import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Title, Subtitle, Paragraph, Badge, Table, TableRow, TableCell, TableHeader, colors } from './StyledComponents';

interface InvestmentOption {
  name: string;
  typicalReturns: string;
  taxImplications: string;
  taxTags: Array<{
    name: string;
    tooltip: string;
    color: string;
  }>;
  taxEfficiency: 'High' | 'Medium' | 'Low';
}

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <span 
      style={{ 
        position: 'relative', 
        display: 'inline-block',
        cursor: 'help',
        marginRight: '4px'
      }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <span style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: colors.neutral.darkest,
          color: colors.neutral.white,
          padding: '8px 12px',
          borderRadius: '6px',
          width: '250px',
          zIndex: 10,
          fontSize: '0.8rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          marginBottom: '8px',
        }}>
          {text}
          <span style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            marginLeft: '-5px',
            borderWidth: '5px',
            borderStyle: 'solid',
            borderColor: `${colors.neutral.darkest} transparent transparent transparent`
          }}></span>
        </span>
      )}
    </span>
  );
};

const investmentOptions: InvestmentOption[] = [
  {
    name: 'Fixed Deposit (Bank)',
    typicalReturns: '5-9%',
    taxImplications: 'Interest is fully taxable as per income tax slab. TDS applicable if interest exceeds ₹40,000 (₹50,000 for senior citizens) per year. Insured up to ₹5 lakhs by DICGC.',
    taxTags: [
      { name: 'Tax as per slab', tooltip: 'Interest earned is added to your income and taxed according to your income tax slab rate', color: colors.error.light },
      { name: 'TDS', tooltip: 'Tax Deducted at Source at 10% if interest exceeds threshold', color: colors.warning.light }
    ],
    taxEfficiency: 'Low'
  },
  {
    name: 'Fixed Deposit (Corporate)',
    typicalReturns: '7-9%',
    taxImplications: 'Interest is fully taxable as per income tax slab. TDS applicable at 10%. Higher returns come with higher risk as they are not insured.',
    taxTags: [
      { name: 'Tax as per slab', tooltip: 'Interest earned is added to your income and taxed according to your income tax slab rate', color: colors.error.light },
      { name: 'TDS', tooltip: 'Tax Deducted at Source at 10%', color: colors.warning.light },
      { name: 'Higher risk', tooltip: 'Not insured by DICGC, depends on company creditworthiness', color: colors.error.dark }
    ],
    taxEfficiency: 'Low'
  },
  {
    name: 'Public Provident Fund (PPF)',
    typicalReturns: '7.1%',
    taxImplications: 'EEE (Exempt-Exempt-Exempt). Contributions up to ₹1.5L qualify for Section 80C deduction. Interest and maturity amount are tax-free.',
    taxTags: [
      { name: 'EEE', tooltip: 'Exempt-Exempt-Exempt: Investment, returns, and maturity all tax-exempt', color: colors.success.light },
      { name: 'Sec 80C', tooltip: 'Tax deduction under Section 80C up to ₹1.5 lakhs per year', color: colors.success.light },
      { name: 'Long-term locked', tooltip: 'Minimum lock-in period of 15 years', color: colors.warning.light }
    ],
    taxEfficiency: 'High'
  },
  {
    name: 'Equity Mutual Funds',
    typicalReturns: '12-15% (long term)',
    taxImplications: 'LTCG (Long Term Capital Gains) taxed at 10% above ₹1L per year for holdings >1 year. STCG (Short Term) taxed at 15% for holdings <1 year.',
    taxTags: [
      { name: 'LTCG 10%', tooltip: 'Long Term Capital Gains taxed at 10% for holdings more than 1 year (exemption up to ₹1 lakh per year)', color: colors.warning.light },
      { name: 'STCG 15%', tooltip: 'Short Term Capital Gains taxed at 15% for holdings less than 1 year', color: colors.error.light }
    ],
    taxEfficiency: 'Medium'
  },
  {
    name: 'National Pension System (NPS)',
    typicalReturns: '8-10%',
    taxImplications: 'EET (Exempt-Exempt-Taxed). Additional deduction of ₹50,000 under Sec 80CCD(1B). On maturity, 60% can be withdrawn tax-free, 40% must be used for annuity (taxable).',
    taxTags: [
      { name: 'EET', tooltip: 'Exempt-Exempt-Taxed: Investment and returns exempt, but maturity amount partially taxable', color: colors.warning.light },
      { name: 'Sec 80C & 80CCD', tooltip: 'Tax deduction under Section 80C (₹1.5L) and additional ₹50,000 under 80CCD(1B)', color: colors.success.light },
      { name: 'Long-term locked', tooltip: 'Locked until retirement age (60 years)', color: colors.warning.dark }
    ],
    taxEfficiency: 'Medium'
  },
  {
    name: 'ULIP (Unit Linked Insurance Plan)',
    typicalReturns: '6-10%',
    taxImplications: 'Tax-free under Section 10(10D) if annual premium is less than ₹2.5L. For policies purchased after Feb 1, 2021 with premium >₹2.5L, gains are taxable as capital gains.',
    taxTags: [
      { name: 'Sec 10(10D)', tooltip: 'Tax exemption under Section 10(10D) for policies with premium less than ₹2.5 lakhs', color: colors.success.light },
      { name: 'LTCG for high premium', tooltip: 'For premium >₹2.5L (post Feb 2021), taxed as capital gains', color: colors.warning.light },
      { name: 'Long-term locked', tooltip: 'Typically 5-year lock-in period', color: colors.warning.light }
    ],
    taxEfficiency: 'Medium'
  },
  {
    name: 'Traditional Insurance Plans',
    typicalReturns: '4-6%',
    taxImplications: 'Maturity proceeds are tax-free under Section 10(10D) if premium is less than 10% of sum assured. Premium qualifies for Section 80C deduction up to ₹1.5L.',
    taxTags: [
      { name: 'Sec 10(10D)', tooltip: 'Tax exemption under Section 10(10D) for policies with premium less than 10% of sum assured', color: colors.success.light },
      { name: 'Sec 80C', tooltip: 'Tax deduction under Section 80C up to ₹1.5 lakhs per year', color: colors.success.light },
      { name: 'Long-term locked', tooltip: 'Typically locked for the entire policy term (15-30 years)', color: colors.warning.dark }
    ],
    taxEfficiency: 'Medium'
  },
  {
    name: 'Index Funds/ETFs',
    typicalReturns: '10-12% (long term)',
    taxImplications: 'Same as equity mutual funds. LTCG taxed at 10% above ₹1L per year for holdings >1 year. STCG taxed at 15% for holdings <1 year.',
    taxTags: [
      { name: 'LTCG 10%', tooltip: 'Long Term Capital Gains taxed at 10% for holdings more than 1 year (exemption up to ₹1 lakh per year)', color: colors.warning.light },
      { name: 'STCG 15%', tooltip: 'Short Term Capital Gains taxed at 15% for holdings less than 1 year', color: colors.error.light },
      { name: 'Liquid', tooltip: 'Highly liquid investment that can be sold during market hours', color: colors.success.light }
    ],
    taxEfficiency: 'Medium'
  },
  {
    name: 'Debt Mutual Funds',
    typicalReturns: '6-8%',
    taxImplications: 'As per Finance Act 2023, all gains are now taxed at income tax slab rate regardless of holding period.',
    taxTags: [
      { name: 'Tax as per slab', tooltip: 'As per Finance Act 2023, all gains are taxed at your income tax slab rate', color: colors.error.light },
      { name: 'No indexation', tooltip: 'No indexation benefit available after Finance Act 2023', color: colors.error.light },
      { name: 'Liquid', tooltip: 'Can be redeemed with exit load depending on the holding period', color: colors.success.light }
    ],
    taxEfficiency: 'Low'
  },
  {
    name: 'Real Estate Investment',
    typicalReturns: '7-10% (location dependent)',
    taxImplications: 'LTCG taxed at 20% with indexation benefit for holdings >2 years. STCG taxed as per income tax slab. Section 54/54F benefits available for reinvestment.',
    taxTags: [
      { name: 'LTCG 20% with indexation', tooltip: 'Long Term Capital Gains taxed at 20% with indexation benefit for holdings more than 2 years', color: colors.warning.light },
      { name: 'Sec 54/54F', tooltip: 'Tax exemption if reinvested in another property or specified bonds', color: colors.success.light },
      { name: 'Illiquid', tooltip: 'Difficult to sell quickly and may involve significant transaction costs', color: colors.error.dark }
    ],
    taxEfficiency: 'Medium'
  },
  {
    name: 'Corporate Bonds',
    typicalReturns: '7-9%',
    taxImplications: 'Interest income taxed as per income tax slab. Capital gains taxed similar to debt mutual funds.',
    taxTags: [
      { name: 'Tax as per slab', tooltip: 'Interest earned is added to your income and taxed according to your income tax slab rate', color: colors.error.light },
      { name: 'TDS', tooltip: 'Tax Deducted at Source applicable on interest payments', color: colors.warning.light },
      { name: 'Credit risk', tooltip: 'Returns depend on the creditworthiness of the issuing company', color: colors.warning.dark }
    ],
    taxEfficiency: 'Low'
  }
];

