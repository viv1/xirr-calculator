import React from 'react';
import { render, screen, fireEvent } from './test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import ResultsDisplay from '../ResultsDisplay';
import { CalculationResult, TaxBracket, InvestmentPlan, PaymentFrequency } from '../../types';

// Mock framer-motion to avoid animation-related issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

// Mock plan for testing
const mockPlan: InvestmentPlan = {
  annualPayment: 100000,
  paymentYears: 5,
  returnAmount: 50000,
  returnStartYear: 6,
  returnYears: 5,
  finalReturnYear: 10,
  finalReturnAmount: 500000,
  paymentFrequency: PaymentFrequency.ANNUAL,
  returnFrequency: PaymentFrequency.ANNUAL,
  taxBracket: TaxBracket.ZERO
};

describe('ResultsDisplay Component', () => {
  const mockResult: CalculationResult = {
    xirr: 0.12, // 12%
    irr: 0.115, // 11.5%
    cagr: 0.11, // 11%
    totalInvested: 100000,
    totalReturns: 150000,
    netProfit: 50000,
    taxAdjustedXirr: 0.15, // 15%
    cashflows: [
      {
        date: new Date('2023-01-01'),
        amount: -50000,
        description: 'Payment'
      },
      {
        date: new Date('2023-07-01'),
        amount: -50000,
        description: 'Payment'
      },
      {
        date: new Date('2024-01-01'),
        amount: 150000,
        description: 'Return'
      }
    ]
  };

  // Mock document.getElementById and scrollIntoView
  const scrollIntoViewMock = vi.fn();
  
  beforeEach(() => {
    // Setup mock for document.getElementById
    vi.spyOn(document, 'getElementById').mockImplementation(() => ({
      scrollIntoView: scrollIntoViewMock
    } as unknown as HTMLElement));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns null when result is null', () => {
    const { container } = render(<ResultsDisplay result={null} plan={mockPlan} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders main results correctly', () => {
    render(<ResultsDisplay result={mockResult} plan={mockPlan} />);
    
    // Check for XIRR value (primary metric, always visible)
    const xirrValue = screen.getByText(/12(?:\.00)?%/, { selector: '.highlight-value' });
    expect(xirrValue).toBeInTheDocument();

    // IRR/CAGR are now behind "Show detailed metrics" toggle, so check monetary values
    expect(screen.getAllByText(/₹\s*1[,.]00[,.]000/).length).toBeGreaterThanOrEqual(1); // Total invested
    expect(screen.getAllByText(/₹\s*1[,.]50[,.]000/).length).toBeGreaterThanOrEqual(1); // Total returns
    expect(screen.getAllByText(/₹\s*50[,.]000/).length).toBeGreaterThanOrEqual(1); // Net profit
  });

  it('formats currency values correctly', () => {
    render(<ResultsDisplay result={mockResult} plan={mockPlan} />);
    expect(screen.getAllByText(/₹\s*1[,.]00[,.]000/).length).toBeGreaterThanOrEqual(1);
  });

  it('displays tax-adjusted XIRR when available', () => {
    render(<ResultsDisplay result={mockResult} plan={mockPlan} />);
    expect(screen.getByText(/15(?:\.00)?%/)).toBeInTheDocument(); // Tax-adjusted XIRR
  });

  it('shows changes notification when hasChanges is true', () => {
    render(<ResultsDisplay result={mockResult} hasChanges={true} plan={mockPlan} />);
    expect(screen.getByText(/you've made changes/i)).toBeInTheDocument();
  });

  it('calls onTabChange when understanding XIRR link is clicked', () => {
    const mockOnTabChange = vi.fn();
    render(<ResultsDisplay result={mockResult} onTabChange={mockOnTabChange} plan={mockPlan} />);
    
    const learnMoreButton = screen.getByText(/Learn more about XIRR/i);
    learnMoreButton.click();
    
    expect(mockOnTabChange).toHaveBeenCalledWith('info');
  });

  it('shows correct rating badge based on XIRR value', () => {
    const poorResult = { ...mockResult, xirr: 0.06 }; // 6%
    const averageResult = { ...mockResult, xirr: 0.08 }; // 8% 
    const goodResult = { ...mockResult, xirr: 0.10 }; // 10%
    const excellentResult = { ...mockResult, xirr: 0.12 }; // 12%
    
    const { rerender } = render(<ResultsDisplay result={poorResult} plan={mockPlan} />);
    expect(screen.getByText((content, element) => 
      element?.tagName.toLowerCase() === "span" && 
      element?.getAttribute("color") === "#E53E3E" && 
      content.toLowerCase().includes("poor") || false
    )).toBeInTheDocument();
    
    rerender(<ResultsDisplay result={averageResult} plan={mockPlan} />);
    expect(screen.getByText((content, element) => 
      element?.tagName.toLowerCase() === "span" && 
      element?.getAttribute("color") === "#ED8936" && 
      content.toLowerCase().includes("average") || false
    )).toBeInTheDocument();
    
    rerender(<ResultsDisplay result={goodResult} plan={mockPlan} />);
    expect(screen.getByText((content, element) => 
      element?.tagName.toLowerCase() === "span" && 
      element?.getAttribute("color") === "#68D391" && 
      content.toLowerCase().includes("good") || false
    )).toBeInTheDocument();
    
    rerender(<ResultsDisplay result={excellentResult} plan={mockPlan} />);
    expect(screen.getByText((content, element) => 
      element?.tagName.toLowerCase() === "span" && 
      element?.getAttribute("color") === "#48BB78" && 
      content.toLowerCase().includes("excellent") || false
    )).toBeInTheDocument();
  });

  it('handles invalid values gracefully', () => {
    const invalidResult = { ...mockResult, xirr: NaN, cagr: Infinity };
    render(<ResultsDisplay result={invalidResult} plan={mockPlan} />);
    
    expect(screen.getAllByText('N/A').length).toBeGreaterThan(0);
  });

  it('shows yearwise breakdown when button is clicked', async () => {
    render(<ResultsDisplay result={mockResult} plan={mockPlan} />);
    
    // Use role instead of text, which may be more reliable
    const breakdownButton = screen.getByRole('button', { name: /View Year/i });
    await userEvent.click(breakdownButton);

    // Check for year headers in the breakdown
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    
    // Verify the scroll function was called
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('handles changes warning correctly', () => {
    render(<ResultsDisplay result={mockResult} hasChanges={true} plan={mockPlan} />);
    expect(screen.getByText(/You've made changes/i)).toBeInTheDocument();
  });

  it('calls onTabChange when info links are clicked', () => {
    const mockOnTabChange = vi.fn();
    render(<ResultsDisplay result={mockResult} onTabChange={mockOnTabChange} plan={mockPlan} />);

    // Get all info links and click the first one
    const infoLinks = screen.getAllByText(/What's this/i);
    expect(infoLinks.length).toBeGreaterThan(0);
    fireEvent.click(infoLinks[0]);

    expect(mockOnTabChange).toHaveBeenCalledWith('info');
  });

  it('displays correct rating badge based on XIRR', () => {
    const poorResult = { ...mockResult, xirr: 0.06 }; // 6%
    const averageResult = { ...mockResult, xirr: 0.08 }; // 8%
    const goodResult = { ...mockResult, xirr: 0.10 }; // 10%
    const excellentResult = { ...mockResult, xirr: 0.12 }; // 12%

    const { rerender } = render(<ResultsDisplay result={poorResult} plan={mockPlan} />);
    expect(screen.getByText('Poor')).toBeInTheDocument();

    rerender(<ResultsDisplay result={averageResult} plan={mockPlan} />);
    expect(screen.getByText('Average')).toBeInTheDocument();

    rerender(<ResultsDisplay result={goodResult} plan={mockPlan} />);
    expect(screen.getByText('Good')).toBeInTheDocument();

    rerender(<ResultsDisplay result={excellentResult} plan={mockPlan} />);
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });

  it('handles invalid numeric values gracefully', () => {
    const invalidResult = {
      ...mockResult,
      xirr: NaN,
      irr: Infinity
    };

    render(<ResultsDisplay result={invalidResult} plan={mockPlan} />);

    // Should show N/A for invalid values - use getAllByText and check the first one
    const naElements = screen.getAllByText('N/A');
    expect(naElements.length).toBeGreaterThan(0);
    expect(naElements[0]).toBeInTheDocument();
  });

  it('shows below-inflation warning when XIRR < 6%', () => {
    const lowResult = { ...mockResult, xirr: 0.04 };
    render(<ResultsDisplay result={lowResult} plan={mockPlan} />);
    expect(screen.getByText(/below the average inflation rate/i)).toBeInTheDocument();
  });

  it('does not show below-inflation warning when XIRR >= 6%', () => {
    const goodResult = { ...mockResult, xirr: 0.08 };
    render(<ResultsDisplay result={goodResult} plan={mockPlan} />);
    expect(screen.queryByText(/below the average inflation rate/i)).not.toBeInTheDocument();
  });

  it('shows inflation-adjusted (real) return section', () => {
    render(<ResultsDisplay result={mockResult} plan={mockPlan} />);
    expect(screen.getAllByText(/Real Return/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Assumed inflation/i)).toBeInTheDocument();
  });

  it('shows inflation rate selector with default 6%', () => {
    render(<ResultsDisplay result={mockResult} plan={mockPlan} />);
    const select = screen.getByDisplayValue(/6%/);
    expect(select).toBeInTheDocument();
  });

  it('shows detailed metrics toggle', () => {
    render(<ResultsDisplay result={mockResult} plan={mockPlan} />);
    expect(screen.getByText(/Show detailed metrics/i)).toBeInTheDocument();
  });

  it('reveals IRR and CAGR when detailed metrics toggle is clicked', () => {
    render(<ResultsDisplay result={mockResult} plan={mockPlan} />);

    // CAGR should not be visible initially (IRR text matches XIRR label, so check CAGR)
    expect(screen.queryByText(/Compound Annual Growth Rate/i)).not.toBeInTheDocument();

    // Click toggle
    fireEvent.click(screen.getByText(/Show detailed metrics/i));

    // Now they should be visible
    expect(screen.getByText(/Compound Annual Growth Rate/i)).toBeInTheDocument();
    // IRR card should also appear (check for the specific "IRR" label text)
    expect(screen.getByText('IRR (Internal Rate of Return)')).toBeInTheDocument();
  });
}); 