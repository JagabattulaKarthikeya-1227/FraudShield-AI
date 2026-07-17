# Security & Governance

FraudShield AI simulates a SOC 2 Type II compliant enterprise application. The security architecture is designed using a Zero-Trust methodology.

## Authentication & Authorization

### JSON Web Tokens (JWT)
The application uses stateless JWTs signed via the `HS256` algorithm. 
To prevent Cross-Site Scripting (XSS) attacks from stealing tokens:
- **Refresh Tokens** are stored exclusively in `HttpOnly, SameSite=Strict` cookies. JavaScript cannot access them.
- **Access Tokens** are kept in memory and are extremely short-lived (e.g., 15 minutes).

### Password Hashing
We utilize **Argon2id**, the current industry standard recommended by OWASP, for password hashing. Argon2id is specifically designed to be resistant to both GPU cracking and side-channel attacks.

## Data Governance & Privacy

### 100% Synthetic Data Guarantee
This platform operates strictly as an academic/portfolio demonstration. **No real Personally Identifiable Information (PII), Credit Card PANs, or actual human data is stored or processed.** The 14-million row dataset was mathematically generated to mirror fraud distributions without violating privacy laws.

### Immutable Audit Logs
All administrative actions (e.g., changing risk thresholds, manually blocking an account) are written to an `AUDIT_LOGS` table. 
- This table is **Append-Only**. 
- The application layer prevents `DELETE` operations, creating a legally defensible system of record.

## OWASP Top 10 Defenses
- **A01 Broken Access Control**: Mitigated via strict RBAC (Role-Based Access Control) decorators (`@require_role`) on the Flask API.
- **A03 Injection**: Mitigated by utilizing SQLAlchemy/Prisma ORMs, inherently preventing SQL injection. React DOM auto-escapes HTML, mitigating XSS.
- **A05 Security Misconfiguration**: Strict CORS (Cross-Origin Resource Sharing) headers ensure the API only accepts requests from the specific frontend origin.

## Secrets Management
Zero secrets (API keys, Database URIs, JWT Secrets) are hardcoded. Everything is injected at runtime via Environment Variables, adhering to the Twelve-Factor App methodology.
