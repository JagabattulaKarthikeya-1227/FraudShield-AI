from flask_jwt_extended import JWTManager
from app.models.user import User
from app.database.core import db

jwt = JWTManager()


@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    print(f"DEBUG_JWT: Looking up user with identity: {identity}")
    user = db.session.get(User, identity)
    print(f"DEBUG_JWT: Found user: {user}")
    return user


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    # In a real scenario, check redis or DB for revoked jti
    # For now, we rely on the DB session is_revoked for refresh tokens
    return False
