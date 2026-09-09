from datetime import timedelta, datetime, timezone
from flask_jwt_extended import create_access_token, create_refresh_token
from app.repositories.user_repo import UserRepository
from app.repositories.session_repo import SessionRepository
from app.security.hashing import hash_password, verify_password, hash_token
from app.core.exceptions import AuthenticationError, ConflictError
from app.models.user import RoleEnum


class AuthService:
    @staticmethod
    def register_user(data: dict):
        if UserRepository.get_by_email(data["email"]):
            raise ConflictError("User with this email already exists.")

        data["password_hash"] = hash_password(data.pop("password"))

        # Map role string -> RoleEnum (e.g. "Administrator" -> RoleEnum.ADMIN)
        role_str = data.pop("role", "Customer")
        role_map = {r.value: r for r in RoleEnum}
        data["role"] = role_map.get(role_str, RoleEnum.CUSTOMER)

        return UserRepository.create(data)

    @staticmethod
    def login(
        email: str, password: str, device_info: str = None, ip_address: str = None
    ):
        user = UserRepository.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            raise AuthenticationError("Invalid email or password.")

        access_token = create_access_token(identity=user)
        # Raw refresh token — returned to client once, never stored in plaintext
        refresh_token = create_refresh_token(identity=user)

        # Persist only the HMAC-SHA256 hash of the refresh token
        SessionRepository.create(
            {
                "user_id": user.id,
                "refresh_token_hash": hash_token(refresh_token),
                "device_info": device_info,
                "ip_address": ip_address,
                "expires_at": datetime.now(timezone.utc) + timedelta(days=30),
            }
        )

        return user, access_token, refresh_token

    @staticmethod
    def refresh_access_token(user, old_refresh_token: str):
        session = SessionRepository.get_by_refresh_token(old_refresh_token)
        if not session or session.user_id != user.id:
            raise AuthenticationError("Invalid or revoked refresh token.")

        access_token = create_access_token(identity=user)
        return access_token
