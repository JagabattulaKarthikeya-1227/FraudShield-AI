import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Play, Loader2, AlertTriangle, CheckCircle2, ArrowRight,
  TrendingUp, TrendingDown, Zap, LayoutDashboard, Info, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemGauge } from '@/components/charts/SystemGauge';
import { StaggerContainer, StaggerItem, FadeIn } from '@/components/motion';
import { usePredictSingle } from '@/core/api/hooks/usePredict';
import { useTransactionExplanation } from '@/core/api/hooks/useExplainability';

// ─── Schema ───────────────────────────────────────────────────────────────────
const calcSchema = z.object({
  transaction_index: z.number({ invalid_type_error: 'Enter a valid numeric ID' })
                      .nonnegative('Must be a positive number')
                      .optional(),
});

type CalcFields = z.infer<typeof calcSchema>;

// ─── Risk colours ─────────────────────────────────────────────────────────────
function riskStyles(level?: string) {
  if (level === 'LOW') return { color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' };
  if (level === 'CRITICAL') return { color: '#e11d48', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' };
  return { color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export const RiskScoreCalculator = () => {
  const { mutate: predict, isPending, isSuccess, isError, data: predictionData, error } = usePredictSingle();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CalcFields>({
    resolver: zodResolver(calcSchema),
  });

  const handlePredictionSuccess = (result: any) => {
    const rowIndex = result?.data?.dataset_index;
    if (Number.isInteger(rowIndex)) setValue('transaction_index', rowIndex);
  };

  const handleRandom = () => {
    // The backend selects a real row from the source dataset.
    predict({}, { onSuccess: handlePredictionSuccess });
  };

  const onSubmit = (data: CalcFields) => {
    const payload = data.transaction_index === undefined
      ? {}
      : { transaction_index: data.transaction_index };
    predict(payload, { onSuccess: handlePredictionSuccess });
  };

  const prob        = predictionData?.data?.fraud_probability ?? 0;
  const gaugeValue  = predictionData?.data?.risk_score ?? 0;
  const rs          = riskStyles(predictionData?.data?.risk_level);
  const txAmount    = predictionData?.data?.transaction_amount;
  const datasetIndex = predictionData?.data?.dataset_index;
  const datasetLabel = predictionData?.data?.dataset_label;

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
              <p className="text-sm text-white/70">Dataset-backed transaction inference</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-2">
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  Select a row from creditcard.csv. The backend reads its 30 model features and dataset label; the ensemble calculates the risk score.
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full text-slate-700 border-slate-300 hover:bg-slate-100"
                  onClick={handleRandom}
                >
                  <Search className="w-4 h-4 mr-2 text-slate-400" />
                  Pick Dataset Row
                </Button>
              </div>

              {/* Transaction Index */}
              <div className="space-y-1.5">
                <label htmlFor="calc-tx" className="text-sm font-semibold text-slate-700">Dataset row index</label>
                <input
                  id="calc-tx"
                  type="number"
                  placeholder="e.g. 10492"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors placeholder:text-slate-400"
                  aria-describedby={errors.transaction_index ? "calc-tx-error" : undefined}
                  {...register('transaction_index', { valueAsNumber: true })}
                />
                {errors.transaction_index && <p id="calc-tx-error" className="text-xs text-rose-600">{errors.transaction_index.message}</p>}
              </div>
              
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 text-base font-bold rounded-xl bg-[#0F766E] hover:bg-[#0F766E]/90 text-white shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing transaction…</> : <><Play className="w-4 h-4" /> Run Fraud Detection</>}
              </Button>

              {isError && (
                <p className="text-xs text-rose-600 text-center flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {(error as any)?.response?.data?.message || "Backend unreachable — is the Flask server running?"}
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
                    Enter a dataset row index or ask the backend to sample a row
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
                  <p className="font-semibold text-slate-700 mb-1">Analyzing transaction...</p>
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
                        {predictionData?.data?.prediction === 'Fraud' ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {predictionData?.data?.risk_level} RISK
                      </div>
                      <div className="text-4xl font-bold text-slate-900">{gaugeValue.toFixed(1)}%</div>
                      <div className="text-sm text-slate-500 mt-1">
                        Amount: <span className="font-semibold text-slate-700">${txAmount?.toFixed(2)}</span>
                        <span className="mx-2 text-slate-300">|</span>
                        Action: <span className="font-semibold text-slate-700">{predictionData?.data?.recommended_action}</span>
                      </div>
                    </div>
                    <div className="w-[180px] shrink-0">
                      <SystemGauge name="Risk" value={gaugeValue} color={rs.color} />
                    </div>
                  </div>
                </div>

                <StaggerContainer className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                  <StaggerItem>
                    <div className="flex items-center gap-2 mb-4">
                      <Info className="w-4 h-4 text-slate-400" />
                      <h3 className="text-base font-bold text-slate-900">Dataset & Model Result</h3>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-slate-500">Source</dt>
                        <dd className="font-medium text-slate-800">{predictionData?.data?.dataset_source ?? '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Dataset row</dt>
                        <dd className="font-medium text-slate-800">{datasetIndex ?? '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Dataset label (ground truth)</dt>
                        <dd className="font-medium text-slate-800">{datasetLabel ?? '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Model prediction</dt>
                        <dd className="font-medium text-slate-800">{predictionData?.data?.prediction ?? '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Backend risk score</dt>
                        <dd className="font-medium text-slate-800">{gaugeValue.toFixed(1)}%</dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Backend recommended action</dt>
                        <dd className="font-medium text-slate-800">{predictionData?.data?.recommended_action ?? '—'}</dd>
                      </div>
                    </dl>
                    <p className="mt-4 text-xs text-slate-500">
                      Transaction inputs and ground-truth label are from the dataset. Risk score, prediction, and action are returned by the backend model; the frontend does not invent metric values.
                    </p>
                  </StaggerItem>
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
