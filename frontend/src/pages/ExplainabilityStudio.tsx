import React, { useMemo, useState } from 'react';
import { PageHeader } from "@/components/layout/PageHeader";
import { BrainCircuit, Database, Activity, Network, Loader2, Play, RefreshCw, AlertTriangle } from "lucide-react";
import ReactEChartsCore from 'echarts-for-react/lib/core';
import echarts from '@/lib/echarts';
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { usePredictSingle } from "@/core/api/hooks/usePredict";
import { useTransactionExplanation } from "@/core/api/hooks/useExplainability";
import { getReadableFeatureName } from '@/utils/explainabilityGenerator';

interface ShapFeature {
  name: string;
  value: number;
  contribution: number;
}

function buildShapOptions(features: ShapFeature[]) {
  const sorted = [...features].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', position: 'top', splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } }, axisLabel: { color: '#64748b' } },
    yAxis: { type: 'category', axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#475569', fontWeight: 'bold' }, data: sorted.map(f => getReadableFeatureName(f.name)) },
    series: [{ name: 'SHAP Contribution', type: 'bar', data: sorted.map(f => ({ value: f.contribution, itemStyle: { color: f.contribution > 0 ? '#e11d48' : '#0f766e' } })) }],
  };
}

export const ExplainabilityStudio = () => {
  const [datasetIndexInput, setDatasetIndexInput] = useState('');
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const { mutate: predict, isPending, data: predictionData, isSuccess, isError, reset } = usePredictSingle();

  const { data: explanationData, isLoading: explanationLoading, isError: explanationError, refetch } = useTransactionExplanation(selectedTxId);
  const result = predictionData?.data;
  const probability = typeof result?.fraud_probability === 'number' ? result.fraud_probability : null;
  const riskLevel = result?.risk_level;
  const datasetIndex = result?.dataset_index;
  const shapFeatures: ShapFeature[] = explanationData?.shap_summary?.features ?? [];
  const baseModels = result?.base_models ?? {};
  const modelRows = Object.entries(baseModels).filter(([, value]) => typeof value === 'number') as [string, number][];

  const runPrediction = (random = false) => {
    const index = datasetIndexInput.trim();
    if (!random && index !== '' && (!/^\\d+$/.test(index) || !Number.isSafeInteger(Number(index)))) return;
    reset();
    setSelectedTxId(null);
    predict(random || index === '' ? {} : { transaction_index: Number(index) }, {
      onSuccess: (response: any) => {
        const data = response?.data;
        if (data?.transaction_id != null) setSelectedTxId(String(data.transaction_id));
        if (Number.isInteger(data?.dataset_index)) setDatasetIndexInput(String(data.dataset_index));
      },
    });
  };

  const shapOptions = useMemo(() => buildShapOptions(shapFeatures), [shapFeatures]);

  return (
    <div className="space-y-6 pb-12 w-full animate-in fade-in duration-500">
      <PageHeader title="AI Engine & Explainability" description="Predictions and local feature contributions for rows from creditcard.csv." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-700"><BrainCircuit className="w-5 h-5" /></div>
              <h2 className="text-base font-semibold text-slate-900">Dataset Inference</h2>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              The Kaggle creditcard.csv source contains Time, V1–V28, Amount, and Class. It has no merchant or category fields. The backend selects the row and runs the model; this page does not create transaction attributes.
            </p>
            <label htmlFor="dataset-row-index" className="text-xs font-bold text-slate-500 uppercase">Dataset row index</label>
            <input
              id="dataset-row-index"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={datasetIndexInput}
              onChange={e => setDatasetIndexInput(e.target.value)}
              className="w-full mt-1 mb-3 border border-slate-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="Leave blank to let the backend pick a row"
            />
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => runPrediction(false)} disabled={isPending} className="bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-2">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Analyze row
              </Button>
              <Button variant="outline" onClick={() => runPrediction(true)} disabled={isPending} className="flex items-center justify-center gap-2">
                <Database className="w-4 h-4" /> Random row
              </Button>
            </div>
            {isError && <p role="alert" className="text-xs text-rose-600 text-center mt-3">Prediction failed. Check the backend response and dataset availability.</p>}
            {!isPending && isSuccess && result && (
              <div className="mt-5 space-y-3">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-2">Source record</div>
                  <dl className="grid grid-cols-2 gap-y-2 text-sm">
                    <dt className="text-slate-500">Dataset</dt><dd className="text-right font-medium">{result.dataset_source ?? 'creditcard.csv'}</dd>
                    <dt className="text-slate-500">Row index</dt><dd className="text-right font-mono">{datasetIndex ?? 'Not returned'}</dd>
                    <dt className="text-slate-500">Dataset Class</dt><dd className="text-right font-medium">{result.dataset_label ?? 'Not returned'}</dd>
                    <dt className="text-slate-500">Amount</dt><dd className="text-right font-medium">{typeof result.transaction_amount === 'number' ? `$${result.transaction_amount.toFixed(2)}` : 'Not returned'}</dd>
                  </dl>
                </div>
                <div className={`p-4 rounded-lg border ${riskLevel === 'CRITICAL' ? 'bg-rose-50 border-rose-100' : riskLevel === 'LOW' ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                  <div className="text-xs font-bold uppercase text-slate-500 mb-1">Backend model result</div>
                  <div className="text-2xl font-bold text-slate-900">{probability === null ? 'Not returned' : `${(probability * 100).toFixed(1)}%`}</div>
                  <div className="text-sm text-slate-700">Prediction: {result.prediction ?? 'Not returned'} · Risk: {riskLevel ?? 'Not returned'}</div>
                  <div className="text-xs text-slate-600 mt-1">Recommended action: {result.recommended_action ?? 'Not returned'}</div>
                </div>
              </div>
            )}
          </section>

          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-700"><Database className="w-5 h-5" /></div>
              <h2 className="text-base font-semibold text-slate-900">Data Provenance</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              The displayed amount and ground-truth class are read from the selected source row. Risk probability, risk level, action, and SHAP contributions are computed by the backend model from that row. The frontend only formats those returned values and renders the chart.
            </p>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-700"><Network className="w-5 h-5" /></div>
                <h2 className="text-base font-semibold text-slate-900">SHAP Feature Contributions</h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">Backend explanation</span>
            </div>
            <div className="h-[350px]">
              {!isSuccess ? (
                <EmptyState title="No Prediction Yet" description="Analyze a dataset row to request its model explanation." icon={<Network className="w-6 h-6" />} />
              ) : explanationLoading ? (
                <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>
              ) : explanationError ? (
                <div className="flex flex-col items-center justify-center gap-3 p-8 text-center min-h-[200px]">
                  <AlertTriangle className="w-8 h-8 text-rose-500" /><p className="text-sm text-slate-600">Backend did not provide the SHAP explanation.</p>
                  <Button variant="outline" size="sm" onClick={() => refetch()}><RefreshCw className="w-3 h-3 mr-2" />Retry</Button>
                </div>
              ) : shapFeatures.length === 0 ? (
                <EmptyState title="No SHAP Data" description="No SHAP values were returned for this prediction." icon={<Network className="w-6 h-6" />} />
              ) : (
                <ReactEChartsCore echarts={echarts} option={shapOptions} style={{ height: '100%', width: '100%' }} />
              )}
            </div>
            {shapFeatures.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <h3 className="text-sm font-semibold text-slate-700">Largest returned contributions</h3>
                {[...shapFeatures].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)).slice(0, 8).map(feature => (
                  <div key={feature.name} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                    <span className="font-medium">{getReadableFeatureName(feature.name)}</span>
                    <span className={`font-semibold ${feature.contribution > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {feature.contribution > 0 ? '+' : ''}{feature.contribution.toFixed(4)} SHAP
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-700"><Activity className="w-5 h-5" /></div>
              <h2 className="text-base font-semibold text-slate-900">Returned Model Probabilities</h2>
            </div>
            {!isSuccess ? (
              <p className="text-sm text-slate-400 text-center py-8">Analyze a row to display probabilities returned by the backend.</p>
            ) : modelRows.length === 0 ? (
              <p className="text-sm text-slate-600 text-center py-8">The backend did not return per-model probabilities for this prediction.</p>
            ) : (
              <div className="space-y-4">
                {modelRows.map(([name, value]) => (
                  <div key={name}>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
                      <span>{name.replaceAll('_', ' ')}</span><span>{(value * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
