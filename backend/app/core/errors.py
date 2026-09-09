import logging
from flask import jsonify
from werkzeug.exceptions import HTTPException

logger = logging.getLogger(__name__)


class APIException(Exception):
    """Base API Exception class for returning clean JSON errors."""

    status_code = 500

    def __init__(self, message, status_code=None, payload=None):
        super().__init__(message)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv["error"] = self.message
        rv["status"] = self.status_code
        return rv


class ResourceNotFoundException(APIException):
    """Raised when an ORM object or requested asset is not found."""

    def __init__(self, message="Resource not found", payload=None):
        super().__init__(message, status_code=404, payload=payload)


class BadRequestException(APIException):
    """Raised on invalid inputs, missing fields, or validation failures."""

    def __init__(self, message="Bad request", payload=None):
        super().__init__(message, status_code=400, payload=payload)


class AuthenticationException(APIException):
    """Raised on security token, login, or credentials validation issues."""

    def __init__(self, message="Authentication failed", payload=None):
        super().__init__(message, status_code=401, payload=payload)


class AuthorizationException(APIException):
    """Raised when client does not possess the correct privileges."""

    def __init__(self, message="Forbidden access denied", payload=None):
        super().__init__(message, status_code=403, payload=payload)


def register_error_handlers(app):
    """Register custom error hooks globally within Flask application."""

    @app.errorhandler(APIException)
    def handle_api_exception(error):
        """Handle custom business and layer errors."""
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response

    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        """Translate Flask/Werkzeug standard exceptions to clean JSON."""
        response = jsonify({"error": error.description, "status": error.code})
        response.status_code = error.code
        return response

    @app.errorhandler(Exception)
    def handle_generic_exception(error):
        """Catches all unhandled exceptions, logs traceback, and hides stack traces from clients."""
        logger.exception("An unhandled exception occurred: %s", str(error))

        response = jsonify(
            {
                "error": "An unexpected error occurred. Please contact the administrator.",
                "status": 500,
            }
        )
        response.status_code = 500
        return response
