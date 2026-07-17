import { useDashboardStats } from "@/core/api/hooks/useDashboard";
import { useTransactions } from "@/core/api/hooks/useTransactions";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlobalKPIHeader, KPI } from "@/components/dashboard/GlobalKPIHeader";
import { EnterpriseTable, Column } from "@/components/dashboard/EnterpriseTable";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, BrainCircuit, ActivitySquare, AlertTriangle } from "lucide-react";
import { InteractiveCard } from "@/components/motion/InteractiveCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { EmptyState } from "@/components/dashboard/EmptyState";

export const CustomerDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: txData, isLoading: txLoading } = useTransactions(1, 10);

  const kpis: KPI[] = [
    {
      id: 'trust',
      label: 'Account Trust Score',
      value: 99.8,
      suffix: '%',
      decimals: 1,
      trend: 'up',
      trendValue: '+0.2%',
      trendLabel: 'Excellent standing',
      sparklineData: [95, 96, 95, 98, 97, 98, 99, 99.5, 99.8]
    },
    {
      id: 'tx',
      label: 'Transactions (30d)',
      value: stats?.total_transactions || 142,
      trend: 'neutral',
      trendValue: '0%',
      trendLabel: 'Average spending volume',
      sparklineData: [12, 15, 10, 22, 18, 30, 25, 20, 14, 18]
    },
    {
      id: 'alerts',
      label: 'Active Verification Requests',
      value: stats?.flagged_transactions || 0,
      trend: 'down',
      trendValue: '-1',
      trendLabel: 'No action required',
    },
    {
      id: 'shield',
      label: 'AI Protection Status',
      value: 100,
      suffix: '%',
      trend: 'up',
      trendValue: 'Active',
      trendLabel: 'Zero Trust architecture enabled',
      sparklineData: [100, 100, 100, 100, 100, 100, 100, 100]
    }
  ];

  const txColumns: Column<any>[] = [
    {
      key: 'id',
      header: 'Transaction ID',
      cell: (tx) => <span className="font-mono text-xs opacity-70">{tx.id.substring(0, 8)}</span>
    },
    {
      key: 'date',
      header: 'Date & Time',
      sortable: true,
      cell: (tx) => <span className="text-slate-600">{new Date(tx.date).toLocaleString()}</span>
    },
    {
      key: 'merchant',
      header: 'Merchant',
      sortable: true,
      cell: (tx) => <span className="font-medium text-slate-900 dark:text-white">{tx.merchant}</span>
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      cell: (tx) => <span className="font-semibold">${tx.amount.toFixed(2)}</span>
    },
    {
      key: 'status',
      header: 'Security Status',
      sortable: true,
      cell: (tx) => (
        <Badge variant="outline" className={
          tx.status === 'flagged' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-500/20' :
          tx.status === 'declined' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500 border-rose-200 dark:border-rose-500/20' :
          'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20'
        }>
          {tx.status === 'flagged' ? 'Verification Required' : tx.status === 'declined' ? 'Blocked' : 'Verified by AI'}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <PageHeader 
        title="Financial Wellness Center" 
        description="Your accounts are actively monitored and protected by FraudShield Zero Trust Architecture." 
      />

      <GlobalKPIHeader kpis={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main transaction table */}
        <div className="lg:col-span-2">
          <EnterpriseTable 
            title="Recent Activity"
            description="Your latest transactions across all linked accounts."
            data={txData?.items || []}
            columns={txColumns}
            isLoading={txLoading}
            emptyState={
              <EmptyState 
                title="No Transactions" 
                description="You haven't made any transactions recently." 
                imageSrc="/src/assets/illustrations/empty_transactions.png" 
              />
            }
          />
        </div>

        {/* Sidebar panels */}
        <div className="space-y-6">
          <FadeIn direction="up" delay={0.2}>
            <InteractiveCard tilt={false} className="p-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-300 mb-1">Account Secure</h3>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400/80 leading-relaxed">
                    FraudShield AI is actively analyzing your spending patterns. No suspicious login attempts or unusual transactions have been detected in the past 30 days.
                  </p>
                </div>
              </div>
            </InteractiveCard>
          </FadeIn>

          <FadeIn direction="up" delay={0.3}>
            <InteractiveCard tilt={false} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/5 rounded-xl">
                  <BrainCircuit className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">AI Explanation Card</h3>
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                    Our hybrid ensemble model automatically learns your behavioral footprint. If you travel internationally, simply make one small transaction at the airport to update your trusted geo-profile.
                  </p>
                  <button className="text-sm font-medium text-primary hover:underline">
                    Learn how we protect privacy →
                  </button>
                </div>
              </div>
            </InteractiveCard>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};
