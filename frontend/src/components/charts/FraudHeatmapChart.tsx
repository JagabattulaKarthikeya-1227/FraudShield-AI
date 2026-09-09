import ReactEChartsCore from 'echarts-for-react/lib/core';
import echarts from '@/lib/echarts';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import { FlaskConical } from 'lucide-react';

export const FraudHeatmapChart = () => {
  const { data: responseData, isLoading, isError } = useQuery({
    queryKey: ['fraudHeatmap'],
    queryFn: async () => {
      const response = await apiClient.get('/transactions/heatmap');
      // Return both the heatmap data AND the is_synthetic flag
      return response.data.data as { heatmap: number[][], is_synthetic: boolean };
    }
  });

  if (isLoading) {
    return <div className="h-[350px] w-full flex items-center justify-center text-slate-500">Loading spatial density data...</div>;
  }

  if (isError || !responseData) {
    return <div className="h-[350px] w-full flex items-center justify-center text-red-500">Failed to load heatmap data.</div>;
  }

  const { heatmap: data, is_synthetic } = responseData;

  const hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
    '7a', '8a', '9a','10a','11a', '12p', '1p', '2p', '3p', '4p', '5p',
    '6p', '7p', '8p', '9p', '10p', '11p'];
  const days = ['Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday', 'Sunday'];

  const option = {
    tooltip: { position: 'top' },
    grid: { height: '70%', top: '10%' },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: { show: true },
      axisLabel: { color: 'rgba(255,255,255,0.6)' }
    },
    yAxis: {
      type: 'category',
      data: days,
      splitArea: { show: true },
      axisLabel: { color: 'rgba(255,255,255,0.6)' }
    },
    visualMap: {
      min: 0,
      max: 15,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      inRange: {
        color: ['#0f172a', '#14B8A6', '#0F766E', '#ef4444'] // Dark to Rose
      },
      textStyle: { color: 'rgba(255,255,255,0.6)' }
    },
    series: [{
      name: 'Fraud Incidents',
      type: 'heatmap',
      data: data,
      label: { show: false },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' }
      }
    }],
    backgroundColor: 'transparent'
  };

  return (
    <div className="relative">
      {is_synthetic && (
        <div
          className="absolute top-2 right-2 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                     bg-amber-500/15 text-amber-400 border border-amber-500/30 backdrop-blur-sm"
          title="This chart shows illustrative demo data. Real fraud patterns will appear once declined transactions are recorded."
        >
          <FlaskConical className="w-3 h-3" />
          Demo data — no real transactions yet
        </div>
      )}
      <ReactEChartsCore echarts={echarts} option={option} style={{ height: '350px', width: '100%' }} />
    </div>
  );
};
