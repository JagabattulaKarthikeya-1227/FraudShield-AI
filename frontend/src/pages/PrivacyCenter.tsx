import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Shield, Eye, Lock, Download, Trash2, CheckCircle2 } from 'lucide-react';
import { TrustRing } from '../components/3d/TrustRing';

export const PrivacyCenter: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="z-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center">
            <Shield className="w-8 h-8 mr-3 text-indigo-500" />
            Privacy & Trust Center
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl">
            Manage Data Subject Access Requests (DSAR), retention policies, and GDPR principles governing the FraudShield AI platform.
          </p>
        </div>
        
        {/* 3D Visual Anchor */}
        <div className="absolute right-0 top-0 w-96 h-full opacity-30 md:opacity-100 mix-blend-screen pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <TrustRing />
          </Canvas>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Policies */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-indigo-500" /> Data Collection & Retention
            </h2>
            <div className="space-y-4">
              {[
                { title: "Personally Identifiable Information (PII)", desc: "Tokenized at rest. Used strictly for fraud verification.", status: "Compliant" },
                { title: "Transaction Telemetry", desc: "Retained for 90 days in hot storage, then archived to cold storage.", status: "Enforced" },
                { title: "Browser & IP Data", desc: "Anonymized via salt hashing before entering the ML pipeline.", status: "Active" }
              ].map((policy, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white text-sm">{policy.title}</h4>
                    <p className="text-slate-500 text-xs mt-1">{policy.desc}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> {policy.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - User Actions */}
        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <Lock className="w-8 h-8 mb-4 opacity-80" />
            <h3 className="text-xl font-bold mb-2">GDPR Access Controls</h3>
            <p className="text-indigo-100 text-sm mb-6">
              As an Administrator, you can execute automated data subject workflows for compliance requests.
            </p>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center bg-white text-indigo-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition-colors">
                <Download className="w-4 h-4 mr-2" /> Export PII Data (CSV)
              </button>
              <button className="w-full flex items-center justify-center bg-indigo-700 text-indigo-100 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-800 transition-colors border border-indigo-500">
                <Trash2 className="w-4 h-4 mr-2" /> Trigger 'Right to be Forgotten'
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
