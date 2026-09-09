from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_current_user
from app.services.auth_service import AuthService
from app.schemas.user import RegisterSchema, LoginSchema, UserSchema
from app.core.responses import success_response
from app.core.exceptions import ValidationError
from marshmallow import ValidationError as MarshmallowError

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
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


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    return success_response(data={"user": UserSchema().dump(get_current_user())})
