/**
 * URL utilities for generating and parsing short URLs for sharing
 */

import { InvestmentPlan, PaymentFrequency, TaxBracket } from '../types';

// Parameters to include in short URL to save space
const shortUrlParamKeys = [
  'ap',  // annualPayment
  'py',  // paymentYears
  'ra',  // returnAmount
  'rsy', // returnStartYear
  'ry',  // returnYears
  'fry', // finalReturnYear
  'fra', // finalReturnAmount
  'pf',  // paymentFrequency
  'rf',  // returnFrequency
  'tx',  // taxBracket
];

// Mapping between full parameter names and their short versions
const paramMap: Record<string, string> = {
  'annualPayment': 'ap',
  'paymentYears': 'py',
  'returnAmount': 'ra',
  'returnStartYear': 'rsy',
  'returnYears': 'ry',
  'finalReturnYear': 'fry',
  'finalReturnAmount': 'fra',
  'paymentFrequency': 'pf',
  'returnFrequency': 'rf',
  'taxBracket': 'tx',
};

// Reverse mapping from short to full parameter names
const reverseParamMap: Record<string, string> = Object.entries(paramMap)
  .reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {});

// Map PaymentFrequency enum to shorter values
const frequencyMap: Record<PaymentFrequency, string> = {
  [PaymentFrequency.ANNUAL]: 'a',
  [PaymentFrequency.HALF_YEARLY]: 'h',
  [PaymentFrequency.QUARTERLY]: 'q',
  [PaymentFrequency.MONTHLY]: 'm',
};

// Reverse mapping from short frequency to PaymentFrequency enum
const reverseFrequencyMap: Record<string, PaymentFrequency> = Object.entries(frequencyMap)
  .reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {}) as Record<string, PaymentFrequency>;

/**
 * Generate a short URL for sharing the current calculation
 * @param plan The investment plan to encode in the URL
 * @returns A short URL string
 */
export const generateShortUrl = (plan: InvestmentPlan): string => {
  const params = new URLSearchParams();
  
  // Convert InvestmentPlan to short parameter names
  if (plan.annualPayment) params.set('ap', plan.annualPayment.toString());
  if (plan.paymentYears) params.set('py', plan.paymentYears.toString());
  if (plan.returnAmount) params.set('ra', plan.returnAmount.toString());
  if (plan.returnStartYear) params.set('rsy', plan.returnStartYear.toString());
  if (plan.returnYears) params.set('ry', plan.returnYears.toString());
  if (plan.finalReturnYear) params.set('fry', plan.finalReturnYear.toString());
  if (plan.finalReturnAmount) params.set('fra', plan.finalReturnAmount.toString());
  
  // Use single-letter codes for frequencies
  if (plan.paymentFrequency) {
    params.set('pf', frequencyMap[plan.paymentFrequency]);
  }
  
  if (plan.returnFrequency) {
    params.set('rf', frequencyMap[plan.returnFrequency]);
  }
  
  // Convert tax bracket to number value
  if (plan.taxBracket !== undefined) {
    params.set('tx', plan.taxBracket.toString());
  }
  
  // Create the complete URL with the origin and pathname from the current window location
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  return `${baseUrl}?${params.toString()}`;
};

/**
 * Parse URL parameters into an investment plan
 * @param url The URL to parse (defaults to current window location)
 * @returns A partial investment plan populated from the URL parameters
 */
export const parseUrlParams = (url?: string): Partial<InvestmentPlan> => {
  const params = new URLSearchParams(url || window.location.search);
  const plan: Partial<InvestmentPlan> = {};
  
  // Check for short format parameters first
  for (const [shortKey, fullKey] of Object.entries(reverseParamMap)) {
    const value = params.get(shortKey);
    
    if (value !== null) {
      // Handle frequency parameters
      if (shortKey === 'pf' || shortKey === 'rf') {
        const frequencyValue = reverseFrequencyMap[value];
        if (frequencyValue) {
          (plan as any)[fullKey] = frequencyValue;
        }
      } 
      // Handle tax bracket (stored as number)
      else if (shortKey === 'tx') {
        (plan as any)[fullKey] = parseFloat(value);
      }
      // Handle numeric parameters
      else {
        (plan as any)[fullKey] = parseFloat(value);
      }
    }
  }
  
  // If no short parameters found, try the full parameter names (backward compatibility)
  if (Object.keys(plan).length === 0) {
    // Parse numeric values
    ['annualPayment', 'paymentYears', 'returnAmount', 'returnStartYear', 
     'returnYears', 'finalReturnYear', 'finalReturnAmount'].forEach(key => {
      const value = params.get(key);
      if (value !== null) {
        (plan as any)[key] = parseFloat(value);
      }
    });
    
    // Parse payment frequency
    const paymentFreq = params.get('paymentFrequency');
    if (paymentFreq && Object.values(PaymentFrequency).includes(paymentFreq as PaymentFrequency)) {
      plan.paymentFrequency = paymentFreq as PaymentFrequency;
    }
    
    // Parse return frequency
    const returnFreq = params.get('returnFrequency');
    if (returnFreq && Object.values(PaymentFrequency).includes(returnFreq as PaymentFrequency)) {
      plan.returnFrequency = returnFreq as PaymentFrequency;
    }
    
    // Parse tax bracket
    const taxBracket = params.get('taxBracket');
    if (taxBracket !== null) {
      plan.taxBracket = parseFloat(taxBracket) as TaxBracket;
    }
  }
  
  return plan;
};

/**
 * Determines if the URL uses the short format or the full format
 * @returns True if the URL uses short parameters, false otherwise
 */
export const isShortUrlFormat = (): boolean => {
  const params = new URLSearchParams(window.location.search);
  return shortUrlParamKeys.some(key => params.has(key));
};

/**
 * Toggle between short and full URL formats
 * @param plan The investment plan
 * @param useShortFormat Whether to use the short format (true) or full format (false)
 * @returns URL string in either short or full format
 */
export const toggleUrlFormat = (plan: InvestmentPlan, useShortFormat: boolean): string => {
  if (useShortFormat) {
    return generateShortUrl(plan);
  } else {
    // Generate full format URL
    const params = new URLSearchParams();
    
    if (plan.annualPayment) params.set('annualPayment', plan.annualPayment.toString());
    if (plan.paymentYears) params.set('paymentYears', plan.paymentYears.toString());
    if (plan.returnAmount) params.set('returnAmount', plan.returnAmount.toString());
    if (plan.returnStartYear) params.set('returnStartYear', plan.returnStartYear.toString());
    if (plan.returnYears) params.set('returnYears', plan.returnYears.toString());
    if (plan.finalReturnYear) params.set('finalReturnYear', plan.finalReturnYear.toString());
    if (plan.finalReturnAmount) params.set('finalReturnAmount', plan.finalReturnAmount.toString());
    
    if (plan.paymentFrequency) {
      params.set('paymentFrequency', plan.paymentFrequency);
    }
    
    if (plan.returnFrequency) {
      params.set('returnFrequency', plan.returnFrequency);
    }
    
    if (plan.taxBracket !== undefined) {
      params.set('taxBracket', plan.taxBracket.toString());
    }
    
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    return `${baseUrl}?${params.toString()}`;
  }
}; 