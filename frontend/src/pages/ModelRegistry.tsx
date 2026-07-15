import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Database, GitCommit, Clock, CheckCircle, XCircle } from 'lucide-react';
import { apiClient } from '../core/api/client';
import { Canvas } from '@react-three/fiber';
import { ModelGalaxy } from '../components/3d/ModelGalaxy';

export const ModelRegistry: React.FC = () => {
  const { data: models, isLoading } = useQuery({
    queryKey: ['ml', 'registry'],
    queryFn: async () => {
      const { data } = await apiClient.get('/ml/registry');
      return data.data.registry as any[];
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header with 3D Galaxy */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden h-64">
        <div className="z-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center">
            <Database className="w-8 h-8 mr-3 text-indigo-500" />
            Enterprise Model Registry
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl">
            Track and govern all trained models across the FraudShield ML lifecycle.
          </p>
        </div>
        
        <div className="absolute right-0 top-0 w-96 h-full opacity-60 mix-blend-screen pointer-events-none">
          <Canvas camera={{ position: [0, 0, 8] }}>
            <ModelGalaxy />
          </Canvas>
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300">
              <tr>
                <th className="px-6 py-4 font-semibold">Model ID</th>
                <th className="px-6 py-4 font-semibold">Algorithm</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">F1 Score</th>
                <th className="px-6 py-4 font-semibold">Latency</th>
                <th className="px-6 py-4 font-semibold">Commit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center">Loading registry...</td></tr>
              ) : (
                models?.map((model, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-indigo-600 dark:text-indigo-400">{model.id}</td>
                    <td className="px-6 py-4">{model.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        model.status === 'Champion' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        model.status.includes('Shadow') ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {model.status === 'Champion' ? <CheckCircle className="w-3 h-3 mr-1" /> : 
                         model.status === 'Retired' ? <XCircle className="w-3 h-3 mr-1" /> : null}
                        {model.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{(model.f1_score * 100).toFixed(1)}%</td>
                    <td className="px-6 py-4 flex items-center"><Clock className="w-4 h-4 mr-1 text-slate-400" /> {model.latency_ms}ms</td>
                    <td className="px-6 py-4 font-mono text-xs flex items-center"><GitCommit className="w-3 h-3 mr-1 text-slate-400"/> {model.commit}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
