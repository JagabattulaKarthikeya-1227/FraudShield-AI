import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useQuery } from '@tanstack/react-query';
import { ActivitySquare, AlertTriangle } from 'lucide-react';
import { apiClient } from '../core/api/client';

export const DriftDetection: React.FC = () => {
  const { data: driftData } = useQuery({
    queryKey: ['ml', 'drift'],
    queryFn: async () => {
      const { data } = await apiClient.get('/ml/drift');
      return data.data;
    }
  });

  // Simulated TimeSeries for Concept Drift
  const driftOptions = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    yAxis: { type: 'value', name: 'KL Divergence' },
    series: [{
      data: [0.02, 0.03, 0.02, 0.05, 0.08, 0.15, 0.12], // Spike on Saturday
      type: 'line',
      smooth: true,
      lineStyle: { color: '#ef4444', width: 3 },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: 'rgba(239, 68, 68, 0.5)' }, { offset: 1, color: 'rgba(239, 68, 68, 0)' }]
        }
      }
    }]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center">
          <ActivitySquare className="w-8 h-8 mr-3 text-rose-500" />
          Drift Detection (Simulation)
        </h1>
        <p className="text-slate-500 mt-2">Monitor data and concept drift to trigger retraining pipelines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Concept Drift (KL Divergence)</h3>
          <ReactECharts option={driftOptions} style={{ height: '300px' }} />
        </div>

        {/* Feature List */}
        <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Feature Distribution Shifts</h3>
          <div className="space-y-4">
            {driftData?.features?.map((feat: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="font-medium text-slate-900 dark:text-white">{feat.name}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-mono text-slate-500">PSI: {feat.psi_score}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${feat.status === 'Warning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}`}>
                    {feat.status === 'Warning' && <AlertTriangle className="w-3 h-3 mr-1"/>}
                    {feat.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
