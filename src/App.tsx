import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import InvestmentForm from './components/InvestmentForm';
import ResultsDisplay from './components/ResultsDisplay';
import InfoSection from './components/InfoSection';
import TaxImplications from './components/TaxImplications';
import GuaranteedIncomePlansInfo from './components/GuaranteedIncomePlansInfo';
import useInvestmentCalculator from './hooks/useInvestmentCalculator';
import { Container, Title, Paragraph, Tabs, TabButton, colors, Button } from './components/StyledComponents';
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
  // Extract just the query string part
  const queryString = newUrl.split('?')[1] || '';
  
  // Update URL without reloading the page
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
    // Initialize with query params or default values
    const queryParams = parseUrlParams();
    
    // If 'fry' (final return year) is specified in URL but 'fra' (final return amount) is not,
    // then set finalReturnAmount to 0 instead of using the default value
    if (queryParams.finalReturnYear && queryParams.finalReturnAmount === undefined) {
      queryParams.finalReturnAmount = 0;
    }
    
    return { ...defaultPlanValues, ...queryParams };
  });
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [useShortUrls, setUseShortUrls] = useState<boolean>(true);
  
  // Calculate results on initial load if query params are present
  useEffect(() => {
    if (Object.keys(parseUrlParams()).length > 0) {
      calculateReturns(currentPlan);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Scroll to top when tab changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToXirrExplanation = () => {
    setActiveTab('info');
    // Scroll to top after tab change
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToGuaranteedPlans = () => {
    setActiveTab('plans');
    // Scroll to top after tab change
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
    // Update URL with current plan values
    updateQueryParams(plan);
    scrollToResults(); // Scroll to results after calculation
  };

  const handleReset = () => {
    resetCalculator();
    setCurrentPlan(defaultPlanValues);
    setHasChanges(false);
    // Clear query params
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', margin: '2rem 0' }}
      >
        <Title>CheckMyReturns.in - XIRR Calculator</Title>
        <Paragraph>
          Calculate the actual returns of guaranteed income plans and compare them with other investment options.
        </Paragraph>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              scrollToXirrExplanation();
            }}
            style={{ 
              color: colors.primary.dark,
              textDecoration: 'underline',
              fontWeight: 500,
              fontSize: '0.95rem',
              display: 'inline-block',
              margin: '0.5rem 0'
            }}
          >
            What is XIRR? Why is it the most accurate measure of investment returns? →
          </a>
          <br />
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              scrollToGuaranteedPlans();
            }}
            style={{ 
              color: colors.primary.dark,
              textDecoration: 'underline',
              fontWeight: 500,
              fontSize: '0.95rem',
              display: 'inline-block',
              margin: '0.5rem 0'
            }}
          >
            Learn about Guaranteed Income Plans and their actual returns →
          </a>
        </motion.div>
      </motion.div>

      <Tabs className="tabs-container">
        <TabButton 
          className={`tab-button ${activeTab === 'calculator' ? 'active' : ''}`}
          isActive={activeTab === 'calculator'} 
          onClick={() => handleTabChange('calculator')}
        >
          Calculator
        </TabButton>
        <TabButton 
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          isActive={activeTab === 'info'} 
          onClick={() => handleTabChange('info')}
        >
          Understanding Returns
        </TabButton>
        <TabButton 
          className={`tab-button ${activeTab === 'tax' ? 'active' : ''}`}
          isActive={activeTab === 'tax'} 
          onClick={() => handleTabChange('tax')}
        >
          Tax Implications
        </TabButton>
        <TabButton 
          className={`tab-button ${activeTab === 'plans' ? 'active' : ''}`}
          isActive={activeTab === 'plans'} 
          onClick={() => handleTabChange('plans')}
        >
          Guaranteed Income Plans
        </TabButton>
      </Tabs>

      {activeTab === 'calculator' && (
        <>
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
              <h3 style={{ margin: 0, color: colors.primary.dark, fontSize: '1.1rem' }}>Policy Summary</h3>
              
              {/* Notification when changes are made */}
              {hasChanges && (
                <div style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: colors.warning.light + '20',
                  borderRadius: '8px',
                  border: `1px solid ${colors.warning.light}`,
                  textAlign: 'center',
                  color: colors.warning.dark,
                  fontWeight: 'bold',
                  fontSize: '0.8rem'
                }}>
                  Changes made. Click "Calculate XIRR" to update.
                </div>
              )}
              
              {/* Timeline visualization */}
              <div style={{
                width: '100%',
                position: 'relative',
                height: '180px',
                marginBottom: '0.5rem',
                marginTop: '0.5rem'
              }}>
                {/* Timeline line */}
                <div style={{
                  position: 'absolute',
                  top: '80px',
                  left: '0',
                  right: '0',
                  height: '2px',
                  backgroundColor: colors.neutral.light,
                  zIndex: 1
                }}></div>
                
                {/* Year markers */}
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  height: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: colors.neutral.dark,
                  fontSize: '0.7rem',
                  zIndex: 1
                }}>
                  <span>Year 1</span>
                  <span>Year {Math.max(
                    currentPlan.paymentYears,
                    currentPlan.returnStartYear + currentPlan.returnYears - 1,
                    currentPlan.finalReturnYear
                  )}</span>
                </div>
                
                {/* Payment period */}
                <div style={{
                  position: 'absolute',
                  top: '40px',
                  left: '0',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  zIndex: 2
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    color: colors.primary.dark,
                    marginBottom: '5px',
                    width: '100%',
                    whiteSpace: 'normal'
                  }}>
                    Pay {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0
                    }).format(
                      currentPlan.paymentFrequency === PaymentFrequency.MONTHLY ? currentPlan.annualPayment / 12 :
                      currentPlan.paymentFrequency === PaymentFrequency.QUARTERLY ? currentPlan.annualPayment / 4 :
                      currentPlan.paymentFrequency === PaymentFrequency.HALF_YEARLY ? currentPlan.annualPayment / 2 :
                      currentPlan.annualPayment)}/{currentPlan.paymentFrequency.toLowerCase()} for {currentPlan.paymentYears} years
                  </div>
                  <div style={{
                    width: `${Math.min(100, (currentPlan.paymentYears / Math.max(
                      currentPlan.paymentYears,
                      currentPlan.returnStartYear + currentPlan.returnYears - 1,
                      currentPlan.finalReturnYear
                    )) * 100)}%`,
                    height: '8px',
                    backgroundColor: colors.primary.main,
                    borderRadius: '4px'
                  }}></div>
                </div>
                
                {/* Return period */}
                {currentPlan.returnYears > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '90px',
                    left: '0',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    zIndex: 2
                  }}>
                    <div style={{
                      width: `${(currentPlan.returnYears / Math.max(
                        currentPlan.paymentYears,
                        currentPlan.returnStartYear + currentPlan.returnYears - 1,
                        currentPlan.finalReturnYear
                      )) * 100}%`,
                      height: '8px',
                      backgroundColor: colors.success.main,
                      borderRadius: '4px',
                      marginLeft: `${(currentPlan.returnStartYear / Math.max(
                        currentPlan.paymentYears,
                        currentPlan.returnStartYear + currentPlan.returnYears - 1,
                        currentPlan.finalReturnYear
                      )) * 100}%`
                    }}></div>
                    <div style={{
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      color: colors.success.dark,
                      marginTop: '5px',
                      width: '100%',
                      whiteSpace: 'normal'
                    }}>
                      Get {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                      }).format(
                        currentPlan.returnFrequency === PaymentFrequency.MONTHLY ? currentPlan.returnAmount / 12 :
                        currentPlan.returnFrequency === PaymentFrequency.QUARTERLY ? currentPlan.returnAmount / 4 :
                        currentPlan.returnFrequency === PaymentFrequency.HALF_YEARLY ? currentPlan.returnAmount / 2 :
                        currentPlan.returnAmount)}/{currentPlan.returnFrequency.toLowerCase()} for {currentPlan.returnYears} years (Year {currentPlan.returnStartYear}-{currentPlan.returnStartYear + currentPlan.returnYears - 1})
                    </div>
                  </div>
                )}
                
                {/* Final return */}
                {currentPlan.finalReturnYear > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '130px',
                    left: '0',
                    width: '100%',
                    zIndex: 3
                  }}>
                    <div style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: colors.secondary.main,
                        borderRadius: '50%',
                        marginLeft: `${(currentPlan.finalReturnYear / Math.max(
                          currentPlan.paymentYears,
                          currentPlan.returnStartYear + currentPlan.returnYears - 1,
                          currentPlan.finalReturnYear
                        )) * 100}%`,
                        flexShrink: 0
                      }}></div>
                    </div>
                    
                    {/* Separate text element that's not tied to dot position */}
                    <div style={{
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      color: colors.secondary.dark,
                      marginTop: '5px',
                      width: '100%',
                      textAlign: 'left'
                    }}>
                      Lumpsum {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                      }).format(currentPlan.finalReturnAmount)} at Year {currentPlan.finalReturnYear}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Add responsive styles for the timeline */}
              <style>
                {`
                  @media (max-width: 480px) {
                    .policy-summary .timeline-label {
                      font-size: 0.6rem !important;
                    }
                  }
                `}
              </style>
              
              {/* Summary stats */}
              <div style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                padding: '0.5rem',
                backgroundColor: colors.neutral.lightest,
                borderRadius: '8px',
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: colors.primary.dark }}>Total Investment</div>
                  <div>{new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                  }).format(currentPlan.annualPayment * currentPlan.paymentYears)}</div>
                </div>
                
                <div>
                  <div style={{ fontWeight: 'bold', color: colors.success.dark }}>Total Returns</div>
                  <div>{new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                  }).format((currentPlan.returnAmount * currentPlan.returnYears) + (currentPlan.finalReturnYear > 0 ? currentPlan.finalReturnAmount : 0))}</div>
                </div>
              </div>
              
              <Button
                onClick={() => {
                  // Instead of triggering a form submission event,
                  // directly call the handleCalculate function with the current plan
                  handleCalculate(currentPlan);
                }}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.1rem'
                }}
                disabled={loading}
              >
                {loading ? 'Calculating...' : 'Calculate XIRR'}
              </Button>
            </motion.div>
          </div>
          
          {result && (
            <div 
              id="results-section"
              style={{ 
                marginTop: '2rem', 
                width: '100%' 
              }}
            >
              <ResultsDisplay 
                result={result} 
                onTabChange={handleTabChange}
                hasChanges={hasChanges}
                plan={currentPlan}
              />
            </div>
          )}
        </>
      )}

      {activeTab === 'info' && <InfoSection onTabChange={handleTabChange} />}
      {activeTab === 'tax' && <TaxImplications />}
      {activeTab === 'plans' && <GuaranteedIncomePlansInfo />}

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
        <p>
          This calculator is for educational purposes only. Always consult a financial advisor before making investment decisions.
        </p>
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
