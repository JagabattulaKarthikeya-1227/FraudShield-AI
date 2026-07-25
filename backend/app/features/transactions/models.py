from datetime import datetime
from app.database.core import db

class Transaction(db.Model):
    """SQLAlchemy model representing credit card transactions."""
    __tablename__ = "transactions"

    id = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    merchant = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    card_type = db.Column(db.String(20), nullable=False)
    location_lat = db.Column(db.Numeric(9, 6), nullable=True)
    location_long = db.Column(db.Numeric(9, 6), nullable=True)
    status = db.Column(db.String(20), nullable=False, default="pending")  # approved, declined, suspicious
    is_fraud = db.Column(db.Boolean, nullable=False, default=False)
    fraud_probability = db.Column(db.Numeric(5, 4), nullable=False, default=0.0000)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def to_dict(self):
        """Serialize model values into dict."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "amount": float(self.amount) if self.amount else 0.0,
            "merchant": self.merchant,
            "category": self.category,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "card_type": self.card_type,
            "location_lat": float(self.location_lat) if self.location_lat else None,
            "location_long": float(self.location_long) if self.location_long else None,
            "status": self.status,
            "is_fraud": self.is_fraud,
            "fraud_probability": float(self.fraud_probability) if self.fraud_probability else 0.0,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