const getBadgeColor = (efficiency: 'High' | 'Medium' | 'Low') => {
  switch (efficiency) {
    case 'High':
      return colors.success.dark;
    case 'Medium':
      return colors.warning.dark;
    case 'Low':
      return colors.error.dark;
    default:
      return colors.neutral.dark;
  }
};

const TaxImplications: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <Title>Tax Implications & Typical Returns</Title>
        <Paragraph>
          Understanding the tax implications of different investment options is crucial for calculating the true returns.
          Below is a comparison of various investment options, their typical returns, and tax treatment.
        </Paragraph>
        
        <div style={{ position: 'relative' }}>
          <div 
            className="mobile-scroll-hint"
            style={{ 
              padding: '0.5rem', 
              backgroundColor: `${colors.warning.light}20`, 
              borderRadius: '4px', 
              marginBottom: '1rem',
              fontSize: '0.8rem',
              color: colors.warning.dark,
              textAlign: 'center',
              display: 'none'
            }}
          >
            <span style={{ fontWeight: 600 }}>Tip:</span> On smaller screens, scroll horizontally to see all data or view in card format on mobile.
          </div>
          
          <style>
            {`
              @media (max-width: 768px) {
                .mobile-scroll-hint {
                  display: block !important;
                }
              }
              
              @media (max-width: 480px) {
                .tax-implications-table td {
                  white-space: normal !important;
                  word-wrap: break-word !important;
                }
              }
            `}
          </style>
          
          <Table className="tax-implications-table">
            <colgroup>
              <col style={{ width: '20%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '50%' }} />
              <col style={{ width: '15%' }} />
            </colgroup>
            <thead>
              <tr>
                <TableHeader>Investment Type</TableHeader>
                <TableHeader>Typical Returns</TableHeader>
                <TableHeader>Tax Implications</TableHeader>
                <TableHeader>Tax Efficiency</TableHeader>
              </tr>
            </thead>
            <tbody>
              {investmentOptions.map((option, index) => (
                <TableRow key={index}>
                  <TableCell data-label="Investment Type"><strong>{option.name}</strong></TableCell>
                  <TableCell data-label="Typical Returns">{option.typicalReturns}</TableCell>
                  <TableCell data-label="Tax Implications">
                    <div style={{ 
                      marginBottom: '8px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px'
                    }}>
                      {option.taxTags.map((tag, tagIndex) => (
                        <Tooltip key={tagIndex} text={tag.tooltip}>
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            backgroundColor: `${tag.color}20`,
                            color: tag.color,
                            marginRight: '0',
                            marginBottom: '0'
                          }}>
                            {tag.name}
                          </span>
                        </Tooltip>
                      ))}
                    </div>
                    <div style={{ lineHeight: '1.5' }}>
                      {option.taxImplications}
                    </div>
                  </TableCell>
                  <TableCell data-label="Tax Efficiency">
                    <Badge style={{ backgroundColor: `${getBadgeColor(option.taxEfficiency)}20`, color: getBadgeColor(option.taxEfficiency) }}>
                      {option.taxEfficiency}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
        
        <Subtitle style={{ marginTop: '2rem' }}>Tax Efficiency Explained</Subtitle>
        <Paragraph>
          <strong>High:</strong> Minimal to no tax on returns, often with additional tax benefits on investment.
        </Paragraph>
        <Paragraph>
          <strong>Medium:</strong> Partial tax benefits or lower tax rates compared to regular income tax.
        </Paragraph>
        <Paragraph>
          <strong>Low:</strong> Fully taxable as per income tax slab rates with few or no tax benefits.
        </Paragraph>
        
        <Subtitle style={{ marginTop: '1.5rem' }}>Important Tax Terms</Subtitle>
        <Paragraph>
          <strong>EEE (Exempt-Exempt-Exempt):</strong> Investment, returns, and maturity all tax-exempt.
        </Paragraph>
        <Paragraph>
          <strong>EET (Exempt-Exempt-Taxed):</strong> Investment and returns exempt, but maturity amount taxable.
        </Paragraph>
        <Paragraph>
          <strong>LTCG (Long Term Capital Gains):</strong> Gains from assets held for longer than a specified period.
        </Paragraph>
        <Paragraph>
          <strong>STCG (Short Term Capital Gains):</strong> Gains from assets held for shorter than the specified period.
        </Paragraph>
        
        <Paragraph style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: colors.neutral.dark }}>
          Note: Tax laws are subject to change. The information provided is as per Indian tax laws as of FY 2023-24.
          Always consult a tax professional for personalized advice.
        </Paragraph>
      </Card>
    </motion.div>
  );
};

export default TaxImplications; 