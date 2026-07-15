import React from 'react';
import { DatabaseZap, Code2, Scale } from 'lucide-react';

export const FeatureStore: React.FC = () => {
  const features = [
    { name: "Amount", type: "Float64", transformation: "StandardScaler", importance: 0.45 },
    { name: "V1..V28", type: "Float32", transformation: "PCA Embedding", importance: 0.35 },
    { name: "Time_Hour", type: "Int8", transformation: "Cyclical (Sin/Cos)", importance: 0.15 },
    { name: "IP_Distance", type: "Float32", transformation: "MinMaxScaler", importance: 0.05 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex justify-center items-center">
          <DatabaseZap className="w-10 h-10 mr-4 text-indigo-500" />
          Enterprise Feature Store
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Centralized management for ML feature transformations, scaling, and SHAP importance lineage.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {features.map((feat, i) => (
          <div key={i} className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{feat.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <span className="flex items-center"><Code2 className="w-4 h-4 mr-1"/> {feat.type}</span>
                <span className="flex items-center"><Scale className="w-4 h-4 mr-1"/> {feat.transformation}</span>
              </div>
            </div>
            
            <div className="w-full md:w-64">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Importance Score</span>
                <span className="font-mono">{feat.importance}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" 
                  style={{ width: `${feat.importance * 100}%` }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
