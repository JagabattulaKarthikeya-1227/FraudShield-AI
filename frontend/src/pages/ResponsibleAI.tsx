import React from 'react';
import { Scale, HeartHandshake, Eye, AlertCircle } from 'lucide-react';

export const ResponsibleAI: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      
      {/* Editorial Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Responsible AI Center
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          We believe in AI that is transparent, fair, and accountable. FraudShield AI is built with strict mathematical boundaries to prevent bias and ensure ethical decision-making.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Fairness */}
        <div className="bg-white dark:bg-[#111111] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Scale className="w-10 h-10 text-indigo-500 mb-6" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Algorithmic Fairness</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            The Hybrid Meta-Ensemble is strictly prevented from utilizing protected class data (e.g., race, gender, zip-code redlining). Feature importance is continuously audited using SHAP to ensure demographic parity.
          </p>
        </div>

        {/* Explainability */}
        <div className="bg-white dark:bg-[#111111] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Eye className="w-10 h-10 text-blue-500 mb-6" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Explainable Decisions</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            No "Black Box" AI. Every prediction flagged as High Risk is passed through a SHAP TreeExplainer, generating a cryptographic, human-readable waterfall chart explaining the exact marginal contribution of every feature.
          </p>
        </div>

        {/* Accountability */}
        <div className="bg-white dark:bg-[#111111] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <HeartHandshake className="w-10 h-10 text-green-500 mb-6" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Human-in-the-Loop</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            FraudShield AI is a Decision Support System, not an autonomous agent. Final actions (e.g., permanently locking an account) require explicit authorization from a human Fraud Analyst via the Audit Center.
          </p>
        </div>

        {/* Limitations */}
        <div className="bg-rose-50 dark:bg-rose-950/20 p-8 rounded-3xl border border-rose-100 dark:border-rose-900/50 shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mb-6" />
          <h3 className="text-xl font-bold text-rose-900 dark:text-rose-400 mb-3">Known Limitations</h3>
          <p className="text-rose-700 dark:text-rose-300 text-sm leading-relaxed">
            The current model (v1.4) relies heavily on tabular numeric embeddings. It may underperform on purely contextual, non-numeric behavioral anomalies (e.g., natural language phishing vectors) until multimodal integration in v2.0.
          </p>
        </div>

      </div>
    </div>
  );
};
