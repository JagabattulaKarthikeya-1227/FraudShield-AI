import React from 'react';
import { PageHeader } from "@/components/layout/PageHeader";
import { BrainCircuit, Fingerprint, Activity, Network } from "lucide-react";
import ReactECharts from 'echarts-for-react';

export const ExplainabilityStudio = () => {

  const shapOptions = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', position: 'top', splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } }, axisLabel: { color: '#64748b' } },
    yAxis: { type: 'category', axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#475569', fontWeight: 'bold' }, data: ['Velocity_1H', 'Amount_Dev', 'IP_Dist', 'Time_Hour', 'Device_New', 'Age_Days'] },
    series: [
      {
        name: 'SHAP Value',
        type: 'bar',
        data: [
          { value: 0.85, itemStyle: { color: '#e11d48' } },
          { value: 0.62, itemStyle: { color: '#e11d48' } },
          { value: 0.45, itemStyle: { color: '#e11d48' } },
          { value: -0.15, itemStyle: { color: '#0f766e' } },
          { value: 0.32, itemStyle: { color: '#e11d48' } },
          { value: -0.22, itemStyle: { color: '#0f766e' } }
        ]
      }
    ]
  };

  return (
    <div className="space-y-6 pb-12 w-full animate-in fade-in duration-500">
      
      <PageHeader 
        title="AI Engine & Explainability" 
        description="Deep dive into model decisions using SHAP and LIME." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Live Prediction Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[1.25rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-700"><BrainCircuit className="w-5 h-5" /></div>
              <h3 className="text-base font-semibold text-slate-900">Live Prediction</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Transaction</div>
                <div className="font-mono text-sm text-slate-900">TXN-998214</div>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">Risk Score</div>
                <div className="text-3xl font-bold text-rose-600">92.4%</div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">Confidence Interval</div>
                <div className="text-3xl font-bold text-emerald-700">99.1%</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[1.25rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-700"><Fingerprint className="w-5 h-5" /></div>
              <h3 className="text-base font-semibold text-slate-900">Business Explanation</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              The model flagged this transaction due to a highly unusual velocity pattern (14 transactions in 1 hour) coupled with an IP address located 4,500 miles away from the user's historical median location.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Visualizations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SHAP Chart */}
          <div className="bg-white p-6 rounded-[1.25rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-700"><Network className="w-5 h-5" /></div>
                <h3 className="text-base font-semibold text-slate-900">SHAP Feature Importance</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">Local Explanation</span>
            </div>
            <div className="h-[350px]">
              <ReactECharts option={shapOptions} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>

          {/* Probability Gauge (Mocked with simple UI) */}
          <div className="bg-white p-6 rounded-[1.25rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-700"><Activity className="w-5 h-5" /></div>
              <h3 className="text-base font-semibold text-slate-900">Ensemble Model Probabilities</h3>
            </div>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                  <span>XGBoost (Primary)</span>
                  <span className="text-rose-600">0.94</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                  <span>LightGBM (Secondary)</span>
                  <span className="text-rose-600">0.91</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '91%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                  <span>Isolation Forest (Anomaly)</span>
                  <span className="text-rose-600">0.88</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
