import os
import pandas as pd
from imblearn.over_sampling import SMOTE
from imblearn.under_sampling import RandomUnderSampler
from imblearn.pipeline import Pipeline
from collections import Counter

def enhance_dataset(
    target_majority_size=50000,
    target_minority_size=50000
):
    base_dir = os.path.dirname(os.path.dirname(__file__))
    input_path = os.path.join(base_dir, "data", "raw", "creditcard.csv")
    output_path = os.path.join(base_dir, "data", "processed", "creditcard_enhanced.csv")
    
    print(f"Loading raw dataset from {input_path}...")
    
    # Check if file exists
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Could not find {input_path}. Please make sure the file is in the right location.")
        
    df = pd.read_csv(input_path)
    
    # Ensure there are no NaNs
    df = df.dropna()
    
    X = df.drop(columns=["Class"])
    y = df["Class"]
    
    print(f"Original dataset shape: {X.shape}")
    print(f"Original class distribution: {Counter(y)}")
    
    print("Applying Undersampling on the majority class and SMOTE on the minority class...")
    
    # Define pipeline
    # 1. Undersample majority class (0) to target_majority_size
    # 2. Oversample minority class (1) to target_minority_size
    under = RandomUnderSampler(sampling_strategy={0: target_majority_size}, random_state=42)
    over = SMOTE(sampling_strategy={1: target_minority_size}, random_state=42)
    
    steps = [('u', under), ('o', over)]
    pipeline = Pipeline(steps=steps)
    
    # Transform the dataset
    X_resampled, y_resampled = pipeline.fit_resample(X, y)
    
    print(f"Enhanced dataset shape: {X_resampled.shape}")
    print(f"Enhanced class distribution: {Counter(y_resampled)}")
    
    # Create output directory if it doesn't exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Recombine features and target
    df_enhanced = pd.concat([X_resampled, y_resampled], axis=1)
    
    print(f"Saving enhanced dataset to {output_path}...")
    df_enhanced.to_csv(output_path, index=False)
    
    print("Dataset enhancement complete!")

if __name__ == "__main__":
    enhance_dataset()
