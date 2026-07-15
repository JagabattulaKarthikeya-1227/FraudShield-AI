import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';

export const useKPIs = () => {
  return useQuery({
    queryKey: ['telemetry_kpi'],
    queryFn: async () => {
      const { data } = await apiClient.get('/telemetry/kpi');
      return data.data;
    },
    refetchInterval: 30000, // Live polling every 30 seconds
  });
};

export const useTrends = () => {
  return useQuery({
    queryKey: ['telemetry_trends'],
    queryFn: async () => {
      const { data } = await apiClient.get('/telemetry/trends');
      return data.data;
    },
    refetchInterval: 60000,
  });
};

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['telemetry_health'],
    queryFn: async () => {
      const { data } = await apiClient.get('/telemetry/health');
      return data.data;
    },
    refetchInterval: 15000, // High frequency for gauges
  });
};
