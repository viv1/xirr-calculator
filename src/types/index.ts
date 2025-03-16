export interface InvestmentPlan {
  annualPayment: number;
  paymentYears: number;
  returnAmount: number;
  returnStartYear: number;
  returnYears: number;
  finalReturnYear: number;
  finalReturnAmount: number;
  paymentFrequency: PaymentFrequency;
  returnFrequency: PaymentFrequency;
  taxBracket?: TaxBracket;
}

export interface CashFlow {
  date: Date;
  amount: number;
  description?: string;
}

export interface CalculationResult {
  xirr: number;
  irr: number;
  cagr: number;
  totalInvested: number;
  totalReturns: number;
  netProfit: number;
  taxAdjustedXirr?: number;
  cashflows?: CashFlow[];
}

export interface CashFlowData {
  cashFlows: number[];
  dates: Date[];
}

export enum CalculationType {
  XIRR = 'XIRR',
  IRR = 'IRR',
  CAGR = 'CAGR'
}

export enum PaymentFrequency {
  ANNUAL = 'ANNUAL',
  HALF_YEARLY = 'HALF_YEARLY',
  QUARTERLY = 'QUARTERLY',
  MONTHLY = 'MONTHLY'
}

export enum TaxBracket {
  ZERO = 0,
  FIVE = 0.05,
  TEN = 0.10,
  FIFTEEN = 0.15,
  TWENTY = 0.20,
  TWENTY_FIVE = 0.25,
  THIRTY = 0.30,
  SURCHARGE_FIFTY_LAKHS = 0.33,
  SURCHARGE_ONE_CRORE = 0.35,
  SURCHARGE_TWO_CRORE = 0.37,
  SURCHARGE_FIVE_CRORE = 0.39
} 