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
