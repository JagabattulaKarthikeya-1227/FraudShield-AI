import shap
import lime
import lime.lime_tabular
import numpy as np
import os
import matplotlib.pyplot as plt


class ExplainabilityEngine:
    def __init__(self, model, background_data, feature_names):
        """
        model: Must have a predict_proba method (e.g. ExtraTreesTrainer or the meta model).
        Automatically selects TreeExplainer for tree-based models (fast, O(n) per instance)
        and falls back to KernelExplainer for black-box models.
        """
        self.model = model
        self.background_data = background_data
        self.feature_names = feature_names

        # Initialize LIME explainer (used as a local linear approximation)
        self.lime_explainer = lime.lime_tabular.LimeTabularExplainer(
            training_data=np.array(self.background_data),
            feature_names=self.feature_names,
            class_names=["Legitimate", "Fraud"],
            mode="classification",
        )

        # Choose the fastest available SHAP explainer.
        # TreeExplainer is O(n * tree_depth) — typically < 100ms per instance.
        # KernelExplainer is O(n * background_size) — can take minutes.
        raw_model = getattr(model, "model", model)  # unwrap trainer wrappers
        if hasattr(raw_model, "estimators_") or hasattr(raw_model, "get_booster"):
            # Tree-based model (Extra Trees, XGBoost, LightGBM, Random Forest)
            self.shap_explainer = shap.TreeExplainer(raw_model)
            self._shap_mode = "tree"
        else:
            # Black-box fallback (e.g. Keras MLP)
            shap_bg = shap.sample(np.array(self.background_data), 100)
            self.shap_explainer = shap.KernelExplainer(model.predict_proba, shap_bg)
            self._shap_mode = "kernel"

    def explain_local_lime(self, instance, output_path=None):
        exp = self.lime_explainer.explain_instance(
            data_row=instance, predict_fn=self.model.predict_proba, num_features=10
        )
        if output_path:
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            exp.save_to_file(output_path)
        return exp.as_list()

    def explain_local_shap(self, instance, output_path=None):
        instance_arr = np.array(instance).reshape(1, -1)

        if self._shap_mode == "tree":
            shap_values = self.shap_explainer.shap_values(instance_arr)
            # TreeExplainer returns [class0_vals, class1_vals] for classifiers
            vals = shap_values[1] if isinstance(shap_values, list) else shap_values
            base_value = (
                self.shap_explainer.expected_value[1]
                if isinstance(self.shap_explainer.expected_value, (list, np.ndarray))
                else self.shap_explainer.expected_value
            )
        else:
            shap_values = self.shap_explainer.shap_values(instance_arr)
            vals = shap_values[1] if isinstance(shap_values, list) else shap_values
            base_value = (
                self.shap_explainer.expected_value[1]
                if isinstance(self.shap_explainer.expected_value, (list, np.ndarray))
                else self.shap_explainer.expected_value
            )

        if output_path:
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            plt.figure()
            shap.waterfall_plot(
                shap.Explanation(
                    values=vals[0],
                    base_values=base_value,
                    data=instance_arr[0],
                    feature_names=self.feature_names,
                ),
                show=False,
            )
            plt.savefig(output_path, bbox_inches="tight")
            plt.close()

        return vals[0].tolist()
