import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { 
  Activity, ArrowRight, CheckCircle2, ChevronRight, Clock, 
  Cpu, FileText, Fingerprint, Network, ShieldAlert, ShieldCheck, 
  TrendingDown, TrendingUp, AlertTriangle, MapPin, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- MOCK DATA ---
const mockTxns = [
  { id: 'TXN-9821', merchant: 'Apple Store', amount: '$1,299.00', country: 'US', device: 'iPhone 14', risk: 0.02, status: 'Approved', time: 'Just now' },
  { id: 'TXN-9820', merchant: 'Luxury Watches', amount: '$4,500.00', country: 'RU', device: 'Unknown', risk: 0.98, status: 'Blocked', time: '2s ago' },
  { id: 'TXN-9819', merchant: 'Amazon', amount: '$42.50', country: 'US', device: 'MacBook', risk: 0.05, status: 'Approved', time: '12s ago' },
  { id: 'TXN-9818', merchant: 'Crypto Exchange', amount: '$10,000.00', country: 'NG', device: 'Windows PC', risk: 0.88, status: 'Blocked', time: '45s ago' },
];

const mockAlerts = [
  { title: "Velocity Anomaly", desc: "14 txns in 60s", risk: "High", time: "1m ago" },
  { title: "New Geolocation", desc: "Login from RU", risk: "Medium", time: "5m ago" },
  { title: "Amount Threshold", desc: "$45k Wire Transfer", risk: "High", time: "12m ago" },
];

const mockInsights = [
  "Spike detected in electronics purchases originating from Eastern Europe.",
  "Velocity anomaly: Account #8842 attempted 15 transactions in 2 minutes.",
  "Model confidence dropped by 4% on 'Crypto Exchange' merchant category."
];

const mockInvestigations = [
  { id: 'INV-091', analyst: 'Sarah Connor', status: 'Closed', decision: 'Confirmed Fraud', reason: 'Stolen card details on dark web.' },
  { id: 'INV-090', analyst: 'John Smith', status: 'Open', decision: 'Pending Review', reason: 'Awaiting customer contact.' },
];

// --- ECHARTS CONFIGS ---

const sparklineOptions = (color: string, data: number[]) => ({
  grid: { top: 0, bottom: 0, left: 0, right: 0 },
  xAxis: { type: 'category', show: false },
  yAxis: { type: 'value', show: false },
  series: [{ data, type: 'line', smooth: true, showSymbol: false, lineStyle: { color, width: 2 } }]
});

const predictionTrendOptions = {
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '5%', top: '10%', containLabel: true },
  xAxis: { type: 'category', boundaryGap: false, data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#64748b' } },
  yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } }, axisLabel: { color: '#64748b' } },
  series: [
    { name: 'Volume', type: 'line', smooth: true, lineStyle: { width: 3, color: '#0f766e' }, showSymbol: false, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(15,118,110,0.2)' }, { offset: 1, color: 'rgba(15,118,110,0)' }] } }, data: [1200, 800, 3200, 4500, 3800, 2100] },
    { name: 'Fraud', type: 'line', smooth: true, lineStyle: { width: 3, color: '#e11d48' }, showSymbol: false, data: [12, 8, 45, 90, 60, 25] }
  ]
};

const riskDistributionOptions = {
  tooltip: { trigger: 'item' },
  legend: { bottom: '0%', left: 'center', textStyle: { color: '#64748b' }, icon: 'circle' },
  series: [{
    name: 'Risk Level', type: 'pie', radius: ['50%', '75%'], center: ['50%', '45%'], avoidLabelOverlap: false,
    itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
    label: { show: false },
    data: [
      { value: 8500, name: 'Low', itemStyle: { color: '#10b981' } },
      { value: 1200, name: 'Medium', itemStyle: { color: '#f59e0b' } },
      { value: 250, name: 'High', itemStyle: { color: '#f97316' } },
      { value: 50, name: 'Critical', itemStyle: { color: '#e11d48' } }
    ]
  }]
};

const shapOptions = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '3%', right: '4%', bottom: '3%', top: '5%', containLabel: true },
  xAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } }, axisLabel: { color: '#64748b' } },
  yAxis: { type: 'category', axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#475569', fontWeight: 'bold' }, data: ['IP Distance', 'Velocity (1h)', 'Amount Dev', 'Time Anomaly', 'Device Age'] },
  series: [{
    name: 'SHAP Value', type: 'bar', barWidth: '40%', itemStyle: { borderRadius: [0, 4, 4, 0] },
    data: [
      { value: 0.85, itemStyle: { color: '#e11d48' } },
      { value: 0.72, itemStyle: { color: '#e11d48' } },
      { value: 0.45, itemStyle: { color: '#e11d48' } },
      { value: 0.25, itemStyle: { color: '#e11d48' } },
      { value: -0.15, itemStyle: { color: '#0f766e' } }
    ]
  }]
};

