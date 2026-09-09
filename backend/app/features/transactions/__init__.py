from flask import Blueprint

# Define transactions Blueprint
transactions_bp = Blueprint("transactions", __name__, url_prefix="/transactions")

# Import controllers to register endpoints with Blueprint context

__all__ = ["transactions_bp"]
