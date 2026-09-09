from datetime import timedelta, datetime, timezone
from flask_jwt_extended import create_access_token, create_refresh_token
from app.repositories.user_repo import UserRepository
from app.repositories.session_repo import SessionRepository
from app.security.hashing import hash_password, verify_password
from app.core.exceptions import AuthenticationError, ConflictError


class AuthService:
    @staticmethod
    def register_user(data: dict):
        if UserRepository.get_by_email(data["email"]):
            raise ConflictError("User with this email already exists.")

        data["password_hash"] = hash_password(data.pop("password"))
        return UserRepository.create(data)

    @staticmethod
    def login(
        email: str, password: str, device_info: str = None, ip_address: str = None
    ):
        user = UserRepository.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            raise AuthenticationError("Invalid email or password.")

        access_token = create_access_token(identity=user)
        refresh_token = create_refresh_token(identity=user)

        # Store refresh token session in DB (simplified expiry logic here)
        SessionRepository.create(
            {
                "user_id": user.id,
                "refresh_token": refresh_token,
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
