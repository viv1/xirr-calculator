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

    // Check for step headers
    expect(screen.getByText('What You Pay')).toBeInTheDocument();
    expect(screen.getByText('What You Get Back')).toBeInTheDocument();

    // Check for key labels
    const howOftenLabels = screen.getAllByText(/How often/i);
    expect(howOftenLabels.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/For how many years/i).length).toBeGreaterThan(0);
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

  it('renders preset template buttons', () => {
    render(<InvestmentForm {...defaultProps} />);
    expect(screen.getByText('Endowment')).toBeInTheDocument();
    expect(screen.getByText('Guaranteed')).toBeInTheDocument();
    expect(screen.getByText('ULIP')).toBeInTheDocument();
    expect(screen.getByText('Pension')).toBeInTheDocument();
  });

  it('applies preset when template button is clicked', async () => {
    const mockOnFormChange = vi.fn();
    render(<InvestmentForm {...defaultProps} onFormChange={mockOnFormChange} />);

    await userEvent.click(screen.getByText('Endowment'));
    expect(mockOnFormChange).toHaveBeenCalled();

    // Endowment preset has annualPayment = 100000
    const lastCall = mockOnFormChange.mock.calls[mockOnFormChange.mock.calls.length - 1][0];
    expect(lastCall.annualPayment).toBe(100000);
    expect(lastCall.returnAmount).toBe(0);
    expect(lastCall.finalReturnYear).toBe(15);
  });

  it('renders step blocks with correct titles', () => {
    render(<InvestmentForm {...defaultProps} />);
    expect(screen.getByText('What You Pay')).toBeInTheDocument();
    expect(screen.getByText('What You Get Back')).toBeInTheDocument();
  });

  it('shows advanced section when toggle is clicked', async () => {
    render(<InvestmentForm {...defaultProps} />);

    // Advanced section should be collapsed initially
    expect(screen.queryByLabelText('Tax bracket')).not.toBeInTheDocument();

    // Click to expand
    const advancedToggle = screen.getByText('Advanced');
    await userEvent.click(advancedToggle);

    // Tax bracket select should now be visible
    expect(document.getElementById('taxBracket')).toBeInTheDocument();
  });

  it('renders with custom currentPlan values', () => {
    const customPlan = {
      annualPayment: 200000, paymentYears: 5, returnAmount: 0,
      returnStartYear: 1, returnYears: 0, finalReturnYear: 10, finalReturnAmount: 1500000,
      paymentFrequency: PaymentFrequency.ANNUAL, returnFrequency: PaymentFrequency.ANNUAL,
      taxBracket: TaxBracket.ZERO
    };
    render(<InvestmentForm {...defaultProps} currentPlan={customPlan} />);

    // Should render with the custom plan's payment amount
    const input = document.getElementById('annualPayment') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(Number(input.value)).toBe(200000);
  });
}); 