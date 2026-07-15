from flask import Blueprint

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

from . import controllers

__all__ = ["auth_bp"]
