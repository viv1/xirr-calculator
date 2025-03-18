import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App Component', () => {
  it('renders the calculator title', () => {
    render(<App />);
    const titleElement = screen.getByRole('heading', { level: 1, name: /CheckMyReturns.in - XIRR Calculator/i });
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the calculator description', () => {
    render(<App />);
    const descriptionElement = screen.getByText(/Calculate the actual returns of guaranteed income plans/i);
    expect(descriptionElement).toBeInTheDocument();
  });

  it('renders all main tabs', () => {
    render(<App />);
    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.getByText('Understanding Returns')).toBeInTheDocument();
    expect(screen.getByText('Tax Implications')).toBeInTheDocument();
    expect(screen.getByText('Guaranteed Income Plans')).toBeInTheDocument();
  });
});
