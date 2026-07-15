import { useDashboardStats } from "@/core/api/hooks/useDashboard";
import { useTransactions } from "@/core/api/hooks/useTransactions";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, CreditCard, ShieldAlert, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const CustomerDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: txData, isLoading: txLoading } = useTransactions(1, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Account Overview" 
        description="Monitor your recent activity and security status." 
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <div className="text-2xl font-bold">{stats?.total_transactions || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <div className="text-2xl font-bold text-amber-500">{stats?.flagged_transactions || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Account Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <div className="text-2xl font-bold text-emerald-500">{stats?.account_health || "Unknown"}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {txLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-background/50 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Merchant</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {txData?.items?.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No recent transactions.</td>
                    </tr>
                  )}
                  {txData?.items?.map((tx: any) => (
                    <tr key={tx.id} className="border-b border-border/20 hover:bg-background/30 transition-colors">
                      <td className="px-6 py-4">{new Date(tx.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium">{tx.merchant}</td>
                      <td className="px-6 py-4">${tx.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={
                          tx.status === 'flagged' ? 'bg-amber-500/10 text-amber-500' :
                          tx.status === 'declined' ? 'bg-rose-500/10 text-rose-500' :
                          'bg-emerald-500/10 text-emerald-500'
                        }>
                          {tx.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
