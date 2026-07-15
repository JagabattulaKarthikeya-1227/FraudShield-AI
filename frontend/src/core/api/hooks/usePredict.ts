import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';

export interface PredictPayload {
  Amount: number;
  Merchant: string;
  Category: string;
  [key: string]: string | number;
}

export const usePredictSingle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PredictPayload) => {
      const response = await apiClient.post('/predict/single', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries to immediately update UI
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const usePredictBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post('/predict/batch', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
    },
  });
};
