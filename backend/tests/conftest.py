import json
import pytest
from app import create_app
from app.database.core import db

@pytest.fixture
def app():
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def token(client):
    register_payload = {
        "email": "testuser@example.com",
        "password": "SecurePassword123!",
        "first_name": "Test",
        "last_name": "User"
    }
    client.post('/api/v1/auth/register', json=register_payload)
    auth_resp = client.post('/api/v1/auth/login', json={
        "email": register_payload["email"],
        "password": register_payload["password"]
    })
    return json.loads(auth_resp.data)["data"]["access_token"]
