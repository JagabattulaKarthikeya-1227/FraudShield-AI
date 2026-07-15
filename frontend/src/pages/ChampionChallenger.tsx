import React from 'react';
import ReactECharts from 'echarts-for-react';
import { GitCompare, PlayCircle } from 'lucide-react';

export const ChampionChallenger: React.FC = () => {
  // Comparative Radar Chart
  const radarOptions = {
    tooltip: {},
    legend: { data: ['Champion (v1.4)', 'Challenger (v1.5)'], bottom: 0, textStyle: { color: '#64748b' } },
    radar: {
      indicator: [
        { name: 'Precision', max: 100 },
        { name: 'Recall', max: 100 },
        { name: 'F1 Score', max: 100 },
        { name: 'Latency (inv)', max: 100 },
        { name: 'Robustness', max: 100 }
      ],
      axisName: { color: '#94a3b8' }
    },
    series: [{
      type: 'radar',
      data: [
        { value: [96, 92, 94, 98, 85], name: 'Champion (v1.4)', itemStyle: { color: '#6366f1' }, areaStyle: { opacity: 0.2 } },
        { value: [97, 95, 96, 90, 92], name: 'Challenger (v1.5)', itemStyle: { color: '#10b981' }, areaStyle: { opacity: 0.2 } }
      ]
    }]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center">
            <GitCompare className="w-8 h-8 mr-3 text-indigo-500" />
            Champion vs Challenger
          </h1>
          <p className="text-slate-500 mt-2">Evaluate the Shadow deployment (v1.5) against the active production Champion (v1.4).</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition">
          <PlayCircle className="w-4 h-4 mr-2" /> Promote to Champion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Performance Matrix</h3>
           <ReactECharts option={radarOptions} style={{ height: '400px' }} />
        </div>
        
        <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Shadow Deployment Logs</h3>
           <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-green-400 overflow-y-auto h-[350px] space-y-2">
             <p>[12:04:01] INGEST: Txn 9901 routed to Shadow Model...</p>
             <p>[12:04:01] CHAMPION: Risk 12% (Normal)</p>
             <p>[12:04:01] CHALLENGER: Risk 14% (Normal)</p>
             <p className="text-slate-500">...</p>
             <p>[12:05:12] INGEST: Txn 9942 routed to Shadow Model...</p>
             <p>[12:05:12] CHAMPION: Risk 82% (Fraud)</p>
             <p className="text-rose-400">[12:05:12] CHALLENGER: Risk 95% (Fraud) - Divergence Detected</p>
             <p className="text-indigo-400">[12:05:12] SYSTEM: Shadow model identified fraud with higher confidence.</p>
           </div>
        </div>
      </div>
    </div>
  );
};
