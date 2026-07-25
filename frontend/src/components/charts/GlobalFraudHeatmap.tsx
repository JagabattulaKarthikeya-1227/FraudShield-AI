import React, { useState, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Activity, AlertTriangle, ShieldAlert, Target, TrendingUp, TrendingDown, Shield } from 'lucide-react';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Hotspot {
  id: string;
  name: string;
  coordinates: [number, number];
  riskScore: number;
  fraudCount: number;
  trend: 'up' | 'down';
  trendValue: string;
  criticalAlerts: number;
  blocked: number;
  topTypes: string[];
}

const HOTSPOTS: Hotspot[] = [
  { id: 'USA', name: 'United States', coordinates: [-95.7129, 37.0902], riskScore: 91, fraudCount: 842, trend: 'up', trendValue: '+12%', criticalAlerts: 19, blocked: 1205, topTypes: ['Account Takeover', 'Card Not Present'] },
  { id: 'IND', name: 'India', coordinates: [78.9629, 20.5937], riskScore: 87, fraudCount: 712, trend: 'up', trendValue: '+8%', criticalAlerts: 14, blocked: 980, topTypes: ['Identity Theft', 'UPI Fraud'] },
  { id: 'BRA', name: 'Brazil', coordinates: [-51.9253, -14.2350], riskScore: 82, fraudCount: 654, trend: 'down', trendValue: '-3%', criticalAlerts: 11, blocked: 840, topTypes: ['Boleto Fraud', 'Card Cloning'] },
  { id: 'NGA', name: 'Nigeria', coordinates: [8.6753, 9.0820], riskScore: 79, fraudCount: 521, trend: 'up', trendValue: '+14%', criticalAlerts: 9, blocked: 710, topTypes: ['Wire Transfer', 'Phishing'] },
  { id: 'GBR', name: 'United Kingdom', coordinates: [-3.4360, 55.3781], riskScore: 74, fraudCount: 489, trend: 'up', trendValue: '+5%', criticalAlerts: 7, blocked: 620, topTypes: ['Authorized Push Payment', 'CNP'] },
  { id: 'RUS', name: 'Russia', coordinates: [105.3188, 61.5240], riskScore: 85, fraudCount: 602, trend: 'down', trendValue: '-1%', criticalAlerts: 12, blocked: 750, topTypes: ['Botnet Attacks', 'Carding'] },
  { id: 'CHN', name: 'China', coordinates: [104.1954, 35.8617], riskScore: 88, fraudCount: 790, trend: 'up', trendValue: '+9%', criticalAlerts: 16, blocked: 1100, topTypes: ['Synthetic Identity', 'Promo Abuse'] },
  { id: 'SGP', name: 'Singapore', coordinates: [103.8198, 1.3521], riskScore: 42, fraudCount: 112, trend: 'down', trendValue: '-15%', criticalAlerts: 2, blocked: 240, topTypes: ['Phishing', 'Investment Scams'] },
  { id: 'DEU', name: 'Germany', coordinates: [10.4515, 51.1657], riskScore: 55, fraudCount: 230, trend: 'up', trendValue: '+2%', criticalAlerts: 4, blocked: 410, topTypes: ['Friendly Fraud', 'Account Takeover'] },
  { id: 'CAN', name: 'Canada', coordinates: [-106.3468, 56.1304], riskScore: 48, fraudCount: 185, trend: 'down', trendValue: '-5%', criticalAlerts: 3, blocked: 320, topTypes: ['Interac Fraud', 'Identity Theft'] },
];

const getRiskColor = (score: number) => {
  if (score >= 80) return '#ef4444'; // Red
  if (score >= 60) return '#f97316'; // Orange
  if (score >= 40) return '#facc15'; // Yellow
  return '#10b981'; // Green
};

