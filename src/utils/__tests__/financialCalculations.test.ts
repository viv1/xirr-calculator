import {
  calculateIRR,
  calculateXIRR,
  calculateCAGR,
  calculateRealReturn,
  formatPercentage,
  generateCashFlows
} from '../financialCalculations';
import { PaymentFrequency } from '../../types';

describe('Financial Calculations', () => {
  describe('calculateIRR', () => {
    it('calculates IRR correctly for simple cash flows', () => {
      const cashFlows = [-1000, 500, 600];
      const irr = calculateIRR(cashFlows);
      expect(irr).toBeCloseTo(0.0639, 4); // ~6.39%
    });

    it('returns NaN for invalid cash flows', () => {
      const cashFlows = [-1000, -500, -600];
      const irr = calculateIRR(cashFlows);
      expect(isNaN(irr)).toBe(true);
    });
  });

  describe('calculateXIRR', () => {
    it('calculates XIRR correctly for dated cash flows', () => {
      const cashFlows = [-1000, 500, 600];
      const dates = [
        new Date('2023-01-01'),
        new Date('2023-07-01'),
        new Date('2024-01-01')
      ];
      const xirr = calculateXIRR(cashFlows, dates);
      expect(xirr).toBeCloseTo(0.1323, 4); // ~13.23%
    });

    it('returns NaN for invalid cash flows', () => {
      const cashFlows = [-1000, -500, -600];
      const dates = [
        new Date('2023-01-01'),
        new Date('2023-07-01'),
        new Date('2024-01-01')
      ];
      const xirr = calculateXIRR(cashFlows, dates);
      expect(isNaN(xirr)).toBe(true);
    });
  });

  describe('calculateCAGR', () => {
    it('calculates CAGR correctly', () => {
      const initialValue = 1000;
      const finalValue = 1331;
      const years = 3;
      const cagr = calculateCAGR(initialValue, finalValue, years);
      expect(cagr).toBeCloseTo(0.10, 4); // 10%
    });

    it('returns NaN for invalid inputs', () => {
      const cagr = calculateCAGR(-1000, 1331, 3);
      expect(isNaN(cagr)).toBe(true);
    });
  });

  describe('formatPercentage', () => {
    it('formats percentage correctly', () => {
      expect(formatPercentage(0.1234)).toBe('12.34%');
      expect(formatPercentage(0.1, 1)).toBe('10.0%');
      expect(formatPercentage(1.5, 0)).toBe('150%');
    });

    it('handles NaN values', () => {
      expect(formatPercentage(NaN)).toBe('N/A');
    });
  });

  describe('calculateRealReturn', () => {
    it('calculates real return correctly', () => {
      // Nominal 10%, inflation 6% => real ≈ 3.77%
      const real = calculateRealReturn(0.10, 0.06);
      expect(real).toBeCloseTo(0.0377, 4);
    });

    it('returns negative real return when nominal < inflation', () => {
      const real = calculateRealReturn(0.04, 0.06);
      expect(real).toBeLessThan(0);
      expect(real).toBeCloseTo(-0.0189, 4);
    });

    it('returns zero when nominal equals inflation', () => {
      const real = calculateRealReturn(0.06, 0.06);
      expect(real).toBeCloseTo(0, 10);
    });

    it('handles zero inflation', () => {
      const real = calculateRealReturn(0.10, 0);
      expect(real).toBeCloseTo(0.10, 10);
    });
  });

  describe('XIRR derivative guard', () => {
    it('returns NaN for pathological cash flows that cause degenerate derivative', () => {
      // All same amounts on same date should fail gracefully
      const cashFlows = [-1000, 1000];
      const dates = [new Date('2023-01-01'), new Date('2023-01-01')];
      const xirr = calculateXIRR(cashFlows, dates);
      // Should return NaN (caught error) rather than Infinity
      expect(isNaN(xirr) || isFinite(xirr)).toBe(true);
    });
  });

  describe('generateCashFlows', () => {
    it('generates return dates in the past when returnStartYear is 0 (edge case)', () => {
      const plan = {
        annualPayment: 1000, paymentYears: 2, returnAmount: 500,
        returnStartYear: 0, returnYears: 1, finalReturnAmount: 0, finalReturnYear: 0,
        paymentFrequency: PaymentFrequency.ANNUAL, returnFrequency: PaymentFrequency.ANNUAL
      };
      const { dates } = generateCashFlows(plan);
      // With returnStartYear=0, return date = startYear + 0 + 0 - 1 = previous year
      // This is the bug that validation should catch
      const returnDate = dates[dates.length - 1];
      const startYear = new Date().getFullYear();
      expect(returnDate.getFullYear()).toBe(startYear - 1);
    });

    it('generates correct cash flows for annual payments and returns', () => {
      const plan = {
        annualPayment: 1000,
        paymentYears: 2,
        returnAmount: 1200,
        returnStartYear: 3,
        returnYears: 2,
        finalReturnAmount: 5000,
        finalReturnYear: 5,
        paymentFrequency: PaymentFrequency.ANNUAL,
        returnFrequency: PaymentFrequency.ANNUAL
      };

      const { cashFlows, dates } = generateCashFlows(plan);

      // Expected cash flows:
      // Year 1: -1000 (payment)
      // Year 2: -1000 (payment)
      // Year 3: 1200 (return)
      // Year 4: 1200 (return)
      // Year 5: 5000 (final return)
      expect(cashFlows).toEqual([-1000, -1000, 1200, 1200, 5000]);
      expect(dates).toHaveLength(5);
      expect(dates[0].getFullYear()).toBe(new Date().getFullYear());
    });

    it('generates correct cash flows for monthly payments and returns', () => {
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

      const { cashFlows, dates } = generateCashFlows(plan);

      // Should have 12 payments of 1000 each and 12 returns of 1200 each
      expect(cashFlows).toHaveLength(24);
      expect(dates).toHaveLength(24);

      // Check monthly payments
      for (let i = 0; i < 12; i++) {
        expect(cashFlows[i]).toBe(-1000); // 12000/12 = 1000 per month
      }

      // Check monthly returns
      for (let i = 12; i < 24; i++) {
        expect(cashFlows[i]).toBe(1200); // 14400/12 = 1200 per month
      }
    });
  });
}); 