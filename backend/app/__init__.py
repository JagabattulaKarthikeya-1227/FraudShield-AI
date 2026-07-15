from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

def create_app(config_name=None):
    load_dotenv()
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')

    app = Flask(__name__)
    
    # 1. Configuration
    from app.config.settings import config_by_name
    app.config.from_object(config_by_name[config_name])

    # 2. Setup Core Services
    from app.core.logging import setup_logging
    setup_logging(app)
    
    from app.core.error_handlers import register_error_handlers
    register_error_handlers(app)

    # 3. Initialize Extensions
    from app.core.database import db
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
    
    from app.security.rate_limiter import limiter
    limiter.init_app(app)
    
    from app.mail.setup import mail
    mail.init_app(app)

    # Import models so Alembic/SQLAlchemy can see them
    from app import models

    # 4. Register API Blueprints
    app.register_blueprint(v1_bp)

    @app.route('/health')
    def health_check():
        return jsonify({"status": "healthy", "version": "1.0.0"})

    return app
