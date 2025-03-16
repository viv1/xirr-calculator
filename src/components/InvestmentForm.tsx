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

interface InvestmentFormProps {
  onCalculate: (plan: InvestmentPlan) => void;
  onReset: () => void;
  loading: boolean;
  onTabChange?: (tab: string) => void;
  onFormChange?: (plan: InvestmentPlan) => void;
  currentPlan?: InvestmentPlan;
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
      return '30% + 10% Surcharge (Income > ₹50L)';
    case TaxBracket.SURCHARGE_ONE_CRORE:
      return '30% + 15% Surcharge (Income > ₹1Cr)';
    case TaxBracket.SURCHARGE_TWO_CRORE:
      return '30% + 25% Surcharge (Income > ₹2Cr)';
    case TaxBracket.SURCHARGE_FIVE_CRORE:
      return '30% + 37% Surcharge (Income > ₹5Cr)';
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
  currentPlan
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
      updatedFormData = {
        ...formData,
        [name]: parseFloat(value) || 0
      };
    }
    
    setFormData(updatedFormData);
    
    // Update payment display if payment frequency changes
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
      newErrors.annualPayment = 'Annual payment must be greater than 0';
    }
    
    if (formData.paymentYears <= 0) {
      newErrors.paymentYears = 'Payment years must be greater than 0';
    }
    
    if (formData.returnAmount > 0 && formData.returnStartYear <= formData.paymentYears) {
      newErrors.returnStartYear = 'Return start year must be after payment years';
    }
    
    if (formData.returnYears < 0) {
      newErrors.returnYears = 'Return years cannot be negative';
    }
    
    if (formData.returnAmount > 0 && formData.returnYears > 0) {
      const lastRegularReturnYear = formData.returnStartYear + formData.returnYears - 1;
      
      if (formData.finalReturnYear > 0 && formData.finalReturnYear < lastRegularReturnYear) {
        newErrors.finalReturnYear = 'Final return year must be after or equal to the last regular return year';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCalculate(formData);
      
      // Improved scroll to results section with a slight delay to ensure rendering is complete
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  };

  const handleReset = () => {
    setFormData(defaultPlanValues);
    setErrors({});
    onReset();
  };

  return (
    <Card
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <Subtitle>
        Investment Plan Details
      </Subtitle>
      <InfoText>
        Enter the details of your investment plan to calculate the actual returns.
      </InfoText>
      
      <FormContainer as="form" onSubmit={handleSubmit}>
        <motion.div variants={slideUp}>
          <FormGroup>
            <Label htmlFor="paymentFrequency">Payment Frequency</Label>
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
          
          <FormGroup>
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
              id="annualPayment-slider"
              min="0"
              max="1000000"
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
              <span>₹10L</span>
            </SliderValue>
            {errors.annualPayment && <ErrorText>{errors.annualPayment}</ErrorText>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="paymentYears">Payment Duration (Years)</Label>
            <Flex>
              <Input
                type="number"
                id="paymentYears"
                name="paymentYears"
                value={formData.paymentYears}
                onChange={handleChange}
                disabled={loading}
                min="1"
                max="30"
                step="1"
              />
            </Flex>
            <Slider
              id="paymentYears-slider"
              min="1"
              max="30"
              step="1"
              value={formData.paymentYears}
              onChange={(e) => handleSliderChange('paymentYears', parseInt(e.target.value))}
              disabled={loading}
            />
            <SliderValue>
              <span>1 year</span>
              <span>30 years</span>
            </SliderValue>
            {errors.paymentYears && <ErrorText>{errors.paymentYears}</ErrorText>}
          </FormGroup>
          
          <Divider style={{ margin: '1.5rem 0' }} />
          
          <FormGroup>
            <Label htmlFor="returnFrequency">Return Frequency</Label>
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
          
          <FormGroup>
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
              id="returnAmount-slider"
              min="0"
              max="1000000"
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
              <span>₹10L</span>
            </SliderValue>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="returnStartYear">Return Start Year</Label>
            <Flex>
              <Input
                type="number"
                id="returnStartYear"
                name="returnStartYear"
                value={formData.returnStartYear}
                onChange={handleChange}
                disabled={loading || formData.returnAmount === 0}
                min="1"
                max="50"
                step="1"
              />
            </Flex>
            <Slider
              id="returnStartYear-slider"
              min="1"
              max="50"
              step="1"
              value={formData.returnStartYear}
              onChange={(e) => handleSliderChange('returnStartYear', parseInt(e.target.value))}
              disabled={loading || formData.returnAmount === 0}
            />
            <SliderValue>
              <span>1 year</span>
              <span>50 years</span>
            </SliderValue>
            {errors.returnStartYear && <ErrorText>{errors.returnStartYear}</ErrorText>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="returnYears">Return Duration (Years)</Label>
            <Flex>
              <Input
                type="number"
                id="returnYears"
                name="returnYears"
                value={formData.returnYears}
                onChange={handleChange}
                disabled={loading || formData.returnAmount === 0}
                min="0"
                max="50"
                step="1"
              />
            </Flex>
            <Slider
              id="returnYears-slider"
              min="0"
              max="50"
              step="1"
              value={formData.returnYears}
              onChange={(e) => handleSliderChange('returnYears', parseInt(e.target.value))}
              disabled={loading || formData.returnAmount === 0}
            />
            <SliderValue>
              <span>0 years</span>
              <span>50 years</span>
            </SliderValue>
            {errors.returnYears && <ErrorText>{errors.returnYears}</ErrorText>}
          </FormGroup>
          
          <Divider style={{ margin: '1.5rem 0' }} />
          
          <FormGroup>
            <Label htmlFor="finalReturnYear">Final Return Year (Maturity/Lumpsum)</Label>
            <Flex>
              <Input
                type="number"
                id="finalReturnYear"
                name="finalReturnYear"
                value={formData.finalReturnYear}
                onChange={handleChange}
                disabled={loading}
                min="0"
                max="100"
                step="1"
              />
            </Flex>
            <Slider
              id="finalReturnYear-slider"
              min="0"
              max="100"
              step="1"
              value={formData.finalReturnYear}
              onChange={(e) => handleSliderChange('finalReturnYear', parseInt(e.target.value))}
              disabled={loading}
            />
            <SliderValue>
              <span>0 (None)</span>
              <span>100 years</span>
            </SliderValue>
            <InfoText>
              Set to 0 if there is no lumpsum payment at the end
            </InfoText>
            {errors.finalReturnYear && <ErrorText>{errors.finalReturnYear}</ErrorText>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="finalReturnAmount">Final Return Amount (Maturity/Lumpsum)</Label>
            <Flex>
              <Input
                type="number"
                id="finalReturnAmount"
                name="finalReturnAmount"
                value={formData.finalReturnAmount}
                onChange={handleChange}
                disabled={loading || formData.finalReturnYear === 0}
                min="0"
              />
            </Flex>
            <Slider
              id="finalReturnAmount-slider"
              min="0"
              max="10000000"
              step="100000"
              value={formData.finalReturnAmount}
              onChange={(e) => handleSliderChange('finalReturnAmount', parseInt(e.target.value))}
              disabled={loading || formData.finalReturnYear === 0}
            />
            <SliderValue>
              <span>₹0</span>
              <span>₹1Cr</span>
            </SliderValue>
          </FormGroup>
          
          <Divider style={{ margin: '1.5rem 0' }} />
          
          <FormGroup>
            <Label htmlFor="taxBracket">Your Tax Bracket</Label>
            <Select
              id="taxBracket"
              name="taxBracket"
              value={(formData.taxBracket || TaxBracket.ZERO).toString()}
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
              <option value={TaxBracket.SURCHARGE_FIFTY_LAKHS.toString()}>30% + 10% Surcharge (Income &gt; ₹50L)</option>
              <option value={TaxBracket.SURCHARGE_ONE_CRORE.toString()}>30% + 15% Surcharge (Income &gt; ₹1Cr)</option>
              <option value={TaxBracket.SURCHARGE_TWO_CRORE.toString()}>30% + 25% Surcharge (Income &gt; ₹2Cr)</option>
              <option value={TaxBracket.SURCHARGE_FIVE_CRORE.toString()}>30% + 37% Surcharge (Income &gt; ₹5Cr)</option>
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