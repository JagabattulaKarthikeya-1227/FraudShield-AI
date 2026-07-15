from sklearn.ensemble import ExtraTreesClassifier
import joblib
import os

class ExtraTreesTrainer:
    def __init__(self, random_seed=42):
        self.model = ExtraTreesClassifier(
            n_estimators=100,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            class_weight='balanced',
            n_jobs=-1,
            random_state=random_seed
        )

    def train(self, X_train, y_train):
        print("Training Extra Trees Base Model...")
        self.model.fit(X_train, y_train)
        print("Training complete.")

    def predict_proba(self, X):
        return self.model.predict_proba(X)[:, 1]

    def save(self, path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump(self.model, path)
        print(f"Extra Trees model saved to {path}")

    @classmethod
    def load(cls, path):
        instance = cls()
        instance.model = joblib.load(path)
        return instance
