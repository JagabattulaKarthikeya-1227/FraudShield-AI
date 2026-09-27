import { Activity, Database } from 'lucide-react';

export function GlobalFraudHeatmap() {
  return (
    <section
      aria-labelledby="global-fraud-heatmap-title"
      className="flex h-full flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm"
    >
      <header className="border-b border-slate-100 bg-slate-50/50 p-6">
        <h2
          id="global-fraud-heatmap-title"
          className="mb-1 flex items-center gap-2 text-lg font-bold text-slate-900"
        >
          <Activity className="h-5 w-5 text-[#0F766E]" />
          Global Fraud Heatmap
        </h2>
        <p className="text-sm text-slate-500">Location-based fraud insights.</p>
      </header>

      <div
        role="status"
        className="flex min-h-[400px] flex-1 items-center justify-center bg-[#f8faf9] p-8 text-center"
      >
        <div className="max-w-md">
          <Database className="mx-auto mb-4 h-8 w-8 text-slate-400" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-800">
            Geographic data unavailable
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The current transaction records do not include country or location
            fields. No geographic fraud figures are displayed until those fields
            are available from the dataset.
          </p>
        </div>
      </div>
    </section>
  );
}
