import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, BatchNormalization, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
import os

class MLPTrainer:
    def __init__(self, input_dim, random_seed=42):
        tf.random.set_seed(random_seed)
        self.input_dim = input_dim
        self.model = self._build_model()

    def _build_model(self):
        model = Sequential([
            Dense(64, activation='relu', input_shape=(self.input_dim,)),
            BatchNormalization(),
            Dropout(0.3),
            Dense(32, activation='relu'),
            BatchNormalization(),
            Dropout(0.3),
            Dense(16, activation='relu'),
            Dense(1, activation='sigmoid')
        ])
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
            loss='binary_crossentropy',
            metrics=[tf.keras.metrics.AUC(name='auc'), tf.keras.metrics.Precision(name='precision')]
        )
        return model

    def train(self, X_train, y_train, X_val, y_val, batch_size=256, epochs=50, save_path=None):
        print("Training Keras MLP Base Model...")
        
        callbacks = [
            EarlyStopping(monitor='val_auc', mode='max', patience=10, restore_best_weights=True)
        ]
        
        if save_path:
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            callbacks.append(ModelCheckpoint(save_path, save_best_only=True, monitor='val_auc', mode='max'))

        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            batch_size=batch_size,
            epochs=epochs,
            callbacks=callbacks,
            verbose=1
        )
        print("MLP Training complete.")
        return history

    def predict_proba(self, X):
        return self.model.predict(X).ravel()
        
    def save(self, path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        self.model.save(path)

    @classmethod
    def load(cls, path):
        # input_dim doesn't matter for loading
        instance = cls(input_dim=1) 
        instance.model = tf.keras.models.load_model(path)
        return instance
