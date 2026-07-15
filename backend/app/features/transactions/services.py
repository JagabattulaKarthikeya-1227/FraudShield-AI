import random
from app.core.database import db
from .models import Transaction
from app.core.errors import ResourceNotFoundException

class TransactionService:
    """Business service orchestrating database interactions and ML scoring triggers."""

    @staticmethod
    def get_all():
        """Retrieve list of transactions from repository."""
        return Transaction.query.all()

    @staticmethod
    def get_by_id(transaction_id: str):
        """Find a single transaction, throwing ResourceNotFoundException if absent."""
        transaction = Transaction.query.get(transaction_id)
        if not transaction:
            raise ResourceNotFoundException(f"Transaction ID {transaction_id} not found.")
        return transaction

    @staticmethod
    def create(data: dict):
        """Create transaction record, run model inference stub, and save to DB."""
        # Simulated Machine Learning score prediction
        # (XGBoost/TensorFlow model scoring will be plugged in Phase 2)
        score = random.uniform(0.0, 1.0)
        is_fraud = score > 0.8
        status = "suspicious" if is_fraud else "approved"

        new_transaction = Transaction(
            id=data["id"],
            user_id=data.get("user_id"),
            amount=data["amount"],
            merchant=data["merchant"],
            category=data["category"],
            timestamp=data.get("timestamp"),
            card_type=data["card_type"],
            location_lat=data.get("location_lat"),
            location_long=data.get("location_long"),
            status=status,
            is_fraud=is_fraud,
            fraud_probability=score
        )

        db.session.add(new_transaction)
        db.session.commit()
        return new_transaction
