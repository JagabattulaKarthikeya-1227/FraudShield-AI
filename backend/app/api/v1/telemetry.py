from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_current_user
from app.core.responses import success_response
from app.core.exceptions import AppError
from app.database.core import db
from app.models.transaction import Transaction, TransactionStatus
from app.models.user import User
import datetime
import random

telemetry_bp = Blueprint('telemetry', __name__)

@telemetry_bp.route('/kpi', methods=['GET'])
@jwt_required()
def get_kpis():
    user = get_current_user()
    if user.role.value not in ["Administrator", "Fraud Analyst"]:
        raise AppError("Unauthorized access to enterprise telemetry.", 403)
        
    total_tx = Transaction.query.count()
    total_fraud = Transaction.query.filter_by(status=TransactionStatus.DECLINED).count()
    total_queue = Transaction.query.filter_by(status=TransactionStatus.FLAGGED).count()
    
    fraud_rate = (total_fraud / total_tx * 100) if total_tx > 0 else 0
    
    return success_response(data={
        "transactions_today": total_tx, # Mocking as total for demo
        "fraud_rate": round(fraud_rate, 2),
        "detection_accuracy": 99.8, # Simulated ensemble accuracy
        "review_queue": total_queue,
        "avg_decision_time_ms": random.randint(45, 60),
        "active_users": User.query.count()
    })

@telemetry_bp.route('/trends', methods=['GET'])
@jwt_required()
def get_trends():
    user = get_current_user()
    if user.role.value not in ["Administrator", "Fraud Analyst"]:
        raise AppError("Unauthorized", 403)
        
    # Generate realistic 30-day time-series data for the ECharts Area chart
    days = [(datetime.datetime.now() - datetime.timedelta(days=i)).strftime('%m-%d') for i in range(29, -1, -1)]
    legit_volume = [random.randint(5000, 8000) for _ in range(30)]
    fraud_volume = [int(v * random.uniform(0.001, 0.005)) for v in legit_volume]
    
    return success_response(data={
        "labels": days,
        "legitimate": legit_volume,
        "fraudulent": fraud_volume
    })

@telemetry_bp.route('/health', methods=['GET'])
@jwt_required()
def get_system_health():
    user = get_current_user()
    if user.role.value != "Administrator":
        raise AppError("Only Administrators can view system hardware metrics.", 403)
        
    # Simulate realistic server telemetry metrics
    return success_response(data={
        "cpu_usage": random.randint(30, 45),
        "memory_usage": random.randint(50, 70),
        "api_latency_ms": random.randint(20, 80),
        "backend_status": "Online",
        "database_status": "Online",
        "smtp_status": "Idle",
        "active_model_version": "v1.4.2-hybrid"
    })
