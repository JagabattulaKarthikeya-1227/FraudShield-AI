import numpy as np
import pandas as pd
import yaml
import joblib
import os
from app.ml.training.extra_trees import ExtraTreesTrainer
from app.ml.training.mlp import MLPTrainer
from app.ml.training.xgboost_meta import XGBoostMetaTrainer

class InferenceService:
    def __init__(self, registry_path=None, config_path="app/ml/config/risk_thresholds.yaml"):
        # Hardcode paths to where our training script saved them
        base_dir = os.path.dirname(os.path.dirname(__file__))
        models_dir = os.path.join(base_dir, "models", "saved")
        
        self.scaler = joblib.load(os.path.join(models_dir, "scaler.pkl"))
        self.et_model = ExtraTreesTrainer.load(os.path.join(models_dir, "extra_trees.pkl"))
        self.mlp_model = MLPTrainer.load(os.path.join(models_dir, "mlp.keras"))
        self.meta_model = XGBoostMetaTrainer.load(os.path.join(models_dir, "xgboost_meta.pkl"))
        
        # Load Risk Thresholds
        with open(config_path, 'r') as f:
            self.risk_config = yaml.safe_load(f)['thresholds']
            
        self.active_record = {"version_id": "v1.0.0"} # Dummy for API compatibility

    def _determine_risk(self, probability):
        if probability < self.risk_config['low_risk']['max_probability']:
            return "Low Risk", self.risk_config['low_risk']['action']
        elif probability < self.risk_config['review_required']['max_probability']:
            return "Review Required", self.risk_config['review_required']['action']
        else:
            return "High Risk", self.risk_config['high_risk']['action']

    def predict_single(self, transaction_dict: dict):
        # The model expects 30 features: Time, V1-V28, Amount
        # If the API only sends basic info like Amount, we need to construct a 30-dim vector
        
        # Default all 30 features to 0.0
        features = np.zeros((1, 30))
        
        # Assuming the 30th feature (index 29) is Amount, and 1st (index 0) is Time
        # (This matches the Kaggle dataset structure: Time, V1-V28, Amount)
        if "Amount" in transaction_dict:
            features[0, 29] = float(transaction_dict["Amount"])
        
        if "Time" in transaction_dict:
            features[0, 0] = float(transaction_dict["Time"])
            
        # Scale all features exactly how they were scaled in training
        X_scaled = self.scaler.transform(features)
        
        # Base Predictions
        prob_et = self.et_model.predict_proba(X_scaled)
        prob_mlp = self.mlp_model.predict_proba(X_scaled)
        
        # Meta Features
        X_meta = self.meta_model.prepare_meta_features(prob_et, prob_mlp)
        
        # Final Probability
        final_prob = self.meta_model.predict_proba(X_meta)[0]
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
