import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';

export const useTransactions = (page: number = 1, perPage: number = 20) => {
  return useQuery({
    queryKey: ['transactions', page, perPage],
    queryFn: async () => {
      const { data } = await apiClient.get(`/transactions/?page=${page}&per_page=${perPage}`);
      return data.data; // our backend wraps in { success, data, message }
    },
  });
};

export const useReviewTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ txId, action, notes }: { txId: string, action: 'approve' | 'reject', notes?: string }) => {
      const response = await apiClient.put(`/transactions/${txId}/review`, { action, notes });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
    },
  });
};
