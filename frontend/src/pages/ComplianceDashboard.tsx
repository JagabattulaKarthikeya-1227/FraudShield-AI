import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Server, Key, FileText } from 'lucide-react';
import { ComplianceGrid } from '../components/3d/ComplianceGrid';
import { apiClient } from '../core/api/client';

export const ComplianceDashboard: React.FC = () => {
  // Fetch live compliance scores from the backend API
  const { data: scores, isLoading } = useQuery({
    queryKey: ['grc', 'compliance_scores'],
    queryFn: async () => {
      const { data } = await apiClient.get('/grc/compliance_scores');
      return data.data;
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header with 3D Grid */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden h-64">
        <div className="z-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Compliance & Governance Framework
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl">
            Live mapping of platform features against strict enterprise regulatory and security frameworks. Note: This is an educational implementation.
          </p>
        </div>
        
        <div className="absolute inset-0 z-0 opacity-40">
          <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
            <ComplianceGrid />
          </Canvas>
        </div>
      </div>

      {/* Framework Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "OWASP Top 10", val: scores?.owasp_top_10, icon: <ShieldCheck className="text-green-500" /> },
          { title: "GDPR Readiness", val: scores?.gdpr_readiness, icon: <FileText className="text-blue-500" /> },
          { title: "ISO 27001 Controls", val: scores?.iso_27001_controls, icon: <Server className="text-indigo-500" /> },
          { title: "NIST Framework", val: scores?.nist_framework, icon: <Key className="text-purple-500" /> },
        ].map((framework, i) => (
          <div key={i} className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-full mb-4">
              {framework.icon}
            </div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">{framework.title}</h3>
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded mt-1"></div>
            ) : (
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {framework.val}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
