import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { InteractiveCard } from '@/components/motion/InteractiveCard';
import { AcademicTooltip } from '@/components/ui/AcademicTooltip';
import { Shield, FileText, Scale, Eye, AlertTriangle, Fingerprint, Lock } from 'lucide-react';

export const ResponsibleAI: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader 
        title="Responsible AI & Governance" 
        description="Official Model Card outlining fairness, bias, and ethical compliance for v4.2.1-prod." 
      />

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Model Card */}
        <div className="lg:w-2/3 space-y-6">
          <InteractiveCard tilt={false} className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Model Card: Fraud Ensembler v4.2.1</h2>
                <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors">
                <FileText className="w-4 h-4" /> Export PDF
              </button>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-3"><Shield className="w-5 h-5 text-indigo-500" /> Intended Use</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  This model is designed to detect fraudulent credit card transactions in real-time. It operates as a secondary screening mechanism, flagging high-risk transactions for manual review by the SOC team. It is NOT intended to automatically freeze accounts without human-in-the-loop validation if the risk score falls in the "Borderline" (0.6 - 0.8) threshold.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-3"><Scale className="w-5 h-5 text-emerald-500" /> Fairness & Disparate Impact</h3>
                <AcademicTooltip 
                  title="Disparate Impact (DI)" 
                  content="DI is a metric that evaluates fairness by comparing the proportion of favorable outcomes across different demographic groups. A DI > 0.8 is generally considered legally compliant (the 'Four-Fifths Rule')."
                >
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    Rigorous testing was performed to ensure the model does not discriminate based on zip codes (which can be a proxy for race/income). The Disparate Impact ratio is currently measured at <strong>0.98</strong>, exceeding the compliance requirement of 0.80.
                  </p>
                </AcademicTooltip>
              </section>

              <section>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-3"><AlertTriangle className="w-5 h-5 text-amber-500" /> Known Limitations & Biases</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Card Present vs Not Present:</strong> The model currently exhibits a 2% higher false positive rate on international Card-Not-Present transactions.</li>
                  <li><strong>Velocity Limits:</strong> The feature extractor requires at least 3 historical transactions to establish a baseline. Cold-start accounts bypass the ML ensemble and rely on rules.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-3"><Eye className="w-5 h-5 text-purple-500" /> Explainability Strategy</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Due to the black-box nature of the Stacking Meta-learner, we utilize KernelSHAP for global feature importance and LIME for local transaction explainability. This ensures analysts can legally defend why a transaction was declined.
                </p>
              </section>
            </div>
          </InteractiveCard>
        </div>

        {/* Sidebar Info */}
        <div className="lg:w-1/3 space-y-6">
          <InteractiveCard tilt={false} className="p-6 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Fingerprint className="w-4 h-4 text-slate-500"/> Model Specifications</h3>
            <div className="space-y-4">
              {[
                { k: 'Framework', v: 'scikit-learn + xgboost' },
                { k: 'Dataset', v: 'CC-Fraud-2026-v2' },
                { k: 'Train Date', v: 'Oct 14, 2026' },
                { k: 'Parameters', v: '14.2 Million' },
                { k: 'Compliance', v: 'GDPR, CCPA' },
              ].map((spec, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800 last:border-0">
                  <span className="text-sm text-slate-500">{spec.k}</span>
                  <span className="text-sm font-medium">{spec.v}</span>
                </div>
              ))}
            </div>
          </InteractiveCard>

          <InteractiveCard tilt={false} className="p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-300 mb-1">SOC 2 Compliant</h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-400/80 leading-relaxed">This model and its serving infrastructure have passed the SOC 2 Type II audit for security, availability, and processing integrity.</p>
              </div>
            </div>
          </InteractiveCard>
        </div>

      </div>
    </div>
  );
};
