import { useState, useCallback } from 'react';
import { 
  calculateIRR, 
  calculateXIRR, 
  calculateCAGR, 
  generateCashFlows 
} from '../utils/financialCalculations';
import { InvestmentPlan, CalculationResult, CashFlowData, PaymentFrequency, TaxBracket, CashFlow } from '../types';

export const useInvestmentCalculator = () => {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [cashFlowData, setCashFlowData] = useState<CashFlowData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate tax-adjusted XIRR
  const calculateTaxAdjustedXIRR = (xirr: number, taxBracket: TaxBracket): number => {
    // For tax-free investments, the tax-adjusted XIRR is the equivalent taxable return
    // that would give the same after-tax return as the tax-free XIRR
    // Formula: taxAdjustedXIRR = xirr / (1 - taxRate)
    if (taxBracket === TaxBracket.ZERO) {
      return xirr; // No adjustment needed if tax rate is 0
    }
    
    return xirr / (1 - taxBracket);
  };

  const calculateReturns = useCallback((plan: InvestmentPlan) => {
    setLoading(true);
    setError(null);
    
    try {
      // Generate cash flows and dates
      const { cashFlows, dates } = generateCashFlows(plan);
      
      setCashFlowData({ cashFlows, dates });
      
      // Calculate total invested and returns
      let totalInvested = plan.annualPayment * plan.paymentYears;
      
      // Calculate total returns based on frequency
      let totalRegularReturns = 0;
      if (plan.returnAmount > 0) {
        totalRegularReturns = plan.returnAmount * plan.returnYears;
      }
      
      const totalReturns = totalRegularReturns + plan.finalReturnAmount;
      const netProfit = totalReturns - totalInvested;
      
      // Calculate XIRR, IRR, and CAGR
      const xirrValue = calculateXIRR(cashFlows, dates);
      const irrValue = calculateIRR(cashFlows);
      
      // For CAGR, we'll use the total invested and total returns
      let years = 0;
      
      if (plan.finalReturnYear > 0) {
        years = plan.finalReturnYear;
      } else if (plan.returnAmount > 0) {
        years = plan.returnStartYear + plan.returnYears - 1;
      } else {
        years = plan.paymentYears;
      }
      
      const cagrValue = calculateCAGR(totalInvested, totalReturns, years);
      
      // Calculate tax-adjusted XIRR if a tax bracket is provided
      const taxAdjustedXirrValue = plan.taxBracket !== undefined 
        ? calculateTaxAdjustedXIRR(xirrValue, plan.taxBracket)
        : undefined;
      
      // Create cashflows array for the detailed breakdown
      const detailedCashflows: CashFlow[] = cashFlows.map((amount, index) => ({
        date: dates[index],
        amount: amount,
        description: amount < 0 ? 'Payment' : 'Return'
      }));
      
      setResult({
        xirr: xirrValue,
        irr: irrValue,
        cagr: cagrValue,
        totalInvested,
        totalReturns,
        netProfit,
        taxAdjustedXirr: taxAdjustedXirrValue,
        cashflows: detailedCashflows
      });
    } catch (err) {
      // Pass through the original error message if it's an Error object
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error calculating investment returns. Please check your inputs.');
      }
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetCalculator = useCallback(() => {
    setResult(null);
    setCashFlowData(null);
    setError(null);
  }, []);

  return {
    result,
    cashFlowData,
    loading,
    error,
    calculateReturns,
    resetCalculator
  };
};

export default useInvestmentCalculator; 