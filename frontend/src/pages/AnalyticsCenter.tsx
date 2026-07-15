import { useKPIs, useTrends } from "@/core/api/hooks/useTelemetry";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PredictionTimelineChart } from "@/components/charts/PredictionTimelineChart";
import { FraudHeatmapChart } from "@/components/charts/FraudHeatmapChart";
import { GlobalFraudGlobe } from "@/components/3d/GlobalFraudGlobe";
import { Loader2, Activity, ShieldAlert, Target, Users } from "lucide-react";

export const AnalyticsCenter = () => {
  const { data: kpi, isLoading: loadingKpi } = useKPIs();
  const { data: trends, isLoading: loadingTrends } = useTrends();

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Analytics & Command Center" 
        description="Enterprise macroscopic monitoring and real-time fraud velocity telemetry." 
      />

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-panel border-blue-500/20">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 rounded-full text-blue-500"><Activity className="w-6 h-6" /></div>
            <div>
              <p className="text-sm opacity-60">Global Fraud Rate</p>
              <h3 className="text-2xl font-bold">{loadingKpi ? <Loader2 className="w-5 h-5 animate-spin" /> : `${kpi?.fraud_rate}%`}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-emerald-500/20">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500"><Target className="w-6 h-6" /></div>
            <div>
              <p className="text-sm opacity-60">Detection Accuracy</p>
              <h3 className="text-2xl font-bold">{loadingKpi ? <Loader2 className="w-5 h-5 animate-spin" /> : `${kpi?.detection_accuracy}%`}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-rose-500/20">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-rose-500/10 rounded-full text-rose-500"><ShieldAlert className="w-6 h-6" /></div>
            <div>
              <p className="text-sm opacity-60">Priority Review Queue</p>
              <h3 className="text-2xl font-bold">{loadingKpi ? <Loader2 className="w-5 h-5 animate-spin" /> : kpi?.review_queue}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-indigo-500/20">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-indigo-500/10 rounded-full text-indigo-500"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-sm opacity-60">Avg. Decision Latency</p>
              <h3 className="text-2xl font-bold">{loadingKpi ? <Loader2 className="w-5 h-5 animate-spin" /> : `${kpi?.avg_decision_time_ms}ms`}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Timeline */}
        <Card className="glass-panel lg:col-span-2">
          <CardHeader>
            <CardTitle>30-Day Prediction Velocity</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingTrends ? <div className="h-[350px] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin opacity-50" /></div> :
              (trends && <PredictionTimelineChart labels={trends.labels} legitimate={trends.legitimate} fraudulent={trends.fraudulent} />)}
          </CardContent>
        </Card>

        {/* 3D Global Globe */}
        <div className="h-full min-h-[400px]">
          <GlobalFraudGlobe />
        </div>
      </div>

      {/* Heatmap Row */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Global Fraud Density Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <FraudHeatmapChart />
        </CardContent>
      </Card>
    </div>
  );
};
