import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { InvestmentPlan, CalculationResult, PaymentFrequency, TaxBracket } from '../types';
import { calculateXIRR, calculateIRR, calculateCAGR, generateCashFlows, formatPercentage, calculateRealReturn } from '../utils/financialCalculations';
import {
  Card,
  Subtitle,
  InfoText,
  Button,
  SecondaryButton,
  ResultCard,
  ResultRow,
  ResultLabel,
  ResultValue,
  HighlightValue,
  Badge,
  colors,
  fadeIn
} from './StyledComponents';
import InvestmentForm from './InvestmentForm';

const defaultPlanA: InvestmentPlan = {
  annualPayment: 110000,
  paymentYears: 10,
  returnAmount: 107000,
  returnStartYear: 12,
  returnYears: 10,
  finalReturnYear: 21,
  finalReturnAmount: 1100000,
  paymentFrequency: PaymentFrequency.ANNUAL,
  returnFrequency: PaymentFrequency.ANNUAL,
  taxBracket: TaxBracket.ZERO
};

const defaultPlanB: InvestmentPlan = {
  annualPayment: 100000,
  paymentYears: 12,
  returnAmount: 120000,
  returnStartYear: 13,
  returnYears: 15,
  finalReturnYear: 27,
  finalReturnAmount: 1500000,
  paymentFrequency: PaymentFrequency.ANNUAL,
  returnFrequency: PaymentFrequency.ANNUAL,
  taxBracket: TaxBracket.ZERO
};

interface CompareResult {
  plan: InvestmentPlan;
  result: CalculationResult | null;
  error: string | null;
}

const calculatePlanResult = (plan: InvestmentPlan): { result: CalculationResult | null; error: string | null } => {
  try {
    const { cashFlows, dates } = generateCashFlows(plan);

    const totalInvested = plan.annualPayment * plan.paymentYears;
    let totalRegularReturns = 0;
    if (plan.returnAmount > 0) {
      totalRegularReturns = plan.returnAmount * plan.returnYears;
    }
    const totalReturns = totalRegularReturns + plan.finalReturnAmount;
    const netProfit = totalReturns - totalInvested;

    const xirrValue = calculateXIRR(cashFlows, dates);
    const irrValue = calculateIRR(cashFlows);

    let years = 0;
    if (plan.finalReturnYear > 0) {
      years = plan.finalReturnYear;
    } else if (plan.returnAmount > 0) {
      years = plan.returnStartYear + plan.returnYears - 1;
    } else {
      years = plan.paymentYears;
    }
    const cagrValue = calculateCAGR(totalInvested, totalReturns, years);

    return {
      result: {
        xirr: xirrValue,
        irr: irrValue,
        cagr: cagrValue,
        totalInvested,
        totalReturns,
        netProfit,
      },
      error: null
    };
  } catch (err) {
    return {
      result: null,
      error: err instanceof Error ? err.message : 'Calculation error'
    };
  }
};

