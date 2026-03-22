import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  InfoText,
  ErrorText,
  fadeIn,
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
  renderMobileSummary?: () => React.ReactNode;
}

const defaultPlanValues: InvestmentPlan = {
  annualPayment: 110000, paymentYears: 10, returnAmount: 107000, returnStartYear: 12,
  returnYears: 10, finalReturnYear: 21, finalReturnAmount: 1100000,
  paymentFrequency: PaymentFrequency.ANNUAL, returnFrequency: PaymentFrequency.ANNUAL,
  taxBracket: TaxBracket.ZERO
};

const presets: { name: string; desc: string; plan: InvestmentPlan }[] = [
  { name: 'Endowment', desc: '10yr pay, lump sum', plan: { ...defaultPlanValues, annualPayment: 100000, returnAmount: 0, returnYears: 0, returnStartYear: 1, finalReturnYear: 15, finalReturnAmount: 1800000 } },
  { name: 'Guaranteed', desc: '10yr pay, income+lump', plan: defaultPlanValues },
  { name: 'ULIP', desc: '5yr pay, lump sum yr 10', plan: { ...defaultPlanValues, annualPayment: 200000, paymentYears: 5, returnAmount: 0, returnYears: 0, returnStartYear: 1, finalReturnYear: 10, finalReturnAmount: 1500000 } },
  { name: 'Pension', desc: '20yr pay, monthly income', plan: { ...defaultPlanValues, annualPayment: 60000, paymentYears: 20, returnAmount: 96000, returnStartYear: 21, returnYears: 15, finalReturnYear: 0, finalReturnAmount: 0, paymentFrequency: PaymentFrequency.MONTHLY, returnFrequency: PaymentFrequency.MONTHLY } },
];

const getDisplayAmount = (annualAmount: number, frequency: PaymentFrequency): { value: number, label: string } => {
  switch (frequency) {
    case PaymentFrequency.MONTHLY: return { value: Math.round(annualAmount / 12), label: 'Monthly' };
    case PaymentFrequency.QUARTERLY: return { value: Math.round(annualAmount / 4), label: 'Quarterly' };
    case PaymentFrequency.HALF_YEARLY: return { value: Math.round(annualAmount / 2), label: 'Half-Yearly' };
    default: return { value: annualAmount, label: 'Annual' };
  }
};

// Step block: wraps entire step content in colored background
const StepBlock = ({ number, title, tooltip, bgColor, borderColor, children }: {
  number: number; title: string; tooltip: string; bgColor: string; borderColor: string; children: React.ReactNode;
}) => (
  <div className="step-block" style={{
    backgroundColor: bgColor,
    borderLeft: `3px solid ${borderColor}`,
    borderRadius: '8px',
    padding: '0.75rem',
    marginBottom: '0.75rem',
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem',
    }}>
      <div style={{
        width: '22px', height: '22px', borderRadius: '50%',
        backgroundColor: borderColor, color: colors.neutral.white,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: '0.7rem', flexShrink: 0
      }}>{number}</div>
      <span style={{ fontWeight: 600, color: colors.neutral.darkest, fontSize: '0.85rem' }}>{title}</span>
      <span
        className="tooltip-trigger"
        style={{
          cursor: 'help', position: 'relative', display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center',
          width: '15px', height: '15px', borderRadius: '50%',
          backgroundColor: colors.neutral.medium, color: 'white',
          fontSize: '9px', fontWeight: 'bold', flexShrink: 0
        }}
      >
        ?
        <div className="tooltip-content" style={{
          position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: colors.neutral.dark, color: 'white', padding: '0.5rem',
          borderRadius: '4px', width: '220px', zIndex: 100, fontSize: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)', display: 'none',
        }}>{tooltip}</div>
      </span>
    </div>
    {children}
  </div>
);

// Step dots for mobile wizard
const StepDots = ({ current, total, onDotClick }: { current: number; total: number; onDotClick: (step: number) => void }) => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
    {Array.from({ length: total }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onDotClick(i)}
        style={{
          width: i === current ? '24px' : '8px', height: '8px', borderRadius: '4px',
          backgroundColor: i === current ? colors.primary.dark : i < current ? colors.primary.light : colors.neutral.light,
          border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0
        }}
      />
    ))}
  </div>
);

