import pytest
import json

def test_explainability_role_access(client):
    # Register a test customer
    client.post('/api/v1/auth/register', json={
        "email": "customer_xai@fraudshield.ai",
        "password": "SecurePassword123!",
        "first_name": "Test",
        "last_name": "Customer"
    })
    
    # Login
    auth_resp = client.post('/api/v1/auth/login', json={
        "email": "customer_xai@fraudshield.ai",
        "password": "SecurePassword123!"
    })
    token = json.loads(auth_resp.data)["data"]["access_token"]
    
    # Attempt to access global insights (Should Fail)
    global_resp = client.get('/api/v1/explainability/global', headers={"Authorization": f"Bearer {token}"})
    assert global_resp.status_code == 403
    
    # The transaction endpoint logic works similarly, verifying role.value == "Customer" 
    # to return NLP instead of raw arrays.
