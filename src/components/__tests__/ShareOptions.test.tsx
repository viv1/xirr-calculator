import React from 'react';
import { render, screen, act } from './test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import ShareOptions from '../ShareOptions';

// Mock clipboard API
const mockClipboard = {
  writeText: vi.fn()
};

Object.assign(navigator, {
  clipboard: mockClipboard
});

describe('ShareOptions Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders share buttons correctly', () => {
    render(<ShareOptions />);
    
    // Check for all share buttons using aria-labels
    expect(screen.getByLabelText('Copy URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Share on WhatsApp')).toBeInTheDocument();
    expect(screen.getByLabelText('Share on Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Share on X')).toBeInTheDocument();
    expect(screen.getByLabelText('Share on Reddit')).toBeInTheDocument();
  });

  it('renders in compact mode when compact prop is true', () => {
    render(<ShareOptions compact={true} />);
    
    // Check for compact mode by verifying the container has the compact prop
    const container = screen.getByRole('group', { name: 'Share options' });
    expect(container).toHaveAttribute('data-compact', 'true');
  });

  it('copies URL to clipboard when Copy URL button is clicked', async () => {
    render(<ShareOptions />);
    
    const copyButton = screen.getByLabelText('Copy URL');
    
    await act(async () => {
      await userEvent.click(copyButton);
    });
    
    // Check if clipboard API was called with the current URL
    expect(mockClipboard.writeText).toHaveBeenCalledWith(window.location.href);
    
    // Check if tooltip appears
    expect(screen.getByRole('tooltip')).toHaveTextContent('URL copied to clipboard!');
    
    // Advance timers to check tooltip disappearance
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('generates correct share URLs', () => {
    render(<ShareOptions />);
    
    // Check WhatsApp share URL
    const whatsappLink = screen.getByLabelText('Share on WhatsApp');
    expect(whatsappLink).toHaveAttribute('href', expect.stringContaining('wa.me'));
    
    // Check Email share URL
    const emailLink = screen.getByLabelText('Share on Email');
    expect(emailLink).toHaveAttribute('href', expect.stringContaining('mailto:'));
    
    // Check Twitter/X share URL
    const xLink = screen.getByLabelText('Share on X');
    expect(xLink).toHaveAttribute('href', expect.stringContaining('twitter.com/intent/tweet'));
    
    // Check Reddit share URL
    const redditLink = screen.getByLabelText('Share on Reddit');
    expect(redditLink).toHaveAttribute('href', expect.stringContaining('reddit.com/submit'));
  });

  it('handles clipboard API errors gracefully', async () => {
    // Mock clipboard API to throw an error
    mockClipboard.writeText.mockRejectedValueOnce(new Error('Clipboard error'));
    
    render(<ShareOptions />);
    
    const copyButton = screen.getByLabelText('Copy URL');
    
    await act(async () => {
      await userEvent.click(copyButton);
    });
    
    // Check if error is handled gracefully
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
}); 