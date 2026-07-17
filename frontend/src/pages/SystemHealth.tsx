import React from 'react';
import ReactECharts from 'echarts-for-react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/layout/PageHeader';
import { InteractiveCard } from '@/components/motion/InteractiveCard';
import { AcademicTooltip } from '@/components/ui/AcademicTooltip';
import { Server, Database, Activity, Zap, Cpu, MemoryStick, Network, Terminal, GitBranch, ArrowRight, UploadCloud, Monitor } from 'lucide-react';

const ServiceNode = ({ icon: Icon, name, status, latency, memory }: any) => (
  <InteractiveCard tilt={false} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${status === 'Healthy' ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-amber-50 dark:bg-amber-900/30'}`}>
        <Icon className={`w-5 h-5 ${status === 'Healthy' ? 'text-emerald-500' : 'text-amber-500'}`} />
      </div>
      <div>
        <h4 className="font-semibold text-sm">{name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="flex h-2 w-2 rounded-full relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === 'Healthy' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'Healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-500">{status}</span>
        </div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-xs font-mono text-slate-500">{latency}</div>
      <div className="text-[10px] text-slate-400 mt-1">{memory}</div>
    </div>
  </InteractiveCard>
);

const PipelineNode = ({ icon: Icon, label, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="flex flex-col items-center gap-2 relative z-10"
  >
    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center">
      <Icon className="w-5 h-5 text-indigo-500" />
    </div>
    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 text-center w-20">{label}</span>
  </motion.div>
);

export const SystemHealth: React.FC = () => {
  
  const latencyOptions = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { data: ['P99 Latency (ms)', 'Cache Hit Rate (%)'], bottom: 0, textStyle: { color: '#64748b' } },
    xAxis: { type: 'category', data: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25'], splitLine: { show: false } },
    yAxis: [
      { type: 'value', name: 'ms', position: 'left', splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } } },
      { type: 'value', name: '%', position: 'right', max: 100, splitLine: { show: false } }
    ],
    series: [
      {
        name: 'P99 Latency (ms)',
        type: 'line',
        smooth: true,
        data: [42, 45, 41, 65, 48, 44],
        itemStyle: { color: '#f43f5e' },
        areaStyle: { color: 'rgba(244, 63, 94, 0.1)' }
      },
      {
        name: 'Cache Hit Rate (%)',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: [88, 86, 89, 72, 85, 91],
        itemStyle: { color: '#10b981' },
      }
    ]
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <PageHeader 
        title="System Health & Observability" 
        description="Real-time SRE metrics, microservice health, and deployment architecture." 
      />

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <AcademicTooltip title="Frontend Caching" content="React Query heavily caches API responses in the browser, reducing load on the backend. This node represents the NGINX static asset server.">
          <ServiceNode icon={Monitor} name="Frontend (NGINX)" status="Healthy" latency="12ms" memory="140 MB" />
        </AcademicTooltip>
        
        <AcademicTooltip title="Gunicorn Workers" content="The Flask API is served via Gunicorn with 4 async worker processes to handle concurrent prediction streams without blocking.">
          <ServiceNode icon={Terminal} name="Flask API (Gunicorn)" status="Healthy" latency="28ms" memory="512 MB" />
        </AcademicTooltip>
        
        <AcademicTooltip title="In-Memory Cache" content="Redis is used for rate-limiting, session management, and caching frequent queries (like standard SHAP baseline values) to achieve <50ms response times.">
          <ServiceNode icon={Zap} name="Redis Cache" status="Healthy" latency="2ms" memory="1.2 GB" />
        </AcademicTooltip>
        
        <AcademicTooltip title="ML Inference" content="The Stacking Ensemble is loaded into memory (RAM) via joblib. High memory usage is expected due to the Random Forest estimators.">
          <ServiceNode icon={Cpu} name="Model Inference" status="Warning" latency="45ms" memory="3.8 GB (85%)" />
        </AcademicTooltip>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Latency & Cache Monitor */}
        <div className="lg:col-span-2 space-y-6">
          <InteractiveCard tilt={false} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-full">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Activity className="w-4 h-4 text-indigo-500"/> API Performance & Observability</h3>
            <p className="text-xs text-slate-500 mb-6">Monitoring P99 latency against Redis cache hit rates.</p>
            <div className="h-[300px]">
              <ReactECharts option={latencyOptions} style={{ height: '100%', width: '100%' }} />
            </div>
          </InteractiveCard>
        </div>

        {/* Server Specs */}
        <div className="space-y-6">
          <InteractiveCard tilt={false} className="p-6 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 h-full">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Server className="w-4 h-4 text-slate-500"/> Infrastructure Specs</h3>
            <div className="space-y-4">
              {[
                { k: 'Cloud Provider', v: 'AWS (us-east-1)' },
                { k: 'Container Engine', v: 'Docker Swarm' },
                { k: 'Database', v: 'PostgreSQL 15' },
                { k: 'Reverse Proxy', v: 'NGINX' },
                { k: 'Load Balancer', v: 'ALB (Active-Active)' },
              ].map((spec, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800 last:border-0">
                  <span className="text-sm text-slate-500">{spec.k}</span>
                  <span className="text-sm font-medium">{spec.v}</span>
                </div>
              ))}
            </div>
          </InteractiveCard>
        </div>

      </div>

      {/* Deployment Architecture */}
      <InteractiveCard tilt={false} className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <h3 className="font-semibold mb-2">CI/CD Deployment Architecture</h3>
        <p className="text-xs text-slate-500 mb-8 max-w-2xl">
          Visualizing the automated deployment pipeline from GitHub push to production serving. 
          Containers are orchestrated via Docker and routed through NGINX.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-between relative px-4 py-8">
          {/* Animated connection line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 hidden md:block">
            <motion.div 
              animate={{ x: ['0%', '100%'] }} 
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="h-full w-24 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
            />
          </div>

          <PipelineNode icon={GitBranch} label="GitHub Actions (CI)" delay={0} />
          <ArrowRight className="w-4 h-4 text-slate-300 md:hidden my-2" />
          
          <PipelineNode icon={UploadCloud} label="Docker Registry" delay={0.2} />
          <ArrowRight className="w-4 h-4 text-slate-300 md:hidden my-2" />
          
          <PipelineNode icon={Network} label="NGINX Reverse Proxy" delay={0.4} />
          <ArrowRight className="w-4 h-4 text-slate-300 md:hidden my-2" />
          
          <PipelineNode icon={Terminal} label="Flask API (Gunicorn)" delay={0.6} />
          <ArrowRight className="w-4 h-4 text-slate-300 md:hidden my-2" />
          
          <PipelineNode icon={Database} label="PostgreSQL & Redis" delay={0.8} />
        </div>
      </InteractiveCard>

    </div>
  );
};
