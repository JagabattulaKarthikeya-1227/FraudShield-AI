from app.core.security import verify_password
from .models import User
from app.core.errors import AuthenticationException


class AuthService:
    """Mock identity provider business services skeleton."""

    @staticmethod
    def authenticate_user(email: str, password: str) -> User:
        """Stub authenticating analyst credentials."""
        # Genuine DB logic can be built in Phase 2
        user = User.query.filter_by(email=email).first()
        if not user or not verify_password(password, user.password_hash):
            raise AuthenticationException("Invalid email address or credentials.")
        return user
