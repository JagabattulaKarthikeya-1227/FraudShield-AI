from flask import Blueprint, request, current_app
from flask_jwt_extended import jwt_required
from app.core.responses import success_response
from app.core.exceptions import AppError
from app.api.v1.predict import get_inference_service
import random
import pandas as pd
import os
import threading

fraud_bp = Blueprint("fraud", __name__)

# ---------------------------------------------------------------------------
# Module-level DataFrame cache — loaded once on first request, not per-call.
# A lock ensures only one thread reads the CSV if multiple requests arrive
# simultaneously during cold start.
# ---------------------------------------------------------------------------
_df_cache: pd.DataFrame | None = None
_df_lock = threading.Lock()


def _get_dataset() -> pd.DataFrame:
    """Return the cached transaction DataFrame, loading it on first access."""
    global _df_cache
    if _df_cache is not None:
        return _df_cache
    with _df_lock:
        if _df_cache is not None:  # double-checked locking
            return _df_cache
        base_dir = os.path.dirname(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        )
        data_path = os.path.join(
            base_dir, "app", "ml", "data", "processed", "creditcard_enhanced.csv"
        )
        if not os.path.exists(data_path):
            data_path = os.path.join(
                base_dir, "app", "ml", "data", "raw", "creditcard.csv"
            )
        if not os.path.exists(data_path):
            raise AppError("Dataset not found on server", 404)
        current_app.logger.info(
            f"[fraud_bp] Loading dataset into cache from {data_path}"
        )
        _df_cache = pd.read_csv(data_path)
        current_app.logger.info(f"[fraud_bp] Dataset cached — {len(_df_cache):,} rows.")
    return _df_cache


@fraud_bp.route("/predict", methods=["POST"])
@jwt_required()
def predict():
    """
    Demo-mode fraud prediction endpoint.
    Picks a real transaction row from the training dataset (by index or
    randomly at 50/50 fraud vs. legit) and runs it through the full
    InferenceService stacked ensemble — the same model used by /predict/single.

    Requires a valid JWT token.
    """
    data = request.json or {}

    df = _get_dataset()

    transaction_index = data.get("transaction_index")

    if transaction_index is not None:
        try:
            row = df.iloc[int(transaction_index)]
        except IndexError:
            raise AppError("Transaction index out of bounds", 404)
    else:
        # Force 50/50 split for meaningful demo coverage
        is_fraud = random.choice([True, False])
        subset = df[df["Class"] == (1 if is_fraud else 0)]
        if subset.empty:
            subset = df
        sampled = subset.sample(n=1)
        transaction_index = int(sampled.index[0])
        row = sampled.iloc[0]

    # Build the full 30-feature dict (Time, V1-V28, Amount) for the ensemble
    features_dict = row.to_dict()

    # Run through the stacked ensemble (Extra Trees + MLP + XGBoost)
    engine = get_inference_service()
    result = engine.predict_single(features_dict)

    prob = result["probability"]

    # Map ensemble risk levels to response vocabulary
    risk_map = {
        "Low Risk": ("LOW", "Approve"),
        "Review Required": ("MEDIUM", "Review"),
        "High Risk": ("CRITICAL", "Decline"),
    }
    risk_level, recommended_action = risk_map.get(
        result["risk_level"], ("MEDIUM", "Review")
    )

    # Return clean response — V1-V28 values are never forwarded to the frontend
    clean_response = {
        "transaction_id": f"TX-{transaction_index}",
        "transaction_amount": float(row.get("Amount", 0.0)),
        "fraud_probability": round(prob, 4),
        "risk_score": round(prob * 100.0, 2),
        "prediction": "Fraud" if prob >= 0.75 else "Normal",
        "risk_level": risk_level,
        "recommended_action": recommended_action,
        "feature_mode": result.get("feature_mode", "full"),
        "base_models": result.get("base_models", {}),
    }

    return success_response(
        data=clean_response, message="Prediction completed successfully."
    )
