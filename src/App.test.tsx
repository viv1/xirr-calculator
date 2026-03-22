import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App Component', () => {
  it('renders the calculator description', () => {
    render(<App />);
    const descriptionElement = screen.getByText(/Find out the real returns/i);
    expect(descriptionElement).toBeInTheDocument();
  });

  it('renders all main tabs', () => {
    render(<App />);
    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.getByText('Compare Plans')).toBeInTheDocument();
    expect(screen.getByText('Tax Info')).toBeInTheDocument();
    expect(screen.getByText('Learn')).toBeInTheDocument();
  });
});
