import pytest
import json

def test_predict_realtime_unauthorized(client):
    # Attempting to predict without a JWT should fail
    resp = client.post('/api/v1/predict/single', json={})
    assert resp.status_code == 401

def test_predict_realtime_success(client):
    # Register and login a valid analyst
    client.post('/api/v1/auth/register', json={
        "email": "analyst_test@fraudshield.ai",
        "password": "SecurePassword123!",
        "first_name": "Test",
        "last_name": "Analyst"
    })
    
    auth_resp = client.post('/api/v1/auth/login', json={
        "email": "analyst_test@fraudshield.ai",
        "password": "SecurePassword123!"
    })
    token = json.loads(auth_resp.data)["data"]["access_token"]
    
    # Issue a valid prediction request
    # Note: In a real test, you would mock the ML model output, 
    # but since our predict route uses a deterministic mock fallback if the model isn't loaded, this will pass.
    payload = {
        "V1": -1.2, "V2": 2.3, "V3": -0.5, "V4": 1.1, "V5": 0.0,
        "V6": -0.1, "V7": -0.2, "V8": 0.3, "V9": -0.4, "V10": -0.5,
        "V11": 0.6, "V12": -0.7, "V13": 0.8, "V14": -0.9, "V15": 1.0,
        "V16": -1.1, "V17": 1.2, "V18": -1.3, "V19": 1.4, "V20": -1.5,
        "V21": 0.1, "V22": -0.2, "V23": 0.3, "V24": -0.4, "V25": 0.5,
        "V26": -0.6, "V27": 0.7, "V28": -0.8, "Amount": 150.00, "Time": 1000
    }
    
    resp = client.post('/api/v1/predict/single', headers={"Authorization": f"Bearer {token}"}, json=payload)
    assert resp.status_code == 200
    data = json.loads(resp.data)["data"]
    
    assert "risk_assessment" in data
    
    assert "transaction_id" in data
