import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import InvestmentForm from './components/InvestmentForm';
import ResultsDisplay from './components/ResultsDisplay';
import TaxImplications from './components/TaxImplications';
import CompareView from './components/CompareView';
import LearnSection from './components/LearnSection';
import useInvestmentCalculator from './hooks/useInvestmentCalculator';
import { Container, Paragraph, Tabs, TabButton, colors, Button } from './components/StyledComponents';
import { InvestmentPlan, PaymentFrequency, TaxBracket } from './types';
import { parseUrlParams, toggleUrlFormat } from './utils/urlUtils';

// Default investment plan values
const defaultPlanValues: InvestmentPlan = {
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

// Function to update URL with current plan values (using short format by default)
const updateQueryParams = (plan: InvestmentPlan, useShortFormat: boolean = true) => {
  const newUrl = toggleUrlFormat(plan, useShortFormat);
  const queryString = newUrl.split('?')[1] || '';
  const newPath = `${window.location.pathname}?${queryString}`;
  window.history.pushState({ path: newPath }, '', newPath);
};

function App() {
  const {
    result,
    loading,
    error,
    calculateReturns,
    resetCalculator
  } = useInvestmentCalculator();

  const [activeTab, setActiveTab] = useState<string>('calculator');
  const [currentPlan, setCurrentPlan] = useState<InvestmentPlan>(() => {
    const queryParams = parseUrlParams();
    if (queryParams.finalReturnYear && queryParams.finalReturnAmount === undefined) {
      queryParams.finalReturnAmount = 0;
    }
    return { ...defaultPlanValues, ...queryParams };
  });
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Calculate results on initial load if query params are present
  useEffect(() => {
    if (Object.keys(parseUrlParams()).length > 0) {
      calculateReturns(currentPlan);
    }
  }, []);

  // Restore form state when browser back/forward is used
  useEffect(() => {
    const handlePopState = () => {
      const queryParams = parseUrlParams();
      if (Object.keys(queryParams).length > 0) {
        const restoredPlan = { ...defaultPlanValues, ...queryParams };
        setCurrentPlan(restoredPlan);
        calculateReturns(restoredPlan);
      } else {
        setCurrentPlan(defaultPlanValues);
        resetCalculator();
      }
      setHasChanges(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (tab: string) => {
    // Map old tab names to new ones
    if (tab === 'info' || tab === 'plans' || tab === 'faq') {
      setActiveTab('learn');
    } else {
      setActiveTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToResults = () => {
    const resultsElement = document.getElementById('results-section');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormChange = (plan: InvestmentPlan) => {
    setCurrentPlan(plan);
    if (result) {
      setHasChanges(true);
    }
  };

  const handleCalculate = (plan: InvestmentPlan) => {
    setCurrentPlan(plan);
    calculateReturns(plan);
    setHasChanges(false);
    updateQueryParams(plan);
    scrollToResults();
  };

  const fmtINR = (v: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);
  const maxYear = Math.max(currentPlan.paymentYears, currentPlan.returnStartYear + currentPlan.returnYears - 1, currentPlan.finalReturnYear);
  const payAmt = currentPlan.paymentFrequency === PaymentFrequency.MONTHLY ? currentPlan.annualPayment / 12 :
    currentPlan.paymentFrequency === PaymentFrequency.QUARTERLY ? currentPlan.annualPayment / 4 :
    currentPlan.paymentFrequency === PaymentFrequency.HALF_YEARLY ? currentPlan.annualPayment / 2 : currentPlan.annualPayment;
  const retAmt = currentPlan.returnFrequency === PaymentFrequency.MONTHLY ? currentPlan.returnAmount / 12 :
    currentPlan.returnFrequency === PaymentFrequency.QUARTERLY ? currentPlan.returnAmount / 4 :
    currentPlan.returnFrequency === PaymentFrequency.HALF_YEARLY ? currentPlan.returnAmount / 2 : currentPlan.returnAmount;

  const renderPolicySummaryContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      <h3 style={{ margin: 0, color: colors.primary.dark, fontSize: '1.1rem', textAlign: 'center' }}>Policy Summary</h3>

      {/* Timeline */}
      <div style={{ width: '100%', position: 'relative', height: '180px' }}>
        <div style={{ position: 'absolute', top: '80px', left: '0', right: '0', height: '2px', backgroundColor: colors.neutral.light, zIndex: 1 }}></div>
        <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '20px', display: 'flex', justifyContent: 'space-between', color: colors.neutral.dark, fontSize: '0.7rem', zIndex: 1 }}>
          <span>Year 1</span><span>Year {maxYear}</span>
        </div>
        <div style={{ position: 'absolute', top: '40px', left: '0', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', zIndex: 2 }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: colors.primary.dark, marginBottom: '5px', width: '100%' }}>
            Pay {fmtINR(payAmt)}/{currentPlan.paymentFrequency.toLowerCase()} for {currentPlan.paymentYears} yrs
          </div>
          <div style={{ width: `${Math.min(100, (currentPlan.paymentYears / maxYear) * 100)}%`, height: '8px', backgroundColor: colors.primary.main, borderRadius: '4px' }}></div>
        </div>
        {currentPlan.returnYears > 0 && (
          <div style={{ position: 'absolute', top: '90px', left: '0', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', zIndex: 2 }}>
            <div style={{ width: `${(currentPlan.returnYears / maxYear) * 100}%`, height: '8px', backgroundColor: colors.success.main, borderRadius: '4px', marginLeft: `${(currentPlan.returnStartYear / maxYear) * 100}%` }}></div>
            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: colors.success.dark, marginTop: '5px', width: '100%' }}>
              Get {fmtINR(retAmt)}/{currentPlan.returnFrequency.toLowerCase()} for {currentPlan.returnYears} yrs (Yr {currentPlan.returnStartYear}-{currentPlan.returnStartYear + currentPlan.returnYears - 1})
            </div>
          </div>
        )}
        {currentPlan.finalReturnYear > 0 && (
          <div style={{ position: 'absolute', top: '130px', left: '0', width: '100%', zIndex: 3 }}>
            <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
              <div style={{ width: '10px', height: '10px', backgroundColor: colors.secondary.main, borderRadius: '50%', marginLeft: `${(currentPlan.finalReturnYear / maxYear) * 100}%`, flexShrink: 0 }}></div>
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: colors.secondary.dark, marginTop: '5px' }}>
              Lumpsum {fmtINR(currentPlan.finalReturnAmount)} at Year {currentPlan.finalReturnYear}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.7rem', color: colors.neutral.dark, justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '8px', backgroundColor: colors.primary.main, borderRadius: '2px' }}></div><span>Payment</span></div>
        {currentPlan.returnYears > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '8px', backgroundColor: colors.success.main, borderRadius: '2px' }}></div><span>Returns</span></div>}
        {currentPlan.finalReturnYear > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '10px', height: '10px', backgroundColor: colors.secondary.main, borderRadius: '50%' }}></div><span>Lump Sum</span></div>}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.5rem', backgroundColor: colors.neutral.lightest, borderRadius: '8px' }}>
        <div><div style={{ fontWeight: 'bold', color: colors.primary.dark }}>Total Investment</div><div>{fmtINR(currentPlan.annualPayment * currentPlan.paymentYears)}</div></div>
        <div><div style={{ fontWeight: 'bold', color: colors.success.dark }}>Total Returns</div><div>{fmtINR((currentPlan.returnAmount * currentPlan.returnYears) + (currentPlan.finalReturnYear > 0 ? currentPlan.finalReturnAmount : 0))}</div></div>
      </div>
    </div>
  );

  const handleReset = () => {
    if (!window.confirm('Are you sure you want to reset all values to defaults?')) {
      return;
    }
    resetCalculator();
    setCurrentPlan(defaultPlanValues);
    setHasChanges(false);
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="app-header"
        style={{ textAlign: 'center', margin: '0.75rem 0' }}
      >
        <Paragraph style={{ margin: '0.25rem 0' }}>
          Find out the real returns on your insurance or investment plan
        </Paragraph>
      </motion.div>

      <nav aria-label="Main navigation">
        <Tabs className="tabs-container" role="tablist" aria-label="Calculator sections">
          <TabButton
            className={`tab-button ${activeTab === 'calculator' ? 'active' : ''}`}
            $isActive={activeTab === 'calculator'}
            onClick={() => handleTabChange('calculator')}
            role="tab"
            aria-selected={activeTab === 'calculator'}
            aria-controls="panel-calculator"
            id="tab-calculator"
          >
            Calculator
          </TabButton>
          <TabButton
            className={`tab-button ${activeTab === 'compare' ? 'active' : ''}`}
            $isActive={activeTab === 'compare'}
            onClick={() => handleTabChange('compare')}
            role="tab"
            aria-selected={activeTab === 'compare'}
            aria-controls="panel-compare"
            id="tab-compare"
          >
            Compare Plans
          </TabButton>
          <TabButton
            className={`tab-button ${activeTab === 'tax' ? 'active' : ''}`}
            $isActive={activeTab === 'tax'}
            onClick={() => handleTabChange('tax')}
            role="tab"
            aria-selected={activeTab === 'tax'}
            aria-controls="panel-tax"
            id="tab-tax"
          >
            Tax Info
          </TabButton>
          <TabButton
            className={`tab-button ${activeTab === 'learn' ? 'active' : ''}`}
            $isActive={activeTab === 'learn'}
            onClick={() => handleTabChange('learn')}
            role="tab"
            aria-selected={activeTab === 'learn'}
            aria-controls="panel-learn"
            id="tab-learn"
          >
            Learn
          </TabButton>
        </Tabs>
      </nav>

      <main>
      {activeTab === 'calculator' && (
        <section role="tabpanel" id="panel-calculator" aria-labelledby="tab-calculator">
          <div className="calculator-container">
            <div className="form-section">
              <InvestmentForm
                onCalculate={handleCalculate}
                onReset={handleReset}
                loading={loading}
                onTabChange={handleTabChange}
                onFormChange={handleFormChange}
                currentPlan={currentPlan}
                scrollToResults={scrollToResults}
                renderMobileSummary={() => renderPolicySummaryContent()}
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    padding: '1rem',
                    backgroundColor: `${colors.error.light}20`,
                    color: colors.error.dark,
                    borderRadius: '8px',
                    marginTop: '1rem',
                    textAlign: 'center',
                    border: `1px solid ${colors.error.light}`
                  }}
                >
                  {error}
                </motion.div>
              )}
            </div>

            <motion.div
              className="policy-summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                backgroundColor: colors.neutral.white,
                borderRadius: '16px',
                padding: '1rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
                border: `1px solid ${colors.neutral.lighter}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              {hasChanges && (
                <div style={{
                  width: '100%', padding: '0.5rem',
                  backgroundColor: colors.warning.light + '20', borderRadius: '8px',
                  border: `1px solid ${colors.warning.light}`, textAlign: 'center',
                  color: colors.warning.dark, fontWeight: 'bold', fontSize: '0.8rem'
                }}>
                  Changes made. Click "Calculate Returns" to update.
                </div>
              )}

              {renderPolicySummaryContent()}

              <Button
                onClick={() => handleCalculate(currentPlan)}
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                disabled={loading}
              >
                {loading ? 'Calculating...' : 'Calculate Returns'}
              </Button>
            </motion.div>
          </div>

          {result && (
            <div id="results-section" style={{ marginTop: '2rem', width: '100%' }}>
              <ResultsDisplay
                result={result}
                onTabChange={handleTabChange}
                hasChanges={hasChanges}
                plan={currentPlan}
              />
            </div>
          )}
        </section>
      )}

      {activeTab === 'compare' && (
        <section role="tabpanel" id="panel-compare" aria-labelledby="tab-compare">
          <CompareView />
        </section>
      )}
      {activeTab === 'tax' && (
        <section role="tabpanel" id="panel-tax" aria-labelledby="tab-tax">
          <TaxImplications />
        </section>
      )}
      {activeTab === 'learn' && (
        <section role="tabpanel" id="panel-learn" aria-labelledby="tab-learn">
          <LearnSection onTabChange={handleTabChange} />
        </section>
      )}
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          marginTop: '3rem',
          padding: '1rem',
          textAlign: 'center',
          borderTop: `1px solid ${colors.neutral.light}`,
          color: colors.neutral.dark,
          fontSize: '0.9rem'
        }}
      >
        <p>This calculator is for educational purposes only. Always consult a financial advisor before making investment decisions.</p>
        <p style={{ marginTop: '0.5rem', color: colors.warning.dark }}>
          <strong>Remember:</strong> Separating your insurance and investment needs typically leads to better outcomes than combined products.
        </p>
        <p style={{ marginTop: '0.5rem', color: colors.neutral.dark, fontSize: '0.85rem' }}>
          <strong>Privacy Note:</strong> All calculations are performed entirely in your browser.
          No personal or financial data is stored or transmitted. We use Google Analytics only to track anonymous usage statistics.
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          © {new Date().getFullYear()} CheckMyReturns.in - XIRR Calculator for Guaranteed Income Plans
        </p>
      </motion.footer>
    </Container>
  );
}

export default App;
