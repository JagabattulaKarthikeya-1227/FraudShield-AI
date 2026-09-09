from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv


def create_app(config_name=None):
    load_dotenv()
    if config_name is None:
        config_name = os.environ.get("FLASK_ENV", "development")

    app = Flask(__name__)

    # 1. Configuration
    from app.config.settings import config_by_name, validate_production_secrets

    app.config.from_object(config_by_name[config_name])

    # Fail fast in production if JWT/Flask secret keys are missing or weak
    validate_production_secrets(config_name)

    # 2. Setup Core Services
    from app.core.logging import setup_logging

    setup_logging(app)

    from app.core.error_handlers import register_error_handlers

    register_error_handlers(app)

    # 3. Initialize Extensions
    from app.database.core import db
    from flask_migrate import Migrate
    from app.security.jwt_manager import jwt
    from app.api.v1 import v1_bp

    migrate = Migrate()

    db.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    migrate.init_app(app, db)

    from app.schemas import ma

    ma.init_app(app)

    # Import ALL models so SQLAlchemy discovers them before create_all()
    from app.models import user, session, prediction, audit, grc, misc, mlops, review, transaction, verification_token  # noqa: F401

    # Auto-create tables if they don't exist (safe for dev & first-run)
    with app.app_context():
        db.create_all()

    from app.security.rate_limiter import limiter

    limiter.init_app(app)

    from app.mail.setup import mail

    mail.init_app(app)

    # Import models so Alembic/SQLAlchemy can see them

    # 4. Register API Blueprints
    app.register_blueprint(v1_bp)

    # 5. Register Flask CLI commands
    from app.cli import register_cli, warn_if_no_admins
    register_cli(app)

    # 6. Warn at startup if no admin accounts exist (non-blocking)
    import threading
    threading.Thread(target=warn_if_no_admins, args=(app,), daemon=True).start()

    @app.route("/health")
    def health_check():
        return jsonify({"status": "healthy", "version": "1.0.0"})

    # 5. Pre-warm ML Inference Engine in background thread so first user request is instant (<50ms)
    import threading

    def _warmup_ml(app_instance):
        with app_instance.app_context():
            try:
                app_instance.logger.info(
                    "Pre-warming ML Inference Engine in background..."
                )
                from app.api.v1.predict import get_inference_service

                get_inference_service()
                app_instance.logger.info("ML Inference Engine pre-warmed successfully!")
            except Exception as e:
                app_instance.logger.error(
                    f"Failed to pre-warm ML Inference Engine: {e}"
                )

    threading.Thread(target=_warmup_ml, args=(app,), daemon=True).start()

    return app
