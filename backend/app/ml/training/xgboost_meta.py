import xgboost as xgb
import numpy as np
import joblib
import os

class XGBoostMetaTrainer:
    def __init__(self, random_seed=42):
        self.model = xgb.XGBClassifier(
            n_estimators=150,
            learning_rate=0.05,
            max_depth=4,
            subsample=0.8,
            colsample_bytree=0.8,
            scale_pos_weight=10, # Slight boost to positive class in meta stage
            random_state=random_seed,
            eval_metric="aucpr",
            early_stopping_rounds=15
        )

    def prepare_meta_features(self, prob_et, prob_mlp):
        """Stacks probabilities from base models"""
        return np.column_stack((prob_et, prob_mlp))

    def train(self, X_meta_train, y_train, X_meta_val, y_val):
        print("Training XGBoost Meta Model...")
        self.model.fit(
            X_meta_train, y_train,
            eval_set=[(X_meta_val, y_val)],
            verbose=False
        )
        print("Meta Model Training complete.")

    def predict_proba(self, X_meta):
        return self.model.predict_proba(X_meta)[:, 1]

    def save(self, path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump(self.model, path)
        print(f"XGBoost Meta Model saved to {path}")

    @classmethod
    def load(cls, path):
        instance = cls()
        instance.model = joblib.load(path)
        return instance
