import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertOctagon, Activity, Clock, UserCheck } from 'lucide-react';
import { apiClient } from '../core/api/client';
import { Canvas } from '@react-three/fiber';
import { RiskSphere } from '../components/3d/RiskSphere';

export const IncidentManagement: React.FC = () => {
  const { data: incidents, isLoading } = useQuery({
    queryKey: ['grc', 'incidents'],
    queryFn: async () => {
      const { data } = await apiClient.get('/grc/incidents');
      return data.data.incidents as any[];
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center">
            <AlertOctagon className="w-8 h-8 mr-3 text-rose-500" />
            Incident Management
          </h1>
          <p className="text-slate-500 mt-2">
            Track and escalate security anomalies, rate-limit violations, and operational risks.
          </p>
        </div>
        <div className="w-32 h-32">
           <Canvas camera={{ position: [0, 0, 5] }}>
             <RiskSphere />
           </Canvas>
        </div>
      </div>

      {/* Incident List */}
      <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading incidents...</div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {incidents?.map((incident, idx) => (
              <div key={idx} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Info */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        {incident.id}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        incident.severity === 'Critical' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' :
                        incident.severity === 'Medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {incident.severity}
                      </span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {incident.module}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
                      {incident.description}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center space-x-6 text-sm text-slate-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {new Date(incident.timestamp).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <UserCheck className="w-4 h-4 mr-1.5" />
                      {incident.assigned_to}
                    </div>
                    <div className="flex items-center">
                      <Activity className={`w-4 h-4 mr-1.5 ${incident.status === 'Resolved' ? 'text-green-500' : 'text-amber-500'}`} />
                      {incident.status}
                    </div>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
