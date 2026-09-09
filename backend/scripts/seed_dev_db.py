import os
import sys
import datetime
from decimal import Decimal

# Ensure backend directory is in path so we can import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.database.core import db
from app.models.user import User, RoleEnum
from app.models.transaction import Transaction
from app.models.misc import Notification
from app.security.hashing import hash_password

def seed():
    app = create_app()
    with app.app_context():
        print("Creating all tables based on ORM models...")
        # create_all is safe to run; it will create missing tables based on the live models
        db.create_all()

        print("Checking for existing users...")
        if User.query.first():
            print("Database already contains data. Skipping seed to prevent duplication.")
            return

        print("Seeding demo data...")
        
        # 1. Create a demo fraud analyst
        analyst = User(
            email="analyst@fraudshield.ai",
            first_name="Demo",
            last_name="Analyst",
            role=RoleEnum.FRAUD_ANALYST,
            is_active=True
        )
        # Using hash_password directly since we removed set_password in an earlier fix
        analyst.password_hash = hash_password("Demo@12345")
        
        db.session.add(analyst)
        db.session.commit()
        
        print(f"Created demo analyst: {analyst.email}")

        # 2. Create some sample transactions
        tx1 = Transaction(
            user_id=analyst.id,
            amount=Decimal("1250.00"),
            merchant="APPLE STORE",
            category="Electronics",
            timestamp=datetime.datetime.now(datetime.UTC),
            card_type="Credit",
            status="pending",
            is_fraud=False,
            fraud_probability=Decimal("0.8500")
        )
        db.session.add(tx1)
        db.session.commit()
        
        # 3. Create a sample notification
        notif = Notification(
            user_id=analyst.id,
            title="Welcome to FraudShield AI",
            message="Your local development environment has been successfully seeded.",
            type="system",
            priority="normal",
            is_read=False
        )
        db.session.add(notif)
        db.session.commit()

        print("Seeding complete! You can now log in with analyst@fraudshield.ai / Demo@12345")
        print("Note: To create an administrator account, run `flask create-admin`.")

if __name__ == "__main__":
    seed()
