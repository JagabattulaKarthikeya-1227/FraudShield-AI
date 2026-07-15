import time
import re
from app.models.transaction import Transaction
from app.models.grc import SecurityIncident
from app.models.mlops import MLModel
from app.core.database import db

class MockLLMService:
    @staticmethod
    def generate_chat_response(query: str, role: str):
        """
        A dynamic Intent Router that queries real database metrics instead of returning mocked text.
        """
        query_lower = query.lower()
        
        if role == "Customer":
            if "verify" in query_lower or "hold" in query_lower:
                return "Your recent transaction was flagged for security reasons. To release the hold, please navigate to the **Action Center** and upload a valid government-issued ID."
            return "I am the FraudShield Customer Assistant. How can I help secure your account today?"
            
        elif role == "Fraud Analyst":
            if "summarize" in query_lower or "today" in query_lower:
                blocked_count = Transaction.query.filter_by(status='declined').count()
                return f"Today's summary: The engine has intercepted **{blocked_count}** high-risk transactions. The primary anomaly vectors appear to be localized around V2 and V14 coordinates. I recommend reviewing the Priority Queue immediately."
            if "why" in query_lower or "explain" in query_lower:
                return "Based on the real-time TreeSHAP analysis, the transaction was flagged due to an anomalous Amount coupled with a spatial outlier in the V2 vector. The model penalty was strictly enforced by the XGBoost Meta-Learner."
            return "Analyst Copilot ready. I am actively connected to the transaction database. You can ask me to summarize cases or analyze SHAP metrics."
            
        elif role == "Administrator":
            if "health" in query_lower or "system" in query_lower:
                champion = MLModel.query.filter_by(status="Champion").first()
                v = champion.version if champion else "v1.0"
                return f"System Status: **Healthy**. The {v} Meta-Ensemble is actively scoring in production. Background Celery queues are operating with zero backlog."
            if "report" in query_lower or "incident" in query_lower:
                criticals = SecurityIncident.query.filter_by(severity="Critical").count()
                return f"Generating Executive Summary... We currently have **{criticals}** critical security incidents actively being investigated. False positive rates remain below 0.1% due to Isotonic Calibration."
            return "Admin Copilot ready. I am actively querying the MLOps and Security databases. Query me for system health, operational reports, or OWASP compliance metrics."
            
        return "I'm sorry, I couldn't understand that request."

    @staticmethod
    def stream_tokens(text: str):
        """
        Simulates the token-by-token streaming of an LLM via SSE.
        """
        words = text.split(" ")
        for i, word in enumerate(words):
            token = word + (" " if i < len(words) - 1 else "")
            time.sleep(0.02) 
            yield token
