# Executive Summary: FraudShield AI

## For Recruiters and Hiring Managers

If you are reviewing this portfolio project, you are likely looking for a candidate who can do more than just write basic React components or run Jupyter notebooks. You are looking for an engineer who understands **Enterprise Architecture, Production Machine Learning, and DevSecOps**.

FraudShield AI is designed to demonstrate that exact skill set. 

### What is it?
FraudShield AI is an **Explainable Hybrid Ensemble Framework** for Credit Card Fraud Detection. It is a full-stack web application that allows fraud analysts to review blocked transactions, understand *why* the AI blocked them, and manage the machine learning lifecycle.

### Why does this project stand out?

1. **It solves a real business problem**: Fraud datasets are massively imbalanced (99.9% normal, 0.1% fraud). Standard AI models fail here. This project demonstrates how to solve this using advanced SMOTE sampling and Stacking Ensembles, explicitly optimizing for PR-AUC rather than standard metrics.
2. **It handles regulatory compliance (Explainable AI)**: In finance, you cannot legally deny a transaction using a "Black Box" model. This project uses KernelSHAP to mathematically prove *why* the model made its decision, demonstrating an understanding of AI ethics and compliance.
3. **It demonstrates DevSecOps knowledge**: The platform isn't just a frontend. It features an immutable Audit Log, OWASP Top 10 defenses (like HttpOnly JWT cookies and Argon2id hashing), and an SRE observability dashboard.
4. **World-class UX/UI**: The frontend utilizes Framer Motion and React Three Fiber to create a luxury, cinematic experience that proves a mastery of modern frontend engineering.

### Tech Stack at a Glance
- **Frontend**: React 18, Tailwind CSS, Framer Motion, React Three Fiber (WebGL).
- **Backend**: Python, Flask, Gunicorn.
- **Machine Learning**: Scikit-Learn, XGBoost, SHAP.
- **Data/DevOps**: PostgreSQL, Redis, Docker, GitHub Actions.

> **Note:** The data used in this project is 100% synthetically generated to mirror real-world distributions. No real financial data is exposed, demonstrating an understanding of data privacy laws.
