import React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  Subtitle,
  Paragraph,
  fadeIn,
  colors,
  Divider,
  Button,
  InfoText,
  Badge
} from './StyledComponents';

interface InfoSectionProps {
  onTabChange?: (tab: string) => void;
}

const InfoSection: React.FC<InfoSectionProps> = ({ onTabChange }) => {
  return (
    <Card
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <Subtitle>Understanding Investment Returns</Subtitle>
      
      <Paragraph>
        Insurance agents and financial advisors often misrepresent returns on ULIPs (Unit Linked Insurance Plans) 
        and guaranteed income plans by using simplistic calculations that ignore the time value of money.
      </Paragraph>
      
      <InfoText style={{ 
        backgroundColor: `${colors.warning.light}20`, 
        padding: '1rem', 
        borderRadius: '8px',
        border: `1px solid ${colors.warning.light}`,
        marginTop: '1rem'
      }}>
        <strong>Important:</strong> Mixing investment and insurance is rarely optimal. Insurance products that combine 
        investment features typically have higher fees, lower returns, and less flexibility than separate 
        products. For better financial outcomes, consider:
        <ul style={{ marginTop: '0.5rem', marginBottom: '0' }}>
          <li>Pure term insurance for protection needs (much cheaper)</li>
          <li>Dedicated investment vehicles (mutual funds, index funds, etc.) for wealth building</li>
        </ul>
      </InfoText>
      
      <Divider />
      
      <Subtitle id="xirr-explanation">Understanding Different Return Metrics</Subtitle>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <Paragraph style={{ fontWeight: 600, color: colors.primary.dark }}>
          XIRR (Extended Internal Rate of Return)
        </Paragraph>
        <Paragraph>
          XIRR calculates the annualized yield for a series of cash flows occurring at irregular intervals. 
          It's the most accurate metric for investments with:
        </Paragraph>
        <ul>
          <li>Varying payment amounts or frequencies</li>
          <li>Irregular return schedules</li>
          <li>Multiple cash inflows and outflows at different times</li>
        </ul>
        <InfoText>
          XIRR is especially important for evaluating insurance-linked investment plans, which typically 
          have irregular payment and return schedules.
        </InfoText>
        
        <div style={{ 
          backgroundColor: `${colors.primary.light}15`, 
          padding: '1rem', 
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          <Paragraph style={{ fontWeight: 600, marginBottom: '0.5rem', color: colors.primary.dark }}>
            Why XIRR is the Most Accurate Metric:
          </Paragraph>
          <ul style={{ marginTop: '0', marginBottom: '0' }}>
            <li><strong>Time Value of Money:</strong> XIRR properly accounts for when each payment and return occurs, recognizing that money today is worth more than money tomorrow.</li>
            <li><strong>Handles Irregular Cash Flows:</strong> Unlike simpler metrics, XIRR can handle varying payment amounts and irregular timing.</li>
            <li><strong>True Annualized Return:</strong> XIRR expresses returns as an annual percentage, making it easy to compare with other investments like FDs, PPF, or mutual funds.</li>
            <li><strong>Accounts for Compounding:</strong> XIRR factors in the compounding effect of returns over time.</li>
          </ul>
        </div>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <Paragraph style={{ fontWeight: 600, color: colors.primary.dark }}>
          IRR (Internal Rate of Return)
        </Paragraph>
        <Paragraph>
          IRR is similar to XIRR but assumes equal time periods between cash flows. It's useful for:
        </Paragraph>
        <ul>
          <li>Regular, evenly spaced investments</li>
          <li>Projects with consistent cash flow timing</li>
        </ul>
        <InfoText>
          IRR is less accurate than XIRR for most insurance and investment plans that have varying 
          payment schedules or irregular returns.
        </InfoText>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <Paragraph style={{ fontWeight: 600, color: colors.primary.dark }}>
          CAGR (Compound Annual Growth Rate)
        </Paragraph>
        <Paragraph>
          CAGR measures the mean annual growth rate of an investment over a specified time period. It:
        </Paragraph>
        <ul>
          <li>Smooths out returns to show a steady growth rate</li>
          <li>Only considers the beginning and ending values</li>
          <li>Ignores volatility and interim cash flows</li>
        </ul>
        <InfoText>
          CAGR is simpler but less accurate for complex investments with multiple cash flows.
        </InfoText>
      </div>
      
      <div style={{ 
        backgroundColor: `${colors.primary.light}15`, 
        padding: '1rem', 
        borderRadius: '8px',
        marginBottom: '1.5rem'
      }}>
        <Paragraph style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
          Why XIRR is the Best Metric for Evaluating Insurance Plans:
        </Paragraph>
        <ul style={{ marginTop: '0', marginBottom: '0' }}>
          <li>Accounts for the exact timing of each payment and return</li>
          <li>Properly values the time value of money</li>
          <li>Handles irregular payment schedules common in insurance products</li>
          <li>Provides a true annualized return that can be compared across different investment types</li>
        </ul>
      </div>
      
      <Divider />
      
      <Subtitle>Common Misleading Practices</Subtitle>
      <Paragraph>
        Insurance agents often quote returns by simply dividing the total returns by the total investment, 
        ignoring the long lock-in periods and delayed gratification. For example, they might say:
      </Paragraph>
      <ul>
        <li>"You invest ₹11 lakhs and get back ₹21.7 lakhs - that's a 97% return!"</li>
        <li>"The annual return is 4.6% (97% ÷ 21 years)"</li>
      </ul>
      <Paragraph>
        These calculations are misleading because they don't account for the time value of money. 
        When calculated properly using XIRR, many of these "attractive" plans yield returns of just 3-5%, 
        which is often lower than inflation and significantly less than what you could earn through 
        other investment options like index funds.
      </Paragraph>
      
      <InfoText style={{ 
        backgroundColor: `${colors.error.light}15`, 
        padding: '1rem', 
        borderRadius: '8px',
        border: `1px solid ${colors.error.light}`,
        marginTop: '1rem'
      }}>
        <strong>Red Flag:</strong> When an insurance product is marketed primarily for its investment returns 
        rather than its insurance benefits, it's often a sign that you're paying for unnecessary features. 
        Pure investment products almost always outperform insurance-investment hybrids over the long term.
      </InfoText>
      
      <Divider />
      
      <Subtitle>How to Use This Calculator</Subtitle>
      <Paragraph>
        1. Enter the details of the investment plan as presented by your agent
      </Paragraph>
      <Paragraph>
        2. See the actual XIRR, IRR, and CAGR returns
      </Paragraph>
      <Paragraph>
        3. Compare these returns with other investment options like fixed deposits, PPF, or index funds
      </Paragraph>
      <Paragraph>
        4. Make an informed decision based on the true returns, not the marketing pitch
      </Paragraph>
      
      <Divider />
      
      <Subtitle>Alternative Investments</Subtitle>
      <Paragraph>
        For comparison, here are typical returns from other investment options in India:
      </Paragraph>
      <ul>
        <li>Fixed Deposits (Bank): 5-9% per annum (insured up to ₹5 lakhs)</li>
        <li>Fixed Deposits (Corporate): 7-9% per annum (higher risk)</li>
        <li>Public Provident Fund (PPF): 7.1% per annum (tax-free)</li>
        <li>National Pension System (NPS): 8-10% per annum (historical)</li>
        <li>Index Funds (Nifty 50): ~12% per annum (historical, long-term)</li>
      </ul>
      
      <InfoText style={{ 
        backgroundColor: `${colors.success.light}15`, 
        padding: '1rem', 
        borderRadius: '8px',
        border: `1px solid ${colors.success.light}`,
        marginTop: '1rem',
        marginBottom: '1.5rem'
      }}>
        <strong>Better Approach:</strong> Instead of buying an expensive insurance-investment hybrid product, 
        consider a "buy term, invest the rest" strategy:
        <ul style={{ marginTop: '0.5rem', marginBottom: '0' }}>
          <li>Purchase a pure term insurance policy for protection (typically 5-10x cheaper)</li>
          <li>Invest the premium difference in index funds or other high-return investments</li>
          <li>Enjoy better returns, lower fees, and greater flexibility</li>
        </ul>
      </InfoText>
      
      <Divider />
      
      <Paragraph style={{ marginTop: '1.5rem' }}>
        <strong>Want to understand the tax implications of different investment options?</strong>
      </Paragraph>
      {onTabChange && (
        <Button 
          onClick={() => onTabChange('tax')}
          style={{ marginTop: '1rem' }}
        >
          View Tax Implications
        </Button>
      )}
    </Card>
  );
};

export default InfoSection; 