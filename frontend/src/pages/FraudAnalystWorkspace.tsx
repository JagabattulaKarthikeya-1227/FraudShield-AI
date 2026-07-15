import { useState } from "react";
import { useDashboardStats } from "@/core/api/hooks/useDashboard";
import { useTransactions, useReviewTransaction } from "@/core/api/hooks/useTransactions";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X } from "lucide-react";

export const FraudAnalystWorkspace = () => {
  const [page, setPage] = useState(1);
  const { data: stats } = useDashboardStats();
  const { data: txData, isLoading: txLoading } = useTransactions(page, 10);
  const { mutate: reviewTx, isPending: reviewPending } = useReviewTransaction();

  const handleReview = (id: string, action: 'approve' | 'reject') => {
    reviewTx({ txId: id, action, notes: "Reviewed via priority queue." });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Analyst Workspace" 
        description="Priority queue and manual review center." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-500">Pending Reviews (Queue)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.priority_queue_size || 0}</div>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">My Reviews (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.my_reviews_this_month || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Global Transaction Stream</CardTitle>
        </CardHeader>
        <CardContent>
          {txLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-background/50 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Risk Score</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {txData?.items?.map((tx: any) => (
                    <tr key={tx.id} className="border-b border-border/20 hover:bg-background/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs opacity-70">{tx.id.substring(0,8)}...</td>
                      <td className="px-6 py-4">
                        {tx.risk_score ? (tx.risk_score * 100).toFixed(1) + '%' : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={
                          tx.status === 'flagged' ? 'bg-amber-500/10 text-amber-500' :
                          tx.status === 'declined' ? 'bg-rose-500/10 text-rose-500' :
                          'bg-emerald-500/10 text-emerald-500'
                        }>
                          {tx.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {tx.status === 'flagged' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleReview(tx.id, 'approve')} disabled={reviewPending} className="border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10">
                              <Check className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleReview(tx.id, 'reject')} disabled={reviewPending} className="border-rose-500/50 text-rose-500 hover:bg-rose-500/10">
                              <X className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        {tx.status !== 'flagged' && <span className="opacity-50 text-xs">Reviewed</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-4 px-4">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                <span className="text-xs text-muted-foreground">Page {page} of {txData?.pages || 1}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= (txData?.pages || 1)}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
