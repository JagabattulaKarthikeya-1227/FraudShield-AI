# Security & Governance

*Last verified against commit/date: September 2026*

FraudShield AI simulates a SOC 2 Type II compliant enterprise application. The security architecture is designed using a Zero-Trust methodology.

## Authentication & Authorization

### JSON Web Tokens (JWT)
The application uses stateless JWTs signed via the `HS256` algorithm. 
- **Refresh & Access Tokens** are returned to the client in the JSON response body and expected to be transmitted in the `Authorization` header (`JWT_TOKEN_LOCATION = ["headers"]`).
- **Access Tokens** are short-lived with a lifetime of **1 hour** (`JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)`).

### Password Hashing
We utilize **bcrypt** (or Werkzeug's default `pbkdf2:sha256`) for password hashing. `bcrypt` is included in our `requirements.txt` as the preferred hashing library.

## Data Governance & Privacy

### Kaggle Dataset
This platform operates strictly as an academic/portfolio demonstration. The dataset used for model training and simulation is the **Kaggle Credit Card Fraud Detection dataset**, which contains **284,807 real, anonymized transactions** rather than a purely synthetic 14-million row dataset.

### Immutable Audit Logs
All administrative actions (e.g., changing risk thresholds, manually blocking an account) are written to an `AUDIT_LOGS` table. 
- This table is **Append-Only**. 
- The application layer prevents `DELETE` operations, creating a legally defensible system of record.

## OWASP Top 10 Defenses
- **A01 Broken Access Control**: Mitigated via strict RBAC (Role-Based Access Control) decorators (`@require_role`) on the Flask API.
- **A03 Injection**: Mitigated by utilizing SQLAlchemy/Prisma ORMs, inherently preventing SQL injection. React DOM auto-escapes HTML, mitigating XSS.
- **A05 Security Misconfiguration**: CORS (Cross-Origin Resource Sharing) headers are currently configured to allow wildcard (`*`) origins by default, though this can be overridden via the `CORS_ORIGINS` environment variable for scoped production deployments.

## Secrets Management
The application supports injecting secrets via Environment Variables, adhering to the Twelve-Factor App methodology. Note that for local development convenience, `settings.py` and `docker-compose.yml` contain hardcoded fallback default secrets (e.g., `default-dev-secret-key`), but the backend enforces strong secret requirements at startup when running in the `production` environment.