const mapMockOptions = {
  tooltip: { trigger: 'item' },
  grid: { top: '10%', bottom: '10%', left: '5%', right: '5%' },
  xAxis: { show: false, min: -180, max: 180 },
  yAxis: { show: false, min: -90, max: 90 },
  series: [{
    name: 'Fraud Hotspots', type: 'scatter', symbolSize: (val: any) => val[2] * 2,
    itemStyle: { color: '#e11d48', opacity: 0.7, shadowBlur: 10, shadowColor: '#e11d48' },
    data: [
      [-100, 40, 10, 'US - High Velocity'], // US
      [37, 55, 15, 'RU - IP Anomaly'],     // RU
      [10, 50, 5, 'EU - Normal'],         // EU
      [103, 1.3, 8, 'SG - Threshold'],     // SG
      [-43, -22, 6, 'BR - Device Mismatch'] // BR
    ]
  }]
};

// --- COMPONENTS ---

const KpiCard = ({ title, value, trend, trendUp, sparklineColor, sparklineData }: any) => (
  <div className="bg-white p-5 rounded-[18px] border border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all group">
    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">{title}</div>
    <div className="flex items-end justify-between mb-4">
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      <div className={`flex items-center text-xs font-bold ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
        {trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {trend}
      </div>
    </div>
    <div className="h-10 w-full opacity-60 group-hover:opacity-100 transition-opacity">
      <ReactECharts option={sparklineOptions(sparklineColor, sparklineData)} style={{ height: '100%', width: '100%' }} />
    </div>
  </div>
);

export const CustomerDashboard = () => {
  return (
    <div className="space-y-6 pb-12 w-full animate-in fade-in duration-500">
      
      {/* SECTION 1: Welcome Header */}
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Good Morning, Analyst</h1>
        <p className="text-slate-500 mt-1">Real-time fraud monitoring powered by Explainable AI.</p>
      </div>

      {/* SECTION 2: KPI CARDS (Exactly 6) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard title="Transactions Today" value="124.5K" trend="12%" trendUp={true} sparklineColor="#0f766e" sparklineData={[10, 20, 15, 30, 25, 40]} />
        <KpiCard title="Fraud Detected" value="$42.1K" trend="5%" trendUp={false} sparklineColor="#e11d48" sparklineData={[5, 10, 8, 15, 12, 20]} />
        <KpiCard title="Fraud Rate" value="0.08%" trend="0.01%" trendUp={true} sparklineColor="#f59e0b" sparklineData={[0.07, 0.08, 0.06, 0.09, 0.08, 0.08]} />
        <KpiCard title="Detection Accuracy" value="99.92%" trend="0.05%" trendUp={true} sparklineColor="#0f766e" sparklineData={[99.8, 99.85, 99.9, 99.92, 99.91, 99.92]} />
        <KpiCard title="Avg Prediction Time" value="42ms" trend="3ms" trendUp={true} sparklineColor="#0f766e" sparklineData={[45, 44, 43, 42, 41, 42]} />
        <KpiCard title="Active Models" value="3" trend="Stable" trendUp={true} sparklineColor="#8b5cf6" sparklineData={[3, 3, 3, 3, 3, 3]} />
      </div>

      {/* ROW 2: Live Stream & Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* SECTION 3: Live Transaction Stream */}
        <div className="xl:col-span-2 bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Live Transaction Stream</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
              Live Sync
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">ID / Time</th>
                  <th className="p-4">Merchant</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Context</th>
                  <th className="p-4">Risk / Confidence</th>
                  <th className="p-4">Prediction</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {mockTxns.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="p-4">
                      <div className="font-mono text-xs text-slate-900 font-medium group-hover:text-emerald-600 transition-colors">{tx.id}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{tx.time}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-900">{tx.merchant}</td>
                    <td className="p-4 font-bold text-slate-900">{tx.amount}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600"><MapPin className="w-3 h-3 text-slate-400"/> {tx.country}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 ml-4.5">{tx.device}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${tx.risk > 0.5 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${tx.risk * 100}%` }} />
                        </div>
                        <span className={`text-xs font-bold ${tx.risk > 0.5 ? 'text-rose-600' : 'text-emerald-600'}`}>{(tx.risk * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${tx.status === 'Blocked' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                        {tx.status === 'Blocked' ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 4: Live Fraud Alerts */}
        <div className="xl:col-span-1 bg-white rounded-[20px] border border-slate-200 shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Priority Alerts</h3>
            <div className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-100">3 Action Required</div>
          </div>
          <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto max-h-[400px]">
            {mockAlerts.map((alert, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-white group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${alert.risk === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                      {alert.risk}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3"/> {alert.time}</span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{alert.title}</h4>
                <p className="text-xs text-slate-600 mb-4">{alert.desc}</p>
                <div className="flex gap-2">
                  <Button size="sm" className="h-7 text-xs bg-slate-900 hover:bg-slate-800 text-white w-full">Review</Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs w-full">Dismiss</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 3: Map & AI Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* SECTION 5: Transaction Map */}
        <div className="xl:col-span-2 bg-white rounded-[20px] border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">Global Threat Map</h3>
          <div className="h-[250px] w-full bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden flex items-center justify-center">
            {/* Using a scatter plot over a light grid to simulate global hotspots */}
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.5 }}></div>
            <ReactECharts option={mapMockOptions} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* SECTION 6: AI Insights */}
        <div className="xl:col-span-1 bg-white rounded-[20px] border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">AI Insights</h3>
          </div>
          <div className="space-y-4 flex-1">
            {mockInsights.map((insight, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="mt-0.5 p-1.5 rounded-full bg-emerald-50 text-emerald-600"><Activity className="w-3.5 h-3.5" /></div>
                <p className="text-sm text-slate-600 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 4: Prediction Trend & Risk Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* SECTION 10: Prediction Trend */}
        <div className="xl:col-span-2 bg-white rounded-[20px] border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Volume & Fraud Trends</h3>
            <div className="flex bg-slate-100 p-0.5 rounded-lg">
              {['24H', '7D', '30D'].map(t => (
                <button key={t} className={`px-3 py-1 text-xs font-bold rounded-md ${t === '24H' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="h-[250px]">
            <ReactECharts option={predictionTrendOptions} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* SECTION 11: Risk Distribution */}
        <div className="xl:col-span-1 bg-white rounded-[20px] border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">Risk Distribution</h3>
          <div className="h-[250px]">
            <ReactECharts option={riskDistributionOptions} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* ROW 5: Explainability & Models */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SECTION 9: SHAP Summary */}
        <div className="lg:col-span-1 bg-white rounded-[20px] border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">Global Feature Importance (SHAP)</h3>
          <div className="h-[250px]">
            <ReactECharts option={shapOptions} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* SECTION 7: Model Health */}
        <div className="lg:col-span-1 bg-white rounded-[20px] border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">Model Health (Hybrid v4.2)</h3>
          <div className="grid grid-cols-2 gap-4 flex-1">
            {[
              { l: 'Accuracy', v: '99.92%' }, { l: 'Precision', v: '98.5%' },
              { l: 'Recall', v: '96.2%' }, { l: 'F1 Score', v: '97.3%' },
              { l: 'AUC-ROC', v: '0.998' }, { l: 'Latency', v: '42ms' },
              { l: 'Inf / sec', v: '2,450' }, { l: 'GPU Util', v: '45%' }
            ].map((m, i) => (
              <div key={i} className="flex flex-col p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{m.l}</span>
                <span className="text-lg font-bold text-slate-900">{m.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 8: Model Comparison */}
        <div className="lg:col-span-1 bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Model Comparison</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-3 pl-6">Algorithm</th>
                  <th className="p-3">F1</th>
                  <th className="p-3">Lat (ms)</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50">
                <tr className="bg-emerald-50/50">
                  <td className="p-3 pl-6 font-semibold text-emerald-700 flex items-center gap-2">XGBoost <span className="text-[8px] bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-700 uppercase">Active</span></td>
                  <td className="p-3 font-medium text-slate-900">0.973</td>
                  <td className="p-3 text-emerald-600 font-medium">42</td>
                </tr>
                <tr><td className="p-3 pl-6 font-medium text-slate-700">LightGBM</td><td className="p-3 text-slate-600">0.968</td><td className="p-3 text-slate-600">38</td></tr>
                <tr><td className="p-3 pl-6 font-medium text-slate-700">Random Forest</td><td className="p-3 text-slate-600">0.945</td><td className="p-3 text-slate-600">85</td></tr>
                <tr><td className="p-3 pl-6 font-medium text-slate-700">Autoencoder</td><td className="p-3 text-slate-600">0.912</td><td className="p-3 text-slate-600">110</td></tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ROW 6: Recent Investigations */}
      <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Recent Investigations</h3>
          <Button variant="ghost" size="sm" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">View All Cases <ArrowRight className="w-3 h-3 ml-1"/></Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {mockInvestigations.map((inv, idx) => (
            <div key={idx} className="p-6 hover:bg-slate-50 transition-colors group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-900">{inv.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${inv.status === 'Closed' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'}`}>{inv.status}</span>
                </div>
                <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600">{inv.analyst.charAt(0)}</div> {inv.analyst}</div>
              </div>
              <div className="mb-2">
                <span className="text-xs font-bold text-slate-900">Decision: </span>
                <span className={`text-xs font-medium ${inv.decision === 'Confirmed Fraud' ? 'text-rose-600' : 'text-amber-600'}`}>{inv.decision}</span>
              </div>
              <p className="text-sm text-slate-600">{inv.reason}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
