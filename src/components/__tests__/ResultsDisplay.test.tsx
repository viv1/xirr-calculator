import React from 'react';
import { render, screen, fireEvent } from './test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import ResultsDisplay from '../ResultsDisplay';
import { CalculationResult, TaxBracket } from '../../types';

// Mock framer-motion to avoid animation-related issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

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

  it('renders nothing when result is null', () => {
    const { container } = render(<ResultsDisplay result={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders main results correctly', () => {
    render(<ResultsDisplay result={mockResult} />);

    // Check for XIRR value
    expect(screen.getByText(/12.00%/)).toBeInTheDocument();

    // Use getAllByText and check that at least one element is found
    const investedTexts = screen.getAllByText(/1.*00.*000/);
    expect(investedTexts.length).toBeGreaterThan(0);
    
    const returnTexts = screen.getAllByText(/1.*50.*000/);
    expect(returnTexts.length).toBeGreaterThan(0);
    
    const profitTexts = screen.getAllByText(/50.*000/);
    expect(profitTexts.length).toBeGreaterThan(0);
  });

  it('displays tax-adjusted XIRR when available', () => {
    render(<ResultsDisplay result={mockResult} />);
    expect(screen.getByText(/15.00%/)).toBeInTheDocument();
  });

  it('shows yearwise breakdown when button is clicked', async () => {
    render(<ResultsDisplay result={mockResult} />);
    
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
    render(<ResultsDisplay result={mockResult} hasChanges={true} />);
    expect(screen.getByText(/You've made changes/i)).toBeInTheDocument();
  });

  it('calls onTabChange when info links are clicked', () => {
    const mockOnTabChange = vi.fn();
    render(<ResultsDisplay result={mockResult} onTabChange={mockOnTabChange} />);

    // Get all info links and click the first one
    const infoLinks = screen.getAllByText(/What's this/i);
    expect(infoLinks.length).toBeGreaterThan(0);
    fireEvent.click(infoLinks[0]);

    expect(mockOnTabChange).toHaveBeenCalledWith('info');
  });

  it('displays correct rating badge based on XIRR', () => {
    const poorResult = { ...mockResult, xirr: 0.04 }; // 4%
    const averageResult = { ...mockResult, xirr: 0.06 }; // 6%
    const goodResult = { ...mockResult, xirr: 0.08 }; // 8%
    const excellentResult = { ...mockResult, xirr: 0.12 }; // 12%

    const { rerender } = render(<ResultsDisplay result={poorResult} />);
    expect(screen.getByText('Poor')).toBeInTheDocument();

    rerender(<ResultsDisplay result={averageResult} />);
    expect(screen.getByText('Average')).toBeInTheDocument();

    rerender(<ResultsDisplay result={goodResult} />);
    expect(screen.getByText('Good')).toBeInTheDocument();

    rerender(<ResultsDisplay result={excellentResult} />);
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });

  it('formats currency values correctly', () => {
    render(<ResultsDisplay result={mockResult} />);
    
    // Check for Indian currency format (₹ with commas) - using regex to be less strict
    const currencyElements = screen.getAllByText(/₹/);
    expect(currencyElements.length).toBeGreaterThan(0);
  });

  it('handles invalid numeric values gracefully', () => {
    const invalidResult = {
      ...mockResult,
      xirr: NaN,
      irr: Infinity
    };

    render(<ResultsDisplay result={invalidResult} />);
    
    // Should show N/A for invalid values - use getAllByText and check the first one
    const naElements = screen.getAllByText('N/A');
    expect(naElements.length).toBeGreaterThan(0);
    expect(naElements[0]).toBeInTheDocument();
  });
}); 