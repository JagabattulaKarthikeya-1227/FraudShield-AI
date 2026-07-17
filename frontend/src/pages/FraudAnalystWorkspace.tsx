import React, { useState } from "react";
import { useDashboardStats } from "@/core/api/hooks/useDashboard";
import { useTransactions, useReviewTransaction } from "@/core/api/hooks/useTransactions";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlobalKPIHeader, KPI } from "@/components/dashboard/GlobalKPIHeader";
import { EnterpriseTable, Column } from "@/components/dashboard/EnterpriseTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { InteractiveCard } from "@/components/motion/InteractiveCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ShieldAlert, History, Key, Activity, Network } from "lucide-react";

export const FraudAnalystWorkspace = () => {
  const [page, setPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  
  const { data: stats } = useDashboardStats();
  const { data: txData, isLoading: txLoading } = useTransactions(page, 15);
  const { mutate: reviewTx, isPending: reviewPending } = useReviewTransaction();

  const handleReview = (id: string, action: 'approve' | 'reject') => {
    reviewTx({ txId: id, action, notes: "Reviewed via Analyst Workspace." });
    if (selectedTx?.id === id) {
      setSelectedTx(null); // Close panel after decision
    }
  };

  const kpis: KPI[] = [
    {
      id: 'queue',
      label: 'Priority Review Queue',
      value: stats?.priority_queue_size || 0,
      trend: 'down',
      trendValue: '-12%',
      trendLabel: 'vs last hour',
    },
    {
      id: 'reviews',
      label: 'My Reviews (Month)',
      value: stats?.my_reviews_this_month || 432,
      trend: 'up',
      trendValue: '+24',
      trendLabel: 'Above average throughput',
    },
    {
      id: 'precision',
      label: 'Ensemble Precision',
      value: 99.1,
      suffix: '%',
      decimals: 1,
      trend: 'up',
      trendValue: '+0.1%',
      trendLabel: 'Model v4.2.1-prod',
      sparklineData: [98, 98.2, 98.5, 99.0, 99.1]
    },
    {
      id: 'latency',
      label: 'Average Inference Time',
      value: 42,
      suffix: 'ms',
      trend: 'neutral',
      trendValue: '0',
      trendLabel: 'P99: 85ms',
    }
  ];

  const txColumns: Column<any>[] = [
    {
      key: 'id',
      header: 'ID',
      cell: (tx) => <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400">{tx.id.substring(0,8)}</span>
    },
    {
      key: 'score',
      header: 'Risk Score',
      sortable: true,
      cell: (tx) => (
        <div className="flex items-center gap-2">
          <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                (tx.risk_score * 100) > 80 ? 'bg-rose-500' : 
                (tx.risk_score * 100) > 40 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.max(10, tx.risk_score * 100)}%` }}
            />
          </div>
          <span className="text-xs font-medium">{(tx.risk_score * 100).toFixed(1)}</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (tx) => (
        <Badge variant="outline" className={
          tx.status === 'flagged' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
          tx.status === 'declined' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
          'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
        }>
          {tx.status.toUpperCase()}
        </Badge>
      )
    },
    {
      key: 'action',
      header: '',
      cell: (tx) => (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={(e) => { e.stopPropagation(); setSelectedTx(tx); }}
          className="h-7 text-xs px-2"
        >
          Investigate
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12 h-[calc(100vh-100px)] flex flex-col">
      <div className="shrink-0">
        <PageHeader 
          title="Security Operations Center" 
          description="Advanced Investigation & Manual Review Console." 
        />
        <GlobalKPIHeader kpis={kpis} />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left: Transaction Stream */}
        <div className={`transition-all duration-500 flex flex-col min-h-0 ${selectedTx ? 'lg:w-1/2' : 'w-full'}`}>
          <EnterpriseTable 
            title="Global Transaction Stream"
            description="Live feed of network activity."
            data={txData?.items || []}
            columns={txColumns}
            isLoading={txLoading}
            emptyState={
              <EmptyState 
                title="Queue Empty" 
                description="No transactions pending review." 
                imageSrc="/src/assets/illustrations/empty_transactions.png" 
              />
            }
          />
        </div>

        {/* Right: Investigation Panel (Split Screen) */}
        <AnimatePresence>
          {selectedTx && (
            <motion.div 
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: '100%' }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              className="lg:w-1/2 flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                    <ShieldAlert className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Investigation: <span className="font-mono text-indigo-600 dark:text-indigo-400">{selectedTx.id}</span></h3>
                    <p className="text-xs text-slate-500">{new Date(selectedTx.date).toLocaleString()}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedTx(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Panel Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Decision Block */}
                <div className="grid grid-cols-2 gap-4">
                  <InteractiveCard tilt={false} className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                    <h4 className="text-xs font-semibold text-rose-800 dark:text-rose-400 mb-1 uppercase tracking-wider">XGBoost Score</h4>
                    <p className="text-3xl font-bold text-rose-600">{(selectedTx.risk_score * 100).toFixed(1)}%</p>
                  </InteractiveCard>
                  <InteractiveCard tilt={false} className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                    <h4 className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 mb-1 uppercase tracking-wider">Customer Trust</h4>
                    <p className="text-3xl font-bold text-emerald-600">High</p>
                  </InteractiveCard>
                </div>

                {/* SHAP Visualizer Mock */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Network className="w-4 h-4"/> SHAP Feature Importance</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'amount', val: 0.45, color: 'bg-rose-500' },
                      { name: 'distance_from_home', val: 0.32, color: 'bg-rose-500' },
                      { name: 'historical_avg', val: -0.15, color: 'bg-emerald-500' },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs">
                        <span className="w-32 font-mono text-right truncate">{f.name}</span>
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center">
                          <div 
                            className={`h-full rounded-full ${f.color}`} 
                            style={{ width: `${Math.abs(f.val) * 100}%`, marginLeft: f.val < 0 ? 'auto' : '0' }}
                          />
                        </div>
                        <span className="w-12 font-mono">{f.val > 0 ? '+' : ''}{f.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Merchant Context */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                  <h4 className="text-sm font-semibold mb-2">Transaction Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500 block text-xs">Merchant</span>
                      <span className="font-medium">{selectedTx.merchant}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs">Amount</span>
                      <span className="font-medium">${selectedTx.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex justify-between gap-4">
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" 
                  onClick={() => handleReview(selectedTx.id, 'approve')}
                  disabled={reviewPending}
                >
                  <Check className="w-4 h-4 mr-2" /> Mark Safe
                </Button>
                <Button 
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white" 
                  onClick={() => handleReview(selectedTx.id, 'reject')}
                  disabled={reviewPending}
                >
                  <X className="w-4 h-4 mr-2" /> Confirm Fraud
                </Button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
