# FraudShield AI Demo Scripts

Use these scripts for Hackathons, Academic Presentations, or Job Interviews. Keep a second monitor open with this script while screen-sharing.

---

## ⏱️ The 5-Minute Pitch (Hackathons & Executives)

**[0:00 - Setup]** 
*Action: Have the `AnalyticsCenter` page open. Do not touch the mouse yet.*

**[0:05 - The Hook]**
"Credit card fraud costs banks $32 Billion a year. But the biggest problem isn't detecting fraud—it's explaining the AI's decision to regulators. I built FraudShield AI, an enterprise platform that solves the 'Black Box' problem."

**[1:00 - The Infrastructure]**
*Action: Scroll down slowly to show the ECharts Timeline and Heatmap.*
"This is the Command Center. The React frontend is streaming live Server-Sent Events from a Flask Python backend. Under the hood, I'm orchestrating Nginx, Redis, Celery, and MySQL via Docker Compose. The telemetry you see here updates asynchronously without blocking the UI thread."

**[2:00 - The ML Engine]**
*Action: Click into `MLOpsCenter`.*
"To detect fraud on a heavily imbalanced dataset (99.8% legitimate), I engineered a Stacking Meta-Ensemble. I combined XGBoost, Extra Trees, and a Deep Neural Net, balanced the classes using SMOTE, and calibrated the output probabilities using Isotonic Regression."

**[3:00 - The Killer Feature (Explainability)]**
*Action: Click into `DecisionLab`. Select a High-Risk transaction.*
"But here is the killer feature. Regulators demand explanations for AI decisions. I integrated SHAP cooperative game theory to break down the exact mathematical contribution of every feature. As you can see on this Waterfall chart, we have cryptographic proof of *why* the AI declined this card."

**[4:00 - Conclusion]**
"FraudShield AI isn't just a model in a Jupyter Notebook. It's a secure, cloud-native, production-ready AI platform."

---

## ⏱️ The 10-Minute Deep Dive (Technical Recruiters)

*Perform the 5-minute pitch, but expand on these specific technical sections:*

**[Add at 2:30 - Security Architecture]**
*Action: Open the `SecurityCenter` page.*
"Security is paramount in fintech. The platform utilizes strict Role-Based Access Control via JSON Web Tokens. I built this OWASP Security Center to monitor API Rate Limiting drops and active JWT revocations. The entire stack sits behind an Nginx reverse proxy enforcing HSTS and XSS protection headers."

**[Add at 3:30 - Asynchronous Workers]**
*Action: Open the `AuditCenter` page to show the Workflow Timeline.*
"Handling a massive CSV batch upload of 10,000 transactions would normally crash a synchronous web server. I solved this by separating concerns. The Flask API simply validates the payload and drops it onto a Redis message broker. A background Celery worker consumes the queue, processes the predictions, and dispatches SMTP emails independently. This guarantees our API latency remains under 100 milliseconds."
