import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Play, Loader2, AlertTriangle, CheckCircle2, ArrowRight,
  TrendingUp, TrendingDown, Zap, LayoutDashboard, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemGauge } from '@/components/charts/SystemGauge';
import { StaggerContainer, StaggerItem, FadeIn } from '@/components/motion';
import { usePredictSingle } from '@/core/api/hooks/usePredict';
import { useTransactionExplanation } from '@/core/api/hooks/useExplainability';

// ─── Schema ───────────────────────────────────────────────────────────────────
const calcSchema = z.object({
  Amount:    z.number({ invalid_type_error: 'Enter a valid amount' }).positive('Amount must be positive'),
  Merchant:  z.string().min(1, 'Merchant is required'),
  Category:  z.string().min(1, 'Select a category'),
  Country:   z.string().min(1, 'Select a country'),
  DeviceType: z.string().min(1, 'Select a device type'),
  TimeOfDay: z.string().min(1, 'Select a time of day'),
});

type CalcFields = z.infer<typeof calcSchema>;

const CATEGORIES = [
  'Grocery', 'General Retail', 'Travel', 'Electronics', 'Dining',
  'Crypto Exchange', 'Money Transfer', 'Gambling', 'Healthcare', 'Utilities',
];

const COUNTRIES = ['United States', 'United Kingdom', 'Germany', 'Russia', 'Nigeria', 'Singapore', 'Brazil', 'India', 'China', 'Australia'];

const DEVICES = ['Mobile (iOS)', 'Mobile (Android)', 'Mobile (Unknown Number)'];

const TIME_SLOTS: { label: string; value: string; seconds: number }[] = [
  { label: 'Morning (06:00–12:00)', value: 'morning', seconds: 32400 },
  { label: 'Afternoon (12:00–18:00)', value: 'afternoon', seconds: 54000 },
  { label: 'Evening (18:00–22:00)', value: 'evening', seconds: 72000 },
  { label: 'Late Night (22:00–06:00)', value: 'night', seconds: 82800 },
];