export function GlobalFraudHeatmap() {
  const [selectedCountry, setSelectedCountry] = useState<Hotspot | null>(null);

  // Generate a map of country id to risk score for coloring the base map
  const countryData = useMemo(() => {
    const map: Record<string, number> = {};
    HOTSPOTS.forEach(h => { map[h.id] = h.riskScore; });
    return map;
  }, []);

  const top5 = useMemo(() => {
    return [...HOTSPOTS].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);
  }, []);

  return (
    <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#0F766E]" />
          Global Fraud Heatmap
        </h2>
        <p className="text-sm text-slate-500">Monitor fraud activity across countries in real time.</p>
      </div>

      <div className="relative w-full h-[400px] bg-[#f8faf9]">
        <ComposableMap
          projectionConfig={{ scale: 140 }}
          width={800}
          height={400}
          className="w-full h-full outline-none"
        >
          <ZoomableGroup center={[0, 20]} minZoom={1} maxZoom={4}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const geoId = geo.id; // ISO A3 code
                  const riskScore = countryData[geoId] || 0;
                  const isHotspot = !!countryData[geoId];

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isHotspot ? `${getRiskColor(riskScore)}20` : '#E2E8F0'}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      className="outline-none"
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none', fill: isHotspot ? `${getRiskColor(riskScore)}40` : '#CBD5E1' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {HOTSPOTS.map((hotspot) => {
              const color = getRiskColor(hotspot.riskScore);
              const radius = 4 + (hotspot.fraudCount / 100);

              return (
                <Marker 
                  key={hotspot.id} 
                  coordinates={hotspot.coordinates}
                  onClick={() => setSelectedCountry(hotspot)}
                  data-tooltip-id="fraud-tooltip"
                  data-tooltip-html={`
                    <div class="px-1">
                      <div class="font-bold text-sm mb-1">${hotspot.name}</div>
                      <div class="text-xs text-slate-300">Fraud Cases: <span class="text-white font-semibold">${hotspot.fraudCount}</span></div>
                      <div class="text-xs text-slate-300">Avg Risk Score: <span class="text-white font-semibold">${hotspot.riskScore}%</span></div>
                      <div class="text-xs text-rose-300 mt-1">Critical Alerts: <span class="text-rose-400 font-bold">${hotspot.criticalAlerts}</span></div>
                    </div>
                  `}
                >
                  <g className="cursor-pointer group">
                    {/* Pulsing background circle */}
                    <circle
                      r={radius * 2}
                      fill={color}
                      className="opacity-20 group-hover:opacity-40 transition-opacity"
                    >
                      <animate 
                        attributeName="r" 
                        values={`${radius}; ${radius * 3}; ${radius}`} 
                        dur="2s" 
                        repeatCount="indefinite" 
                      />
                      <animate 
                        attributeName="opacity" 
                        values="0.4; 0; 0.4" 
                        dur="2s" 
                        repeatCount="indefinite" 
                      />
                    </circle>
                    {/* Core marker */}
                    <circle
                      r={radius}
                      fill={color}
                      stroke="#fff"
                      strokeWidth={1}
                      className="transition-transform group-hover:scale-125"
                    />
                  </g>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        <Tooltip 
          id="fraud-tooltip" 
          place="top"
          className="z-50 !bg-slate-900 !text-white !rounded-xl !shadow-lg border border-slate-700/50"
          style={{ padding: '8px 12px' }}
        />
      </div>

      {/* Extra Insights - Top 5 Table */}
      <div className="p-6 border-t border-slate-100 bg-white">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Top 5 Highest Risk Countries</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 rounded-lg">
              <tr>
                <th className="px-4 py-3 rounded-l-lg font-semibold">Country</th>
                <th className="px-4 py-3 font-semibold">Risk Score</th>
                <th className="px-4 py-3 font-semibold">Fraud Count</th>
                <th className="px-4 py-3 rounded-r-lg font-semibold">Trend</th>
              </tr>
            </thead>
            <tbody>
              {top5.map((country) => (
                <tr key={country.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getRiskColor(country.riskScore) }} />
                    {country.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold" style={{ color: getRiskColor(country.riskScore) }}>{country.riskScore}%</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{country.fraudCount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 font-medium ${country.trend === 'up' ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {country.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {country.trendValue}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Click Action Modal */}
      <Dialog open={!!selectedCountry} onOpenChange={(open) => !open && setSelectedCountry(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          {selectedCountry && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100">
                    <Target className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold">{selectedCountry.name}</DialogTitle>
                    <DialogDescription>Fraud Intelligence Report</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 my-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-medium mb-1">Risk Score</div>
                  <div className="text-2xl font-bold" style={{ color: getRiskColor(selectedCountry.riskScore) }}>
                    {selectedCountry.riskScore}%
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-medium mb-1">Total Transactions</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {(selectedCountry.fraudCount * 45).toLocaleString()}
                  </div>
                </div>
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                  <div className="text-xs text-rose-600 font-medium mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Blocked Fraud</div>
                  <div className="text-2xl font-bold text-rose-700">
                    {selectedCountry.blocked.toLocaleString()}
                  </div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <div className="text-xs text-emerald-700 font-medium mb-1 flex items-center gap-1"><Shield className="w-3 h-3" /> Prevention Rate</div>
                  <div className="text-2xl font-bold text-emerald-800">
                    99.8%
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Top Fraud Typologies</h4>
                <div className="space-y-2">
                  {selectedCountry.topTypes.map(type => (
                    <div key={type} className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200">
                      <span className="text-sm font-medium text-slate-700">{type}</span>
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={() => setSelectedCountry(null)} className="px-4 py-2 bg-[#0F766E] text-white rounded-lg text-sm font-semibold hover:bg-[#115E59] transition-colors">
                  Close Report
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
