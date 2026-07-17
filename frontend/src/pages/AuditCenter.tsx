import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { EnterpriseTable, Column } from '@/components/dashboard/EnterpriseTable';
import { AcademicTooltip } from '@/components/ui/AcademicTooltip';
import { Download, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AuditCenter: React.FC = () => {
  const auditLogs = [
    { id: 'AL-9021', actor: 'admin@fraudshield.ai', action: 'UPDATE_POLICY', entity: 'RoleMatrix', ip: '192.168.1.45', time: '2026-07-16 10:42:01 UTC', status: 'Success' },
    { id: 'AL-9022', actor: 'system_api', action: 'ROTATE_KEYS', entity: 'StripeWebhook', ip: '172.16.0.4', time: '2026-07-16 10:15:22 UTC', status: 'Success' },
    { id: 'AL-9023', actor: 'j.doe (Analyst)', action: 'REVIEW_TX', entity: 'TX-8921A', ip: '10.0.0.12', time: '2026-07-16 09:30:11 UTC', status: 'Success' },
    { id: 'AL-9024', actor: 'unknown', action: 'FAILED_LOGIN', entity: 'User:jsmith', ip: '203.0.113.42', time: '2026-07-16 08:12:05 UTC', status: 'Failed' },
    { id: 'AL-9025', actor: 'admin@fraudshield.ai', action: 'EXPORT_DATA', entity: 'Transactions_Q3', ip: '192.168.1.45', time: '2026-07-15 14:22:18 UTC', status: 'Success' },
    { id: 'AL-9026', actor: 'system_cicd', action: 'DEPLOY_MODEL', entity: 'v4.2.1-prod', ip: '172.16.0.8', time: '2026-07-15 02:00:00 UTC', status: 'Success' },
  ];

  const columns: Column<any>[] = [
    { key: 'id', header: 'Event ID', cell: (r) => <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400">{r.id}</span> },
    { key: 'time', header: 'Timestamp', sortable: true, cell: (r) => <span className="text-xs text-slate-500 font-mono">{r.time}</span> },
    { key: 'actor', header: 'Actor', cell: (r) => <span className="font-medium">{r.actor}</span> },
    { 
      key: 'action', 
      header: 'Action', 
      cell: (r) => (
        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs font-semibold tracking-wide">
          {r.action}
        </span>
      ) 
    },
    { key: 'entity', header: 'Target Entity', cell: (r) => <span className="text-sm font-mono text-slate-600 dark:text-slate-400">{r.entity}</span> },
    { key: 'ip', header: 'Source IP', cell: (r) => <span className="text-xs font-mono text-slate-500">{r.ip}</span> },
    { 
      key: 'status', 
      header: 'Status', 
      cell: (r) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${r.status === 'Failed' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
          {r.status}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader 
          title="Immutable Audit Log" 
          description="Enterprise system of record for all administrative and automated actions." 
        />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-white dark:bg-slate-900">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <AcademicTooltip 
        title="Immutable Audit Trail" 
        content="In enterprise financial systems, audit logs must be append-only and immutable. This ensures that even administrators cannot erase the history of actions like exporting data or changing risk thresholds, fulfilling SOC 2 and PCI-DSS compliance requirements."
      >
        <div className="w-full">
          <EnterpriseTable 
            title="System Audit Events"
            description="Chronological log of platform mutations."
            data={auditLogs}
            columns={columns}
          />
        </div>
      </AcademicTooltip>

    </div>
  );
};
