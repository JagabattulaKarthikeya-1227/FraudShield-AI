import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from app.ml.training.extra_trees import ExtraTreesTrainer
from app.ml.training.mlp import MLPTrainer
from app.ml.training.xgboost_meta import XGBoostMetaTrainer
import joblib

def main():
    base_dir = os.path.dirname(os.path.dirname(__file__))
    data_path = os.path.join(base_dir, "data", "processed", "creditcard_enhanced.csv")
    models_dir = os.path.join(base_dir, "models", "saved")
    
    print(f"Loading enhanced dataset from {data_path}...")
    df = pd.read_csv(data_path)
    
    X = df.drop(columns=["Class"])
    y = df["Class"].values
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Save scaler
    os.makedirs(models_dir, exist_ok=True)
    joblib.dump(scaler, os.path.join(models_dir, "scaler.pkl"))
    print("Saved feature scaler.")
    
    print("Splitting data into Train and Validation sets (80/20)...")
    X_train, X_val, y_train, y_val = train_test_split(X_scaled, y, test_size=0.2, random_state=42, stratify=y)
    
    print(f"Train shapes: X={X_train.shape}, y={y_train.shape}")
    print(f"Val shapes: X={X_val.shape}, y={y_val.shape}")
    
    # 1. Train Extra Trees Base Model
    print("\n--- Training Extra Trees Base Model ---")
    et_trainer = ExtraTreesTrainer(random_seed=42)
    et_trainer.train(X_train, y_train)
    et_trainer.save(os.path.join(models_dir, "extra_trees.pkl"))
    
    # 2. Train Keras MLP Base Model
    print("\n--- Training Keras MLP Base Model ---")
    mlp_trainer = MLPTrainer(input_dim=X_train.shape[1], random_seed=42)
    mlp_path = os.path.join(models_dir, "mlp.keras")
    mlp_trainer.train(X_train, y_train, X_val, y_val, batch_size=256, epochs=10, save_path=mlp_path)
    # The best weights are saved to mlp_path via ModelCheckpoint callback
    # Re-load the best weights just in case
    mlp_trainer = MLPTrainer.load(mlp_path)
    
    # 3. Generate Meta Features
    print("\n--- Generating Meta-features for Meta Model ---")
    # Base model predictions on Train
    prob_et_train = et_trainer.predict_proba(X_train)
    prob_mlp_train = mlp_trainer.predict_proba(X_train)
    
    # Base model predictions on Val
    prob_et_val = et_trainer.predict_proba(X_val)
    prob_mlp_val = mlp_trainer.predict_proba(X_val)
    
    xgb_trainer = XGBoostMetaTrainer(random_seed=42)
    X_meta_train = xgb_trainer.prepare_meta_features(prob_et_train, prob_mlp_train)
    X_meta_val = xgb_trainer.prepare_meta_features(prob_et_val, prob_mlp_val)
    
    # 4. Train XGBoost Meta Model
    print("\n--- Training XGBoost Meta Model ---")
    xgb_trainer.train(X_meta_train, y_train, X_meta_val, y_val)
    xgb_trainer.save(os.path.join(models_dir, "xgboost_meta.pkl"))
    
    print("\nAll models trained and saved successfully!")

if __name__ == "__main__":
    main()
