import React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  Title,
  Subtitle,
  Paragraph,
  fadeIn,
  colors,
  Divider,
  Button,
  Badge,
  InfoText
} from './StyledComponents';

const GuaranteedIncomePlansInfo: React.FC = () => {
  const openLmgtfyLink = () => {
    window.open('https://letmegooglethat.com/?q=are+guaranteed+income+plans+worth+it', '_blank');
  };

  return (
    <Card
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <Title>Understanding Guaranteed Income Plans</Title>
      
      <Paragraph>
        Guaranteed Income Plans are insurance products that promise a fixed income for a specified period after 
        the premium payment term. They are marketed as safe investment options with guaranteed returns, but it's 
        important to understand their actual returns when adjusted for time value of money.
      </Paragraph>
      
      <InfoText style={{ 
        backgroundColor: `${colors.warning.light}15`, 
        padding: '1rem', 
        borderRadius: '8px',
        border: `1px solid ${colors.warning.light}`,
        marginTop: '1rem',
        marginBottom: '1.5rem'
      }}>
        <strong>Important:</strong> Most guaranteed income plans combine insurance and investment features. 
        This combination typically results in higher fees, lower returns, and less flexibility compared to 
        separate insurance and investment products. Always calculate the XIRR to understand the true returns.
      </InfoText>
      
      <Divider />
      
      <Subtitle>How Guaranteed Income Plans Work</Subtitle>
      <Paragraph>
        These plans typically follow a structure where you:
      </Paragraph>
      <ol>
        <li>Pay premiums for a specified period (e.g., 5-10 years)</li>
        <li>Wait for a deferment period in some cases</li>
        <li>Receive guaranteed income payouts for a fixed duration (e.g., 20-30 years)</li>
        <li>May receive a lump sum amount at the end of the policy term</li>
      </ol>
      
      <Paragraph>
        The plans are designed to provide financial security through predictable income streams, but the 
        actual returns (XIRR) are often lower than what could be achieved through other investment options.
      </Paragraph>
      
      <Divider />
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginBottom: '1.5rem' 
      }}>
        <div>
          <Subtitle>Benefits of Guaranteed Income Plans</Subtitle>
          <ul>
            <li>
              <strong>Guaranteed Returns:</strong> Fixed income regardless of market fluctuations
            </li>
            <li>
              <strong>Tax Benefits:</strong> Premium payments eligible for tax deduction under Section 80C
            </li>
            <li>
              <strong>Tax-Free Income:</strong> Income received is tax-free under Section 10(10D)
            </li>
            <li>
              <strong>Life Cover:</strong> Insurance protection throughout the policy term
            </li>
            <li>
              <strong>Predictable Cash Flow:</strong> Helps in financial planning with fixed income
            </li>
            <li>
              <strong>Low Risk:</strong> No exposure to market volatility
            </li>
            <li>
              <strong>Disciplined Savings:</strong> Enforces regular premium payments
            </li>
          </ul>
        </div>
        
        <div>
          <Subtitle>Drawbacks of Guaranteed Income Plans</Subtitle>
          <ul>
            <li>
              <strong>Low Actual Returns:</strong> XIRR typically ranges from 4-6%, lower than many alternatives
            </li>
            <li>
              <strong>Long Lock-in Periods:</strong> Money is tied up for extended periods
            </li>
            <li>
              <strong>Inflation Impact:</strong> Fixed payouts lose purchasing power over time due to inflation
            </li>
            <li>
              <strong>High Surrender Charges:</strong> Significant penalties for early withdrawal
            </li>
            <li>
              <strong>Opportunity Cost:</strong> Missing out on potentially higher returns from other investments
            </li>
            <li>
              <strong>Complex Terms:</strong> Often difficult to understand the actual returns
            </li>
            <li>
              <strong>Limited Flexibility:</strong> Difficult to adjust to changing financial needs
            </li>
          </ul>
        </div>
      </div>
      
      <Divider />
      
      <Subtitle>Common Types of Guaranteed Income Plans</Subtitle>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Badge color={colors.primary.main}>Immediate Annuity Plans</Badge>
          <Paragraph style={{ marginTop: '0.5rem', marginBottom: '0' }}>
            You pay a lump sum amount and start receiving regular income immediately. Suitable for retirees 
            looking for immediate income streams.
          </Paragraph>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <Badge color={colors.secondary.main}>Deferred Annuity Plans</Badge>
          <Paragraph style={{ marginTop: '0.5rem', marginBottom: '0' }}>
            You pay premiums for a period, followed by a deferment period, after which you start receiving 
            regular income. Suitable for long-term retirement planning.
          </Paragraph>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <Badge color={colors.success.main}>Guaranteed Savings Plans</Badge>
          <Paragraph style={{ marginTop: '0.5rem', marginBottom: '0' }}>
            You pay premiums for a period and receive guaranteed additions or bonuses, with a lump sum 
            payment at maturity. Suitable for specific financial goals.
          </Paragraph>
        </div>
        
        <div>
          <Badge color={colors.warning.main}>Guaranteed Income Plans with Return of Premium</Badge>
          <Paragraph style={{ marginTop: '0.5rem', marginBottom: '0' }}>
            You receive regular income for a period and get your total premiums back at the end of the 
            policy term. Provides both income and capital preservation.
          </Paragraph>
        </div>
      </div>
      
      <Divider />
      
      <Subtitle>Are Guaranteed Income Plans Worth It?</Subtitle>
      <Paragraph>
        Whether guaranteed income plans are worth it depends on your financial goals, risk tolerance, and investment horizon. 
        For risk-averse investors seeking predictable income with tax benefits, they may be suitable. However, for those 
        seeking higher returns and willing to take some market risk, other investment options like mutual funds, PPF, 
        or NPS might offer better long-term growth.
      </Paragraph>
      
      <InfoText style={{ 
        backgroundColor: `${colors.primary.light}15`, 
        padding: '1rem', 
        borderRadius: '8px',
        border: `1px solid ${colors.primary.light}`,
        marginTop: '1rem',
        marginBottom: '1.5rem'
      }}>
        <strong>Alternative Approach:</strong> Consider the "buy term, invest the rest" strategy:
        <ul style={{ marginTop: '0.5rem', marginBottom: '0' }}>
          <li>Purchase a pure term insurance policy for protection needs (5-10x cheaper)</li>
          <li>Invest the premium difference in index funds or other high-return investments</li>
          <li>Create your own "guaranteed income" through systematic withdrawal plans from your investments</li>
          <li>Enjoy better returns, lower fees, and greater flexibility</li>
        </ul>
      </InfoText>
      
      <Paragraph>
        <strong>Key Consideration:</strong> Always calculate the actual XIRR of any guaranteed income plan before investing, 
        as the returns quoted by agents often don't account for the time value of money.
      </Paragraph>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
        <Button onClick={openLmgtfyLink}>
          Is a Guaranteed Income Plan Worth It? (Google Search)
        </Button>
      </div>
    </Card>
  );
};

export default GuaranteedIncomePlansInfo; 