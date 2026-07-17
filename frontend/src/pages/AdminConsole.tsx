import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlobalKPIHeader, KPI } from "@/components/dashboard/GlobalKPIHeader";
import { EnterpriseTable, Column } from "@/components/dashboard/EnterpriseTable";
import { InteractiveCard } from "@/components/motion/InteractiveCard";
import { motion } from "framer-motion";
import { Server, Database, Activity, HardDrive, Users, Shield, Cpu, Mail } from "lucide-react";

export const AdminConsole = () => {
  const kpis: KPI[] = [
    {
      id: 'api',
      label: 'API Uptime',
      value: 99.99,
      suffix: '%',
      decimals: 2,
      trend: 'neutral',
      trendValue: 'All systems operational',
      sparklineData: [100, 100, 99.9, 100, 100, 100, 99.99]
    },
    {
      id: 'db',
      label: 'Database Load',
      value: 42,
      suffix: '%',
      trend: 'down',
      trendValue: '-5%',
      trendLabel: 'Optimized query plan active',
      sparklineData: [60, 55, 45, 50, 48, 45, 42]
    },
    {
      id: 'queue',
      label: 'Redis Queue Size',
      value: 1420,
      trend: 'up',
      trendValue: '+210',
      trendLabel: 'Processing smoothly',
      sparklineData: [1000, 1200, 1100, 1300, 1400, 1420]
    },
    {
      id: 'users',
      label: 'Active Sessions',
      value: 845,
      trend: 'up',
      trendValue: '+12',
      trendLabel: 'Peak hours'
    }
  ];

  const auditData = [
    { id: 'EVT-001', type: 'CONFIG_CHANGE', user: 'admin@fraudshield.ai', desc: 'Updated risk threshold from 0.85 to 0.82', time: '2 mins ago' },
    { id: 'EVT-002', type: 'MODEL_DEPLOY', user: 'system', desc: 'Deployed ensemble-v4.2.1 to production', time: '1 hour ago' },
    { id: 'EVT-003', type: 'USER_ROLE_UPDATE', user: 'admin@fraudshield.ai', desc: 'Elevated j.doe to Fraud Analyst', time: '3 hours ago' },
    { id: 'EVT-004', type: 'API_KEY_ROTATED', user: 'system', desc: 'Automated rotation of Stripe webhook keys', time: '5 hours ago' },
    { id: 'EVT-005', type: 'DATA_EXPORT', user: 'analyst1@fraudshield.ai', desc: 'Exported 10,000 transactions for audit', time: '1 day ago' },
  ];

  const auditColumns: Column<any>[] = [
    { key: 'id', header: 'Event ID', cell: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: 'type', header: 'Event Type', cell: (r) => <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">{r.type}</span> },
    { key: 'desc', header: 'Description', cell: (r) => <span className="text-slate-600 dark:text-slate-400">{r.desc}</span> },
    { key: 'user', header: 'Initiated By', cell: (r) => <span>{r.user}</span> },
    { key: 'time', header: 'Time', cell: (r) => <span className="text-slate-500">{r.time}</span> },
  ];

  const statusItems = [
    { name: 'XGBoost Inference Service', status: 'Healthy', ping: '12ms', icon: Cpu },
    { name: 'PostgreSQL Primary DB', status: 'Healthy', ping: '4ms', icon: Database },
    { name: 'Redis Cache Cluster', status: 'Healthy', ping: '1ms', icon: HardDrive },
    { name: 'SendGrid Email Relay', status: 'Degraded', ping: '450ms', icon: Mail },
    { name: 'Kubernetes Control Plane', status: 'Healthy', ping: '8ms', icon: Server },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader 
        title="Admin Control Center" 
        description="Enterprise infrastructure monitoring and configuration." 
      />
      <GlobalKPIHeader kpis={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Infrastructure Status */}
        <div className="space-y-6">
          <InteractiveCard tilt={false} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Activity className="w-4 h-4"/> System Microservices</h3>
            <div className="space-y-4">
              {statusItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400">{item.ping}</span>
                      <span className={`w-2 h-2 rounded-full ${item.status === 'Healthy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse'}`} />
                    </div>
                  </div>
                )
              })}
            </div>
          </InteractiveCard>

          <InteractiveCard tilt={false} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="w-4 h-4"/> Role Distribution</h3>
            <div className="space-y-4">
              {[
                { role: 'Customers', count: 12450, pct: 95 },
                { role: 'Fraud Analysts', count: 42, pct: 4 },
                { role: 'Administrators', count: 8, pct: 1 },
              ].map((r, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{r.role}</span>
                    <span className="font-mono text-slate-500">{r.count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${Math.max(2, r.pct)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </InteractiveCard>
        </div>

        {/* Right: Audit Log */}
        <div className="lg:col-span-2 space-y-6">
          <EnterpriseTable 
            title="System Audit Log"
            description="Immutable record of administrative and system events."
            data={auditData}
            columns={auditColumns}
            onExport={() => alert("Exporting audit log...")}
          />
        </div>

      </div>
    </div>
  );
};
