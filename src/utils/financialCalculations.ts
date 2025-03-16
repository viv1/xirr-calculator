import { irr } from 'financial';
import { InvestmentPlan, PaymentFrequency } from '../types';

/**
 * Calculate the Internal Rate of Return (IRR) for a series of cash flows
 * @param cashFlows Array of cash flows (negative for outflows, positive for inflows)
 * @returns The IRR as a decimal (multiply by 100 for percentage)
 */
export const calculateIRR = (cashFlows: number[]): number => {
  try {
    return irr(cashFlows);
  } catch (error) {
    console.error('Error calculating IRR:', error);
    return NaN;
  }
};

/**
 * Implementation of XIRR (Extended Internal Rate of Return) calculation
 * @param values Array of cash flow values (negative for outflows, positive for inflows)
 * @param dates Array of dates corresponding to each cash flow
 * @param guess Initial guess for the rate (default: 0.1 or 10%)
 * @returns The XIRR as a decimal (multiply by 100 for percentage)
 */
const xirr = (values: number[], dates: Date[], guess: number = 0.1): number => {
  // Check if arrays are of the same length
  if (values.length !== dates.length) {
    throw new Error('Values and dates arrays must be of the same length');
  }
  
  // Check if we have at least one positive and one negative value
  let hasPositive = false;
  let hasNegative = false;
  
  for (const value of values) {
    if (value > 0) hasPositive = true;
    if (value < 0) hasNegative = true;
    if (hasPositive && hasNegative) break;
  }
  
  if (!hasPositive || !hasNegative) {
    throw new Error('XIRR requires at least one positive and one negative value');
  }
  
  // Sort dates and values together (earliest date first)
  const pairs = dates.map((date, i) => ({ date, value: values[i] }));
  pairs.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const sortedDates = pairs.map(pair => pair.date);
  const sortedValues = pairs.map(pair => pair.value);
  
  // Convert dates to days from first date
  const firstDate = sortedDates[0];
  const daysDiff = sortedDates.map(date => 
    (date.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Newton-Raphson method to find the rate
  const maxIterations = 100;
  const precision = 1e-10;
  
  let rate = guess;
  
  for (let i = 0; i < maxIterations; i++) {
    // Calculate f(rate) and f'(rate)
    let f = 0;
    let derivative = 0;
    
    for (let j = 0; j < sortedValues.length; j++) {
      const dayFraction = daysDiff[j] / 365;
      const factor = Math.pow(1 + rate, dayFraction);
      f += sortedValues[j] / factor;
      derivative -= dayFraction * sortedValues[j] / (factor * (1 + rate));
    }
    
    // Calculate next rate
    const newRate = rate - f / derivative;
    
    // Check for convergence
    if (Math.abs(newRate - rate) < precision) {
      return newRate;
    }
    
    rate = newRate;
  }
  
  throw new Error('XIRR did not converge');
};

/**
 * Calculate the Extended Internal Rate of Return (XIRR) for a series of cash flows with dates
 * @param cashFlows Array of cash flows (negative for outflows, positive for inflows)
 * @param dates Array of dates corresponding to each cash flow
 * @returns The XIRR as a decimal (multiply by 100 for percentage)
 */
export const calculateXIRR = (cashFlows: number[], dates: Date[]): number => {
  try {
    return xirr(cashFlows, dates);
  } catch (error) {
    console.error('Error calculating XIRR:', error);
    return NaN;
  }
};

/**
 * Calculate the Compound Annual Growth Rate (CAGR)
 * @param initialValue Initial investment value
 * @param finalValue Final investment value
 * @param years Number of years
 * @returns The CAGR as a decimal (multiply by 100 for percentage)
 */
export const calculateCAGR = (
  initialValue: number,
  finalValue: number,
  years: number
): number => {
  try {
    if (initialValue <= 0 || years <= 0) {
      throw new Error('Initial value and years must be positive');
    }
    return Math.pow(finalValue / initialValue, 1 / years) - 1;
  } catch (error) {
    console.error('Error calculating CAGR:', error);
    return NaN;
  }
};

/**
 * Format a decimal as a percentage string
 * @param value Decimal value
 * @param decimalPlaces Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimalPlaces: number = 2): string => {
  if (isNaN(value)) return 'N/A';
  return `${(value * 100).toFixed(decimalPlaces)}%`;
};

/**
 * Generate cash flows and dates for ULIP or guaranteed income plans
 * @param plan Investment plan details
 * @returns Object containing cash flows and dates arrays
 */
export const generateCashFlows = (plan: InvestmentPlan): { cashFlows: number[]; dates: Date[] } => {
  const {
    annualPayment,
    paymentYears,
    returnAmount,
    returnStartYear,
    returnYears,
    finalReturnYear,
    finalReturnAmount,
    paymentFrequency,
    returnFrequency
  } = plan;
  
  const cashFlows: number[] = [];
  const dates: Date[] = [];
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01`); // Set start date to January 1 of current year
  
  // Add payments (negative cash flows)
  if (paymentFrequency === PaymentFrequency.ANNUAL) {
    // Annual payments
    for (let i = 0; i < paymentYears; i++) {
      cashFlows.push(-annualPayment);
      const paymentDate = new Date(startDate);
      paymentDate.setFullYear(startDate.getFullYear() + i);
      dates.push(paymentDate);
    }
  } else if (paymentFrequency === PaymentFrequency.HALF_YEARLY) {
    // Half-yearly payments
    const halfYearlyPayment = annualPayment / 2;
    for (let i = 0; i < paymentYears * 2; i++) {
      cashFlows.push(-halfYearlyPayment);
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(startDate.getMonth() + i * 6);
      dates.push(paymentDate);
    }
  } else if (paymentFrequency === PaymentFrequency.QUARTERLY) {
    // Quarterly payments
    const quarterlyPayment = annualPayment / 4;
    for (let i = 0; i < paymentYears * 4; i++) {
      cashFlows.push(-quarterlyPayment);
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(startDate.getMonth() + i * 3);
      dates.push(paymentDate);
    }
  } else {
    // Monthly payments
    const monthlyPayment = annualPayment / 12;
    for (let i = 0; i < paymentYears * 12; i++) {
      cashFlows.push(-monthlyPayment);
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(startDate.getMonth() + i);
      dates.push(paymentDate);
    }
  }
  
  // Add returns (positive cash flows)
  if (returnAmount > 0) {
    if (returnFrequency === PaymentFrequency.ANNUAL) {
      // Annual returns
      for (let i = 0; i < returnYears; i++) {
        cashFlows.push(returnAmount);
        const returnDate = new Date(startDate);
        returnDate.setFullYear(startDate.getFullYear() + returnStartYear + i - 1);
        dates.push(returnDate);
      }
    } else if (returnFrequency === PaymentFrequency.HALF_YEARLY) {
      // Half-yearly returns
      const halfYearlyReturn = returnAmount / 2;
      for (let i = 0; i < returnYears * 2; i++) {
        cashFlows.push(halfYearlyReturn);
        const returnDate = new Date(startDate);
        returnDate.setMonth(startDate.getMonth() + (returnStartYear - 1) * 12 + i * 6);
        dates.push(returnDate);
      }
    } else if (returnFrequency === PaymentFrequency.QUARTERLY) {
      // Quarterly returns
      const quarterlyReturn = returnAmount / 4;
      for (let i = 0; i < returnYears * 4; i++) {
        cashFlows.push(quarterlyReturn);
        const returnDate = new Date(startDate);
        returnDate.setMonth(startDate.getMonth() + (returnStartYear - 1) * 12 + i * 3);
        dates.push(returnDate);
      }
    } else {
      // Monthly returns
      const monthlyReturn = returnAmount / 12;
      for (let i = 0; i < returnYears * 12; i++) {
        cashFlows.push(monthlyReturn);
        const returnDate = new Date(startDate);
        // Convert to months: (returnStartYear - 1) * 12 + i
        returnDate.setMonth(startDate.getMonth() + (returnStartYear - 1) * 12 + i);
        dates.push(returnDate);
      }
    }
  }
  
  // Add final return if applicable
  if (finalReturnAmount > 0 && finalReturnYear > 0) {
    cashFlows.push(finalReturnAmount);
    const finalReturnDate = new Date(startDate);
    finalReturnDate.setFullYear(startDate.getFullYear() + finalReturnYear - 1);
    dates.push(finalReturnDate);
  }
  
  return { cashFlows, dates };
}; 