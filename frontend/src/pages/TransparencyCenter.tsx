import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldCheck, Eye, Scale, UserCheck } from "lucide-react";

export const Help = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="AI Transparency Center" 
        description="Understanding how FraudShield AI makes decisions securely and fairly." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center text-emerald-500">
              <Eye className="w-5 h-5 mr-2" />
              What is SHAP?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm opacity-80">
            <p>
              <strong>SHAP (SHapley Additive exPlanations)</strong> is a game-theoretic approach to explain the output of any machine learning model.
            </p>
            <p>
              It assigns each feature an importance value for a particular prediction. In FraudShield AI, SHAP allows analysts to instantly identify exactly which behaviors (e.g., velocity, geography) pushed a transaction toward a high-risk classification.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center text-indigo-500">
              <Scale className="w-5 h-5 mr-2" />
              Probability Calibration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm opacity-80">
            <p>
              Raw outputs from advanced models (like Random Forests) are not true probabilities.
            </p>
            <p>
              FraudShield AI utilizes <strong>Isotonic Regression</strong> to calibrate the Meta-Ensemble. This guarantees that when the system predicts an 85% risk of fraud, it historically correlates with an actual 85% fraud rate.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-500">
              <UserCheck className="w-5 h-5 mr-2" />
              Human-in-the-Loop
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm opacity-80">
            <p>
              AI does not make the final decision. 
            </p>
            <p>
              Our architecture strictly enforces a <strong>Human-in-the-Loop (HITL)</strong> policy. Transactions flagged as "High Risk" are routed to the Priority Queue, requiring a manual Analyst override or confirmation via the Decision Panel.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center text-rose-500">
              <ShieldCheck className="w-5 h-5 mr-2" />
              Data Security & Bias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm opacity-80">
            <p>
              We implement zero-leakage SMOTE generation during training.
            </p>
            <p>
              Customers only have access to their own data, filtered through semantic NLP translations to protect underlying mathematical model schemas from adversarial probing.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
