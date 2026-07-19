import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LiveDemo() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    amount: '4500.00',
    merchant: 'Luxury Watches Inc',
    country: 'RU',
    time: '03:14 AM',
    device: 'Unknown Mobile',
    payment: 'Credit Card'
  });

  const runAnalysis = () => {
    setAnalyzing(true);
    setResult(null);
    
    setTimeout(() => {
      setAnalyzing(false);
      // Logic for demo: If amount > 1000 and country is RU, trigger fraud
      const isFraud = parseFloat(formData.amount) > 1000 && formData.country === 'RU';
      
      setResult({
        isFraud,
        risk: isFraud ? 0.96 : 0.04,
        confidence: 0.99,
        time: '38ms',
        factors: isFraud ? [
          { name: 'Location Anomaly (RU)', val: 0.45, type: 'risk' },
          { name: 'Amount Deviation', val: 0.38, type: 'risk' },
          { name: 'Unknown Device', val: 0.22, type: 'risk' }
        ] : [
          { name: 'Trusted Device', val: -0.21, type: 'safe' },
          { name: 'Usual Location', val: -0.15, type: 'safe' },
          { name: 'Amount in Range', val: -0.08, type: 'safe' }
        ]
      });
    }, 1500);
  };

  return (
    <section id="demo" className="py-24 relative overflow-hidden bg-white border-t border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6"
          >
            Test the AI Engine
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            Enter transaction details below to see how our hybrid ensemble model evaluates risk in real-time, providing explainable SHAP values instantly.
          </motion.p>
        </div>

        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden flex flex-col lg:flex-row max-w-5xl mx-auto">
          
          {/* Left Column: Form */}
          <div className="lg:w-1/2 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/50">
            <h3 className="font-semibold text-slate-900 mb-6">Transaction Details</h3>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Amount ($)</label>
                  <input 
                    type="number" 
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Merchant</label>
                  <input 
                    type="text" 
                    value={formData.merchant}
                    onChange={(e) => setFormData({...formData, merchant: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Country Code</label>
                  <input 
                    type="text" 
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value.toUpperCase()})}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Time</label>
                  <input 
                    type="text" 
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Device</label>
                  <select 
                    value={formData.device}
                    onChange={(e) => setFormData({...formData, device: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  >
                    <option>Trusted iPhone</option>
                    <option>Unknown Mobile</option>
                    <option>New Desktop</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Method</label>
                  <select 
                    value={formData.payment}
                    onChange={(e) => setFormData({...formData, payment: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  >
                    <option>Credit Card</option>
                    <option>Apple Pay</option>
                    <option>Wire Transfer</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button onClick={runAnalysis} disabled={analyzing} className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm font-medium">
                {analyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Evaluating...
                  </span>
                ) : (
                  <span>Analyze Transaction</span>
                )}
              </Button>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col min-h-[400px] bg-white">
            
            {!analyzing && !result && (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                <Shield className="w-12 h-12 text-slate-300 mb-4 stroke-[1.5]" />
                <p className="text-sm font-medium text-slate-400">Run analysis to view detailed AI prediction</p>
              </div>
            )}

            {analyzing && (
              <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-sm text-slate-500 font-medium">Running ensemble inference...</p>
              </div>
            )}

            {result && !analyzing && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${result.isFraud ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                      {result.isFraud ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold tracking-tight ${result.isFraud ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {result.isFraud ? 'High Risk Blocked' : 'Transaction Approved'}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Response Time: {result.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Confidence</div>
                    <div className="text-lg font-bold text-slate-900">{(result.confidence * 100).toFixed(1)}%</div>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">AI Risk Score</span>
                    <span className={`text-xl font-bold tracking-tight ${result.isFraud ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {(result.risk * 100).toFixed(1)} / 100
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.risk * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${result.isFraud ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">SHAP Feature Importance</h4>
                  <div className="space-y-4">
                    {result.factors.map((f: any, i: number) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-40 text-xs font-semibold text-slate-700 truncate">{f.name}</div>
                        <div className="flex-1 flex items-center h-1.5 bg-slate-100 rounded-full">
                          <div 
                            className={`h-full rounded-full ${f.type === 'risk' ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                            style={{ 
                              width: `${Math.abs(f.val) * 100}%`,
                              marginLeft: f.type === 'safe' ? 'auto' : '0' 
                            }} 
                          />
                        </div>
                        <div className={`w-12 text-right text-xs font-bold ${f.type === 'risk' ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {f.val > 0 ? '+' : ''}{f.val}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
