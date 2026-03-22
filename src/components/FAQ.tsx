import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  Subtitle,
  InfoText,
  colors,
  fadeIn
} from './StyledComponents';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'Why can XIRR be negative?',
    answer: 'XIRR can be negative when the total returns (including timing) are less than the total investment. This means you would have been better off keeping your money in a savings account. Negative XIRR is common in plans with high upfront costs, long lock-in periods, or poor payout structures.'
  },
  {
    question: 'How does payment frequency affect XIRR?',
    answer: 'Paying monthly instead of annually typically results in a slightly lower XIRR because your money is invested sooner and has more time to potentially grow elsewhere. Monthly payments mean you lose access to your money earlier in each year compared to a single annual payment.'
  },
  {
    question: 'What does "Return Start Year" mean?',
    answer: 'Return Start Year is the year (relative to your first payment) when you start receiving regular payouts. For example, if you pay premiums for 10 years and returns start in Year 12, there is a 1-year waiting period after your last payment before returns begin. This waiting period reduces your effective XIRR.'
  },
  {
    question: 'Is 5-6% XIRR good for a guaranteed plan?',
    answer: 'A 5-6% XIRR is typical for most guaranteed income plans but is generally considered below average. After accounting for inflation (5-6%), your real return is effectively near zero. Bank FDs offer similar rates with more liquidity, and PPF offers 7.1% tax-free. Index funds have historically returned 10-12% over the long term, though with higher volatility.'
  },
  {
    question: 'Why does my insurance agent show higher returns?',
    answer: 'Insurance agents often quote "total returns" or "absolute returns" which don\'t account for the time value of money. For example, paying ₹1L/year for 10 years and getting back ₹20L after 20 years sounds like a 100% return, but the XIRR is only about 4-5% because your early payments were locked in for much longer. XIRR is the only accurate way to compare investments with different cash flow timings.'
  },
  {
    question: 'What if I surrender my policy early?',
    answer: 'Early surrender usually results in significant losses due to surrender charges, especially in the first few years. Most plans have a lock-in period (typically 3-5 years) during which you may get back less than what you paid. This calculator does not model surrender scenarios — it assumes you complete the full term as planned.'
  },
  {
    question: 'Should I "buy term insurance and invest the rest"?',
    answer: 'This is a widely recommended strategy by financial planners. A pure term insurance plan costs a fraction of an endowment or ULIP, and investing the difference in index funds or PPF typically yields much higher returns. For example, a ₹1 crore term plan for a 30-year-old costs about ₹10,000-15,000/year, while an equivalent endowment plan might cost ₹1,00,000+/year with lower returns.'
  },
  {
    question: 'What is the difference between XIRR, IRR, and CAGR?',
    answer: 'XIRR (Extended Internal Rate of Return) is the most accurate — it considers exact dates of each cash flow. IRR assumes equal time periods between cash flows, making it less precise for irregular payments. CAGR only considers the initial and final values, ignoring intermediate cash flows entirely. For insurance plans with multiple payments and returns, XIRR is the gold standard.'
  },
  {
    question: 'Does this calculator account for taxes?',
    answer: 'Yes, when you select a tax bracket, the calculator shows a "Tax-Adjusted Equivalent Return." This shows what a fully taxable investment would need to earn pre-tax to match the after-tax return of your plan. Insurance payouts under Section 10(10D) are tax-free if annual premium is under ₹5 lakh, making this comparison important.'
  },
  {
    question: 'Why does the calculator assume January 1 as the start date?',
    answer: 'The specific start date doesn\'t affect the XIRR calculation because XIRR measures the annualized rate of return based on time intervals between cash flows. Whether your plan starts in January or July, the gaps between payments and returns remain the same, so the XIRR result is identical.'
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <Card>
        <Subtitle>Frequently Asked Questions</Subtitle>
        <InfoText style={{ marginBottom: '1.5rem' }}>
          Common questions about XIRR calculations, insurance returns, and how to use this calculator.
        </InfoText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {faqItems.map((item, index) => (
            <div
              key={index}
              style={{
                border: `1px solid ${openIndex === index ? colors.primary.light : colors.neutral.light}`,
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'border-color 0.2s ease'
              }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  textAlign: 'left',
                  backgroundColor: openIndex === index ? `${colors.primary.light}10` : colors.neutral.white,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: colors.neutral.darkest,
                  transition: 'background-color 0.2s ease'
                }}
              >
                <span>{item.question}</span>
                <span style={{
                  fontSize: '1.2rem',
                  flexShrink: 0,
                  transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease'
                }}>
                  ▼
                </span>
              </button>

              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: '0 1rem 1rem 1rem',
                    color: colors.neutral.dark,
                    fontSize: '0.9rem',
                    lineHeight: '1.6'
                  }}
                >
                  {item.answer}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default FAQ;
