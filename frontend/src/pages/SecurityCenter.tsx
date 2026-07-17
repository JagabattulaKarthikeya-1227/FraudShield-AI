import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlobalKPIHeader, KPI } from '@/components/dashboard/GlobalKPIHeader';
import { InteractiveCard } from '@/components/motion/InteractiveCard';
import { EnterpriseTable, Column } from '@/components/dashboard/EnterpriseTable';
import { AcademicTooltip } from '@/components/ui/AcademicTooltip';
import { ShieldAlert, ShieldCheck, Activity, Globe, Monitor, TerminalSquare, AlertTriangle } from 'lucide-react';

export const SecurityCenter: React.FC = () => {
  const kpis: KPI[] = [
    { id: 'score', label: 'Overall Security Score', value: 94, suffix: '/100', trend: 'up', trendValue: '+2', trendLabel: 'A+' },
    { id: 'auth', label: 'Authentication Health', value: 100, suffix: '%', trend: 'neutral', trendValue: 'Secure' },
    { id: 'incidents', label: 'Active Incidents', value: 0, trend: 'neutral', trendValue: 'Safe' },
    { id: 'api', label: 'Blocked API Requests', value: 142, trend: 'up', trendValue: '+12%', trendLabel: 'Rate Limit Enforced' }
  ];

  const sessions = [
    { id: 'sess_1a', user: 'admin@fraudshield.ai', role: 'Administrator', device: 'MacBook Pro', browser: 'Chrome 120', ip: '192.168.1.45', time: 'Active Now', risk: 'Low' },
    { id: 'sess_2b', user: 'analyst_jdoe', role: 'Fraud Analyst', device: 'Windows PC', browser: 'Edge', ip: '10.0.0.12', time: 'Active Now', risk: 'Low' },
    { id: 'sess_3c', user: 'system_api', role: 'Service Account', device: 'Server', browser: 'cURL', ip: '172.16.0.4', time: '2 mins ago', risk: 'Low' },
    { id: 'sess_4d', user: 'unknown', role: 'Guest', device: 'Mobile', browser: 'Safari', ip: '203.0.113.42', time: '5 mins ago', risk: 'High' }
  ];

  const sessionCols: Column<any>[] = [
    { key: 'user', header: 'Identity', cell: (r) => <div className="font-medium">{r.user}<span className="block text-xs text-slate-500">{r.role}</span></div> },
    { key: 'device', header: 'Environment', cell: (r) => <div className="text-sm">{r.device}<span className="block text-xs text-slate-500">{r.browser}</span></div> },
    { key: 'ip', header: 'IP Address', cell: (r) => <span className="font-mono text-xs">{r.ip}</span> },
    { key: 'time', header: 'Last Activity', cell: (r) => <span className="text-xs text-slate-500">{r.time}</span> },
    { 
      key: 'risk', 
      header: 'Risk Level', 
      cell: (r) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${r.risk === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
          {r.risk}
        </span>
      )
    },
    { key: 'action', header: '', cell: () => <button className="text-xs text-rose-500 hover:underline">Revoke</button> }
  ];

  const timelineEvents = [
    { time: '10:42 AM', type: 'LOGIN_SUCCESS', desc: 'admin@fraudshield.ai authenticated via MFA.', icon: ShieldCheck, color: 'text-emerald-500' },
    { time: '10:15 AM', type: 'API_RATE_LIMIT', desc: 'Blocked 45 rapid requests from 203.0.113.42.', icon: AlertTriangle, color: 'text-amber-500' },
    { time: '09:30 AM', type: 'MODEL_DEPLOY', desc: 'v4.2.1-prod deployed by CI/CD Service.', icon: Activity, color: 'text-indigo-500' },
    { time: '08:12 AM', type: 'FAILED_LOGIN', desc: '3 failed attempts for user jsmith.', icon: ShieldAlert, color: 'text-rose-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader 
        title="Global Security Center" 
        description="Enterprise Trust Center monitoring authentication, authorization, and system integrity." 
      />

      <AcademicTooltip 
        title="Enterprise Security Score" 
        content="This aggregated score evaluates IAM policies, JWT token health, API rate limit enforcement, and encryption standards. 94/100 indicates high compliance with SOC 2 requirements."
      >
        <div className="w-full">
          <GlobalKPIHeader kpis={kpis} />
        </div>
      </AcademicTooltip>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live Timeline */}
        <div className="lg:col-span-1 space-y-6">
          <InteractiveCard tilt={false} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-full">
            <h3 className="font-semibold mb-6 flex items-center gap-2"><TerminalSquare className="w-4 h-4 text-slate-500"/> Live Security Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
              {timelineEvents.map((event, i) => {
                const Icon = event.icon;
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                      <Icon className={`w-4 h-4 ${event.color}`} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 shadow-sm">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-semibold text-slate-900 dark:text-white text-xs">{event.type}</div>
                        <time className="text-xs text-slate-500">{event.time}</time>
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 text-xs">{event.desc}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </InteractiveCard>
        </div>

        {/* Active Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <AcademicTooltip 
            title="Identity & Access Management (IAM)" 
            content="Active sessions are tracked via secure JWT (JSON Web Tokens) stored in HttpOnly cookies to prevent XSS attacks. Admins can instantly revoke refresh tokens to terminate suspicious sessions."
          >
            <div className="w-full h-full">
              <EnterpriseTable 
                title="Active Identity Sessions"
                description="Monitor connected clients and revoke unauthorized access."
                data={sessions}
                columns={sessionCols}
              />
            </div>
          </AcademicTooltip>
        </div>

      </div>
    </div>
  );
};