const InvestmentForm: React.FC<InvestmentFormProps> = ({
  onCalculate, onReset, loading, onTabChange, onFormChange, currentPlan, scrollToResults, renderMobileSummary
}) => {
  const [formData, setFormData] = useState<InvestmentPlan>(currentPlan || defaultPlanValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentDisplay, setPaymentDisplay] = useState(getDisplayAmount(formData.annualPayment, formData.paymentFrequency));
  const [returnDisplay, setReturnDisplay] = useState(getDisplayAmount(formData.returnAmount, formData.returnFrequency));
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mobileStep, setMobileStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    setPaymentDisplay(getDisplayAmount(formData.annualPayment, formData.paymentFrequency));
    setReturnDisplay(getDisplayAmount(formData.returnAmount, formData.returnFrequency));
  }, [formData.annualPayment, formData.returnAmount, formData.paymentFrequency, formData.returnFrequency]);

  useEffect(() => {
    if (formData.returnAmount > 0 && formData.returnYears > 0) {
      const last = formData.returnStartYear + formData.returnYears - 1;
      if (formData.finalReturnYear > 0 && formData.finalReturnYear < last) {
        setFormData(prev => ({ ...prev, finalReturnYear: last }));
      }
    }
  }, [formData.returnStartYear, formData.returnYears]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let u = { ...formData };
    if (name === 'paymentFrequency' || name === 'returnFrequency') {
      u = { ...formData, [name]: value as PaymentFrequency };
    } else if (name === 'taxBracket') {
      u = { ...formData, [name]: parseFloat(value) as TaxBracket };
    } else if (['paymentYears', 'returnStartYear', 'returnYears', 'finalReturnYear'].includes(name)) {
      u = { ...formData, [name]: Math.floor(parseFloat(value)) || 0 };
    } else {
      u = { ...formData, [name]: parseFloat(value) || 0 };
    }
    if (name === 'finalReturnYear' && u.returnAmount > 0 && u.returnYears > 0) {
      const last = u.returnStartYear + u.returnYears - 1;
      if (u.finalReturnYear > 0 && u.finalReturnYear < last) u.finalReturnYear = last;
    }
    setFormData(u);
    if (name === 'paymentFrequency') setPaymentDisplay(getDisplayAmount(u.annualPayment, u.paymentFrequency as PaymentFrequency));
    if (onFormChange) onFormChange(u);
  };

  const handleSliderChange = (name: string, value: number) => {
    const u = { ...formData, [name]: value };
    setFormData(u);
    if (onFormChange) onFormChange(u);
  };

  const applyPreset = (preset: InvestmentPlan) => {
    setFormData(preset);
    setErrors({});
    if (onFormChange) onFormChange(preset);
  };

  const validateForm = (): boolean => {
    const e: Record<string, string> = {};
    if (formData.annualPayment <= 0) e.annualPayment = 'Must be greater than 0';
    if (formData.paymentYears <= 0) e.paymentYears = 'Must be greater than 0';
    if (formData.returnYears < 0) e.returnYears = 'Cannot be negative';
    if (formData.returnAmount > 0 && formData.returnStartYear < 1) e.returnStartYear = 'Must be at least 1';
    if (formData.returnAmount > 0 && formData.returnYears > 0) {
      const last = formData.returnStartYear + formData.returnYears - 1;
      if (formData.finalReturnYear > 0 && formData.finalReturnYear < last) e.finalReturnYear = `Must be after Year ${last}`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // On mobile wizard, pressing Enter in an input should advance to next step
    const lastStep = isMobile && renderMobileSummary ? 3 : 2;
    if (isMobile && mobileStep < lastStep) {
      setMobileStep(s => s + 1);
      return;
    }
    if (validateForm()) {
      onCalculate(formData);
      if (scrollToResults) setTimeout(() => scrollToResults(), 100);
    }
  };

  const handleReset = () => {
    setFormData(defaultPlanValues);
    setErrors({});
    onReset();
  };

  const getMinFinalReturnYear = (): number => {
    if (formData.returnAmount > 0 && formData.returnYears > 0) return formData.returnStartYear + formData.returnYears - 1;
    return 0;
  };

  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `.tooltip-trigger:hover .tooltip-content { display: block !important; }`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const freqConvert = (value: number, freq: PaymentFrequency, toAnnual: boolean) => {
    const m = freq === PaymentFrequency.MONTHLY ? 12 : freq === PaymentFrequency.QUARTERLY ? 4 : freq === PaymentFrequency.HALF_YEARLY ? 2 : 1;
    return toAnnual ? value * m : value;
  };

  // --- Step content renderers ---
  const renderStep1 = () => (
    <StepBlock number={1} title="What You Pay" tooltip="Enter your premium or investment amount, how often you pay, and for how many years" bgColor={`${colors.primary.light}08`} borderColor={colors.primary.main}>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <FormGroup style={{ flex: '2 1 140px', minWidth: '140px', marginBottom: '0.5rem' }}>
          <Label htmlFor="annualPayment">{paymentDisplay.label} amount</Label>
          <Input type="number" id="annualPayment" name="annualPayment"
            value={formData.paymentFrequency === PaymentFrequency.ANNUAL ? formData.annualPayment : paymentDisplay.value}
            onChange={(e) => {
              const v = parseFloat(e.target.value) || 0;
              setFormData(prev => ({ ...prev, annualPayment: freqConvert(v, formData.paymentFrequency, true) }));
            }}
            disabled={loading} min="0"
          />
          {errors.annualPayment && <ErrorText>{errors.annualPayment}</ErrorText>}
        </FormGroup>
        <FormGroup style={{ flex: '1 1 100px', minWidth: '100px', marginBottom: '0.5rem' }}>
          <Label htmlFor="paymentFrequency">Frequency</Label>
          <Select id="paymentFrequency" name="paymentFrequency" value={formData.paymentFrequency} onChange={handleChange} disabled={loading}>
            <option value={PaymentFrequency.ANNUAL}>Annual</option>
            <option value={PaymentFrequency.HALF_YEARLY}>Half-Yearly</option>
            <option value={PaymentFrequency.QUARTERLY}>Quarterly</option>
            <option value={PaymentFrequency.MONTHLY}>Monthly</option>
          </Select>
        </FormGroup>
        <FormGroup style={{ flex: '1 1 80px', minWidth: '80px', marginBottom: '0.5rem' }}>
          <Label htmlFor="paymentYears">Years</Label>
          <NumberInputField id="paymentYears" name="paymentYears" value={formData.paymentYears} onChange={handleChange} min={1} max={100} disabled={loading} />
          {errors.paymentYears && <ErrorText>{errors.paymentYears}</ErrorText>}
        </FormGroup>
      </div>
      {!isMobile && (
        <>
          <Slider type="range" id="annualPaymentSlider" min="0" max="3000000" step="10000"
            value={formData.paymentFrequency === PaymentFrequency.ANNUAL ? formData.annualPayment : paymentDisplay.value}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              handleSliderChange('annualPayment', freqConvert(v, formData.paymentFrequency, true));
            }} disabled={loading} />
          <SliderValue><span>₹0</span><span>₹30L</span></SliderValue>
        </>
      )}
    </StepBlock>
  );

  const renderStep2 = () => (
    <StepBlock number={2} title="What You Get Back" tooltip="Enter regular payouts (if any), when they begin, and any lump sum at maturity" bgColor={`${colors.success.light}08`} borderColor={colors.success.main}>
      {/* Regular payouts row */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <FormGroup style={{ flex: '2 1 140px', minWidth: '140px', marginBottom: '0.5rem' }}>
          <Label htmlFor="returnAmount">{returnDisplay.label} payout</Label>
          <Input type="number" id="returnAmount" name="returnAmount"
            value={formData.returnFrequency === PaymentFrequency.ANNUAL ? formData.returnAmount : returnDisplay.value}
            onChange={(e) => {
              const v = parseFloat(e.target.value) || 0;
              setFormData(prev => ({ ...prev, returnAmount: freqConvert(v, formData.returnFrequency, true) }));
            }}
            disabled={loading} min="0"
          />
          {errors.returnAmount && <ErrorText>{errors.returnAmount}</ErrorText>}
        </FormGroup>
        <FormGroup style={{ flex: '1 1 100px', minWidth: '100px', marginBottom: '0.5rem' }}>
          <Label htmlFor="returnFrequency">Frequency</Label>
          <Select id="returnFrequency" name="returnFrequency" value={formData.returnFrequency} onChange={handleChange} disabled={loading}>
            <option value={PaymentFrequency.ANNUAL}>Annual</option>
            <option value={PaymentFrequency.HALF_YEARLY}>Half-Yearly</option>
            <option value={PaymentFrequency.QUARTERLY}>Quarterly</option>
            <option value={PaymentFrequency.MONTHLY}>Monthly</option>
          </Select>
        </FormGroup>
      </div>

      {/* Payout timing row */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <FormGroup style={{ flex: '1 1 100px', minWidth: '100px', marginBottom: '0.5rem' }}>
          <Label htmlFor="returnStartYear">Starts at year</Label>
          <NumberInputField id="returnStartYear" name="returnStartYear" value={formData.returnStartYear} onChange={handleChange} min={1} max={100} disabled={loading} />
          {errors.returnStartYear && <ErrorText>{errors.returnStartYear}</ErrorText>}
        </FormGroup>
        <FormGroup style={{ flex: '1 1 100px', minWidth: '100px', marginBottom: '0.5rem' }}>
          <Label htmlFor="returnYears">For years</Label>
          <NumberInputField id="returnYears" name="returnYears" value={formData.returnYears} onChange={handleChange} min={0} max={100} disabled={loading} />
          {errors.returnYears && <ErrorText>{errors.returnYears}</ErrorText>}
        </FormGroup>
      </div>

      <InfoText style={{ marginBottom: '0.5rem', fontSize: '0.75rem', color: colors.neutral.dark }}>
        Set payout & years to 0 if no regular returns.
      </InfoText>

      {/* Lump sum row */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <FormGroup style={{ flex: '2 1 140px', minWidth: '140px', marginBottom: '0.5rem' }}>
          <Label htmlFor="finalReturnAmount">Lump sum at maturity</Label>
          <Input type="number" id="finalReturnAmount" name="finalReturnAmount" value={formData.finalReturnAmount} onChange={handleChange} disabled={loading} min="0" />
          {errors.finalReturnAmount && <ErrorText>{errors.finalReturnAmount}</ErrorText>}
        </FormGroup>
        <FormGroup style={{ flex: '1 1 100px', minWidth: '100px', marginBottom: '0.5rem' }}>
          <Label htmlFor="finalReturnYear">In year</Label>
          <NumberInputField id="finalReturnYear" name="finalReturnYear" value={formData.finalReturnYear} onChange={handleChange} min={getMinFinalReturnYear()} disabled={loading} />
          {errors.finalReturnYear && <ErrorText>{errors.finalReturnYear}</ErrorText>}
        </FormGroup>
      </div>
      {!isMobile && (
        <>
          <Slider type="range" id="finalReturnAmountSlider" min="0" max="20000000" step="10000"
            value={formData.finalReturnAmount}
            onChange={(e) => handleSliderChange('finalReturnAmount', parseInt(e.target.value))} disabled={loading} />
          <SliderValue><span>₹0</span><span>₹2Cr</span></SliderValue>
        </>
      )}
      <InfoText style={{ fontSize: '0.7rem' }}>Set both to 0 if no lump sum.{getMinFinalReturnYear() > 0 && ` Min year: ${getMinFinalReturnYear()}`}</InfoText>
    </StepBlock>
  );

  const renderStep3 = () => (
    <StepBlock number={3} title="Advanced" tooltip="Optional: set your tax bracket to see tax-adjusted returns" bgColor={`${colors.secondary.light}08`} borderColor={colors.secondary.main}>
      <FormGroup style={{ marginBottom: '0.25rem' }}>
        <Label htmlFor="taxBracket">Tax bracket</Label>
        <Select id="taxBracket" name="taxBracket" value={formData.taxBracket?.toString() || '0'} onChange={handleChange} disabled={loading}>
          <option value={TaxBracket.ZERO.toString()}>No Tax (0%)</option>
          <option value={TaxBracket.FIVE.toString()}>5%</option>
          <option value={TaxBracket.TEN.toString()}>10%</option>
          <option value={TaxBracket.FIFTEEN.toString()}>15%</option>
          <option value={TaxBracket.TWENTY.toString()}>20%</option>
          <option value={TaxBracket.TWENTY_FIVE.toString()}>25%</option>
          <option value={TaxBracket.THIRTY.toString()}>30%</option>
          <option value={TaxBracket.SURCHARGE_FIFTY_LAKHS.toString()}>30% + 10% surcharge</option>
          <option value={TaxBracket.SURCHARGE_ONE_CRORE.toString()}>30% + 15% surcharge</option>
          <option value={TaxBracket.SURCHARGE_TWO_CRORE.toString()}>30% + 25% surcharge</option>
          <option value={TaxBracket.SURCHARGE_FIVE_CRORE.toString()}>30% + 37% surcharge</option>
        </Select>
        <InfoText style={{ fontSize: '0.7rem' }}>
          Leave at "No Tax" if unsure.
          {onTabChange && <span style={{ color: colors.primary.dark, textDecoration: 'underline', cursor: 'pointer', marginLeft: '0.25rem' }} onClick={() => onTabChange('tax')}>Learn more</span>}
        </InfoText>
      </FormGroup>
    </StepBlock>
  );

  // --- MOBILE: Step-by-step wizard ---
  if (isMobile) {
    const hasSummary = !!renderMobileSummary;
    const totalSteps = hasSummary ? 4 : 3;
    const isLastStep = mobileStep === totalSteps - 1;
    const isSummaryStep = hasSummary && mobileStep === 3;

    const btnStyle = (primary: boolean) => ({
      flex: 1, padding: '0.7rem', borderRadius: '8px', fontWeight: 600 as const, fontSize: '0.9rem', cursor: 'pointer' as const,
      ...(primary
        ? { border: 'none', backgroundColor: colors.primary.dark, color: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }
        : { border: `2px solid ${colors.primary.main}`, backgroundColor: 'white', color: colors.primary.dark })
    });

    return (
      <Card style={{ padding: '1rem' }}>
        <FormContainer as="form" onSubmit={handleSubmit}>
          {/* Presets: horizontal scroll strip */}
          {mobileStep < 3 && (
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: colors.neutral.dark, marginBottom: '0.35rem' }}>Templates:</div>
              <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px' }}>
                {presets.map((p) => (
                  <button key={p.name} type="button" onClick={() => { applyPreset(p.plan); setMobileStep(0); }}
                    style={{
                      padding: '0.35rem 0.6rem', borderRadius: '16px', border: `1px solid ${colors.neutral.light}`,
                      backgroundColor: colors.neutral.white, cursor: 'pointer', whiteSpace: 'nowrap',
                      fontSize: '0.7rem', fontWeight: 500, color: colors.primary.dark, flexShrink: 0
                    }}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <StepDots current={mobileStep} total={totalSteps} onDotClick={setMobileStep} />

          <AnimatePresence mode="wait">
            <motion.div
              key={mobileStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
            >
              {mobileStep === 0 && renderStep1()}
              {mobileStep === 1 && renderStep2()}
              {mobileStep === 2 && renderStep3()}
              {mobileStep === 3 && renderMobileSummary && renderMobileSummary()}
            </motion.div>
          </AnimatePresence>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', gap: '0.5rem' }}>
            {mobileStep > 0 ? (
              <button type="button" onClick={() => setMobileStep(s => s - 1)} style={btnStyle(false)}>
                Back
              </button>
            ) : (
              <button type="button" onClick={handleReset} style={btnStyle(false)}>
                Reset
              </button>
            )}
            {isSummaryStep ? (
              <button type="submit" disabled={loading}
                style={{ ...btnStyle(true), opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Calculating...' : 'Calculate Returns'}
              </button>
            ) : (
              <button type="button" onClick={() => setMobileStep(s => s + 1)} style={btnStyle(true)}>
                Next
              </button>
            )}
          </div>
        </FormContainer>
      </Card>
    );
  }

  // --- DESKTOP: All steps visible with alternating backgrounds ---
  return (
    <Card>
      <FormContainer as="form" onSubmit={handleSubmit}>
        <motion.div variants={fadeIn} initial="hidden" animate="visible">

          {/* Presets: horizontal row */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: colors.neutral.darker, marginBottom: '0.4rem' }}>Templates:</div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {presets.map((p) => (
                <button key={p.name} type="button" onClick={() => applyPreset(p.plan)}
                  style={{
                    padding: '0.35rem 0.75rem', borderRadius: '16px', border: `1px solid ${colors.neutral.light}`,
                    backgroundColor: colors.neutral.white, cursor: 'pointer', fontSize: '0.8rem',
                    fontWeight: 500, color: colors.primary.dark, transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.primary.main; e.currentTarget.style.backgroundColor = `${colors.primary.light}10`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.neutral.light; e.currentTarget.style.backgroundColor = colors.neutral.white; }}
                >
                  {p.name} <span style={{ fontSize: '0.7rem', color: colors.neutral.dark, fontWeight: 400 }}>— {p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {renderStep1()}
          {renderStep2()}

          {/* Advanced toggle */}
          <button type="button" onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none',
              cursor: 'pointer', color: colors.neutral.darker, fontWeight: 600, fontSize: '0.85rem',
              padding: '0.5rem 0', marginTop: '0.5rem'
            }}>
            <span style={{ transform: showAdvanced ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', display: 'inline-block', fontSize: '0.7rem' }}>▶</span>
            Advanced <span style={{ fontSize: '0.7rem', fontWeight: 400, color: colors.neutral.dark }}>(tax bracket)</span>
          </button>
          {showAdvanced && renderStep3()}

          <Flex style={{ justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <SecondaryButton type="button" onClick={handleReset} disabled={loading}>Reset</SecondaryButton>
            <Button type="submit" disabled={loading}>{loading ? 'Calculating...' : 'Calculate Returns'}</Button>
          </Flex>
        </motion.div>
      </FormContainer>
    </Card>
  );
};

export default InvestmentForm;
