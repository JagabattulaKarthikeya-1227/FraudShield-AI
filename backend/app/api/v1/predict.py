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
import pandas as pd
import io

predict_bp = Blueprint('predict', __name__)
inference_service = None

def get_inference_service():
    global inference_service
    if inference_service is None:
        try:
            inference_service = InferenceService(
                registry_path="app/ml/models/model_registry.json",
                config_path="app/ml/config/risk_thresholds.yaml"
            )
        except Exception as e:
            current_app.logger.error(f"Inference Engine unavailable: {e}")
            raise AppError("AI Engine is currently offline or models are untrained.", 503)
    return inference_service

@predict_bp.route('/single', methods=['POST'])
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
        "decline": TransactionStatus.DECLINED
    }
    tx_status = status_mapping.get(result["suggested_action"], TransactionStatus.PENDING)
    
    # 3. Create Transaction Record
    tx = Transaction(
        user_id=user.id,
        merchant=data.get("Merchant", "Unknown"),
        category=data.get("Category", "General"),
        amount=data.get("Amount", 0.0),
        status=tx_status,
        transaction_date=db.func.now()
    )
    db.session.add(tx)
    db.session.flush() # To get tx.id
    
    # 4. Create Prediction Record (shap_values now returned by InferenceService)
    pred = Prediction(
        transaction_id=tx.id,
        model_version=engine.active_record["version_id"],
        risk_score=result["probability"],
        shap_values=result.get("shap_values")  # approximate SHAP from InferenceService
    )
    db.session.add(pred)
    
    # 5. Create Audit Log & Notifications
    audit = AuditLog(
        user_id=user.id,
        action="AI_PREDICTION_GENERATED",
        entity_type="Transaction",
        entity_id=tx.id,
        details={"risk_level": result["risk_level"], "action": result["suggested_action"]}
    )
    db.session.add(audit)
    
    if result["suggested_action"] != "approve":
        note = Notification(
            user_id=user.id,
            title=f"Transaction {result['risk_level']}",
            message=f"Your transaction at {tx.merchant} requires attention.",
            type="alert"
        )
        db.session.add(note)
        
    db.session.commit()
    
    return success_response(data={
        "transaction_id": tx.id,
        "risk_assessment": result
    }, message="Prediction completed successfully.")

@predict_bp.route('/batch', methods=['POST'])
@jwt_required()
def predict_batch():
    if 'file' not in request.files:
        raise AppError("No file provided", 400)
    
    file = request.files['file']
    df = pd.read_csv(file)
    
    # Normally this would be a Celery task. For demonstration, we run synchronously.
    # In production, respond with a task ID and let React Query poll status.
    engine = get_inference_service()
    
    results = []
    for _, row in df.iterrows():
        # Minimal extraction for stub
        res = engine.predict_single(row.to_dict())
        results.append({
            "Amount": row.get("Amount"),
            "Probability": res["probability"],
            "Risk": res["risk_level"]
        })
        
    return success_response(data={"batch_results": results}, message="Batch processed.")
