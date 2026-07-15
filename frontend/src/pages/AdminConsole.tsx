import { useDashboardStats } from "@/core/api/hooks/useDashboard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Server, AlertOctagon, CheckCircle2, Loader2 } from "lucide-react";

export const AdminConsole = () => {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Admin Console" 
        description="Global system telemetry and organizational overview." 
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <div className="text-2xl font-bold">{stats?.total_transactions || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Fraud Prevented</CardTitle>
            <AlertOctagon className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <div className="text-2xl font-bold text-rose-500">{stats?.fraud_prevented || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <div className="text-2xl font-bold text-emerald-500">{stats?.system_status || "Offline"}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
