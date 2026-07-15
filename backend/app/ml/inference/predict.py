import numpy as np
import pandas as pd
import yaml
from app.ml.versioning.registry import ModelRegistry
from app.ml.training.extra_trees import ExtraTreesTrainer
from app.ml.training.mlp import MLPTrainer
from app.ml.training.calibration import ProbabilityCalibrator
import joblib

class InferenceService:
    def __init__(self, registry_path="../models/model_registry.json", config_path="../config/risk_thresholds.yaml"):
        self.registry = ModelRegistry(registry_path)
        self.active_record = self.registry.get_active_model()
        paths = self.active_record["paths"]
        
        # Load components
        self.scaler = joblib.load(paths["scaler"])
        self.et_model = ExtraTreesTrainer.load(paths["extra_trees"])
        self.mlp_model = MLPTrainer.load(paths["mlp"])
        self.calibrator = ProbabilityCalibrator.load(paths["calibrator"])
        
        # Load Risk Thresholds
        with open(config_path, 'r') as f:
            self.risk_config = yaml.safe_load(f)['thresholds']

    def _determine_risk(self, probability):
        if probability < self.risk_config['low_risk']['max_probability']:
            return "Low Risk", self.risk_config['low_risk']['action']
        elif probability < self.risk_config['review_required']['max_probability']:
            return "Review Required", self.risk_config['review_required']['action']
        else:
            return "High Risk", self.risk_config['high_risk']['action']

    def predict_single(self, transaction_dict: dict):
        df = pd.DataFrame([transaction_dict])
        # Note: Assuming transaction_dict is raw and requires scaling on specific columns
        if 'Time' in df.columns and 'Amount' in df.columns:
            df[['Time', 'Amount']] = self.scaler.transform(df[['Time', 'Amount']])
        
        X = df.values
        
        # Base Predictions
        prob_et = self.et_model.predict_proba(X)
        prob_mlp = self.mlp_model.predict_proba(X)
        
        # Meta Features
        X_meta = np.column_stack((prob_et, prob_mlp))
        
        # Final Calibrated Probability
        final_prob = self.calibrator.predict_proba(X_meta)[0]
        risk_level, action = self._determine_risk(final_prob)
        
        return {
            "probability": float(final_prob),
            "risk_level": risk_level,
            "suggested_action": action,
            "base_models": {
                "extra_trees": float(prob_et[0]),
                "mlp": float(prob_mlp[0])
            }
        }