const CompareView: React.FC = () => {
  const [planA, setPlanA] = useState<InvestmentPlan>(defaultPlanA);
  const [planB, setPlanB] = useState<InvestmentPlan>(defaultPlanB);
  const [resultA, setResultA] = useState<CompareResult | null>(null);
  const [resultB, setResultB] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const safeFormatPercentage = (value: number): string => {
    if (!isFinite(value) || isNaN(value)) return 'N/A';
    return formatPercentage(value);
  };

  const handleCompare = () => {
    setLoading(true);
    const resA = calculatePlanResult(planA);
    const resB = calculatePlanResult(planB);
    setResultA({ plan: planA, ...resA });
    setResultB({ plan: planB, ...resB });
    setLoading(false);
  };

  const getReturnColor = (value: number): string => {
    if (value < 0.07) return colors.error.main;
    if (value < 0.09) return colors.warning.main;
    return colors.success.main;
  };

  const getBetterStyle = (a: number | undefined, b: number | undefined, higher: boolean = true) => {
    if (a === undefined || b === undefined || isNaN(a) || isNaN(b)) return {};
    const aIsBetter = higher ? a > b : a < b;
    return aIsBetter ? { fontWeight: 700 as const, color: colors.success.dark } : {};
  };

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <Card>
        <Subtitle>Compare Two Plans</Subtitle>
        <InfoText style={{ marginBottom: '1.5rem' }}>
          Enter the details of two insurance/investment plans to compare their actual returns side by side.
        </InfoText>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Plan A */}
          <div>
            <div style={{
              padding: '0.5rem 1rem',
              backgroundColor: colors.primary.main,
              color: colors.neutral.white,
              borderRadius: '8px 8px 0 0',
              fontWeight: 600,
              textAlign: 'center'
            }}>
              Plan A
            </div>
            <div style={{
              border: `2px solid ${colors.primary.main}`,
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              overflow: 'hidden'
            }}>
              <InvestmentForm
                onCalculate={(plan) => setPlanA(plan)}
                onReset={() => setPlanA(defaultPlanA)}
                loading={loading}
                onFormChange={(plan) => setPlanA(plan)}
                currentPlan={planA}
              />
            </div>
          </div>

          {/* Plan B */}
          <div>
            <div style={{
              padding: '0.5rem 1rem',
              backgroundColor: colors.secondary.main,
              color: colors.neutral.white,
              borderRadius: '8px 8px 0 0',
              fontWeight: 600,
              textAlign: 'center'
            }}>
              Plan B
            </div>
            <div style={{
              border: `2px solid ${colors.secondary.main}`,
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              overflow: 'hidden'
            }}>
              <InvestmentForm
                onCalculate={(plan) => setPlanB(plan)}
                onReset={() => setPlanB(defaultPlanB)}
                loading={loading}
                onFormChange={(plan) => setPlanB(plan)}
                currentPlan={planB}
              />
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Button
            onClick={handleCompare}
            style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
            disabled={loading}
          >
            {loading ? 'Comparing...' : 'Compare Plans'}
          </Button>
        </div>

        {/* Comparison Results */}
        {resultA && resultB && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '2rem' }}
          >
            <Subtitle>Comparison Results</Subtitle>

            {(resultA.error || resultB.error) && (
              <InfoText style={{
                color: colors.error.dark,
                backgroundColor: `${colors.error.light}15`,
                padding: '0.75rem',
                borderRadius: '8px',
                border: `1px solid ${colors.error.light}`,
                marginBottom: '1rem'
              }}>
                {resultA.error && <div>Plan A error: {resultA.error}</div>}
                {resultB.error && <div>Plan B error: {resultB.error}</div>}
              </InfoText>
            )}

            {resultA.result && resultB.result && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.9rem'
                }}>
                  <thead>
                    <tr style={{
                      borderBottom: `2px solid ${colors.neutral.light}`,
                    }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', color: colors.neutral.dark }}>Metric</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', color: colors.primary.dark }}>Plan A</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', color: colors.secondary.dark }}>Plan B</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: `1px solid ${colors.neutral.lightest}` }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>XIRR</td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        color: getReturnColor(resultA.result.xirr),
                        ...getBetterStyle(resultA.result.xirr, resultB.result.xirr)
                      }}>
                        {safeFormatPercentage(resultA.result.xirr)}
                      </td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        color: getReturnColor(resultB.result.xirr),
                        ...getBetterStyle(resultB.result.xirr, resultA.result.xirr)
                      }}>
                        {safeFormatPercentage(resultB.result.xirr)}
                      </td>
                    </tr>

                    <tr style={{ borderBottom: `1px solid ${colors.neutral.lightest}` }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>Real Return (6% inflation)</td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        ...getBetterStyle(
                          calculateRealReturn(resultA.result.xirr, 0.06),
                          calculateRealReturn(resultB.result.xirr, 0.06)
                        )
                      }}>
                        {safeFormatPercentage(calculateRealReturn(resultA.result.xirr, 0.06))}
                      </td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        ...getBetterStyle(
                          calculateRealReturn(resultB.result.xirr, 0.06),
                          calculateRealReturn(resultA.result.xirr, 0.06)
                        )
                      }}>
                        {safeFormatPercentage(calculateRealReturn(resultB.result.xirr, 0.06))}
                      </td>
                    </tr>

                    <tr style={{ borderBottom: `1px solid ${colors.neutral.lightest}` }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>IRR</td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        ...getBetterStyle(resultA.result.irr, resultB.result.irr)
                      }}>
                        {safeFormatPercentage(resultA.result.irr)}
                      </td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        ...getBetterStyle(resultB.result.irr, resultA.result.irr)
                      }}>
                        {safeFormatPercentage(resultB.result.irr)}
                      </td>
                    </tr>

                    <tr style={{ borderBottom: `1px solid ${colors.neutral.lightest}` }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>CAGR</td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        ...getBetterStyle(resultA.result.cagr, resultB.result.cagr)
                      }}>
                        {safeFormatPercentage(resultA.result.cagr)}
                      </td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        ...getBetterStyle(resultB.result.cagr, resultA.result.cagr)
                      }}>
                        {safeFormatPercentage(resultB.result.cagr)}
                      </td>
                    </tr>

                    <tr style={{ borderBottom: `1px solid ${colors.neutral.lightest}` }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>Total Invested</td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        ...getBetterStyle(resultA.result.totalInvested, resultB.result.totalInvested, false)
                      }}>
                        {formatCurrency(resultA.result.totalInvested)}
                      </td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        ...getBetterStyle(resultB.result.totalInvested, resultA.result.totalInvested, false)
                      }}>
                        {formatCurrency(resultB.result.totalInvested)}
                      </td>
                    </tr>

                    <tr style={{ borderBottom: `1px solid ${colors.neutral.lightest}` }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>Total Returns</td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        ...getBetterStyle(resultA.result.totalReturns, resultB.result.totalReturns)
                      }}>
                        {formatCurrency(resultA.result.totalReturns)}
                      </td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        ...getBetterStyle(resultB.result.totalReturns, resultA.result.totalReturns)
                      }}>
                        {formatCurrency(resultB.result.totalReturns)}
                      </td>
                    </tr>

                    <tr style={{ borderBottom: `1px solid ${colors.neutral.lightest}` }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>Net Profit</td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        color: resultA.result.netProfit >= 0 ? colors.success.main : colors.error.main,
                        ...getBetterStyle(resultA.result.netProfit, resultB.result.netProfit)
                      }}>
                        {formatCurrency(resultA.result.netProfit)}
                      </td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        color: resultB.result.netProfit >= 0 ? colors.success.main : colors.error.main,
                        ...getBetterStyle(resultB.result.netProfit, resultA.result.netProfit)
                      }}>
                        {formatCurrency(resultB.result.netProfit)}
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>Absolute Return</td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        ...getBetterStyle(
                          resultA.result.netProfit / resultA.result.totalInvested,
                          resultB.result.netProfit / resultB.result.totalInvested
                        )
                      }}>
                        {safeFormatPercentage(resultA.result.netProfit / resultA.result.totalInvested)}
                      </td>
                      <td style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        ...getBetterStyle(
                          resultB.result.netProfit / resultB.result.totalInvested,
                          resultA.result.netProfit / resultA.result.totalInvested
                        )
                      }}>
                        {safeFormatPercentage(resultB.result.netProfit / resultB.result.totalInvested)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Verdict */}
                {isFinite(resultA.result.xirr) && isFinite(resultB.result.xirr) && (
                  <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    backgroundColor: `${colors.success.main}10`,
                    borderRadius: '8px',
                    border: `1px solid ${colors.success.light}`,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: colors.neutral.darkest, marginBottom: '0.5rem' }}>
                      Verdict
                    </div>
                    <div style={{ color: colors.neutral.dark, lineHeight: 1.6 }}>
                      {resultA.result.xirr > resultB.result.xirr ? (
                        <>
                          <strong style={{ color: colors.primary.dark }}>Plan A</strong> has a higher XIRR
                          ({safeFormatPercentage(resultA.result.xirr)} vs {safeFormatPercentage(resultB.result.xirr)}),
                          making it the better choice purely based on returns.
                        </>
                      ) : resultB.result.xirr > resultA.result.xirr ? (
                        <>
                          <strong style={{ color: colors.secondary.dark }}>Plan B</strong> has a higher XIRR
                          ({safeFormatPercentage(resultB.result.xirr)} vs {safeFormatPercentage(resultA.result.xirr)}),
                          making it the better choice purely based on returns.
                        </>
                      ) : (
                        <>Both plans have identical XIRR of {safeFormatPercentage(resultA.result.xirr)}.</>
                      )}
                    </div>
                    <InfoText style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                      Note: XIRR is the most reliable metric for comparison. Also consider liquidity, lock-in period, and your financial goals.
                    </InfoText>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default CompareView;
