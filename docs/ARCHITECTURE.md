# System Architecture

FraudShield AI leverages a modern, decoupled Cloud-Native architecture designed for horizontal scalability, high availability, and real-time inference.

## Macro Component Layout

```mermaid
graph TD
    Client([Client Browser / SPA]) --> Nginx[Nginx Reverse Proxy]
    
    subgraph "DMZ / Gateway"
        Nginx
    end
    
    subgraph "Application Tier"
        Nginx --> Frontend[React 19 Frontend Container]
        Nginx -.-> Backend[Flask Gunicorn Backend Container]
        
        Backend --> Auth[JWT Security Middleware]
        Backend --> Predict[Hybrid ML Inference Engine]
        Backend --> SSE[Server-Sent Events Stream]
    end
    
    subgraph "Asynchronous Tier"
        Backend -- Dispatch --> Redis[(Redis Queue)]
        Redis -- Consume --> Celery[Celery Background Worker]
        Celery --> SMTP[Email Delivery Service]
    end
    
    subgraph "Data Tier"
        Backend <--> DB[(MySQL 8 Persistent Store)]
        Celery <--> DB
    end
```

## Authentication & RBAC Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Nginx
    participant Backend
    participant DB

    User->>Frontend: Enters Credentials
    Frontend->>Nginx: POST /api/v1/auth/login
    Nginx->>Backend: Reverse Proxy
    Backend->>DB: Verify bcrypt Hash
    DB-->>Backend: OK, Role=Administrator
    Backend-->>Frontend: 200 OK (JWT Access Token)
    Frontend->>Frontend: Store in memory / Zustand
    
    User->>Frontend: Clicks "System Config"
    Frontend->>Backend: GET /api/v1/ops/config (Bearer Token)
    Backend->>Backend: JWT Middleware validates Token & Role
    Backend-->>Frontend: 200 OK (Config Data)
```

## ML Inference Pipeline Flow

```mermaid
graph LR
    Raw[Raw Transaction] --> Scale[StandardScaler]
    Scale --> SMOTE[SMOTE Balancing (Training Only)]
    Scale --> ExtraTrees[Extra Trees Classifier]
    Scale --> XGB[XGBoost Classifier]
    Scale --> MLP[Keras MLP Neural Net]
    ExtraTrees --> Meta[Meta-Ensemble Router]
    XGB --> Meta
    MLP --> Meta
    Meta --> Isotonic[Isotonic Calibration]
    Isotonic --> Prob[Final Probability %]
    Prob --> SHAP[SHAP TreeExplainer]
    SHAP --> Visual[Explainability Visualizer]
```

## Technology Justifications

1. **Vite + React 19**: Chosen for near-instant HMR (Hot Module Replacement) and massive reductions in production bundle sizes compared to CRA.
2. **Flask + Gunicorn**: A lightweight microframework that doesn't force ORM bloat, allowing precise integration with heavy numerical libraries (Pandas, scikit-learn).
3. **Redis + Celery**: By offloading SMTP handshakes and Batch ML processing to Celery, the primary Flask threads remain unblocked, ensuring API latency remains under 100ms.
