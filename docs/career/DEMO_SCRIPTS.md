# Demo Scripts

Use these scripts when presenting the project via screen share in an interview.

## The 5-Minute Technical Screen Demo

**[0:00 - Open on the Landing Page]**
"Hi, I'd like to show you FraudShield AI. This is a full-stack DevSecOps platform I built to demonstrate how to deploy Machine Learning models into a heavily regulated enterprise environment, like banking."

**[1:00 - Navigate to the Fraud Analyst Workspace]**
"The core ML problem here was detecting credit card fraud on a dataset where the positive class is less than 0.2%. Standard accuracy metrics fail here. So, I built a Stacking Ensemble optimizing for PR-AUC, using SMOTE carefully to avoid data leakage."

**[2:00 - Click on a Blocked Transaction to open the Copilot/SHAP view]**
"However, in finance, you can't just use a Black Box model. If you deny a transaction, you have to explain why. Here, I've implemented KernelSHAP to calculate the exact feature importance of this specific blocked transaction. I then built an AI Copilot that translates those math vectors into this plain-English narrative for the human analyst."

**[3:30 - Navigate to the System Health / DevOps Dashboard]**
"I also wanted to demonstrate production engineering skills. This is the SRE dashboard monitoring the simulated microservices. I built a custom JWT auth flow using Argon2id and HttpOnly cookies, mitigating XSS risks. As you can see down here, the architecture is designed to run in Docker containers behind an NGINX reverse proxy."

**[4:30 - Conclusion]**
"Overall, the project allowed me to combine React frontend performance optimization with heavy backend ML inference and cybersecurity principles. I'd be happy to dive into any of the code with you."
