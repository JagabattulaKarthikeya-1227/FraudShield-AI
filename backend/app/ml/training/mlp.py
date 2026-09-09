import logging
logger = logging.getLogger(__name__)
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, BatchNormalization, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
import tensorflow.keras.regularizers as regularizers
import os


class MLPTrainer:
    def __init__(self, input_dim, random_seed=42):
        tf.random.set_seed(random_seed)
        self.input_dim = input_dim
        self.model = self._build_model()

    def _build_model(self):
        reg = regularizers.l2(1e-4)
        model = Sequential(
            [
                Dense(
                    128,
                    activation="swish",
                    kernel_regularizer=reg,
                    input_shape=(self.input_dim,),
                ),
                BatchNormalization(),
                Dropout(0.3),
                Dense(64, activation="swish", kernel_regularizer=reg),
                Dropout(0.3),
                Dense(32, activation="swish", kernel_regularizer=reg),
                BatchNormalization(),
                Dropout(0.3),
                Dense(16, activation="swish", kernel_regularizer=reg),
                Dense(1, activation="sigmoid"),
            ]
        )
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
            loss="binary_crossentropy",
            metrics=[
                tf.keras.metrics.AUC(name="auc"),
                tf.keras.metrics.Precision(name="precision"),
            ],
        )
        return model

    def train(
        self, X_train, y_train, X_val, y_val, batch_size=256, epochs=50, save_path=None
    ):
        logger.info("Training Keras MLP Base Model...")

        callbacks = [
            EarlyStopping(
                monitor="val_auc", mode="max", patience=30, restore_best_weights=True
            ),
            ReduceLROnPlateau(
                monitor="val_auc", mode="max", factor=0.5, patience=10, min_lr=1e-6
            ),
        ]

        if save_path:
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            callbacks.append(
                ModelCheckpoint(
                    save_path, save_best_only=True, monitor="val_auc", mode="max"
                )
            )

        history = self.model.fit(
            X_train,
            y_train,
            validation_data=(X_val, y_val),
            batch_size=batch_size,
            epochs=500,  # Pushed to extreme limit
            callbacks=callbacks,
            verbose=1,
        )
        logger.info("MLP Training complete.")
        return history

    def predict_proba(self, X):
        return self.model(X, training=False).numpy().ravel()

    def save(self, path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        self.model.save(path)

    @classmethod
    def load(cls, path):
        # input_dim doesn't matter for loading
        instance = cls(input_dim=1)
        instance.model = tf.keras.models.load_model(path)
        return instance
