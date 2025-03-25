import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { InvestmentPlan, PaymentFrequency, TaxBracket } from '../types';
import {
  FormContainer,
  FormGroup,
  Label,
  Input,
  Button,
  SecondaryButton,
  Flex,
  Card,
  Subtitle,
  InfoText,
  ErrorText,
  fadeIn,
  slideUp,
  Select,
  Slider,
  SliderValue,
  colors
} from './StyledComponents';
import NumberInputField from './NumberInputField';

interface InvestmentFormProps {
  onCalculate: (plan: InvestmentPlan) => void;
  onReset: () => void;
  loading: boolean;
  onTabChange?: (tab: string) => void;
  onFormChange?: (plan: InvestmentPlan) => void;
  currentPlan?: InvestmentPlan;
  scrollToResults?: () => void;
}

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

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

// Function to get display amount based on frequency
const getDisplayAmount = (annualAmount: number, frequency: PaymentFrequency): { value: number, label: string } => {
  switch (frequency) {
    case PaymentFrequency.MONTHLY:
      return { 
        value: Math.round(annualAmount / 12), 
        label: 'Monthly Amount' 
      };
    case PaymentFrequency.QUARTERLY:
      return { 
        value: Math.round(annualAmount / 4), 
        label: 'Quarterly Amount' 
      };
    case PaymentFrequency.HALF_YEARLY:
      return { 
        value: Math.round(annualAmount / 2), 
        label: 'Half-Yearly Amount' 
      };
    default:
      return { 
        value: annualAmount, 
        label: 'Annual Amount' 
      };
  }
};

// Function to get tax bracket label
const getTaxBracketLabel = (taxBracket: TaxBracket): string => {
  switch (taxBracket) {
    case TaxBracket.ZERO:
      return 'No Tax (0%)';
    case TaxBracket.FIVE:
      return '5% Tax Bracket';
    case TaxBracket.TEN:
      return '10% Tax Bracket';
    case TaxBracket.FIFTEEN:
      return '15% Tax Bracket';
    case TaxBracket.TWENTY:
      return '20% Tax Bracket';
    case TaxBracket.TWENTY_FIVE:
      return '25% Tax Bracket';
    case TaxBracket.THIRTY:
      return '30% Tax Bracket';
    case TaxBracket.SURCHARGE_FIFTY_LAKHS:
      return '30% + 10% Surcharge (Income above ₹50L)';
    case TaxBracket.SURCHARGE_ONE_CRORE:
      return '30% + 15% Surcharge (Income above ₹1Cr)';
    case TaxBracket.SURCHARGE_TWO_CRORE:
      return '30% + 25% Surcharge (Income above ₹2Cr)';
    case TaxBracket.SURCHARGE_FIVE_CRORE:
      return '30% + 37% Surcharge (Income above ₹5Cr)';
    default:
      return 'No Tax (0%)';
  }
};

