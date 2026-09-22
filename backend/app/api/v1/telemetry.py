from flask import Blueprint
from flask_jwt_extended import jwt_required, get_current_user
from app.core.responses import success_response
from app.core.exceptions import AppError
from app.models.transaction import Transaction, TransactionStatus
from app.models.user import User
import datetime
import random
from app.middleware.auth import require_role

telemetry_bp = Blueprint("telemetry", __name__)


@telemetry_bp.route("/kpi", methods=["GET"])
@jwt_required()
@require_role(["Administrator", "Fraud Analyst"])
def get_kpis():
    user = get_current_user()

    total_tx = Transaction.query.count()
    total_fraud = Transaction.query.filter_by(status=TransactionStatus.DECLINED).count()
    total_queue = Transaction.query.filter_by(status=TransactionStatus.FLAGGED).count()

    fraud_rate = (
        round((total_fraud / total_tx) * 100, 2)
        if total_tx > 0
        else None
    )

    return success_response(
        data={
            "transactions_today": total_tx,
            "fraud_rate": fraud_rate,
            "detection_accuracy": None,
            "review_queue": total_queue,
            "avg_decision_time_ms": None,
            "active_users": User.query.count(),
            "is_synthetic": total_tx == 0,
        }
    )


@telemetry_bp.route("/trends", methods=["GET"])
@jwt_required()
@require_role(["Administrator", "Fraud Analyst"])
def get_trends():
    user = get_current_user()

    # Generate realistic 30-day time-series data where fraud rate averages exactly 0.20% of volume
    days = [
        (datetime.datetime.now() - datetime.timedelta(days=i)).strftime("%m-%d")
        for i in range(29, -1, -1)
    ]
    legit_volume = [random.randint(5000, 8000) for _ in range(30)]
    fraud_volume = [
        max(1, int(v * random.uniform(0.0018, 0.0022))) for v in legit_volume
    ]  # ~0.20%

    return success_response(
        data={
            "labels": days,
            "legitimate": legit_volume,
            "fraudulent": fraud_volume,
            "is_synthetic": True,  # Time-series trend data is currently illustrative; no real historical aggregation yet
        }
    )


@telemetry_bp.route("/health", methods=["GET"])
@jwt_required()
@require_role(["Administrator"])
def get_system_health():
    user = get_current_user()

    return success_response(
        data={
            "cpu_usage": None,
            "memory_usage": None,
            "api_latency_ms": None,
            "backend_status": "Online",
            "database_status": "Online",
            "smtp_status": "Idle",
            "active_model_version": "v1.4.2-hybrid",
            "is_synthetic": True,
        }
    )
