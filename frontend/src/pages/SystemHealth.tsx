import { useSystemHealth } from "@/core/api/hooks/useTelemetry";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SystemGauge } from "@/components/charts/SystemGauge";
import { Loader2, Server, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const SystemHealth = () => {
  const { data: health, isLoading } = useSystemHealth();

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="DevOps & System Health" 
        description="Real-time macroscopic telemetry of underlying architecture hardware and microservices." 
      />

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-12 h-12 animate-spin opacity-50" /></div>
      ) : (
        <>
          {/* Gauges Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-panel">
              <CardHeader className="pb-0">
                <CardTitle className="text-center">Cluster CPU Load</CardTitle>
              </CardHeader>
              <CardContent>
                <SystemGauge name="CPU" value={health?.cpu_usage || 0} color="#3b82f6" />
              </CardContent>
            </Card>
            <Card className="glass-panel">
              <CardHeader className="pb-0">
                <CardTitle className="text-center">Memory Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <SystemGauge name="RAM" value={health?.memory_usage || 0} color="#8b5cf6" />
              </CardContent>
            </Card>
            <Card className="glass-panel">
              <CardHeader className="pb-0">
                <CardTitle className="text-center">API Latency (Threshold: 100ms)</CardTitle>
              </CardHeader>
              <CardContent>
                <SystemGauge name="ms" value={health?.api_latency_ms || 0} color="#10b981" />
              </CardContent>
            </Card>
          </div>

          {/* Microservices Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center"><Server className="w-5 h-5 mr-2" /> Microservices Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="font-medium">Flask Backend Core</span>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{health?.backend_status}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="font-medium">MySQL 8 Database</span>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{health?.database_status}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="font-medium">Notification SMTP Service</span>
                  <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/10">{health?.smtp_status}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center"><Cpu className="w-5 h-5 mr-2" /> Model Environment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="font-medium text-sm opacity-80">Active Meta-Ensemble Version</span>
                  <code className="px-2 py-1 bg-primary/10 rounded">{health?.active_model_version}</code>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="font-medium text-sm opacity-80">Server OS</span>
                  <code className="px-2 py-1 bg-primary/10 rounded">Linux / Docker</code>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="font-medium text-sm opacity-80">Python Version</span>
                  <code className="px-2 py-1 bg-primary/10 rounded">3.12.3</code>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
