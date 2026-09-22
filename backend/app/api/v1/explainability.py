from flask import Blueprint
from flask_jwt_extended import jwt_required, get_current_user
from app.core.responses import success_response
from app.core.exceptions import AppError
from app.models.transaction import Transaction
from app.middleware.auth import require_role

explainability_bp = Blueprint("explainability", __name__)





@explainability_bp.route("/transaction/<string:tx_id>", methods=["GET"])
@jwt_required()
def get_transaction_explanation(tx_id):
    user = get_current_user()
    tx = Transaction.query.get(tx_id)
    if not tx:
        raise AppError("Transaction not found", 404)

    if not tx.prediction:
        raise AppError("Prediction/explanation unavailable", 404)

    probability = float(tx.prediction.risk_score)
    from app.api.v1.predict import get_inference_service
    engine = get_inference_service()
    risk_level, _ = engine._determine_risk(probability)
    is_high_risk = risk_level == "High Risk"
    is_medium_risk = risk_level == "Review Required"

    # Customer View: plain-English NLP explanation only
    if user.role.value == "Customer":
        if is_high_risk:
            msg = "This transaction was flagged by the risk engine due to its evaluated characteristics and amount."
        elif is_medium_risk:
            msg = "This transaction requires minor review by the risk engine, though overall fraud probability is moderate."
        else:
            msg = "This transaction was evaluated as low risk based on its characteristics."

        return success_response(
            data={"explanation_type": "nlp", "summary": msg, "probability": probability}
        )

    # Analyst / Admin View: dynamic SHAP feature contributions
    shap_features = []
    base_value = 0.0

    # Read from database if already computed
    if tx.prediction and tx.prediction.shap_values and isinstance(tx.prediction.shap_values, dict):
        base_value = tx.prediction.shap_values.get("base_value", 0.0)
        features_dict = tx.prediction.shap_values.get("features", {})
        shap_features = [
            {"name": k, "value": round(float(v), 4), "contribution": round(float(v), 4)}
            for k, v in features_dict.items()
        ]
    else:
        from app.core.exceptions import ModelNotReadyError
        raise ModelNotReadyError("SHAP explainer is unavailable.")

    return success_response(
        data={
            "explanation_type": "technical",
            "probability": probability,
            "risk_level": risk_level,
            "shap_summary": {"base_value": base_value, "features": shap_features},
        }
    )


@explainability_bp.route("/global", methods=["GET"])
@jwt_required()
@require_role(["Administrator", "Fraud Analyst"])
def get_global_insights():
    user = get_current_user()

    # Aggregate real risk_score data from predictions table if available
    from app.models.prediction import Prediction
    from app.database.core import db

    try:
        high_risk_count = (
            db.session.query(db.func.count(Prediction.id))
            .filter(Prediction.risk_score > 0.75)
            .scalar()
            or 0
        )
        total_count = db.session.query(db.func.count(Prediction.id)).scalar() or 1
        fraud_rate = (
            round(high_risk_count / max(total_count, 1), 4)
            if total_count > 10
            else 0.0020
        )
    except Exception:
        fraud_rate = 0.0020  # Enterprise Kaggle dataset baseline (0.20%)

    return success_response(
        data={
            "is_demo_mode": True,
            "fraud_rate": fraud_rate,
            "feature_importance": [
                {"feature": "V17 (Demonstration Baseline)", "importance": 0.28},
                {"feature": "V14 (Demonstration Baseline)", "importance": 0.24},
                {"feature": "V12 (Demonstration Baseline)", "importance": 0.19},
                {"feature": "Amount (Demonstration Baseline)", "importance": 0.15},
                {"feature": "V10 (Demonstration Baseline)", "importance": 0.08},
                {"feature": "V3 (Demonstration Baseline)", "importance": 0.06},
            ],
            "note": "Global explainability is currently in demo mode with static baselines."
        }
    )


@explainability_bp.route("/compare", methods=["GET"])
@jwt_required()
def get_model_comparison():
    """
    Returns real ensemble architecture metrics computed on the validation set.
    """
    import json
    import os
    eval_path = os.path.join(os.path.dirname(__file__), "../../ml/models/saved/eval_metrics.json")
    
    xgb_f1 = None
    xgb_pr_auc = None
    xgb_precision = None
    xgb_recall = None
    xgb_roc_auc = None
    
    if os.path.exists(eval_path):
        try:
            with open(eval_path, "r") as f:
                metrics = json.load(f)
            xgb_precision = metrics.get("precision")
            xgb_recall = metrics.get("recall")
            xgb_pr_auc = metrics.get("pr_auc")
            xgb_roc_auc = metrics.get("roc_auc")
            if xgb_precision is not None and xgb_recall is not None:
                xgb_f1 = 2 * (xgb_precision * xgb_recall) / (xgb_precision + xgb_recall) if (xgb_precision + xgb_recall) > 0 else 0
        except Exception:
            pass

    return success_response(
        data={
            "models": [
                {
                    "name": "Logistic Regression (Baseline)",
                    "precision": None,
                    "recall": None,
                    "f1": None,
                    "roc_auc": None,
                    "status": "historical",
                },
                {
                    "name": "Extra Trees (Base 1)",
                    "precision": None,
                    "recall": None,
                    "f1": None,
                    "roc_auc": None,
                    "status": "historical",
                },
                {
                    "name": "Keras MLP (Base 2)",
                    "precision": None,
                    "recall": None,
                    "f1": None,
                    "roc_auc": None,
                    "status": "historical",
                },
                {
                    "name": "XGBoost Meta-Learner (Active)",
                    "precision": xgb_precision,
                    "recall": xgb_recall,
                    "f1": xgb_f1,
                    "roc_auc": xgb_roc_auc,
                    "pr_auc": xgb_pr_auc,
                    "status": "verified",
                    "provenance": "validation",
                },
            ],
            "eval_note": "Metrics for active model from validation evaluation artifacts.",
        }
    )
