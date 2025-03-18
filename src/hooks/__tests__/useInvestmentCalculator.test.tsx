import { renderHook, act } from '@testing-library/react';
import { useInvestmentCalculator } from '../useInvestmentCalculator';
import { PaymentFrequency, TaxBracket } from '../../types';
import * as financialCalculations from '../../utils/financialCalculations';
import { vi, describe, it, expect } from 'vitest';

describe('useInvestmentCalculator', () => {
  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useInvestmentCalculator());

    expect(result.current.result).toBeNull();
    expect(result.current.cashFlowData).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('calculates returns correctly for a simple investment plan', async () => {
    const { result } = renderHook(() => useInvestmentCalculator());

    const plan = {
      annualPayment: 10000,
      paymentYears: 2,
      returnAmount: 12000,
      returnStartYear: 3,
      returnYears: 2,
      finalReturnAmount: 50000,
      finalReturnYear: 5,
      paymentFrequency: PaymentFrequency.ANNUAL,
      returnFrequency: PaymentFrequency.ANNUAL,
      taxBracket: TaxBracket.THIRTY
    };

    await act(async () => {
      result.current.calculateReturns(plan);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.result).not.toBeNull();

    if (result.current.result) {
      expect(result.current.result.totalInvested).toBe(20000);
      expect(result.current.result.totalReturns).toBe(74000);
      expect(result.current.result.netProfit).toBe(54000);
      expect(result.current.result.cashflows).toHaveLength(5);
      expect(typeof result.current.result.xirr).toBe('number');
      expect(typeof result.current.result.irr).toBe('number');
      expect(typeof result.current.result.cagr).toBe('number');
      expect(typeof result.current.result.taxAdjustedXirr).toBe('number');
    }
  });

  it('handles monthly payments and returns correctly', async () => {
    const { result } = renderHook(() => useInvestmentCalculator());

    const plan = {
      annualPayment: 12000,
      paymentYears: 1,
      returnAmount: 14400,
      returnStartYear: 2,
      returnYears: 1,
      finalReturnAmount: 0,
      finalReturnYear: 0,
      paymentFrequency: PaymentFrequency.MONTHLY,
      returnFrequency: PaymentFrequency.MONTHLY
    };

    await act(async () => {
      result.current.calculateReturns(plan);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.result).not.toBeNull();

    if (result.current.result) {
      expect(result.current.result.totalInvested).toBe(12000);
      expect(result.current.result.totalReturns).toBe(14400);
      expect(result.current.result.netProfit).toBe(2400);
      expect(result.current.result.cashflows).toHaveLength(24); // 12 payments + 12 returns
    }
  });

  it('handles errors gracefully', async () => {
    const { result } = renderHook(() => useInvestmentCalculator());

    // Mock the calculateXIRR function to throw an error
    const spy = vi.spyOn(financialCalculations, 'calculateXIRR').mockImplementation(() => {
      throw new Error('XIRR requires at least one positive and one negative value');
    });

    const plan = {
      annualPayment: 1000,
      paymentYears: 1,
      returnAmount: 1200,
      returnStartYear: 2,
      returnYears: 1,
      finalReturnAmount: 0,
      finalReturnYear: 0,
      paymentFrequency: PaymentFrequency.ANNUAL,
      returnFrequency: PaymentFrequency.ANNUAL
    };

    await act(async () => {
      result.current.calculateReturns(plan);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('XIRR requires at least one positive and one negative value');
    expect(result.current.result).toBeNull();

    // Restore the original function
    spy.mockRestore();
  });

  it('resets calculator state correctly', async () => {
    const { result } = renderHook(() => useInvestmentCalculator());

    const plan = {
      annualPayment: 10000,
      paymentYears: 2,
      returnAmount: 12000,
      returnStartYear: 3,
      returnYears: 2,
      finalReturnAmount: 50000,
      finalReturnYear: 5,
      paymentFrequency: PaymentFrequency.ANNUAL,
      returnFrequency: PaymentFrequency.ANNUAL
    };

    await act(async () => {
      result.current.calculateReturns(plan);
    });

    expect(result.current.result).not.toBeNull();

    act(() => {
      result.current.resetCalculator();
    });

    expect(result.current.result).toBeNull();
    expect(result.current.cashFlowData).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('calculates tax-adjusted XIRR correctly', async () => {
    const { result } = renderHook(() => useInvestmentCalculator());

    const plan = {
      annualPayment: 10000,
      paymentYears: 2,
      returnAmount: 12000,
      returnStartYear: 3,
      returnYears: 2,
      finalReturnAmount: 50000,
      finalReturnYear: 5,
      paymentFrequency: PaymentFrequency.ANNUAL,
      returnFrequency: PaymentFrequency.ANNUAL,
      taxBracket: TaxBracket.THIRTY // 30% tax bracket
    };

    await act(async () => {
      result.current.calculateReturns(plan);
    });

    expect(result.current.result).not.toBeNull();

    if (result.current.result && result.current.result.xirr && result.current.result.taxAdjustedXirr) {
      // Tax-adjusted XIRR should be higher than regular XIRR
      // For 30% tax bracket: taxAdjustedXirr = xirr / (1 - 0.3)
      const expectedTaxAdjustedXirr = result.current.result.xirr / (1 - 0.3);
      expect(result.current.result.taxAdjustedXirr).toBeCloseTo(expectedTaxAdjustedXirr, 4);
    }
  });
}); 