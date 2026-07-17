import { useKPIs, useTrends } from "@/core/api/hooks/useTelemetry";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlobalKPIHeader, KPI } from "@/components/dashboard/GlobalKPIHeader";
import { InteractiveCard } from "@/components/motion/InteractiveCard";
import { PredictionTimelineChart } from "@/components/charts/PredictionTimelineChart";
import { FraudHeatmapChart } from "@/components/charts/FraudHeatmapChart";
import { GlobalFraudGlobe } from "@/components/3d/GlobalFraudGlobe";
import { Loader2 } from "lucide-react";

export const AnalyticsCenter = () => {
  const { data: kpi, isLoading: loadingKpi } = useKPIs();
  const { data: trends, isLoading: loadingTrends } = useTrends();

  const kpis: KPI[] = [
    { id: 'rate', label: 'Global Fraud Rate', value: kpi?.fraud_rate || 0.12, suffix: '%', decimals: 2, trend: 'down', trendValue: '-0.02%' },
    { id: 'acc', label: 'Detection Accuracy', value: kpi?.detection_accuracy || 99.8, suffix: '%', decimals: 1, trend: 'up', trendValue: '+0.1%' },
    { id: 'queue', label: 'Priority Review Queue', value: kpi?.review_queue || 45, trend: 'down', trendValue: '-12' },
    { id: 'latency', label: 'Avg Decision Latency', value: kpi?.avg_decision_time_ms || 32, suffix: 'ms', trend: 'neutral', trendValue: '0ms' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader 
        title="Analytics & Command Center" 
        description="Enterprise macroscopic monitoring and real-time fraud velocity telemetry." 
      />

      <GlobalKPIHeader kpis={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timeline */}
        <InteractiveCard tilt={false} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6 text-slate-900 dark:text-white">30-Day Prediction Velocity</h3>
          {loadingTrends ? (
            <div className="h-[350px] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin opacity-50" /></div>
          ) : (
            trends && <PredictionTimelineChart labels={trends.labels} legitimate={trends.legitimate} fraudulent={trends.fraudulent} />
          )}
        </InteractiveCard>

        {/* 3D Global Globe */}
        <div className="h-full min-h-[400px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-slate-50 dark:bg-slate-950">
          <GlobalFraudGlobe />
        </div>
      </div>

      {/* Heatmap Row */}
      <InteractiveCard tilt={false} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-semibold mb-6 text-slate-900 dark:text-white">Global Fraud Density Matrix</h3>
        <FraudHeatmapChart />
      </InteractiveCard>
    </div>
  );
};