const InvestmentForm: React.FC<InvestmentFormProps> = ({
  onCalculate,
  onReset,
  loading,
  onTabChange,
  onFormChange,
  currentPlan,
  scrollToResults
}) => {
  const [formData, setFormData] = useState<InvestmentPlan>(currentPlan || defaultPlanValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentDisplay, setPaymentDisplay] = useState(getDisplayAmount(formData.annualPayment, formData.paymentFrequency));
  const [returnDisplay, setReturnDisplay] = useState(getDisplayAmount(formData.returnAmount, formData.returnFrequency));

  // Update display amounts when frequencies or amounts change
  useEffect(() => {
    setPaymentDisplay(getDisplayAmount(formData.annualPayment, formData.paymentFrequency));
    setReturnDisplay(getDisplayAmount(formData.returnAmount, formData.returnFrequency));
  }, [formData.annualPayment, formData.returnAmount, formData.paymentFrequency, formData.returnFrequency]);

  // Update final return year minimum when start year or return years change
  useEffect(() => {
    if (formData.returnAmount > 0 && formData.returnYears > 0) {
      const lastRegularReturnYear = formData.returnStartYear + formData.returnYears - 1;
      
      if (formData.finalReturnYear > 0 && formData.finalReturnYear < lastRegularReturnYear) {
        setFormData(prev => ({
          ...prev,
          finalReturnYear: lastRegularReturnYear
        }));
      }
    }
  }, [formData.returnStartYear, formData.returnYears]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let updatedFormData = { ...formData };
    
    if (name === 'paymentFrequency' || name === 'returnFrequency') {
      updatedFormData = {
        ...formData,
        [name]: value as PaymentFrequency
      };
    } else if (name === 'taxBracket') {
      updatedFormData = {
        ...formData,
        [name]: parseFloat(value) as TaxBracket
      };
    } else {
      // Ensure whole numbers for year fields
      if (['paymentYears', 'returnStartYear', 'returnYears', 'finalReturnYear'].includes(name)) {
        updatedFormData = {
          ...formData,
          [name]: Math.floor(parseFloat(value)) || 0
        };
      } else {
        updatedFormData = {
          ...formData,
          [name]: parseFloat(value) || 0
        };
      }
    }
    
    // Handle validation for finalReturnYear
    if (name === 'finalReturnYear' && updatedFormData.returnAmount > 0 && updatedFormData.returnYears > 0) {
      const lastRegularReturnYear = updatedFormData.returnStartYear + updatedFormData.returnYears - 1;
      
      if (updatedFormData.finalReturnYear > 0 && updatedFormData.finalReturnYear < lastRegularReturnYear) {
        updatedFormData.finalReturnYear = lastRegularReturnYear;
      }
    }
    
    setFormData(updatedFormData);
    
    // Update payment display if investment frequency changes
    if (name === 'paymentFrequency') {
      setPaymentDisplay(getDisplayAmount(updatedFormData.annualPayment, updatedFormData.paymentFrequency as PaymentFrequency));
    }
    
    // Call onFormChange if provided
    if (onFormChange) {
      onFormChange(updatedFormData);
    }
  };

  // Handle slider changes
  const handleSliderChange = (name: string, value: number) => {
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(updatedFormData);
    
    // Call onFormChange if provided
    if (onFormChange) {
      onFormChange(updatedFormData);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.annualPayment <= 0) {
      newErrors.annualPayment = 'Annual investment must be greater than 0';
    }
    
    if (formData.paymentYears <= 0) {
      newErrors.paymentYears = 'Investment years must be greater than 0';
    }
    
    if (formData.returnYears < 0) {
      newErrors.returnYears = 'Return years cannot be negative';
    }
    
    if (formData.returnAmount > 0 && formData.returnYears > 0) {
      const lastRegularReturnYear = formData.returnStartYear + formData.returnYears - 1;
      
      if (formData.finalReturnYear > 0 && formData.finalReturnYear < lastRegularReturnYear) {
        newErrors.finalReturnYear = `Final return year must be after or equal to the last regular return year (Year ${lastRegularReturnYear})`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function for tooltips
  const InfoIcon = ({ tooltip }: { tooltip: string }) => (
    <span 
      style={{ 
        marginLeft: '0.5rem', 
        cursor: 'help',
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        backgroundColor: colors.primary.light,
        color: 'white',
        fontSize: '10px',
        fontWeight: 'bold'
      }}
      data-tooltip={tooltip}
      className="tooltip-trigger"
    >
      i
      <div className="tooltip-content" style={{
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: colors.neutral.dark,
        color: 'white',
        padding: '0.5rem',
        borderRadius: '4px',
        width: '200px',
        zIndex: 100,
        fontSize: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        display: 'none',
      }}>
        {tooltip}
      </div>
    </span>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCalculate(formData);
      
      // Use the scrollToResults function if provided
      if (scrollToResults) {
        setTimeout(() => {
          scrollToResults();
        }, 100);
      }
    }
  };

  const handleReset = () => {
    setFormData(defaultPlanValues);
    setErrors({});
    onReset();
  };

  // Calculate minimum value for final return year
  const getMinFinalReturnYear = (): number => {
    if (formData.returnAmount > 0 && formData.returnYears > 0) {
      return formData.returnStartYear + formData.returnYears - 1;
    }
    return 0;
  };

  // Add CSS for tooltips
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .tooltip-trigger:hover .tooltip-content {
        display: block !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Card>
      <FormContainer as="form" onSubmit={handleSubmit}>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <Subtitle>Investment Details</Subtitle>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <FormGroup style={{ flex: '1 1 60%', minWidth: '200px' }}>
              <Label htmlFor="annualPayment">{paymentDisplay.label}</Label>
              <Flex>
                <Input
                  type="number"
                  id="annualPayment"
                  name="annualPayment"
                  value={formData.paymentFrequency === PaymentFrequency.ANNUAL ? 
                    formData.annualPayment : 
                    paymentDisplay.value}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    let annualValue = value;
                    
                    // Convert to annual value based on frequency
                    if (formData.paymentFrequency === PaymentFrequency.MONTHLY) {
                      annualValue = value * 12;
                    } else if (formData.paymentFrequency === PaymentFrequency.QUARTERLY) {
                      annualValue = value * 4;
                    } else if (formData.paymentFrequency === PaymentFrequency.HALF_YEARLY) {
                      annualValue = value * 2;
                    }
                    
                    setFormData(prev => ({
                      ...prev,
                      annualPayment: annualValue
                    }));
                  }}
                  disabled={loading}
                  min="0"
                />
              </Flex>
              <Slider
                type="range"
                id="annualPaymentSlider"
                min="0"
                max="3000000"
                step="10000"
                value={formData.paymentFrequency === PaymentFrequency.ANNUAL ? 
                  formData.annualPayment : 
                  paymentDisplay.value}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  let annualValue = value;
                  
                  // Convert to annual value based on frequency
                  if (formData.paymentFrequency === PaymentFrequency.MONTHLY) {
                    annualValue = value * 12;
                  } else if (formData.paymentFrequency === PaymentFrequency.QUARTERLY) {
                    annualValue = value * 4;
                  } else if (formData.paymentFrequency === PaymentFrequency.HALF_YEARLY) {
                    annualValue = value * 2;
                  }
                  
                  handleSliderChange('annualPayment', annualValue);
                }}
                disabled={loading}
              />
              <SliderValue>
                <span>₹0</span>
                <span>₹30L</span>
              </SliderValue>
              {errors.annualPayment && <ErrorText>{errors.annualPayment}</ErrorText>}
            </FormGroup>
            
            <FormGroup style={{ flex: '1 1 30%', minWidth: '150px' }}>
              <Label htmlFor="paymentFrequency">Frequency</Label>
              <Select
                id="paymentFrequency"
                name="paymentFrequency"
                value={formData.paymentFrequency}
                onChange={handleChange}
                disabled={loading}
              >
                <option value={PaymentFrequency.ANNUAL}>Annual</option>
                <option value={PaymentFrequency.HALF_YEARLY}>Half-Yearly</option>
                <option value={PaymentFrequency.QUARTERLY}>Quarterly</option>
                <option value={PaymentFrequency.MONTHLY}>Monthly</option>
              </Select>
            </FormGroup>
          </div>
          
          <FormGroup>
            <Label htmlFor="paymentYears">
              Payment Period (Years)
              <InfoIcon tooltip="The number of years you will be making payments into the plan" />
            </Label>
            <div style={{ width: '100%', maxWidth: '150px' }}>
              <NumberInputField
                id="paymentYears"
                name="paymentYears"
                value={formData.paymentYears}
                onChange={handleChange}
                min={1}
                max={100}
                disabled={loading}
              />
            </div>
            {errors.paymentYears && <ErrorText>{errors.paymentYears}</ErrorText>}
          </FormGroup>
          
          <Subtitle style={{ marginTop: '1.5rem' }}>Return Details</Subtitle>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <FormGroup style={{ flex: '1 1 60%', minWidth: '200px' }}>
              <Label htmlFor="returnAmount">{returnDisplay.label}</Label>
              <Flex>
                <Input
                  type="number"
                  id="returnAmount"
                  name="returnAmount"
                  value={formData.returnFrequency === PaymentFrequency.ANNUAL ? 
                    formData.returnAmount : 
                    returnDisplay.value}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    let annualValue = value;
                    
                    // Convert to annual value based on frequency
                    if (formData.returnFrequency === PaymentFrequency.MONTHLY) {
                      annualValue = value * 12;
                    } else if (formData.returnFrequency === PaymentFrequency.QUARTERLY) {
                      annualValue = value * 4;
                    } else if (formData.returnFrequency === PaymentFrequency.HALF_YEARLY) {
                      annualValue = value * 2;
                    }
                    
                    setFormData(prev => ({
                      ...prev,
                      returnAmount: annualValue
                    }));
                  }}
                  disabled={loading}
                  min="0"
                />
              </Flex>
              <Slider
                type="range"
                id="returnAmountSlider"
                min="0"
                max="20000000"
                step="10000"
                value={formData.returnFrequency === PaymentFrequency.ANNUAL ? 
                  formData.returnAmount : 
                  returnDisplay.value}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  let annualValue = value;
                  
                  // Convert to annual value based on frequency
                  if (formData.returnFrequency === PaymentFrequency.MONTHLY) {
                    annualValue = value * 12;
                  } else if (formData.returnFrequency === PaymentFrequency.QUARTERLY) {
                    annualValue = value * 4;
                  } else if (formData.returnFrequency === PaymentFrequency.HALF_YEARLY) {
                    annualValue = value * 2;
                  }
                  
                  handleSliderChange('returnAmount', annualValue);
                }}
                disabled={loading}
              />
              <SliderValue>
                <span>₹0</span>
                <span>₹2Cr</span>
              </SliderValue>
              {errors.returnAmount && <ErrorText>{errors.returnAmount}</ErrorText>}
            </FormGroup>
            
            <FormGroup style={{ flex: '1 1 30%', minWidth: '150px' }}>
              <Label htmlFor="returnFrequency">Frequency</Label>
              <Select
                id="returnFrequency"
                name="returnFrequency"
                value={formData.returnFrequency}
                onChange={handleChange}
                disabled={loading}
              >
                <option value={PaymentFrequency.ANNUAL}>Annual</option>
                <option value={PaymentFrequency.HALF_YEARLY}>Half-Yearly</option>
                <option value={PaymentFrequency.QUARTERLY}>Quarterly</option>
                <option value={PaymentFrequency.MONTHLY}>Monthly</option>
              </Select>
            </FormGroup>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <FormGroup style={{ flex: '1 1 30%', minWidth: '150px' }}>
              <Label htmlFor="returnStartYear">
                Start Year
                <InfoIcon tooltip="The year when you start receiving regular returns" />
              </Label>
              <div style={{ width: '100%' }}>
                <NumberInputField
                  id="returnStartYear"
                  name="returnStartYear"
                  value={formData.returnStartYear}
                  onChange={handleChange}
                  min={1}
                  max={100}
                  disabled={loading}
                />
              </div>
              {errors.returnStartYear && <ErrorText>{errors.returnStartYear}</ErrorText>}
            </FormGroup>
            
            <FormGroup style={{ flex: '1 1 30%', minWidth: '150px' }}>
              <Label htmlFor="returnYears">
                Return Years
                <InfoIcon tooltip="The number of years you will receive regular returns" />
              </Label>
              <div style={{ width: '100%' }}>
                <NumberInputField
                  id="returnYears"
                  name="returnYears"
                  value={formData.returnYears}
                  onChange={handleChange}
                  min={0}
                  max={100}
                  disabled={loading}
                />
              </div>
              <InfoText>Set to 0 if there are no regular returns.</InfoText>
              {errors.returnYears && <ErrorText>{errors.returnYears}</ErrorText>}
            </FormGroup>
            
            <FormGroup style={{ flex: '1 1 30%', minWidth: '150px' }}>
              <Label htmlFor="finalReturnYear">
                Final Year
                <InfoIcon tooltip="The year when you receive the final lump sum amount" />
              </Label>
              <div style={{ width: '100%' }}>
                <NumberInputField
                  id="finalReturnYear"
                  name="finalReturnYear"
                  value={formData.finalReturnYear}
                  onChange={handleChange}
                  min={getMinFinalReturnYear()}
                  disabled={loading}
                />
              </div>
              <InfoText>Set to 0 if no lump sum. {getMinFinalReturnYear() > 0 && `Min: Year ${getMinFinalReturnYear()}`}</InfoText>
              {errors.finalReturnYear && <ErrorText>{errors.finalReturnYear}</ErrorText>}
            </FormGroup>
          </div>
          
          <FormGroup style={{ flex: '1', minWidth: '200px' }}>
            <Label htmlFor="finalReturnAmount">
              Final Lumpsum Return Amount
              <InfoIcon tooltip="The lump sum amount received at the end of the plan" />
            </Label>
            <Flex>
              <Input
                type="number"
                id="finalReturnAmount"
                name="finalReturnAmount"
                value={formData.finalReturnAmount}
                onChange={handleChange}
                disabled={loading}
                min="0"
              />
            </Flex>
            <Slider
              type="range"
              id="finalReturnAmountSlider"
              min="0"
              max="20000000"
              step="10000"
              value={formData.finalReturnAmount}
              onChange={(e) => handleSliderChange('finalReturnAmount', parseInt(e.target.value))}
              disabled={loading}
            />
            <SliderValue>
              <span>₹0</span>
              <span>₹2Cr</span>
            </SliderValue>
            {errors.finalReturnAmount && <ErrorText>{errors.finalReturnAmount}</ErrorText>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="taxBracket">Your Tax Bracket</Label>
            <Select
              id="taxBracket"
              name="taxBracket"
              value={formData.taxBracket?.toString() || '0'}
              onChange={handleChange}
              disabled={loading}
            >
              <option value={TaxBracket.ZERO.toString()}>No Tax (0%)</option>
              <option value={TaxBracket.FIVE.toString()}>5% Tax Bracket</option>
              <option value={TaxBracket.TEN.toString()}>10% Tax Bracket</option>
              <option value={TaxBracket.FIFTEEN.toString()}>15% Tax Bracket</option>
              <option value={TaxBracket.TWENTY.toString()}>20% Tax Bracket</option>
              <option value={TaxBracket.TWENTY_FIVE.toString()}>25% Tax Bracket</option>
              <option value={TaxBracket.THIRTY.toString()}>30% Tax Bracket</option>
              <option value={TaxBracket.SURCHARGE_FIFTY_LAKHS.toString()}>30% + 10% Surcharge (Income above ₹50L)</option>
              <option value={TaxBracket.SURCHARGE_ONE_CRORE.toString()}>30% + 15% Surcharge (Income above ₹1Cr)</option>
              <option value={TaxBracket.SURCHARGE_TWO_CRORE.toString()}>30% + 25% Surcharge (Income above ₹2Cr)</option>
              <option value={TaxBracket.SURCHARGE_FIVE_CRORE.toString()}>30% + 37% Surcharge (Income above ₹5Cr)</option>
            </Select>
            <InfoText>
              This helps calculate tax-adjusted returns. For tax-free investments like PPF, select "No Tax".
              {onTabChange && (
                <span
                  style={{ 
                    color: colors.primary.dark, 
                    textDecoration: 'underline', 
                    cursor: 'pointer',
                    marginLeft: '0.5rem'
                  }}
                  onClick={() => onTabChange('tax')}
                >
                  Learn more about tax implications
                </span>
              )}
            </InfoText>
          </FormGroup>
          
          <Flex style={{ justifyContent: 'space-between', marginTop: '2rem' }}>
            <SecondaryButton
              type="button"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </SecondaryButton>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Calculating...' : 'Calculate XIRR'}
            </Button>
          </Flex>
        </motion.div>
      </FormContainer>
    </Card>
  );
};

// Add missing Divider component
const Divider = ({ style }: { style?: React.CSSProperties }) => (
  <div
    style={{
      height: '1px',
      width: '100%',
      backgroundColor: `${colors.neutral.light}`,
      margin: '1rem 0',
      ...style
    }}
  />
);

export default InvestmentForm; 