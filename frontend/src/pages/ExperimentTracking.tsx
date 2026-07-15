import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Beaker } from 'lucide-react';
import { apiClient } from '../core/api/client';
import { Canvas } from '@react-three/fiber';
import { ExperimentOrbit } from '../components/3d/ExperimentOrbit';

export const ExperimentTracking: React.FC = () => {
  const { data: experiments, isLoading } = useQuery({
    queryKey: ['ml', 'experiments'],
    queryFn: async () => {
      const { data } = await apiClient.get('/ml/experiments');
      return data.data.experiments as any[];
    }
  });

  // ECharts Scatter configuration for Hyperparameter search space
  const scatterOptions = {
    tooltip: { trigger: 'item', formatter: 'Run: {c}' },
    xAxis: { type: 'value', name: 'Learning Rate', splitLine: { show: false } },
    yAxis: { type: 'value', name: 'Max Depth', splitLine: { show: false } },
    series: [{
      symbolSize: 20,
      data: experiments?.map(e => [e.learning_rate, e.max_depth, e.run_id]),
      type: 'scatter',
      itemStyle: { color: '#6366f1' }
    }]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden h-48">
        <div className="z-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center">
            <Beaker className="w-8 h-8 mr-3 text-indigo-500" />
            Experiment Tracking
          </h1>
          <p className="text-slate-500 mt-2">
            Visualize hyperparameter tuning jobs and objective function trajectories.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-full pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ExperimentOrbit />
          </Canvas>
        </div>
      </div>

      {/* Scatter Plot */}
      <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
          <LineChart className="w-5 h-5 mr-2 text-indigo-500" /> Hyperparameter Search Space
        </h3>
        {!isLoading && <ReactECharts option={scatterOptions} style={{ height: '400px' }} />}
      </div>
    </div>
  );
};
