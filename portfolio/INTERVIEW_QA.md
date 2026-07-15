# Technical Interview Q&A Cheat Sheet

If you demonstrate FraudShield AI in a technical interview, expect senior engineers to probe your architectural decisions. Use these answers to demonstrate seniority and deep systems knowledge.

---

### Q1. "Why did you use Server-Sent Events (SSE) instead of WebSockets for the live notifications?"
**A:** "WebSockets are bidirectional and excellent for chat apps. However, for FraudShield, the data flow is strictly unidirectional (Server pushing alerts to Analysts). WebSockets introduce significant overhead, require custom protocol handling, and often struggle with load balancers. SSE uses standard HTTP/1.1, respects Nginx caching rules, automatically reconnects via the browser's native `EventSource` API, and is vastly lighter for our specific use case."

### Q2. "How did you solve the class imbalance problem in the credit card dataset?"
**A:** "The dataset was highly skewed (99.8% legitimate). If I trained a model natively, it would just predict 'Legitimate' 100% of the time to achieve high accuracy. I used SMOTE (Synthetic Minority Over-sampling Technique) during the training phase. SMOTE interpolates between existing minority examples to create synthetic fraud cases. I explicitly ensured SMOTE was applied *after* train-test splitting to prevent data leakage."

### Q3. "Why did you use a Stacking Meta-Ensemble instead of just XGBoost?"
**A:** "Different algorithms capture different decision boundaries. Extra Trees is highly robust to noise, the Keras Neural Net captures deep non-linear interactions, and XGBoost is excellent for gradient optimization. By stacking them and feeding their outputs into a Logistic Regression meta-classifier, the meta-model learns *which* base model to trust under *which* conditions, consistently outperforming any single model."

### Q4. "How do you explain the AI's decision to a non-technical auditor?"
**A:** "I integrated SHAP (Shapley Additive exPlanations). It relies on cooperative game theory to assign an exact marginal payout (feature importance) to every variable. If the AI flags a transaction, the Explainability Studio renders a SHAP Waterfall chart showing exactly which features (e.g., 'Amount' or 'Location') pushed the base risk score over the threshold, providing cryptographic mathematical proof of the decision."

### Q5. "Why did you use Celery and Redis? Why not just execute predictions in the Flask route?"
**A:** "If a user uploads a CSV with 10,000 transactions, executing that synchronously in Flask would block the Gunicorn worker thread, causing the API to timeout and dropping subsequent requests from other users. By placing the payload onto a Redis message broker, Flask immediately returns a 202 Accepted, and the background Celery worker consumes the queue asynchronously. This keeps the API latency strictly under 100ms."

### Q6. "Why did you choose React Query (TanStack) over Redux?"
**A:** "Redux is great for client-side state, but terrible for server state. Most of FraudShield's state (Audit Logs, Telemetry, Predictions) lives on the server. React Query handles caching, background refetching, deduping identical requests, and loading states out of the box. Writing boilerplate Redux thunks for API calls is an anti-pattern in modern React."
