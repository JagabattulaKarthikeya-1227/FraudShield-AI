import pytest
import json
import datetime
from app.models.transaction import Transaction, TransactionStatus
from app.database.core import db

def test_telemetry_role_access(client):
    # Register test customer
    client.post('/api/v1/auth/register', json={
        "email": "customer_ops@fraudshield.ai",
        "password": "SecurePassword123!",
        "first_name": "Test",
        "last_name": "Customer"
    })
    
    auth_resp = client.post('/api/v1/auth/login', json={
        "email": "customer_ops@fraudshield.ai",
        "password": "SecurePassword123!"
    })
    token = json.loads(auth_resp.data)["data"]["access_token"]
    
    # Customer should be blocked from System Health
    health_resp = client.get('/api/v1/telemetry/health', headers={"Authorization": f"Bearer {token}"})
    assert health_resp.status_code == 403
    
    # Customer should be blocked from Enterprise KPIs
    kpi_resp = client.get('/api/v1/telemetry/kpi', headers={"Authorization": f"Bearer {token}"})
    assert kpi_resp.status_code == 403


def test_telemetry_trends_empty_db(client):
    # Setup admin token
    client.post('/api/v1/auth/register', json={
        "email": "admin_telemetry@fraudshield.ai",
        "password": "SecurePassword123!",
        "first_name": "Admin",
        "last_name": "User",
        "role": "Administrator"
    })
    auth_resp = client.post('/api/v1/auth/login', json={
        "email": "admin_telemetry@fraudshield.ai",
        "password": "SecurePassword123!"
    })
    token = json.loads(auth_resp.data)["data"]["access_token"]
    
    # Case 2 - empty database
    resp = client.get('/api/v1/telemetry/trends', headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    data = json.loads(resp.data)["data"]
    assert data["status"] == "unavailable"
    assert data["is_synthetic"] is False
    assert len(data["labels"]) == 0
    assert len(data["legitimate"]) == 0


def test_telemetry_trends_real_data(client, app):
    # Setup admin token
    auth_resp = client.post('/api/v1/auth/login', json={
        "email": "admin_telemetry@fraudshield.ai",
        "password": "SecurePassword123!"
    })
    token = json.loads(auth_resp.data)["data"]["access_token"]

    # Case 1 - real data
    with app.app_context():
        # Seed some data
        tx1 = Transaction(
            merchant="Test Merchant 1",
            amount=100.0,
            status=TransactionStatus.APPROVED,
            transaction_date=datetime.datetime.now()
        )
        tx2 = Transaction(
            merchant="Test Merchant 2",
            amount=200.0,
            status=TransactionStatus.DECLINED,
            transaction_date=datetime.datetime.now()
        )
        db.session.add(tx1)
        db.session.add(tx2)
        db.session.commit()
        
    resp = client.get('/api/v1/telemetry/trends', headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    data = json.loads(resp.data)["data"]
    
    # Case 3 - frontend contract
    assert "labels" in data
    assert "legitimate" in data
    assert "fraudulent" in data
    assert "flagged" in data
    assert "hourly_volume" not in data
    
    # Case 4 - no fake arrays
    assert data["status"] == "available"
    assert data["is_synthetic"] is False
    assert len(data["labels"]) == 30
    assert data["legitimate"][-1] >= 1
    assert data["fraudulent"][-1] >= 1
