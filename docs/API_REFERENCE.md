# API Reference Guide

All API endpoints are prefixed with `/api/v1`. The API consumes and produces `application/json`.

## Authentication

FraudShield AI uses short-lived JWTs (JSON Web Tokens) for authentication. You must pass the token in the `Authorization` header:
`Authorization: Bearer <your_jwt_here>`

### `POST /auth/login`
Authenticates a user and returns a JWT.
- **Body**: `{"email": "admin@fraudshield.ai", "password": "password"}`
- **Response**: `200 OK`
```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbG...",
    "user": { "role": "Administrator", "name": "Admin" }
  }
}
```

## Telemetry & Operations (RBAC: Administrator)

### `GET /telemetry/health`
Returns live system hardware metrics.
- **Response**: `200 OK`
```json
{
  "cpu_usage": 45.2,
  "memory_usage": 60.1,
  "api_latency_ms": 42
}
```

### `GET /notifications/stream`
Server-Sent Events (SSE) endpoint. Keeps a persistent HTTP connection open.
- **Response**: `text/event-stream`
```text
data: {"type": "heartbeat", "timestamp": "2026-07-15..."}

data: {"type": "alert", "message": "High Risk TX-9182"}
```

## Machine Learning

### `POST /predict/realtime`
Scores a raw transaction via the Meta-Ensemble.
- **Body**: 
```json
{
  "V1": -1.3,
  "V2": 2.4,
  "Amount": 150.00,
  "Time": 45912
}
```
- **Response**: `200 OK`
```json
{
  "risk_score": 0.89,
  "classification": "Fraudulent",
  "shap_values": {"V2": 0.4, "Amount": 0.1}
}
```
