import React from 'react';
import ReactECharts from 'echarts-for-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlobalKPIHeader, KPI } from '@/components/dashboard/GlobalKPIHeader';
import { InteractiveCard } from '@/components/motion/InteractiveCard';
import { AcademicTooltip } from '@/components/ui/AcademicTooltip';
import { Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

export const DriftDetection: React.FC = () => {
  const kpis: KPI[] = [
    { id: 'psi', label: 'Max Feature PSI', value: 0.08, decimals: 2, trend: 'neutral', trendValue: 'Stable' },
    { id: 'target_drift', label: 'Target Distribution', value: 0.12, suffix: '%', decimals: 2, trend: 'down', trendValue: '-0.01%' },
    { id: 'kl_div', label: 'KL Divergence (Amount)', value: 0.04, decimals: 2, trend: 'up', trendValue: 'Safe' },
    { id: 'status', label: 'Retraining Trigger', value: 0, trend: 'neutral', trendValue: 'Not Required' }
  ];

  // ECharts: Feature Distribution Comparison (Train vs Prod)
  const distributionOptions = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { data: ['Training Distribution', 'Production Stream (7d)'], bottom: 0, textStyle: { color: '#64748b' } },
    xAxis: { type: 'category', data: ['0-100', '100-500', '500-1k', '1k-5k', '5k+'], splitLine: { show: false } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } } },
    series: [
      {
        name: 'Training Distribution',
        type: 'bar',
        data: [45, 30, 15, 8, 2],
        itemStyle: { color: '#94a3b8' }
      },
      {
        name: 'Production Stream (7d)',
        type: 'line',
        smooth: true,
        data: [44, 32, 14, 9, 1],
        itemStyle: { color: '#6366f1' },
        areaStyle: { color: 'rgba(99, 102, 241, 0.2)' }
      }
    ]
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader 
        title="Drift Detection & Monitoring" 
        description="Monitor Population Stability Index (PSI) and feature distributions in real-time." 
      />
      
      <AcademicTooltip 
        title="Population Stability Index (PSI)" 
        content="PSI measures how much the distribution of a variable has shifted between two samples (e.g., training data vs production data). A PSI < 0.1 means no significant change; PSI > 0.2 indicates major drift requiring retraining."
      >
        <div className="w-full">
          <GlobalKPIHeader kpis={kpis} />
        </div>
      </AcademicTooltip>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Distribution Comparison */}
        <div className="lg:col-span-2 space-y-6">
          <InteractiveCard tilt={false} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Activity className="w-4 h-4 text-indigo-500"/> Feature: `transaction_amount`</h3>
            <p className="text-xs text-slate-500 mb-6">Comparing current production streaming data against the V4.2.1-prod baseline.</p>
            <div className="h-[350px]">
              <ReactECharts option={distributionOptions} style={{ height: '100%', width: '100%' }} />
            </div>
          </InteractiveCard>
        </div>

        {/* AI Copilot Insights */}
        <div className="space-y-6">
          <InteractiveCard tilt={false} className="p-6 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 h-full">
            <h3 className="font-semibold mb-4 text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5"/> AI Copilot Insight
            </h3>
            <div className="space-y-4 text-sm text-indigo-800 dark:text-indigo-200/80 leading-relaxed">
              <p>
                <strong>Analysis complete.</strong> The production stream matches the training distribution closely across all 128 top features.
              </p>
              <p>
                The highest drift was observed in `merchant_category_code` (PSI: 0.08), likely due to a seasonal shift in travel-related purchases. This is well below the retraining threshold of 0.20.
              </p>
              <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50 mt-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs">No immediate action required. Next automated calibration scheduled for Sunday 02:00 UTC.</p>
              </div>
            </div>
          </InteractiveCard>
        </div>

      </div>
    </div>
  );
};
