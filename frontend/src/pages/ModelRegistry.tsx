import React from 'react';
import ReactECharts from 'echarts-for-react';
import { PageHeader } from "@/components/layout/PageHeader";
import { Database, GitCompare, Activity } from "lucide-react";
import { Button } from '@/components/ui/button';

export const ModelRegistry = () => {

  const rocOptions = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Ensemble v4', 'Random Guess'], textStyle: { color: '#64748b' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', name: 'False Positive Rate', nameLocation: 'middle', nameGap: 25, axisLabel: { color: '#64748b' }, splitLine: { show: false } },
    yAxis: { type: 'value', name: 'True Positive Rate', nameLocation: 'middle', nameGap: 35, axisLabel: { color: '#64748b' }, splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } } },
    series: [
      {
        name: 'Ensemble v4',
        type: 'line',
        smooth: true,
        lineStyle: { width: 3, color: '#0f766e' },
        showSymbol: false,
        data: [[0, 0], [0.05, 0.8], [0.1, 0.9], [0.2, 0.95], [0.5, 0.98], [1, 1]]
      },
      {
        name: 'Random Guess',
        type: 'line',
        lineStyle: { type: 'dashed', color: '#cbd5e1' },
        showSymbol: false,
        data: [[0, 0], [1, 1]]
      }
    ]
  };

  const matrixData = [
    [9999, 1],
    [0, 1000]
  ];

  return (
    <div className="space-y-6 pb-12 w-full animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <PageHeader 
          title="Model Performance" 
          description="Registry and evaluation metrics for active fraud detection models." 
        />
        <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm font-medium h-9">
          Deploy New Version
        </Button>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Accuracy", val: "99.99%", color: "emerald" },
          { label: "Precision", val: "99.98%", color: "emerald" },
          { label: "Recall", val: "100.00%", color: "emerald" },
          { label: "F1 Score", val: "99.99%", color: "emerald" },
        ].map((m, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{m.label}</div>
            <div className={`text-3xl font-bold text-${m.color}-600`}>{m.val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ROC Curve */}
        <div className="bg-white p-6 rounded-[1.25rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-slate-900">ROC Curve</h3>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md">AUC: 0.9999</span>
          </div>
          <div className="h-[300px]">
            <ReactECharts option={rocOptions} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Confusion Matrix */}
        <div className="bg-white p-6 rounded-[1.25rem] border border-slate-200 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-6">Confusion Matrix</h3>
          
          <div className="flex items-center justify-center h-[300px]">
            <div className="grid grid-cols-3 gap-2 text-center w-full max-w-sm">
              <div className="col-span-1"></div>
              <div className="col-span-1 text-xs font-semibold text-slate-500 mb-2">Predicted Safe</div>
              <div className="col-span-1 text-xs font-semibold text-slate-500 mb-2">Predicted Fraud</div>
              
              <div className="col-span-1 flex items-center justify-end pr-4 text-xs font-semibold text-slate-500">Actual Safe</div>
              <div className="col-span-1 bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-emerald-700">{matrixData[0][0]}</span>
                <span className="text-[10px] text-emerald-600 uppercase mt-1">True Negative</span>
              </div>
              <div className="col-span-1 bg-rose-50 border border-rose-100 rounded-lg p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-rose-700">{matrixData[0][1]}</span>
                <span className="text-[10px] text-rose-600 uppercase mt-1">False Positive</span>
              </div>

              <div className="col-span-1 flex items-center justify-end pr-4 text-xs font-semibold text-slate-500">Actual Fraud</div>
              <div className="col-span-1 bg-amber-50 border border-amber-100 rounded-lg p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-amber-700">{matrixData[1][0]}</span>
                <span className="text-[10px] text-amber-600 uppercase mt-1">False Negative</span>
              </div>
              <div className="col-span-1 bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-emerald-700">{matrixData[1][1]}</span>
                <span className="text-[10px] text-emerald-600 uppercase mt-1">True Positive</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Model History Table */}
      <div className="bg-white rounded-[1.25rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-base font-semibold text-slate-900">Active Models</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Version</th>
                <th className="p-4">Type</th>
                <th className="p-4">Deployed</th>
                <th className="p-4">Latency</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-mono text-slate-900">v4.2.1-prod</td>
                <td className="p-4 text-slate-600">Hybrid Ensemble (XGB+LGBM)</td>
                <td className="p-4 text-slate-600">2 days ago</td>
                <td className="p-4 text-slate-600">42ms</td>
                <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-md">Primary</span></td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-mono text-slate-900">v4.3.0-rc1</td>
                <td className="p-4 text-slate-600">Neural Network (Transformer)</td>
                <td className="p-4 text-slate-600">5 hours ago</td>
                <td className="p-4 text-slate-600">115ms</td>
                <td className="p-4"><span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-md">Challenger</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
