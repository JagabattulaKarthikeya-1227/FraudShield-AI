import os
from celery import Celery


def make_celery(app_name=__name__):
    redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379/0")

    celery = Celery(app_name, backend=redis_url, broker=redis_url)

    celery.conf.update(
        task_serializer="json",
        accept_content=["json"],
        result_serializer="json",
        timezone="UTC",
        enable_utc=True,
        # Ensure we don't accidentally consume too much memory in production workers
        worker_max_tasks_per_child=50,
    )

    return celery


celery = make_celery("fraudshield_tasks")


@celery.task(name="process_batch_predictions")
def process_batch_predictions(file_path: str):
    import pandas as pd
    import os
    import logging
    from app.ml.inference.predict import InferenceService
    
    logger = logging.getLogger(__name__)

    try:
        df = pd.read_csv(file_path)
        engine = InferenceService(
            registry_path="app/ml/models/model_registry.json",
            config_path="app/ml/config/risk_thresholds.yaml",
        )
        
        results = engine.predict_batch(df)
        
        return {
            "status": "completed", 
            "batch_results": results, 
            "row_count": len(results)
        }
    except Exception as e:
        logger.error(f"Batch task failed: {e}")
        return {"status": "failed", "error": str(e)}
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


@celery.task(name="dispatch_high_risk_email")
def dispatch_high_risk_email(analyst_email: str, tx_id: str):
    import time

    # Simulate SMTP handshake and dispatch
    time.sleep(2)
    return {"status": "sent", "recipient": analyst_email, "tx_id": tx_id}
