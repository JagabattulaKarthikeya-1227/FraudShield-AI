import { useAuditLogs } from "@/core/api/hooks/useOps";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WorkflowTimeline } from "@/components/shared/WorkflowTimeline";
import { AuditTimelineRing } from "@/components/3d/AuditTimelineRing";

export const AuditCenter = () => {
  const { data: logs, isLoading } = useAuditLogs();

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Immutable Audit Center" 
        description="A cryptographic chronological ledger of all system actions and prediction lifecycles." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-500">
                <ShieldCheck className="w-5 h-5 mr-2" />
                Global Event Ledger
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin opacity-50" /></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-background/50 border-b border-border/50">
                      <tr>
                        <th className="px-4 py-3">Event ID</th>
                        <th className="px-4 py-3">Timestamp</th>
                        <th className="px-4 py-3">Actor</th>
                        <th className="px-4 py-3">Action</th>
                        <th className="px-4 py-3">Target</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs?.map((log: any) => (
                        <tr key={log.id} className="border-b border-border/20 hover:bg-background/40">
                          <td className="px-4 py-3 font-mono text-xs opacity-70">{log.id}</td>
                          <td className="px-4 py-3 opacity-80">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="px-4 py-3 font-medium text-blue-500">{log.actor}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">{log.action}</Badge>
                          </td>
                          <td className="px-4 py-3 opacity-80 font-mono text-xs">{log.resource}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <AuditTimelineRing />
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Standard Workflow Trace</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkflowTimeline />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
