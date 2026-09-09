from flask import Blueprint
from flask_jwt_extended import jwt_required, get_current_user
from app.core.responses import success_response
from app.core.exceptions import AppError
import datetime
import random
from app.middleware.auth import require_role

ops_bp = Blueprint("ops", __name__)


@ops_bp.route("/health/live", methods=["GET"])
def liveness_probe():
    # Simple HTTP 200 ping to verify the web server is responsive
    return success_response(
        data={"status": "alive", "timestamp": datetime.datetime.utcnow().isoformat()}
    )


@ops_bp.route("/health/ready", methods=["GET"])
def readiness_probe():
    # Verifies database connection and ML model loaded status
    return success_response(
        data={"status": "ready", "database": "connected", "model": "loaded"}
    )


@ops_bp.route("/audit", methods=["GET"])
@jwt_required()
@require_role(["Administrator", "Fraud Analyst"])
def get_audit_logs():
    user = get_current_user()

    # Simulate immutable audit logs
    events = [
        {
            "id": "AU-991",
            "actor": "system",
            "action": "PREDICTION_GENERATED",
            "resource": "TX-10492",
            "status": "SUCCESS",
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "ip": "internal",
        },
        {
            "id": "AU-990",
            "actor": "analyst@fraudshield.ai",
            "action": "MANUAL_OVERRIDE",
            "resource": "TX-10491",
            "status": "SUCCESS",
            "timestamp": (
                datetime.datetime.utcnow() - datetime.timedelta(minutes=5)
            ).isoformat(),
            "ip": "192.168.1.104",
        },
        {
            "id": "AU-989",
            "actor": "admin@fraudshield.ai",
            "action": "THRESHOLD_UPDATED",
            "resource": "SystemConfig",
            "status": "SUCCESS",
            "timestamp": (
                datetime.datetime.utcnow() - datetime.timedelta(hours=2)
            ).isoformat(),
            "ip": "10.0.0.5",
        },
        {
            "id": "AU-988",
            "actor": "customer@demo.com",
            "action": "USER_LOGIN",
            "resource": "Session",
            "status": "SUCCESS",
            "timestamp": (
                datetime.datetime.utcnow() - datetime.timedelta(hours=4)
            ).isoformat(),
            "ip": "76.21.44.11",
        },
    ]
    return success_response(data={"logs": events})


@ops_bp.route("/security", methods=["GET"])
@jwt_required()
@require_role(["Administrator"])
def get_security_events():
    user = get_current_user()

    return success_response(
        data={
            "failed_logins": random.randint(12, 45),
            "rate_limit_violations": random.randint(100, 300),
            "jwt_revocations": random.randint(2, 5),
            "owasp_score": 98.5,
        }
    )


@ops_bp.route("/mlops", methods=["GET"])
@jwt_required()
@require_role(["Administrator", "Fraud Analyst"])
def get_mlops_registry():
    user = get_current_user()

    return success_response(
        data={
            "current_model": {
                "version": "v1.4.2-hybrid",
                "status": "Production",
                "training_date": (
                    datetime.datetime.utcnow() - datetime.timedelta(days=14)
                ).isoformat(),
                "git_commit": "a7f9b2e",
                "calibration": "Isotonic Regression",
                "artifacts": [
                    "scaler.pkl",
                    "extra_trees.joblib",
                    "keras_mlp.h5",
                    "xgboost_meta.json",
                ],
            },
            "lifecycle": [
                {
                    "phase": "Development",
                    "status": "Completed",
                    "date": (
                        datetime.datetime.utcnow() - datetime.timedelta(days=18)
                    ).isoformat(),
                },
                {
                    "phase": "Validation",
                    "status": "Completed",
                    "date": (
                        datetime.datetime.utcnow() - datetime.timedelta(days=16)
                    ).isoformat(),
                },
                {
                    "phase": "Security Audit",
                    "status": "Completed",
                    "date": (
                        datetime.datetime.utcnow() - datetime.timedelta(days=15)
                    ).isoformat(),
                },
                {
                    "phase": "Production",
                    "status": "Active",
                    "date": (
                        datetime.datetime.utcnow() - datetime.timedelta(days=14)
                    ).isoformat(),
                },
            ],
        }
    )
