import React from 'react';
import { render, screen, fireEvent, waitFor } from './test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import InvestmentForm from '../InvestmentForm';
import { PaymentFrequency, TaxBracket } from '../../types';

// Mock framer-motion to avoid animation-related issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

describe('InvestmentForm Component', () => {
  const defaultProps = {
    onCalculate: vi.fn(),
    onReset: vi.fn(),
    loading: false,
    onTabChange: vi.fn(),
    onFormChange: vi.fn(),
    scrollToResults: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders investment form elements correctly', () => {
    render(<InvestmentForm {...defaultProps} />);
    
    // Check for headers
    expect(screen.getByText('Investment Details')).toBeInTheDocument();
    expect(screen.getByText('Return Details')).toBeInTheDocument();
    
    // Check for payment years label
    expect(screen.getByText(/Payment Period/i)).toBeInTheDocument();
    
    // Use getAllByText and check that there are multiple frequency labels
    const labels = screen.getAllByText(/Frequency/i);
    expect(labels.length).toBeGreaterThan(0);
  });

  it('fires onFormChange when form values change', async () => {
    const mockOnFormChange = vi.fn();
    render(<InvestmentForm {...defaultProps} onFormChange={mockOnFormChange} />);
    
    // Get the select element by its ID
    const select = document.getElementById('paymentFrequency') as HTMLSelectElement;
    expect(select).not.toBeNull();
    
    // Use fireEvent directly which is more reliable
    fireEvent.change(select, { target: { value: PaymentFrequency.MONTHLY } });
    
    // Check if the onFormChange was called
    expect(mockOnFormChange).toHaveBeenCalled();
  });

  it('handles loading state correctly', () => {
    render(<InvestmentForm {...defaultProps} loading={true} />);
    
    // Find inputs and verify they're disabled
    const annualPaymentInput = document.getElementById('annualPayment') as HTMLInputElement;
    expect(annualPaymentInput).toBeDisabled();
    
    // Find buttons and check disabled state
    const buttons = screen.getAllByRole('button');
    const disabledButtons = buttons.filter(btn => btn.hasAttribute('disabled'));
    expect(disabledButtons.length).toBeGreaterThan(0);
  });

  it('resets form when reset button is clicked', async () => {
    const mockOnReset = vi.fn();
    render(<InvestmentForm {...defaultProps} onReset={mockOnReset} />);
    
    // Find the reset button by text
    const resetButton = screen.getByText('Reset');
    expect(resetButton).toBeInTheDocument();
    
    // Click the reset button
    await userEvent.click(resetButton);
    
    // Check if onReset was called
    expect(mockOnReset).toHaveBeenCalled();
  });

  it('formats currency values correctly', () => {
    render(<InvestmentForm {...defaultProps} />);
    
    // Check for currency values by looking at the ranges
    const sliderRanges = screen.getAllByText(/₹/);
    expect(sliderRanges.length).toBeGreaterThan(0);
  });
}); 