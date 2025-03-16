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

function App() {
  const {
    result,
    loading,
    error,
    calculateReturns,
    resetCalculator
  } = useInvestmentCalculator();

  const [activeTab, setActiveTab] = useState<string>('calculator');
  const [currentPlan, setCurrentPlan] = useState<InvestmentPlan>(defaultPlanValues);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

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
    scrollToResults(); // Scroll to results after calculation
  };

  const handleReset = () => {
    resetCalculator();
    setCurrentPlan(defaultPlanValues);
    setHasChanges(false);
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
                padding: '1.5rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
                border: `1px solid ${colors.neutral.lighter}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem'
              }}
            >
              <h3 style={{ margin: 0, color: colors.primary.dark }}>Policy Summary</h3>
              
              {/* Notification when changes are made */}
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
              
              {/* Policy Start Section */}
              <div style={{
                width: '100%',
                padding: '1.5rem',
                backgroundColor: colors.neutral.lightest,
                borderRadius: '8px',
                border: `1px solid ${colors.neutral.light}`,
                position: 'relative'
              }}>
                <div style={{ 
                  position: 'absolute', 
                  top: '-12px', 
                  left: '20px', 
                  backgroundColor: colors.primary.main,
                  color: 'white',
                  padding: '2px 10px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  Policy Start: You Invest
                </div>
                
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: colors.primary.dark,
                  textAlign: 'center',
                  marginBottom: '0.5rem'
                }}>
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0
                  }).format(
                    currentPlan.paymentFrequency === PaymentFrequency.MONTHLY ? currentPlan.annualPayment / 12 :
                    currentPlan.paymentFrequency === PaymentFrequency.QUARTERLY ? currentPlan.annualPayment / 4 :
                    currentPlan.paymentFrequency === PaymentFrequency.HALF_YEARLY ? currentPlan.annualPayment / 2 :
                    currentPlan.annualPayment)} / {currentPlan.paymentFrequency === PaymentFrequency.MONTHLY ? "month" :
                    currentPlan.paymentFrequency === PaymentFrequency.QUARTERLY ? "quarter" :
                    currentPlan.paymentFrequency === PaymentFrequency.HALF_YEARLY ? "half-year" :
                    "year"}
                </div>
                
                <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                  for {currentPlan.paymentYears} Years
                </div>
                
                <div style={{ 
                  backgroundColor: colors.primary.light + '20', 
                  padding: '0.5rem', 
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: colors.primary.dark
                }}>
                  Total: {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                  }).format(currentPlan.annualPayment * currentPlan.paymentYears)}
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '1rem',
                  color: colors.neutral.dark,
                  fontSize: '0.8rem'
                }}>
                  <span>1 Year</span>
                  <span>...</span>
                  <span>{currentPlan.paymentYears} Years</span>
                </div>
              </div>
              
              {/* Returns Section */}
              <div style={{
                width: '100%',
                padding: '1.5rem',
                backgroundColor: colors.neutral.lightest,
                borderRadius: '8px',
                border: `1px solid ${colors.neutral.light}`,
                position: 'relative'
              }}>
                <div style={{ 
                  position: 'absolute', 
                  top: '-12px', 
                  left: '20px', 
                  backgroundColor: colors.success.main,
                  color: 'white',
                  padding: '2px 10px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  From {currentPlan.returnStartYear}th Year You Get
                </div>
                
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: colors.success.dark,
                  textAlign: 'center',
                  marginBottom: '0.5rem'
                }}>
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0
                  }).format(
                    currentPlan.returnFrequency === PaymentFrequency.MONTHLY ? currentPlan.returnAmount / 12 :
                    currentPlan.returnFrequency === PaymentFrequency.QUARTERLY ? currentPlan.returnAmount / 4 :
                    currentPlan.returnFrequency === PaymentFrequency.HALF_YEARLY ? currentPlan.returnAmount / 2 :
                    currentPlan.returnAmount)} / {currentPlan.returnFrequency === PaymentFrequency.MONTHLY ? "month" :
                    currentPlan.returnFrequency === PaymentFrequency.QUARTERLY ? "quarter" :
                    currentPlan.returnFrequency === PaymentFrequency.HALF_YEARLY ? "half-year" :
                    "year"}
                </div>
                
                <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                  for {currentPlan.returnYears} Years
                </div>
                
                <div style={{ 
                  backgroundColor: colors.success.light + '20', 
                  padding: '0.5rem', 
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: colors.success.dark
                }}>
                  Total: {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                  }).format(currentPlan.returnAmount * currentPlan.returnYears)}
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '1rem',
                  color: colors.neutral.dark,
                  fontSize: '0.8rem'
                }}>
                  <span>{currentPlan.returnStartYear} Year</span>
                  <span>...</span>
                  <span>{currentPlan.returnStartYear + currentPlan.returnYears - 1} Years</span>
                </div>
              </div>
              
              {/* Lumpsum Section */}
              {currentPlan.finalReturnYear > 0 && (
                <div style={{
                  width: '100%',
                  padding: '1.5rem',
                  backgroundColor: colors.neutral.lightest,
                  borderRadius: '8px',
                  border: `1px solid ${colors.neutral.light}`,
                  position: 'relative'
                }}>
                  <div style={{ 
                    position: 'absolute', 
                    top: '-12px', 
                    left: '20px', 
                    backgroundColor: colors.secondary.main,
                    color: 'white',
                    padding: '2px 10px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    Additional Lumpsum Amount
                  </div>
                  
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    color: colors.secondary.dark,
                    textAlign: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0
                    }).format(currentPlan.finalReturnAmount)}
                  </div>
                  
                  <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                    On {currentPlan.finalReturnYear}th Year
                  </div>
                </div>
              )}
              
              <Button
                onClick={() => {
                  const form = document.querySelector('form');
                  if (form) {
                    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                  }
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
