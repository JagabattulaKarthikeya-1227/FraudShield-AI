from flask import request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token
from app.core.errors import BadRequestException
from . import auth_bp
from .schemas import LoginRequestSchema, UserResponseSchema
from .services import AuthService
# Register marshmallow schemas to Flasgger definition library.
from flasgger import Schema as FlasggerSchema


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    User login to retrieve JWT tokens
    ---
    tags:
      - Authentication
    parameters:
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/LoginRequest'
    responses:
      200:
        description: Authenticated successfully, tokens returned
        schema:
          type: object
          properties:
            access_token:
              type: string
            refresh_token:
              type: string
            user:
              $ref: '#/definitions/UserResponse'
      401:
        description: Invalid credentials
    """
    json_data = request.get_json()
    if not json_data:
        raise BadRequestException("Missing login payload.")

    schema = LoginRequestSchema()
    errors = schema.validate(json_data)
    if errors:
        raise BadRequestException(
            "Invalid validation inputs.", payload={"validation_errors": errors}
        )

    # Call service class to perform validation
    user = AuthService.authenticate_user(json_data["email"], json_data["password"])

    # Generate mock JWT tokens
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    user_schema = UserResponseSchema()
    return (
        jsonify(
            {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": user_schema.dump(user),
            }
        ),
        200,
    )


class LoginRequest(LoginRequestSchema, FlasggerSchema):
    pass


class UserResponse(UserResponseSchema, FlasggerSchema):
    pass
