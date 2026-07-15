import shap
import lime
import lime.lime_tabular
import numpy as np
import os
import matplotlib.pyplot as plt

class ExplainabilityEngine:
    def __init__(self, model, background_data, feature_names):
        """
        model: Must have a predict_proba method (e.g. the Calibrated Meta Model)
        """
        self.model = model
        self.background_data = background_data
        self.feature_names = feature_names
        
        # Initialize LIME explainer
        self.lime_explainer = lime.lime_tabular.LimeTabularExplainer(
            training_data=np.array(self.background_data),
            feature_names=self.feature_names,
            class_names=['Legitimate', 'Fraud'],
            mode='classification'
        )
        
        # Initialize SHAP explainer (KernelExplainer as fallback for black-box meta ensemble)
        # Using a subset of background data for speed
        shap_bg = shap.sample(self.background_data, 100)
        self.shap_explainer = shap.KernelExplainer(self.model.predict_proba, shap_bg)

    def explain_local_lime(self, instance, output_path=None):
        exp = self.lime_explainer.explain_instance(
            data_row=instance,
            predict_fn=self.model.predict_proba,
            num_features=10
        )
        if output_path:
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            exp.save_to_file(output_path)
        return exp.as_list()

    def explain_local_shap(self, instance, output_path=None):
        shap_values = self.shap_explainer.shap_values(instance)
        # Assuming index 1 is fraud class for predict_proba
        vals = shap_values[1] if isinstance(shap_values, list) else shap_values
        
        if output_path:
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            plt.figure()
            shap.waterfall_plot(shap.Explanation(values=vals[0], 
                                               base_values=self.shap_explainer.expected_value[1], 
                                               data=instance[0], 
                                               feature_names=self.feature_names),
                              show=False)
            plt.savefig(output_path, bbox_inches='tight')
            plt.close()
            
        return vals.tolist()
