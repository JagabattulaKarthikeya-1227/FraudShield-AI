import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlobalKPIHeader, KPI } from "@/components/dashboard/GlobalKPIHeader";
import { InteractiveCard } from "@/components/motion/InteractiveCard";
import { motion } from "framer-motion";
import { BarChart3, Binary, Network, Fingerprint, Eye, Scale, FileText, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ExplainabilityStudio = () => {
  const [activeTab, setActiveTab] = useState<'shap' | 'lime' | 'narrative'>('shap');

  const kpis: KPI[] = [
    {
      id: 'confidence',
      label: 'Model Confidence',
      value: 94.2,
      suffix: '%',
      decimals: 1,
      trend: 'up',
      trendValue: 'High',
      trendLabel: 'Ensemble consensus reached'
    },
    {
      id: 'features',
      label: 'Features Analyzed',
      value: 128,
      trend: 'neutral',
      trendValue: 'Standard',
      trendLabel: 'Real-time vector extraction'
    },
    {
      id: 'drift',
      label: 'Data Drift Score',
      value: 0.04,
      decimals: 2,
      trend: 'up',
      trendValue: 'Stable',
      trendLabel: 'No covariate shift detected',
      sparklineData: [0.01, 0.02, 0.01, 0.04, 0.03, 0.04]
    },
    {
      id: 'fairness',
      label: 'Fairness Metric (DI)',
      value: 0.98,
      decimals: 2,
      trend: 'neutral',
      trendValue: 'Compliant',
      trendLabel: 'Disparate Impact ratio normal'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader 
        title="Explainability Studio" 
        description="Deep dive into ensemble decision boundaries and feature attribution." 
      />
      <GlobalKPIHeader kpis={kpis} />

      {/* Control Strip */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-xl shadow-sm">
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-md px-4 ${activeTab === 'shap' ? 'bg-white dark:bg-slate-800 shadow-sm' : ''}`}
            onClick={() => setActiveTab('shap')}
          >
            <Network className="w-4 h-4 mr-2" /> SHAP Values
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-md px-4 ${activeTab === 'lime' ? 'bg-white dark:bg-slate-800 shadow-sm' : ''}`}
            onClick={() => setActiveTab('lime')}
          >
            <Binary className="w-4 h-4 mr-2" /> LIME Approximations
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-md px-4 ${activeTab === 'narrative' ? 'bg-white dark:bg-slate-800 shadow-sm' : ''}`}
            onClick={() => setActiveTab('narrative')}
          >
            <FileText className="w-4 h-4 mr-2" /> Narrative Explanations
          </Button>
        </div>
        <div className="flex items-center gap-2 pr-2">
          <span className="text-sm font-medium text-slate-500">Target Transaction:</span>
          <select className="text-sm bg-slate-100 dark:bg-slate-950 border-none rounded-md px-3 py-1 font-mono focus:ring-1 focus:ring-indigo-500">
            <option>TX-8921A (High Risk)</option>
            <option>TX-8922B (Low Risk)</option>
            <option>TX-8923C (Borderline)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Waterfall Plot / Main Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <InteractiveCard tilt={false} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {activeTab === 'shap' && <><Network className="w-5 h-5 text-indigo-500"/> SHAP Force Plot</>}
                {activeTab === 'lime' && <><Binary className="w-5 h-5 text-teal-500"/> Local Interpretable Model-agnostic Explanations</>}
                {activeTab === 'narrative' && <><Bot className="w-5 h-5 text-purple-500"/> AI Copilot Translation</>}
              </h3>
              <span className="px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500 rounded-full text-xs font-semibold border border-rose-200 dark:border-rose-500/20">
                Prediction: FRAUD (89.4%)
              </span>
            </div>
            
            <div className="flex-1 relative flex items-center justify-center bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50 overflow-hidden p-6">
              {activeTab === 'shap' && (
                <div className="w-full h-full flex flex-col justify-center max-w-2xl">
                  {/* SHAP Waterfall Mock */}
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2 px-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span>Base Value: 0.12</span>
                    <span>Output Value: 0.89</span>
                  </div>
                  <div className="space-y-4 py-4">
                    {[
                      { name: 'distance_from_home', val: 0.35, color: 'bg-rose-500' },
                      { name: 'amount', val: 0.28, color: 'bg-rose-500' },
                      { name: 'device_velocity', val: 0.15, color: 'bg-rose-500' },
                      { name: 'historical_avg_30d', val: -0.05, color: 'bg-emerald-500' },
                      { name: 'mcc_risk_score', val: 0.04, color: 'bg-rose-500' },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-4 text-sm relative group">
                        <span className="w-40 font-mono text-right text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{f.name}</span>
                        <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-800 rounded relative">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.abs(f.val) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                            className={`absolute top-0 h-full rounded ${f.color}`}
                            style={{ [f.val > 0 ? 'left' : 'right']: '50%' }}
                          />
                        </div>
                        <span className="w-16 font-mono text-slate-500">{f.val > 0 ? '+' : ''}{f.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'narrative' && (
                <div className="w-full max-w-2xl prose prose-sm dark:prose-invert">
                  <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-xl space-y-4">
                    <p><strong>Business Summary:</strong> This transaction was highly anomalous because the $4,500 purchase was made physically in Paris 2 hours after a known physical transaction in New York. This impossible travel velocity is the primary driver for the fraud classification.</p>
                    <p><strong>Technical Breakdown:</strong> `distance_from_home` (3,600 miles) combined with `time_since_last_txn` (120 mins) pushed the XGBoost trees heavily towards the positive class (SHAP: +0.35). Secondary risk added by the electronics MCC code (SHAP: +0.04).</p>
                    <p><strong>Recommended Action:</strong> Block transaction and freeze card until customer confirms via mobile push notification.</p>
                  </div>
                </div>
              )}
            </div>
          </InteractiveCard>
        </div>

        {/* Right Column: Model Inputs & Confidence */}
        <div className="space-y-6">
          <InteractiveCard tilt={false} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Scale className="w-4 h-4"/> Base Learner Consensus</h3>
            <div className="space-y-4">
              {[
                { name: 'XGBoost', score: 0.91, weight: '45%' },
                { name: 'Random Forest', score: 0.85, weight: '30%' },
                { name: 'LightGBM', score: 0.89, weight: '15%' },
                { name: 'Neural Net', score: 0.72, weight: '10%' },
              ].map((model, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{model.name}</span>
                    <span className="font-mono text-slate-500">wt: {model.weight}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${model.score * 100}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="h-full bg-indigo-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </InteractiveCard>

          <InteractiveCard tilt={false} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Fingerprint className="w-4 h-4"/> Input Feature Vector</h3>
            <div className="space-y-2 h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {[
                { k: 'amount', v: '4500.00' },
                { k: 'distance', v: '3600.5' },
                { k: 'is_online', v: '0' },
                { k: 'time_since', v: '120.0' },
                { k: 'mcc_code', v: '5732' },
                { k: 'velocity_24h', v: '15' },
                { k: 'avs_match', v: '1' },
                { k: 'cvv_match', v: '1' },
              ].map((kv, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                  <span className="text-xs font-mono text-slate-500">{kv.k}</span>
                  <span className="text-xs font-mono font-medium text-slate-900 dark:text-white">{kv.v}</span>
                </div>
              ))}
            </div>
          </InteractiveCard>
        </div>
      </div>
    </div>
  );
};
