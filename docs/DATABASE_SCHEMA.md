# Database Schema

FraudShield AI utilizes PostgreSQL as its primary persistent storage for configuration, audit logs, and MLOps metrics. High-velocity temporary data (like rate limiting and session tokens) is stored in Redis.

## Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ AUDIT_LOGS : performs
    USERS ||--o{ MODEL_EXPERIMENTS : creates
    
    USERS {
        string id PK "UUID"
        string email "Indexed, Unique"
        string password_hash "Argon2id"
        string role "Admin, Analyst, Customer"
        boolean mfa_enabled
    }
    
    AUDIT_LOGS {
        string id PK "UUID"
        string user_id FK
        string action "e.g., UPDATE_POLICY"
        string entity "e.g., RoleMatrix"
        string ip_address
        timestamp created_at "Immutable"
    }
    
    MODEL_EXPERIMENTS {
        string id PK
        string user_id FK
        float pr_auc
        float f1_score
        string model_type
        json parameters
        timestamp trained_at
    }
```

## Security Constraints
- **Passwords**: Stored exclusively as Argon2id hashes with random salts.
- **Immutability**: The `AUDIT_LOGS` table is append-only. Hard deletes are prevented at the application level to ensure SOC 2 compliance.
- **PII**: No real credit card numbers or raw transaction data are stored in this database. This is strictly a configuration and governance database.
