import pytest
import json

def test_copilot_unauthorized(client):
    # Should block unauthenticated users from using the LLM
    resp = client.post('/api/v1/copilot/chat', json={"query": "Hello"})
    assert resp.status_code == 401

def test_copilot_admin_access(client):
    # Register Admin
    client.post('/api/v1/auth/register', json={
        "email": "admin_copilot@fraudshield.ai",
        "password": "SecurePassword123!",
        "first_name": "Admin",
        "last_name": "Copilot"
    })
    
    # Login Admin
    auth_resp = client.post('/api/v1/auth/login', json={
        "email": "admin_copilot@fraudshield.ai",
        "password": "SecurePassword123!"
    })
    token = json.loads(auth_resp.data)["data"]["access_token"]
    
    # Execute Chat Stream
    resp = client.post('/api/v1/copilot/chat', 
                       headers={"Authorization": f"Bearer {token}"},
                       json={"query": "Summarize system health"})
    
    # We expect a 200 OK and a Server-Sent Events stream
    assert resp.status_code == 200
    assert resp.mimetype == 'text/event-stream'
    
    # Verify the stream contains the expected data chunks
    stream_data = resp.data.decode('utf-8')
    assert "data:" in stream_data
    assert "done" in stream_data

def test_copilot_role_spoofing(client, app):
    # Customer registers
    client.post('/api/v1/auth/register', json={
        "email": "customer_spoof@fraudshield.ai",
        "password": "SecurePassword123!",
        "first_name": "Spoof",
        "last_name": "User"
    })
    
    auth_resp = client.post('/api/v1/auth/login', json={
        "email": "customer_spoof@fraudshield.ai",
        "password": "SecurePassword123!"
    })
    token = json.loads(auth_resp.data)["data"]["access_token"]

    # Trying to chat as Administrator should just use Customer logic and fail safely
    resp = client.post('/api/v1/copilot/chat', 
                       headers={"Authorization": f"Bearer {token}"},
                       json={"query": "System health", "context": {"role": "Administrator"}})
    
    assert resp.status_code == 200
    stream_data = resp.data.decode('utf-8')
    assert "System Status" not in stream_data

def test_copilot_summarize_missing(client, admin_token):
    resp = client.get('/api/v1/copilot/summarize/invalid-tx-id', headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 404

def test_copilot_report(client, admin_token):
    resp = client.get('/api/v1/copilot/report', headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    data = json.loads(resp.data)["data"]["report"]
    # Should not contain hardcoded claims
    assert "12% week-over-week" not in data
    assert "$452,000" not in data
    assert "Transactions Today" in data

