from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy model definitions."""


# Shared db instance initialized without an app.
# It will be bound to the app context in the application factory function.
db = SQLAlchemy(model_class=Base)


def init_db(app):
    """Initialize the database configuration and models with the Flask app."""
    db.init_app(app)

    with app.app_context():
        # Optional: Import models here if you want to auto-create them
        # db.create_all()
        pass
