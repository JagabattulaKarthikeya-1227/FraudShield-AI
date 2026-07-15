import json
from flask import Blueprint, request, Response, stream_with_context
from flask_jwt_extended import jwt_required, get_current_user
from app.core.responses import success_response
from app.core.exceptions import AppError
from app.services.llm_service import MockLLMService

copilot_bp = Blueprint('copilot', __name__)

@copilot_bp.route('/chat', methods=['POST'])
@jwt_required()
def chat_stream():
    """
    Streams a response back to the client using Server-Sent Events (SSE).
    """
    user = get_current_user()
    data = request.get_json()
    query = data.get("query", "")
    
    if not query:
        raise AppError("Query cannot be empty", 400)
        
    full_response = MockLLMService.generate_chat_response(query, user.role.value)
    
    def generate():
        for token in MockLLMService.stream_tokens(full_response):
            # SSE format: data: {"token": "hello"}\n\n
            payload = json.dumps({"token": token})
            yield f"data: {payload}\n\n"
        # Send an end event
        yield f"data: {json.dumps({'done': True})}\n\n"
            
    return Response(stream_with_context(generate()), mimetype='text/event-stream')

@copilot_bp.route('/summarize/<tx_id>', methods=['GET'])
@jwt_required()
def summarize_case(tx_id):
    user = get_current_user()
    if user.role.value not in ["Administrator", "Fraud Analyst"]:
        raise AppError("Unauthorized.", 403)
        
    summary = f"AI Summary for {tx_id}: This transaction was classified as High Risk (89%). The SHAP TreeExplainer indicates that the primary driving factors were the transaction Amount and the V2 location vector deviating from historic baselines."
    
    return success_response(data={"summary": summary})

@copilot_bp.route('/report', methods=['GET'])
@jwt_required()
def generate_report():
    user = get_current_user()
    if user.role.value != "Administrator":
        raise AppError("Unauthorized.", 403)
        
    markdown_report = """# Executive Fraud Report
    
## Velocity
Fraud attempts have risen 12% week-over-week.

## Model Performance
The Hybrid Meta-Ensemble correctly intercepted $452,000 in fraudulent attempts yesterday. 
False positive rates remain suppressed below 0.1% due to Isotonic Calibration.
"""
    return success_response(data={"report": markdown_report})
