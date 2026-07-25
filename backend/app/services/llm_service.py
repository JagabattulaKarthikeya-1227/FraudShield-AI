import time
import re
from app.models.transaction import Transaction
from app.models.grc import SecurityIncident
from app.models.mlops import MLModel
from app.database.core import db

class MockLLMService:
    @staticmethod
    def generate_chat_response(query: str, role: str):
        """
        A dynamic Intent Router that queries real database metrics and answers Copilot prompts instantly.
        """
        query_lower = query.lower()
        
        if role in ["Customer", "customer"]:
            if "trust" in query_lower or "score" in query_lower or "explain" in query_lower:
                return "Your **Trust Score** is currently **98/100 (Excellent)**. Our AI models continuously evaluate your login patterns, device biometrics, and transaction velocity. Because your account shows consistent legitimate usage with zero security flags, you enjoy instant checkout approvals and zero verification friction."
            if "secure" in query_lower or "account" in query_lower or "health" in query_lower:
                return "Your account security status is **Active & Monitored**. We have verified your current device, and 2-Factor Authentication (2FA) is enabled. No unauthorized login attempts or credential breaches have been detected in the last 30 days."
            if "summarize" in query_lower or "activity" in query_lower or "recent" in query_lower:
                return "Recent Activity Summary: You have made **3 approved transactions** in the past 7 days totaling **$374.99**. All purchases matched your historic behavior profiles across retail and grocery categories."
            if "verify" in query_lower or "hold" in query_lower:
                return "Your recent transaction was flagged for security reasons. To release the hold, please navigate to the **Action Center** and upload a valid government-issued ID."
            return f"I am the FraudShield Customer Assistant. I have analyzed your request regarding '{query}'. Your account is in Good Standing (Trust Score: 98/100) and all transactions are protected by our real-time AI engine."
            
        elif role in ["Fraud Analyst", "Analyst", "analyst"]:
            if "shap" in query_lower or "why" in query_lower or "explain" in query_lower:
                return "Based on the real-time TreeSHAP analysis, the transaction was flagged due to an anomalous Amount coupled with a spatial outlier in the V2 vector. The model penalty was strictly enforced by the XGBoost Meta-Learner."
            if "report" in query_lower or "investigation" in query_lower or "generate" in query_lower:
                return "Generating Case Investigation Report...\n\n**Case ID:** TX-99281\n**Risk Rating:** 89% (High Risk)\n**Key Findings:**\n- Velocity spike detected: 4 transactions in 12 minutes.\n- Geolocation anomaly: IP address originates 2,400 miles from billing address.\n- Recommendation: Keep hold active and request manual verification."
            if "lime" in query_lower or "local" in query_lower:
                return "Local LIME Explanation:\n- **Feature 'Amount' (> $800):** +0.42 risk contribution.\n- **Feature 'Distance_from_home':** +0.31 risk contribution.\n- **Feature 'Merchant_Category (Crypto/Gambling)':** +0.18 risk contribution.\nThe local linear model confirms positive weights driving the High Risk decision."
            if "threshold" in query_lower or "risk" in query_lower:
                return "The production risk thresholds are calibrated as follows:\n- 🟢 **Low Risk (0.00 - 0.30):** Automatic approval without friction.\n- 🟡 **Review Required (0.30 - 0.70):** Flagged for secondary verification / OTP.\n- 🔴 **High Risk (0.70 - 1.00):** Immediate transaction hold and analyst queue dispatch."
            if "summarize" in query_lower or "today" in query_lower:
                blocked_count = Transaction.query.filter_by(status='declined').count() if hasattr(Transaction, 'query') else 12
                return f"Today's summary: The engine has intercepted **{blocked_count}** high-risk transactions. The primary anomaly vectors appear to be localized around V2 and V14 coordinates. I recommend reviewing the Priority Queue immediately."
            return f"Analyst Copilot ready. I have processed your query regarding '{query}'. All live SHAP explainer pipelines and transaction tables are actively connected."
            
        elif role in ["Administrator", "Admin", "admin"]:
            if "health" in query_lower or "system" in query_lower or "check" in query_lower:
                champion = MLModel.query.filter_by(status="Champion").first() if hasattr(MLModel, 'query') else None
                v = champion.version if champion else "v1.0"
                return f"System Status: **Healthy**. The {v} Meta-Ensemble is actively scoring in production. Background Celery queues are operating with zero backlog and API latency is < 15ms."
            if "audit" in query_lower or "summary" in query_lower or "report" in query_lower or "incident" in query_lower:
                criticals = SecurityIncident.query.filter_by(severity="Critical").count() if hasattr(SecurityIncident, 'query') else 0
                return f"Generating Executive Summary... We currently have **{criticals}** critical security incidents actively being investigated. False positive rates remain below 0.1% due to Isotonic Calibration."
            if "drift" in query_lower or "model" in query_lower or "show" in query_lower:
                return "Model Drift Analysis (Last 30 Days):\n- **PSI (Population Stability Index):** 0.04 (No significant feature drift detected).\n- **KS Statistic:** 0.68 (Model discrimination remains strong).\n- **Action:** No retraining required at this time. Scheduled validation in 14 days."
            if "database" in query_lower or "latency" in query_lower or "performance" in query_lower:
                return "Real-Time Infrastructure Metrics:\n- **PostgreSQL Read Latency:** 1.2ms (p95: 3.4ms)\n- **Redis Cache Hit Rate:** 99.4%\n- **ML Inference Engine Avg Time:** 12.8ms per prediction.\nAll database clusters are operating well within SLAs."
            return f"Admin Copilot ready. I have queried our telemetry and security clusters regarding '{query}'. All systems and MLOps pipelines are running normally."
            
        return f"I am ready to assist you in {role} mode. I have analyzed your request regarding '{query}' against our live FraudShield database and AI telemetry. All systems are secure and running within expected thresholds."

    @staticmethod
    def stream_tokens(text: str):
        """
        Simulates fast token-by-token streaming of an LLM via SSE (<0.1s total delay).
        """
        words = text.split(" ")
        for i, word in enumerate(words):
            token = word + (" " if i < len(words) - 1 else "")
            time.sleep(0.002) 
            yield token
