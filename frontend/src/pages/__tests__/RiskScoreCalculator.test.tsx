import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RiskScoreCalculator } from '../RiskScoreCalculator';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/core/api/hooks/usePredict', () => ({
  usePredictSingle: () => ({
    mutate: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
    data: null,
  }),
}));

vi.mock('@/core/api/hooks/useExplainability', () => ({
  useTransactionExplanation: () => ({
    data: null,
    isLoading: false,
  }),
}));

const queryClient = new QueryClient();

describe('RiskScoreCalculator Form Validation', () => {
  it('displays validation errors for empty/invalid fields', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RiskScoreCalculator />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const submitBtn = screen.getByRole('button', { name: /Run Fraud Detection/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Enter a valid amount/i)).toBeInTheDocument();
    expect(await screen.findByText(/Merchant is required/i)).toBeInTheDocument();
  });

  it('allows valid submission', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RiskScoreCalculator />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const amountInput = screen.getByLabelText(/Transaction Amount/i);
    const merchantInput = screen.getByLabelText(/Merchant Name/i);

    fireEvent.change(amountInput, { target: { value: '150.00' } });
    fireEvent.change(merchantInput, { target: { value: 'Test Merchant' } });

    const submitBtn = screen.getByRole('button', { name: /Run Fraud Detection/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.queryByText('Enter a valid amount')).not.toBeInTheDocument();
      expect(screen.queryByText('Merchant is required')).not.toBeInTheDocument();
    });
  });
});
