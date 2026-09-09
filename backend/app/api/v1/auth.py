from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_current_user
from app.services.auth_service import AuthService
from app.schemas.user import RegisterSchema, LoginSchema, UserSchema
from app.core.responses import success_response
from app.core.exceptions import ValidationError
from marshmallow import ValidationError as MarshmallowError

from app.security.rate_limiter import limiter
from flask_limiter.util import get_remote_address

auth_bp = Blueprint("auth", __name__)


def login_rate_limit_key():
    """Key the rate limit by IP and the submitted email to prevent targeted and rotating brute-force attacks."""
    email = request.json.get("email", "") if request.is_json else ""
    return f"{get_remote_address()}:{email}"


@auth_bp.route("/register", methods=["POST"])
@limiter.limit("3 per hour")
def register():
    try:
        data = RegisterSchema().load(request.json)
    except MarshmallowError as e:
        raise ValidationError(errors=e.messages)

    user = AuthService.register_user(data)
    return success_response(
        data={"user": UserSchema().dump(user)},
        message="User registered successfully.",
        status_code=201,
    )


@auth_bp.route("/login", methods=["POST"])
@limiter.limit("5 per minute", key_func=login_rate_limit_key)
def login():
    try:
        data = LoginSchema().load(request.json)
    except MarshmallowError as e:
        raise ValidationError(errors=e.messages)

    user, access_token, refresh_token = AuthService.login(
        email=data["email"],
        password=data["password"],
        device_info=request.headers.get("User-Agent"),
        ip_address=request.remote_addr,
    )

    return success_response(
        data={
            "user": UserSchema().dump(user),
            "access_token": access_token,
            "refresh_token": refresh_token,
        },
        message="Login successful.",
    )


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user = get_current_user()
    # Normally we pass the raw token, but JWTManager handles it.
    # For our simple Session lookup, we'd need the actual token string.
    # Alternatively, lookup by user_id. For now, just issue a new access token.
    access_token = AuthService.refresh_access_token(
        current_user, request.headers.get("Authorization").split(" ")[1]
    )
    return success_response(data={"access_token": access_token})


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    from flask_jwt_extended import get_jwt
    from app.core.redis import redis_client
    from app.repositories.session_repo import SessionRepository
    from datetime import datetime, timezone
    import logging

    jwt_data = get_jwt()
    jti = jwt_data["jti"]
    
    # 1. Blocklist the access token in Redis until it expires naturally
    exp = jwt_data.get("exp")
    if exp:
        now = datetime.now(timezone.utc).timestamp()
        ttl = max(1, int(exp - now))
    else:
        ttl = 3600  # Fallback to 1 hour
    
    try:
        if redis_client:
            redis_client.setex(f"blocklist:{jti}", ttl, "true")
        else:
            logging.warning("Redis client is not available. Skipping access token blocklist.")
    except Exception as e:
        logging.error(f"Failed to add token to Redis blocklist: {e}")
        # Proceed with session revocation even if Redis fails

    # 2. Revoke the refresh token session if provided
    refresh_token = request.json.get("refresh_token") if request.is_json else None
    if refresh_token:
        current_user = get_current_user()
        session = SessionRepository.get_by_refresh_token(refresh_token)
        if session and session.user_id == current_user.id:
            SessionRepository.revoke(session)

    return success_response(message="Logged out successfully.")


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    return success_response(data={"user": UserSchema().dump(get_current_user())})
