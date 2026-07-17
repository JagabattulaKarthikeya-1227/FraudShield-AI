import { useMLOpsRegistry } from "@/core/api/hooks/useOps";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlobalKPIHeader, KPI } from "@/components/dashboard/GlobalKPIHeader";
import { InteractiveCard } from "@/components/motion/InteractiveCard";
import { Loader2, GitCommit, Settings, CheckCircle2, Box, Layers, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const MLOpsCenter = () => {
  const { data: mlops, isLoading } = useMLOpsRegistry();

  const kpis: KPI[] = [
    { id: 'drift', label: 'Feature Drift', value: 0.02, decimals: 2, trend: 'neutral', trendValue: 'Stable' },
    { id: 'latency', label: 'Model Latency (p99)', value: 85, suffix: 'ms', trend: 'down', trendValue: '-5ms' },
    { id: 'memory', label: 'RAM Utilization', value: 45, suffix: '%', trend: 'up', trendValue: '+2%' },
    { id: 'version', label: 'Active Pipeline', value: 4, prefix: 'v', suffix: '.2', trend: 'up', trendValue: 'Deployed' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader 
        title="MLOps & Model Lifecycle" 
        description="Monitor active pipeline artifacts, deployment statuses, and calibration techniques." 
      />
      <GlobalKPIHeader kpis={kpis} />

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-12 h-12 animate-spin text-slate-300" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <InteractiveCard tilt={false} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold mb-6 flex items-center gap-2"><Box className="w-5 h-5 text-indigo-500" /> Active Production Artifacts</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Version</p>
                  <p className="font-mono text-lg">{mlops?.current_model?.version || 'v4.2.1-prod'}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Git Commit</p>
                  <p className="font-mono text-sm flex items-center gap-1 bg-slate-100 dark:bg-slate-800 w-fit px-2 py-1 rounded">
                    <GitCommit className="w-3 h-3 text-slate-500" /> {mlops?.current_model?.git_commit || 'a8f9c2e'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                  <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
                    {mlops?.current_model?.status || 'Active'}
                  </Badge>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Layers className="w-4 h-4"/> Loaded Pipelines (.pkl / .h5)</p>
                <div className="flex flex-wrap gap-2">
                  {(mlops?.current_model?.artifacts || ['scaler.pkl', 'smote_balancer.pkl', 'xgb_meta.h5', 'rf_base.pkl']).map((art: string, i: number) => (
                    <Badge key={i} variant="outline" className="font-mono text-xs bg-slate-50 dark:bg-slate-950">{art}</Badge>
                  ))}
                </div>
              </div>
            </InteractiveCard>
          </div>

          <InteractiveCard tilt={false} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold mb-6 flex items-center gap-2"><History className="w-5 h-5 text-teal-500"/> Deployment Lifecycle</h3>
            <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 pl-6 space-y-6 py-2">
              {(mlops?.lifecycle || [
                { phase: 'Trained on 10M records', date: '2026-07-10', status: 'Completed' },
                { phase: 'Calibrated (Isotonic)', date: '2026-07-11', status: 'Completed' },
                { phase: 'Shadow Mode A/B', date: '2026-07-12', status: 'Completed' },
                { phase: 'Promoted to Prod', date: '2026-07-14', status: 'Active' },
              ]).map((stage: any, idx: number) => (
                <div key={idx} className="relative group">
                  <div className={`absolute -left-[31px] p-1 rounded-full border bg-white dark:bg-slate-900 ${
                    stage.status === 'Completed' ? 'border-emerald-500 text-emerald-500' :
                    'border-indigo-500 text-indigo-500 animate-pulse'
                  }`}>
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${stage.status === 'Completed' ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>{stage.phase}</h4>
                    <p className="text-xs text-slate-400">{new Date(stage.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </InteractiveCard>
        </div>
      )}
    </div>
  );
};