// ─── Risk colours ─────────────────────────────────────────────────────────────
function riskStyles(prob: number) {
  if (prob < 0.15) return { color: '#10b981', label: 'Low Risk',      bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' };
  if (prob < 0.75) return { color: '#f59e0b', label: 'Review Required', bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700' };
  return                { color: '#e11d48', label: 'High Risk',     bg: 'bg-rose-50',    border: 'border-rose-200',    text: 'text-rose-700' };
}

// ─── SHAP bar ─────────────────────────────────────────────────────────────────
function ShapBar({ name, contribution, maxAbs }: { name: string; contribution: number; maxAbs: number }) {
  const pct = maxAbs > 0 ? Math.abs(contribution) / maxAbs * 100 : 0;
  const isPositive = contribution > 0; // positive = increases fraud risk
  const targetColor = isPositive ? '#fb7185' : '#10b981'; // rose-400 / emerald-500
  const targetText = isPositive ? '#e11d48' : '#059669'; // rose-600 / emerald-600

  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-xs text-slate-500 w-36 shrink-0 truncate">{name}</span>
      <div className="flex-1 relative h-5 flex items-center">
        {/* Bar going right (fraud-increasing) or left (fraud-reducing) */}
        <motion.div 
          className="h-2 rounded-full" 
          initial={{ width: '0%', backgroundColor: '#cbd5e1' }} // neutral slate-300
          animate={{ width: `${pct}%`, backgroundColor: targetColor }}
          transition={{ duration: 0.8, ease: "easeOut", backgroundColor: { delay: 0.3, duration: 0.5 } }}
        />
      </div>
      <motion.span 
        initial={{ color: '#94a3b8' }}
        animate={{ color: targetText }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-xs font-bold w-16 text-right"
      >
        {isPositive ? '+' : ''}{contribution.toFixed(3)}
      </motion.span>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        {isPositive
          ? <TrendingUp className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          : <TrendingDown className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
      </motion.div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export const RiskScoreCalculator = () => {
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  const { mutate: predict, isPending, isSuccess, isError, data: predictionData } = usePredictSingle();
  const {
    data: explanationData,
    isLoading: explanationLoading,
  } = useTransactionExplanation(selectedTxId);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CalcFields>({
    resolver: zodResolver(calcSchema),
    defaultValues: {
      Amount: 149.99,
      Merchant: 'Amazon',
      Category: 'General Retail',
      Country: 'United States',
      DeviceType: 'Mobile (iOS)',
      TimeOfDay: 'afternoon',
    },
  });

  const onSubmit = (data: CalcFields) => {
    const timeSlot = TIME_SLOTS.find(t => t.value === data.TimeOfDay);
    predict(
      {
        Amount: data.Amount,
        Merchant: data.Merchant,
        Category: data.Category,
        Time: timeSlot?.seconds ?? 54000,
      },
      {
        onSuccess: (result: any) => {
          const txId = result?.data?.transaction_id;
          if (txId) setSelectedTxId(String(txId));
        },
      }
    );
  };

  const prob        = predictionData?.data?.risk_assessment?.probability ?? 0;
  const gaugeValue  = Math.round(prob * 100);
  const rs          = riskStyles(prob);
  const baseModels  = predictionData?.data?.risk_assessment?.base_models;
  const rawShapFeatures = explanationData?.shap_summary?.features ?? [];
  const shapFeatures = [...rawShapFeatures].sort((a: any, b: any) => Math.abs(b.contribution) - Math.abs(a.contribution));
  const maxAbs       = shapFeatures.length > 0 ? Math.max(...shapFeatures.map((f: any) => Math.abs(f.contribution))) : 1;
  const summary      = explanationData?.summary;

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full gap-6 lg:items-stretch pt-2">
      {/* ── Left: Form ────────────────────────────────────────────────────── */}
      <FadeIn className="lg:w-[400px] shrink-0">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-[#0F766E] text-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/80">Live AI Inference</span>
              </div>
              <h1 className="text-2xl font-bold leading-tight mb-1">Risk Score Calculator</h1>
              <p className="text-sm text-white/70">Submit any transaction — see the ensemble's real probability + SHAP explanation in under 2 seconds.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              {/* Amount */}
              <div className="space-y-1.5">
                <label htmlFor="calc-amount" className="text-sm font-semibold text-slate-700">Transaction Amount ($)</label>
                <input
                  id="calc-amount"
                  type="number"
                  step="0.01"
                  placeholder="299.99"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors placeholder:text-slate-400"
                  aria-describedby={errors.Amount ? "calc-amount-error" : undefined}
                  {...register('Amount', { valueAsNumber: true })}
                />
                {errors.Amount && <p id="calc-amount-error" className="text-xs text-rose-600">{errors.Amount.message}</p>}
              </div>

              {/* Merchant */}
              <div className="space-y-1.5">
                <label htmlFor="calc-merchant" className="text-sm font-semibold text-slate-700">Merchant Name</label>
                <input
                  id="calc-merchant"
                  type="text"
                  placeholder="Apple Store"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors placeholder:text-slate-400"
                  aria-describedby={errors.Merchant ? "calc-merchant-error" : undefined}
                  {...register('Merchant')}
                />
                {errors.Merchant && <p id="calc-merchant-error" className="text-xs text-rose-600">{errors.Merchant.message}</p>}
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label htmlFor="calc-category" className="text-sm font-semibold text-slate-700">Category</label>
                <select
                  id="calc-category"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-colors"
                  {...register('Category')}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* 2-col: Country + Device */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="calc-country" className="text-sm font-semibold text-slate-700">Country</label>
                  <select id="calc-country" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white" {...register('Country')}>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="calc-device" className="text-sm font-semibold text-slate-700">Device</label>
                  <select id="calc-device" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white" {...register('DeviceType')}>
                    {DEVICES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Time of day */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Time of Day</label>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map(slot => (
                    <label
                      key={slot.value}
                      className={`flex items-center gap-2 cursor-pointer p-2.5 rounded-lg border text-xs font-medium transition-all ${
                        watch('TimeOfDay') === slot.value
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <input type="radio" value={slot.value} className="sr-only" {...register('TimeOfDay')} />
                      {slot.label.split(' ')[0]}
                      <span className="text-slate-400">{slot.label.slice(slot.label.indexOf('('))}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 text-base font-bold rounded-xl bg-[#0F766E] hover:bg-[#0F766E]/90 text-white shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysing…</> : <><Play className="w-4 h-4" /> Run Fraud Detection</>}
              </Button>

              {isError && (
                <p className="text-xs text-rose-600 text-center flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Backend unreachable — is the Flask server running?
                </p>
              )}
            </form>
          </div>
        </FadeIn>

        {/* ── Right: Results ────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col">
          <AnimatePresence mode="wait">
            {!isSuccess && !isPending ? (
              /* Idle placeholder */
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-h-[550px] flex flex-col items-center justify-center gap-6 p-12 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                  <Play className="w-8 h-8 text-slate-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">Ready when you are</h2>
                  <p className="text-slate-500 text-sm max-w-xs">
                    Fill out the form and click "Run Fraud Detection"
                  </p>
                </div>
              </motion.div>
            ) : isPending ? (
              /* Loading */
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-h-[550px] flex flex-col items-center justify-center gap-6"
              >
                <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-[#0F766E]" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-700 mb-1">Running through ensemble…</p>
                </div>
              </motion.div>
            ) : (
              /* Results */
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-5"
              >
                {/* Risk Gauge */}
                <div className={`bg-white rounded-3xl border ${rs.border} shadow-sm p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${rs.bg} ${rs.text} border ${rs.border} mb-2`}>
                        {gaugeValue > 50 ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {rs.label}
                      </div>
                      <div className="text-4xl font-bold text-slate-900">{gaugeValue}%</div>
                      <div className="text-sm text-slate-500 mt-0.5">
                        Suggested: <span className="font-semibold text-slate-700">{predictionData?.data?.risk_assessment?.suggested_action}</span>
                      </div>
                    </div>
                    <div className="w-[180px] shrink-0">
                      <SystemGauge name="Risk" value={gaugeValue} color={rs.color} />
                    </div>
                  </div>

                  {/* Base model probabilities */}
                  {baseModels && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Ensemble Base Models</p>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Extra Trees', value: baseModels.extra_trees },
                          { label: 'Keras MLP', value: baseModels.mlp },
                          { label: 'XGBoost Meta', value: prob },
                        ].map(({ label, value }) => (
                          <div key={label} className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className={`text-xl font-bold ${value > 0.5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {(value * 100).toFixed(1)}%
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* SHAP Explanation */}
                <StaggerContainer className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                  <StaggerItem>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-base font-bold text-slate-900">SHAP Feature Contributions</h3>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Info className="w-3 h-3" /> Real model explanation
                      </span>
                    </div>
                  </StaggerItem>

                  {explanationLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                    </div>
                  ) : shapFeatures.length > 0 ? (
                    <>
                      <StaggerItem>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 px-0">
                          <span>Feature</span>
                          <div className="flex gap-6 mr-6">
                            <span className="text-emerald-600">↓ Reduces Risk</span>
                            <span className="text-rose-500">↑ Increases Risk</span>
                          </div>
                        </div>
                      </StaggerItem>
                      {shapFeatures.map((f: any, i: number) => (
                        <StaggerItem key={i}>
                          <ShapBar name={f.name} contribution={f.contribution} maxAbs={maxAbs} />
                        </StaggerItem>
                      ))}
                    </>
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-4">SHAP data loading…</p>
                  )}

                  {/* Plain-language summary */}
                  {summary && (
                    <StaggerItem>
                      <div className={`mt-5 pt-5 border-t border-slate-100 p-4 rounded-xl ${rs.bg} border ${rs.border}`}>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">AI Reasoning</p>
                        <p className={`text-sm leading-relaxed ${rs.text}`}>{summary}</p>
                      </div>
                    </StaggerItem>
                  )}
                </StaggerContainer>

                {/* Navigation CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/dashboard" className="flex-1">
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> Explore Full Dashboard
                    </Button>
                  </Link>
                  <Link to="/explainability" className="flex-1">
                    <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:text-slate-900 flex items-center gap-2">
                      Deep Explainability Studio <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
  );
};
