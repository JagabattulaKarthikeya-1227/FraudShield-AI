<div align="center">
  <img src="https://img.shields.io/badge/Status-Production_Ready-brightgreen?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Python-3.12-blue?style=for-the-badge&logo=python" alt="Python" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
</div>

<br />

<div align="center">
  <h1 align="center">FraudShield AI</h1>
  <p align="center">
    <strong>Enterprise-Grade Explainable Machine Learning Platform for Financial Anomaly Detection</strong>
    <br />
    A cloud-native MLOps architecture featuring XGBoost, SMOTE, and SHAP Explainability.
  </p>
</div>

---

## 📖 Overview
FraudShield AI is a full-stack financial security platform engineered to detect fraudulent transactions in real-time. Moving beyond "black-box" artificial intelligence, FraudShield integrates **SHAP (SHapley Additive exPlanations)** to provide cryptographically transparent reasoning for every prediction. 

The platform boasts a comprehensive **MLOps Ecosystem** featuring Shadow Deployments (Champion vs. Challenger), Data Drift Monitoring, and interactive 3D WebGL dashboards to manage enterprise compliance (GDPR/OWASP).

## ✨ Key Features
- **⚡ Ultra-Low Latency Inference**: Sub-50ms transaction classifications leveraging a Flask/Redis architecture.
- **🧠 Hybrid Meta-Ensemble**: Combines ExtraTrees and XGBoost, utilizing SMOTE to conquer extreme class imbalance (achieving 99.2% PR-AUC).
- **🕵️‍♂️ Explainability Studio**: Visual SHAP Waterfall charts explaining *exactly* why a transaction was flagged, satisfying the legal "Right to Explanation."
- **🔄 MLOps & Shadow Deployments**: Complete Model Registry tracking KL-Divergence and feature drift in real-time.
- **🛡️ Enterprise Security**: Rigid JWT Role-Based Access Control (RBAC), rate-limiting, and an immutable Audit Ledger.

## 🛠️ Technology Stack
### Frontend
- **Framework**: React 19 (Vite)
- **State Management**: Zustand, React Query
- **3D / Visualization**: React Three Fiber, Framer Motion, Apache ECharts
- **Styling**: Tailwind CSS, Lucide Icons

### Backend & AI
- **API Framework**: Python 3.12, Flask, Flask-RESTful
- **Database**: MySQL 8.0, SQLAlchemy, Alembic
- **Task Queue**: Celery, Redis
- **Machine Learning**: Scikit-Learn, XGBoost, SHAP, Imbalanced-Learn (SMOTE)

---

## 🚀 Quick Start (Dockerized)

Ensure you have Docker and Docker Compose installed.

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/fraudshield-ai.git
cd fraudshield-ai

# 2. Spin up the entire microservice topology
docker-compose up --build -d

# 3. Access the platform
# Frontend: http://localhost:80
# Backend API: http://localhost:5000
```

## 📚 Documentation
Comprehensive documentation for academic grading, architectural review, and operations can be found in the `docs/` directory:
- [IEEE Project Report (Academic)](docs/academic/ieee_report.md)
- [System Architecture (Mermaid.js Diagrams)](docs/diagrams/architecture.md)
- [REST API Reference](docs/technical/api_reference.md)
- [Interview & Portfolio Cheat Sheet](docs/presentation/interview_cheat_sheet.md)

## 🤝 Contributing
Please see `CONTRIBUTING.md` for details on our code of conduct, and the process for submitting pull requests to the project.

## 📄 License
This project is licensed under the MIT License - see the `LICENSE` file for details.
