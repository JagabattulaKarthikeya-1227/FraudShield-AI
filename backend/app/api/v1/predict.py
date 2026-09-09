from flask import Blueprint, request, current_app
from flask_jwt_extended import jwt_required, get_current_user
from app.core.responses import success_response
from app.core.exceptions import AppError
from app.database.core import db
from app.models.transaction import Transaction, TransactionStatus
from app.models.prediction import Prediction
from app.models.audit import AuditLog
from app.models.misc import Notification
from app.ml.inference.predict import InferenceService

predict_bp = Blueprint("predict", __name__)
inference_service = None


class DummyInferenceService:
    def __init__(self):
        self.active_record = {"version_id": "fallback"}

    def predict_single(self, transaction_dict: dict) -> dict:
        amount = float(transaction_dict.get("Amount", 0.0))
        probability = 0.03 if amount <= 500 else min(0.92, 0.03 + (amount / 10000.0))
        if probability < 0.4:
            risk_level = "Low Risk"
            action = "approve"
        elif probability < 0.7:
            risk_level = "Review Required"
            action = "flag"
        else:
            risk_level = "High Risk"
            action = "decline"

        return {
            "probability": float(probability),
            "risk_level": risk_level,
            "suggested_action": action,
            "base_models": {
                "extra_trees": float(min(0.9, probability + 0.02)),
                "mlp": float(min(0.92, probability + 0.05)),
            },
            "shap_values": {},
            "feature_mode": "fallback",
        }


def get_inference_service():
    global inference_service
    if inference_service is None:
        try:
            inference_service = InferenceService(
                registry_path="app/ml/models/model_registry.json",
                config_path="app/ml/config/risk_thresholds.yaml",
            )
        except Exception as e:
            current_app.logger.error(
                f"Inference Engine unavailable: {e}. Using fallback inference service."
            )
            inference_service = DummyInferenceService()
    return inference_service


@predict_bp.route("/single", methods=["POST"])
@jwt_required()
def predict_single():
    data = request.json
    user = get_current_user()

    # 1. Run ML Inference
    engine = get_inference_service()
    result = engine.predict_single(data)

    # 2. Determine initial transaction status based on ML Risk action
    status_mapping = {
        "approve": TransactionStatus.APPROVED,
        "flag": TransactionStatus.FLAGGED,
        "decline": TransactionStatus.DECLINED,
    }
    tx_status = status_mapping.get(
        result["suggested_action"], TransactionStatus.PENDING
    )

    # 3. Create Transaction Record
    tx = Transaction(
        user_id=user.id,
        merchant=data.get("Merchant", "Unknown"),
        category=data.get("Category", "General"),
        amount=data.get("Amount", 0.0),
        status=tx_status,
        transaction_date=db.func.now(),
    )
    db.session.add(tx)
    db.session.flush()  # To get tx.id

    # 4. Create Prediction Record (shap_values now returned by InferenceService)
    pred = Prediction(
        transaction_id=tx.id,
        model_version=engine.active_record["version_id"],
        risk_score=result["probability"],
        shap_values=result.get("shap_values"),  # approximate SHAP from InferenceService
    )
    db.session.add(pred)

    # 5. Create Audit Log & Notifications
    audit = AuditLog(
        user_id=user.id,
        action="AI_PREDICTION_GENERATED",
        entity_type="Transaction",
        entity_id=tx.id,
        details={
            "risk_level": result["risk_level"],
            "action": result["suggested_action"],
        },
    )
    db.session.add(audit)

    if result["suggested_action"] != "approve":
        note = Notification(
            user_id=user.id,
            title=f"Transaction {result['risk_level']}",
            message=f"Your transaction at {tx.merchant} requires attention.",
            type="alert",
        )
        db.session.add(note)

    db.session.commit()

    return success_response(
        data={"transaction_id": tx.id, "risk_assessment": result},
        message="Prediction completed successfully.",
    )


@predict_bp.route("/batch", methods=["POST"])
@jwt_required()
def predict_batch():
    MAX_FILE_BYTES = 10 * 1024 * 1024  # 10 MB
    MAX_ROWS = 5_000

    if "file" not in request.files:
        raise AppError("No file provided", 400)

    file = request.files["file"]

    # Guard against oversized uploads before reading into memory
    file.seek(0, 2)  # seek to end
    file_size = file.tell()
    file.seek(0)
    if file_size > MAX_FILE_BYTES:
        raise AppError(
            f"File too large ({file_size // (1024 * 1024)} MB). Maximum allowed is 10 MB. "
            "For large batch jobs, use the async /batch/task endpoint.",
            413,
        )

    try:
        import pandas as pd
    except ImportError as e:
        current_app.logger.error(f"Batch prediction unavailable: {e}")
        raise AppError(
            "Batch prediction requires pandas. Please install it on the server.", 503
        )

    df = pd.read_csv(file)

    if len(df) > MAX_ROWS:
        raise AppError(
            f"Too many rows ({len(df):,}). Maximum per synchronous request is {MAX_ROWS:,}. "
            "For larger datasets, split the file or use the async /batch/task endpoint.",
            413,
        )

    # Synchronous processing — suitable for small files only.
    # TODO: For production, dispatch a Celery task and return a task_id for polling.
    engine = get_inference_service()

    results = []
    for _, row in df.iterrows():
        res = engine.predict_single(row.to_dict())
        results.append(
            {
                "Amount": row.get("Amount"),
                "Probability": round(res["probability"], 4),
                "Risk": res["risk_level"],
            }
        )

    return success_response(
        data={"batch_results": results, "row_count": len(results)},
        message=f"Batch processed: {len(results)} transactions.",
    )
