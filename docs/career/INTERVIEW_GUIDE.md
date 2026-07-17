# Interview Guide & STAR Answers

Use this guide to prepare for technical interviews based on your work building FraudShield AI.

## The STAR Method
**Situation**: The context or background.
**Task**: The specific challenge you needed to solve.
**Action**: What *you* did to solve it.
**Result**: The business or technical outcome.

---

## Technical Questions

### Q: "Tell me about a time you had to deal with highly imbalanced data."
**Situation**: While building FraudShield AI, the dataset had a massive class imbalance: 99.8% normal transactions and 0.17% fraud.
**Task**: Standard ML models were simply guessing "Not Fraud" every time to achieve 99% accuracy, completely missing the actual fraud.
**Action**: I implemented a two-step solution. First, I used SMOTE (Synthetic Minority Over-sampling Technique) strictly during the cross-validation training folds to prevent data leakage. Second, I built a Stacking Ensemble using Extra Trees and an MLP, with a Logistic Regression Meta-Learner. Most importantly, I changed the optimization metric from ROC-AUC to PR-AUC.
**Result**: The model successfully learned the minority class boundaries, allowing the platform to flag actual fraudulent transactions without causing massive false positives for legitimate customers.

### Q: "How did you handle application security and authentication?"
**Situation**: FraudShield AI needed to simulate an enterprise SOC 2 compliant environment.
**Task**: I needed to implement secure authentication without relying on a third-party provider like Auth0 to demonstrate backend knowledge.
**Action**: I built a custom JWT authentication flow in Flask. I used Argon2id to hash passwords to protect against GPU cracking. To prevent XSS attacks from stealing tokens, I stored the long-lived refresh tokens in `HttpOnly, SameSite=Strict` cookies, keeping only short-lived access tokens in memory on the React client.
**Result**: The application successfully mitigates the OWASP Top 10 vulnerabilities related to Broken Access Control and XSS.

### Q: "Why did you use React Three Fiber?"
**Situation**: I needed a way to visualize global fraud networks on the Landing Page to create a premium enterprise feel.
**Task**: Standard CSS animations or 2D SVGs were not performant or visually impressive enough to render thousands of data points.
**Action**: I implemented a custom WebGL pipeline using React Three Fiber. I generated a 3D globe geometry and used particle systems to represent transactions. I optimized the render loop by utilizing `useFrame` strictly when the component was in view.
**Result**: The platform achieves a cinematic, 60fps 3D experience directly in the browser without dropping frames, proving deep frontend performance optimization skills.

### Q: "Explain the 'Black Box' problem in AI and how you solved it."
**Situation**: In the financial sector, regulations (like the CFPB) require you to provide a reason for an adverse action (like denying a credit card transaction).
**Task**: The Stacking Ensemble I built was highly accurate, but it was a "black box"—you couldn't easily tell *why* it made a decision.
**Action**: I implemented KernelSHAP (SHapley Additive exPlanations), a game-theoretic approach to explainability. SHAP calculates the exact marginal contribution of every feature to the final prediction. I then built an Enterprise AI Copilot that takes those SHAP mathematical vectors and translates them into plain English for human analysts.
**Result**: The platform provides legally defensible, human-readable explanations for every single blocked transaction.
