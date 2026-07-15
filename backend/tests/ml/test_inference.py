import pytest
from unittest.mock import patch, MagicMock
from app.ml.inference.predict import InferenceService

@patch('app.ml.inference.predict.ModelRegistry')
@patch('app.ml.inference.predict.ExtraTreesTrainer')
@patch('app.ml.inference.predict.MLPTrainer')
@patch('app.ml.inference.predict.ProbabilityCalibrator')
@patch('joblib.load')
def test_inference_service_classification(mock_joblib, mock_calibrator, mock_mlp, mock_et, mock_registry):
    # Setup mocks
    mock_registry_instance = mock_registry.return_value
    mock_registry_instance.get_active_model.return_value = {
        "paths": {
            "scaler": "dummy",
            "extra_trees": "dummy",
            "mlp": "dummy",
            "calibrator": "dummy"
        }
    }
    
    mock_scaler = mock_joblib.return_value
    mock_scaler.transform.return_value = [[0.0, 0.0]]
    
    mock_et_instance = mock_et.load.return_value
    mock_et_instance.predict_proba.return_value = [0.1]
    
    mock_mlp_instance = mock_mlp.load.return_value
    mock_mlp_instance.predict_proba.return_value = [0.2]
    
    mock_calibrator_instance = mock_calibrator.load.return_value
    mock_calibrator_instance.predict_proba.return_value = [0.85] # Should trigger High Risk
    
    # Initialize service
    # We mock config loading directly or provide a test config
    with patch('builtins.open', new_callable=MagicMock) as mock_open:
        mock_open.return_value.__enter__.return_value.read.return_value = """
thresholds:
  low_risk:
    max_probability: 0.15
    action: "approve"
  review_required:
    min_probability: 0.15
    max_probability: 0.75
    action: "flag"
  high_risk:
    min_probability: 0.75
    action: "decline"
"""
        service = InferenceService(registry_path="dummy", config_path="dummy")
        
        result = service.predict_single({"Time": 0, "Amount": 100, "V1": 0.5})
        
        assert result["risk_level"] == "High Risk"
        assert result["suggested_action"] == "decline"
        assert result["probability"] == 0.85
