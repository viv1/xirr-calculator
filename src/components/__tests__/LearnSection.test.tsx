import React from 'react';
import { render, screen, fireEvent } from './test-utils';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import LearnSection from '../LearnSection';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

describe('LearnSection Component', () => {
  it('renders all sub-navigation buttons', () => {
    render(<LearnSection />);
    expect(screen.getByText('FAQ')).toBeInTheDocument();
    expect(screen.getByText('Understanding Returns')).toBeInTheDocument();
    expect(screen.getByText('Guaranteed Plans')).toBeInTheDocument();
  });

  it('shows FAQ by default', () => {
    render(<LearnSection />);
    // FAQ component renders "Frequently Asked Questions"
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
  });

  it('switches to Understanding Returns when clicked', () => {
    render(<LearnSection />);
    fireEvent.click(screen.getByText('Understanding Returns'));
    // InfoSection renders — FAQ should no longer be visible
    expect(screen.queryByText('Frequently Asked Questions')).not.toBeInTheDocument();
    // InfoSection has XIRR content
    expect(screen.getAllByText(/XIRR/).length).toBeGreaterThan(0);
  });

  it('switches to Guaranteed Plans when clicked', () => {
    render(<LearnSection />);
    fireEvent.click(screen.getByText('Guaranteed Plans'));
    // FAQ should no longer be visible
    expect(screen.queryByText('Frequently Asked Questions')).not.toBeInTheDocument();
    // GuaranteedIncomePlansInfo has content about guaranteed plans
    expect(screen.getAllByText(/Guaranteed/i).length).toBeGreaterThan(0);
  });
});
