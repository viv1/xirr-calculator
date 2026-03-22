import React from 'react';
import { render, screen, fireEvent } from './test-utils';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import FAQ from '../FAQ';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

describe('FAQ Component', () => {
  it('renders all FAQ questions', () => {
    render(<FAQ />);
    expect(screen.getByText('Why can XIRR be negative?')).toBeInTheDocument();
    expect(screen.getByText('How does payment frequency affect XIRR?')).toBeInTheDocument();
    expect(screen.getByText(/What does "Return Start Year" mean/)).toBeInTheDocument();
    expect(screen.getByText(/buy term insurance/i)).toBeInTheDocument();
  });

  it('expands an answer when question is clicked', () => {
    render(<FAQ />);
    const question = screen.getByText('Why can XIRR be negative?');
    fireEvent.click(question);
    expect(screen.getByText(/XIRR can be negative when the total returns/)).toBeInTheDocument();
  });

  it('collapses an answer when clicked again', () => {
    render(<FAQ />);
    const question = screen.getByText('Why can XIRR be negative?');

    // Open
    fireEvent.click(question);
    expect(screen.getByText(/XIRR can be negative when the total returns/)).toBeInTheDocument();

    // Close
    fireEvent.click(question);
    expect(screen.queryByText(/XIRR can be negative when the total returns/)).not.toBeInTheDocument();
  });

  it('only shows one answer at a time', () => {
    render(<FAQ />);

    // Open first question
    fireEvent.click(screen.getByText('Why can XIRR be negative?'));
    expect(screen.getByText(/XIRR can be negative when/)).toBeInTheDocument();

    // Open second question — first should close
    fireEvent.click(screen.getByText('How does payment frequency affect XIRR?'));
    expect(screen.queryByText(/XIRR can be negative when/)).not.toBeInTheDocument();
    expect(screen.getByText(/Paying monthly instead of annually/)).toBeInTheDocument();
  });
});
