import os
from datetime import timedelta


class Config:
    """Base configuration."""

    SECRET_KEY = os.environ.get("SECRET_KEY", "default-dev-secret-key")

    # SQLAlchemy
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "sqlite:///fraudshield_dev.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT Extended
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "default-jwt-secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ["access", "refresh"]
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_COOKIE_SECURE = os.environ.get("JWT_COOKIE_SECURE", "False").lower() == "true"
    JWT_COOKIE_CSRF_PROTECT = False

    # Mail Config
    MAIL_SERVER = os.environ.get("MAIL_SERVER", "localhost")
    MAIL_PORT = int(os.environ.get("MAIL_PORT", 2525))
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS", "True").lower() == "true"
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.environ.get(
        "MAIL_DEFAULT_SENDER", "noreply@fraudshield.ai"
    )


class DevelopmentConfig(Config):
    DEBUG = True
    ENV = "development"


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(seconds=5)


class ProductionConfig(Config):
    DEBUG = False
    ENV = "production"
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")

    # In production, SECRET_KEY and JWT_SECRET_KEY are read directly from env.
    # Validation is deferred to app startup (see validate_production_secrets()).
    SECRET_KEY = os.environ.get("SECRET_KEY") or ""
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or ""


def validate_production_secrets(config_name: str) -> None:
    """Raise RuntimeError early at app startup if production secrets are missing.

    Called from the app factory before any request is served, so the process
    exits loudly rather than running with a weak or missing signing key.
    """
    if config_name != "production":
        return

    secret_key = os.environ.get("SECRET_KEY", "")
    jwt_secret = os.environ.get("JWT_SECRET_KEY", "")

    _weak = {"", "default-dev-secret-key", "default-jwt-secret"}

    if secret_key in _weak:
        raise RuntimeError(
            "[SECURITY] SECRET_KEY must be set to a strong random value in "
            "production. Generate one with:\n"
            "  python -c \"import secrets; print(secrets.token_hex(32))\"\n"
            "Then set it in your .env file or secrets manager."
        )

    if jwt_secret in _weak:
        raise RuntimeError(
            "[SECURITY] JWT_SECRET_KEY must be set to a strong random value in "
            "production. Generate one with:\n"
            "  python -c \"import secrets; print(secrets.token_hex(32))\"\n"
            "Then set it in your .env file or secrets manager."
        )


config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}
