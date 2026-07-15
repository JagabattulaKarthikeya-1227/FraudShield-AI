# MLOps & Explainability Guide

FraudShield AI departs from traditional single-model deployments by utilizing a **Calibrated Hybrid Meta-Ensemble**. This document explains the machine learning architecture.

## 1. The Class Imbalance Problem
Credit card fraud datasets (like the European Cardholder dataset) are notoriously skewed, often featuring a 99.8% to 0.2% legitimate-to-fraud ratio. 
If left unaddressed, models will trivially predict "Legitimate" 100% of the time and achieve 99.8% accuracy while failing entirely at their actual job.

**Our Solution**: During the training pipeline, we apply **SMOTE** (Synthetic Minority Over-sampling Technique). SMOTE generates synthetic fraud examples by interpolating between existing minority instances in the feature space, allowing the classifiers to learn distinct decision boundaries.

## 2. The Hybrid Meta-Ensemble
No single algorithm captures all nuances of fraud:
- **Extra Trees Classifier**: Excellent at handling noisy, high-dimensional tabular data.
- **XGBoost**: Gradient boosted trees provide unparalleled accuracy for non-linear relationships.
- **Keras MLP (Neural Net)**: Deep learning catches complex, hidden interactions between features.

**Our Solution**: The outputs of these three base learners are fed into a Logistic Regression Meta-Classifier (Stacking). The meta-classifier learns *which* base model to trust under *which* conditions.

## 3. Probability Calibration (Isotonic Regression)
Tree-based models (like XGBoost) often produce uncalibrated probabilities (e.g., they might output 0.8, but empirically only 60% of those transactions are fraud).
In a fintech environment, a predicted probability of 80% MUST mean an 80% empirical likelihood of fraud.

**Our Solution**: We apply **Isotonic Regression** on top of the ensemble. This non-parametric calibration forces the predicted probabilities to strictly map to true empirical likelihoods.

## 4. SHAP and LIME (Explainability)
The primary business obstacle to AI adoption in banking is the "Black Box" problem. Regulations (like GDPR's Right to Explanation) require banks to justify adverse actions (e.g., declining a transaction).

- **SHAP (SHapley Additive exPlanations)**: Based on cooperative game theory, SHAP calculates the exact marginal contribution of every single feature (V1-V28, Amount) to the final risk score.
- **LIME (Local Interpretable Model-agnostic Explanations)**: Generates a local surrogate model around the specific transaction to prove *why* the complex ensemble made its decision.

FraudShield's Explainability Studio visualizes these mathematical outputs in human-readable Waterfall and Radar charts, allowing Fraud Analysts to confidently verify AI decisions.
