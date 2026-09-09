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


# Example background task
@celery.task(name="process_batch_predictions")
def process_batch_predictions(file_path: str):
    import time

    # Simulate heavy Pandas CSV processing and batch ML inference
    time.sleep(5)
    return {"status": "completed", "file": file_path, "rows_processed": 1542}


@celery.task(name="dispatch_high_risk_email")
def dispatch_high_risk_email(analyst_email: str, tx_id: str):
    import time

    # Simulate SMTP handshake and dispatch
    time.sleep(2)
    return {"status": "sent", "recipient": analyst_email, "tx_id": tx_id}
