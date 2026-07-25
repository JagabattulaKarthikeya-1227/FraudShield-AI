import pytest
from app import create_app
from app.database.core import db

@pytest.fixture
def app():
    """Setup app context fixture in testing mode."""
    app = create_app("testing")
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()


@pytest.fixture
def client(app):
    """Setup testing client wrapper."""
    return app.test_client()


def test_health_check(client):
    """Ensure health check routes respond properly."""
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json['status'] == 'healthy'
