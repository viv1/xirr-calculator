import React, { ReactElement, useState } from 'react';
import { motion } from 'framer-motion';
import { CalculationResult, TaxBracket, CashFlow, InvestmentPlan } from '../types';
import { formatPercentage } from '../utils/financialCalculations';
import {
  ResultsContainer,
  ResultCard,
  ResultRow,
  ResultLabel,
  ResultValue,
  HighlightValue,
  Subtitle,
  Card,
  InfoText,
  slideUp,
  staggerContainer,
  colors,
  Badge,
  Button,
  CollapsibleHeader
} from './StyledComponents';
import ShareOptions from './ShareOptions';

interface ResultsDisplayProps {
  result: CalculationResult | null;
  onTabChange?: (tab: string) => void;
  hasChanges?: boolean;
  plan: InvestmentPlan;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onTabChange, hasChanges = false, plan }) => {
  const [showYearwiseBreakdown, setShowYearwiseBreakdown] = useState(false);
  
  if (!result) return null;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Safe format percentage to handle Infinity and NaN
  const safeFormatPercentage = (value: number): string => {
    if (!isFinite(value) || isNaN(value)) {
      return "N/A";
    }
    return formatPercentage(value);
  };

  const getReturnColor = (value: number): string => {
    if (value < 0.07) return colors.error.main;
    if (value < 0.09) return colors.warning.main;
    return colors.success.main;
  };

  const getComparisonText = (xirrValue: number): string => {
    if (xirrValue < 0.07) {
      return 'This return is lower than most fixed deposits (5-9%) and significantly lower than index funds (10-12%).';
    } else if (xirrValue < 0.09) {
      return 'This return is comparable to fixed deposits but lower than index funds (10-12%).';
    } else if (xirrValue < 0.12) {
      return 'This return is better than fixed deposits and comparable to PPF (7.1%), but still lower than index funds (10-12%).';
    } else {
      return 'This return is competitive with most investment options including PPF and matching or exceeding index fund returns (10-12%).';
    }
  };

  const getRatingBadge = (value: number): ReactElement => {
    let rating: string;
    let color: string;
    
    if (value < 0.07) {
      rating = 'Poor';
      color = colors.error.main;
    } else if (value < 0.09) {
      rating = 'Average';
      color = colors.warning.main;
    } else if (value < 0.12) {
      rating = 'Good';
      color = colors.success.light;
    } else {
      rating = 'Excellent';
      color = colors.success.main;
    }
    
    return <Badge color={color}>{rating}</Badge>;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Group cashflows by year for the yearwise breakdown
  const cashflowsByYear: Record<number, { payments: CashFlow[], returns: CashFlow[] }> = {};
  
  if (result.cashflows) {
    // Find the min and max years
    let minYear = Number.MAX_SAFE_INTEGER;
    let maxYear = Number.MIN_SAFE_INTEGER;
    
    result.cashflows.forEach(cf => {
      const year = new Date(cf.date).getFullYear();
      minYear = Math.min(minYear, year);
      maxYear = Math.max(maxYear, year);
    });
    
    // Initialize all years, even those without cash flows
    for (let year = minYear; year <= maxYear; year++) {
      cashflowsByYear[year] = { payments: [], returns: [] };
    }
    
    // Populate with actual cash flows
    result.cashflows.forEach(cf => {
      const year = new Date(cf.date).getFullYear();
      
      if (cf.amount < 0) {
        cashflowsByYear[year].payments.push(cf);
      } else {
        cashflowsByYear[year].returns.push(cf);
      }
    });
  }

  return (
    <ResultsContainer>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '0.75rem',
            marginBottom: hasChanges ? '0.5rem' : '0' 
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <Subtitle style={{ margin: 0 }}>
                Investment Returns Analysis
                {getRatingBadge(result.xirr)}
              </Subtitle>
              <ShareOptions compact={true} plan={plan} />
            </div>
          </div>
          
          {hasChanges && (
            <div style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: colors.warning.light + '20',
              borderRadius: '8px',
              border: `1px solid ${colors.warning.light}`,
              marginBottom: '1rem',
              textAlign: 'center',
              color: colors.warning.dark,
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              You've made changes. Click "Calculate XIRR" to update results.
            </div>
          )}
          
          <ResultCard className="result-card">
            <ResultRow>
              <ResultLabel className="result-label">
                XIRR (Extended Internal Rate of Return)
                {onTabChange && (
                  <span 
                    style={{ 
                      fontSize: '0.8rem', 
                      marginLeft: '0.5rem', 
                      cursor: 'pointer',
                      color: colors.primary.main,
                      textDecoration: 'underline'
                    }}
                    onClick={() => onTabChange('info')}
                  >
                    What's this?
                  </span>
                )}
              </ResultLabel>
              <HighlightValue className="highlight-value" style={{ color: getReturnColor(result.xirr) }}>
                {safeFormatPercentage(result.xirr)}
              </HighlightValue>
            </ResultRow>
            
            <InfoText>
              XIRR is the most accurate measure of return for investments with irregular cash flows. 
              It takes into account the timing of each payment and return, providing a true annualized return rate.
              {onTabChange && (
                <span 
                  style={{ 
                    marginLeft: '0.5rem', 
                    cursor: 'pointer',
                    color: colors.primary.main,
                    textDecoration: 'underline'
                  }}
                  onClick={() => {
                    onTabChange('info');
                    setTimeout(() => {
                      const element = document.getElementById('xirr-explanation');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                >
                  Learn more about XIRR
                </span>
              )}
            </InfoText>
            
            <Button
              onClick={() => {
                setShowYearwiseBreakdown(true);
                const cashFlowSection = document.getElementById('cash-flow-section');
                if (cashFlowSection) {
                  cashFlowSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              style={{
                backgroundColor: colors.primary.main,
                color: colors.neutral.white,
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.9rem',
                padding: '0.5rem 1rem'
              }}
            >
              <span role="img" aria-label="chart">📊</span> View Year-by-Year Cash Flow
            </Button>
            
            {result.taxAdjustedXirr !== undefined && result.taxAdjustedXirr !== result.xirr && (
              <>
                <ResultRow>
                  <ResultLabel>
                    Tax-Adjusted Equivalent Return
                    {onTabChange && (
                      <span 
                        style={{ 
                          fontSize: '0.8rem', 
                          marginLeft: '0.5rem', 
                          cursor: 'pointer',
                          color: colors.primary.main,
                          textDecoration: 'underline'
                        }}
                        onClick={() => onTabChange('tax')}
                      >
                        What's this?
                      </span>
                    )}
                  </ResultLabel>
                  <HighlightValue style={{ 
                    color: getReturnColor(result.taxAdjustedXirr),
                    fontSize: '1.2rem'
                  }}>
                    {safeFormatPercentage(result.taxAdjustedXirr)}
                  </HighlightValue>
                </ResultRow>
                <InfoText>
                  The tax-adjusted equivalent return shows what a taxable investment would need to earn to match this after-tax return. 
                  This helps compare tax-free investments (like PPF) with taxable ones (like FDs).
                </InfoText>
              </>
            )}
            
            <InfoText style={{ 
              fontWeight: 500, 
              marginTop: '1rem', 
              color: getReturnColor(result.xirr),
              padding: '0.75rem',
              backgroundColor: `${getReturnColor(result.xirr)}10`,
              borderRadius: '8px'
            }}>
              {getComparisonText(result.xirr)}
            </InfoText>
          </ResultCard>
          
          <motion.div 
            className="result-grid"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1rem' 
            }}
          >
            <ResultCard className="result-card">
              <ResultRow>
                <ResultLabel className="result-label">IRR (Internal Rate of Return)</ResultLabel>
                <ResultValue className="result-value">{safeFormatPercentage(result.irr)}</ResultValue>
              </ResultRow>
              <InfoText>
                IRR assumes equal time periods between cash flows.
              </InfoText>
            </ResultCard>
            
            <ResultCard className="result-card">
              <ResultRow>
                <ResultLabel className="result-label">CAGR (Compound Annual Growth Rate)</ResultLabel>
                <ResultValue className="result-value">{safeFormatPercentage(result.cagr)}</ResultValue>
              </ResultRow>
              <InfoText>
                CAGR measures the annual growth rate of an investment over a specified time period.
              </InfoText>
            </ResultCard>
          </motion.div>
          
          {onTabChange && (
            <motion.div
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: `${colors.primary.light}15`,
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <span style={{ fontWeight: 500 }}>
                Not sure what these metrics mean? 
              </span>
              <Button 
                onClick={() => onTabChange('info')}
                style={{ marginLeft: '0.5rem', fontSize: '0.9rem' }}
              >
                Learn about XIRR, IRR & CAGR
              </Button>
            </motion.div>
          )}
          
          <ResultCard className="result-card">
            <motion.div
              className="result-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}
            >
              <div>
                <ResultRow>
                  <ResultLabel className="result-label">Total Invested</ResultLabel>
                  <ResultValue className="result-value">{formatCurrency(result.totalInvested)}</ResultValue>
                </ResultRow>
                
                <ResultRow>
                  <ResultLabel className="result-label">Total Returns</ResultLabel>
                  <ResultValue className="result-value">{formatCurrency(result.totalReturns)}</ResultValue>
                </ResultRow>
              </div>
              
              <div>
                <ResultRow>
                  <ResultLabel className="result-label">Net Profit</ResultLabel>
                  <ResultValue className="result-value" style={{ 
                    color: result.netProfit >= 0 ? colors.success.main : colors.error.main 
                  }}>
                    {formatCurrency(result.netProfit)}
                  </ResultValue>
                </ResultRow>
                
                <ResultRow>
                  <ResultLabel className="result-label">Absolute Return</ResultLabel>
                  <ResultValue className="result-value" style={{ 
                    color: result.netProfit >= 0 ? colors.success.main : colors.error.main 
                  }}>
                    {safeFormatPercentage(result.netProfit / result.totalInvested)}
                  </ResultValue>
                </ResultRow>
              </div>
            </motion.div>
          </ResultCard>
          
          <InfoText style={{ 
            backgroundColor: `${colors.warning.light}15`, 
            padding: '1rem', 
            borderRadius: '8px',
            border: `1px solid ${colors.warning.light}`,
            marginTop: '1rem'
          }}>
            <strong>Important Note:</strong> Insurance agents often quote returns without considering the time value of money.
            XIRR provides a more accurate picture of your actual returns. Remember that mixing investment and insurance 
            typically results in suboptimal outcomes for both needs.
          </InfoText>
          
          <motion.div 
            style={{ 
              marginTop: '1.5rem',
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: colors.neutral.lightest,
              border: `1px solid ${colors.neutral.light}`
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: colors.neutral.darkest }}>
              Compare with other investment options:
            </div>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.5rem',
              alignItems: 'center'
            }}>
              <Badge color={colors.neutral.medium}>Fixed Deposits (Bank): 5-9%</Badge>
              <Badge color={colors.neutral.dark}>Fixed Deposits (Corporate): 7-9%</Badge>
              <Badge color={colors.primary.light}>PPF: 7.1% (tax-free)</Badge>
              <Badge color={colors.secondary.light}>NPS: 8-10%</Badge>
              <Badge color={colors.success.main}>Index Funds: 10-12% (long-term)</Badge>
            </div>
          </motion.div>
          
          {/* Yearwise Breakdown Section */}
          <motion.div
            style={{
              marginTop: '2rem',
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: colors.neutral.lightest,
              border: `1px solid ${colors.neutral.light}`
            }}
            id="cash-flow-section"
          >
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: colors.neutral.darkest }}>
              Yearwise Cash Flow Breakdown
            </div>
            
            <CollapsibleHeader 
              isOpen={showYearwiseBreakdown}
              onClick={() => setShowYearwiseBreakdown(!showYearwiseBreakdown)}
              style={{
                padding: '1rem',
                backgroundColor: colors.neutral.lightest,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontWeight: 600, color: colors.neutral.darkest }}>
                Yearwise Cash Flow Breakdown
              </span>
              <span style={{ fontSize: '1.2rem' }}>
                {showYearwiseBreakdown ? '▲' : '▼'}
              </span>
            </CollapsibleHeader>
            
            {showYearwiseBreakdown && (
              <div style={{ padding: '1rem' }}>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr 1fr 1fr',
                  gap: '0.5rem',
                  fontWeight: 600,
                  borderBottom: `1px solid ${colors.neutral.light}`,
                  paddingBottom: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <div>Year</div>
                  <div>Payments</div>
                  <div>Returns</div>
                  <div>Cumulative Net Flow</div>
                </div>
                
                {Object.entries(cashflowsByYear).map(([year, flows], index, array) => {
                  const totalPayments = flows.payments.reduce((sum, cf) => sum + Math.abs(cf.amount), 0);
                  const totalReturns = flows.returns.reduce((sum, cf) => sum + cf.amount, 0);
                  
                  // Calculate cumulative net flow
                  let cumulativeNetFlow = 0;
                  for (let i = 0; i <= index; i++) {
                    const yearKey = array[i][0];
                    const yearFlows = array[i][1];
                    const yearPayments = yearFlows.payments.reduce((sum, cf) => sum + Math.abs(cf.amount), 0);
                    const yearReturns = yearFlows.returns.reduce((sum, cf) => sum + cf.amount, 0);
                    cumulativeNetFlow += (yearReturns - yearPayments);
                  }
                  
                  return (
                    <div 
                      key={year}
                      style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr 1fr 1fr',
                        gap: '0.5rem',
                        padding: '0.5rem 0',
                        borderBottom: `1px solid ${colors.neutral.lightest}`
                      }}
                    >
                      <div style={{ fontWeight: 500 }}>{year}</div>
                      <div style={{ color: colors.error.main }}>{formatCurrency(-totalPayments)}</div>
                      <div style={{ color: colors.success.main }}>{formatCurrency(totalReturns)}</div>
                      <div style={{ 
                        color: cumulativeNetFlow >= 0 ? colors.success.main : colors.error.main,
                        fontWeight: 700
                      }}>
                        {formatCurrency(cumulativeNetFlow)}
                      </div>
                    </div>
                  );
                })}
                
                <InfoText style={{ marginTop: '1rem' }}>
                  This breakdown shows your cash flows year by year, helping you understand the timing of your payments and returns.
                </InfoText>
                <InfoText style={{ 
                  marginTop: '0.5rem', 
                  backgroundColor: `${colors.primary.light}15`, 
                  padding: '0.5rem', 
                  borderRadius: '4px',
                  border: `1px solid ${colors.primary.light}`
                }}>
                  <strong>Note:</strong> Yearwise calculation assumes all investments start from January 1.
                </InfoText>
              </div>
            )}
          </motion.div>
          
          {onTabChange && (
            <motion.div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginTop: '1.5rem',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: `${colors.primary.light}10`,
                border: `1px dashed ${colors.primary.light}`
              }}
            >
              <div style={{ fontWeight: 600, color: colors.primary.dark, textAlign: 'center' }}>
                Want to learn more?
              </div>
              
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '0.75rem',
                justifyContent: 'center' 
              }}>
                <Button 
                  onClick={() => onTabChange('info')}
                  style={{ 
                    backgroundColor: colors.primary.main,
                    minWidth: '180px'
                  }}
                >
                  <span role="img" aria-label="lightbulb">💡</span> Understanding Returns
                </Button>
                
                <Button 
                  onClick={() => onTabChange('tax')}
                  style={{ 
                    backgroundColor: colors.secondary.main,
                    minWidth: '180px'
                  }}
                >
                  <span role="img" aria-label="document">📝</span> Tax Implications
                </Button>
              </div>
              
              <InfoText style={{ textAlign: 'center', marginBottom: '0' }}>
                Make better financial decisions with complete information
              </InfoText>
            </motion.div>
          )}

          {/* Add ShareOptions at the bottom */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: '2rem',
            borderTop: `1px solid ${colors.neutral.light}`,
            paddingTop: '1.5rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '0.75rem', color: colors.neutral.dark, fontSize: '0.9rem' }}>
                Share these results with others
              </div>
              <ShareOptions compact={false} plan={plan} />
            </div>
          </div>
        </Card>
        
        {/* Go to Top floating button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 100
          }}
        >
          <Button
            onClick={scrollToTop}
            style={{
              borderRadius: '50%',
              width: '3rem',
              height: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              backgroundColor: colors.primary.main
            }}
          >
            ↑
          </Button>
        </motion.div>
      </motion.div>
    </ResultsContainer>
  );
};

export default ResultsDisplay; 