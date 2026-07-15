import pytest
import json

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
