import React, { useState } from 'react';
import styled from 'styled-components';

interface ShareOptionsProps {
  compact?: boolean;
}

const ShareContainer = styled.div<{ compact?: boolean }>`
  display: flex;
  gap: ${props => props.compact ? '0.5rem' : '1rem'};
  align-items: center;
  flex-wrap: wrap;
`;

const ShareButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
  position: relative;

  &:hover {
    color: #333;
  }
`;

const ShareLink = styled.a`
  color: #666;
  text-decoration: none;
  padding: 0.5rem;
  transition: color 0.2s;

  &:hover {
    color: #333;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  white-space: nowrap;
  margin-bottom: 0.5rem;
  z-index: 1000;
`;

const ShareOptions: React.FC<ShareOptionsProps> = ({ compact = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: '📱',
      url: `https://wa.me/?text=${encodeURIComponent(window.location.href)}`,
      color: '#25D366'
    },
    {
      name: 'Email',
      icon: '📧',
      url: `mailto:?body=${encodeURIComponent(window.location.href)}`,
      color: '#EA4335'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`,
      color: '#1DA1F2'
    },
    {
      name: 'Reddit',
      icon: '🤖',
      url: `https://reddit.com/submit?url=${encodeURIComponent(window.location.href)}`,
      color: '#FF4500'
    }
  ];

  return (
    <ShareContainer compact={compact} role="group" aria-label="Share options" data-compact={compact.toString()}>
      <ShareButton onClick={handleCopyUrl} aria-label="Copy URL">
        📋
        {showTooltip && <Tooltip role="tooltip">URL copied to clipboard!</Tooltip>}
      </ShareButton>
      {shareLinks.map(({ name, icon, url, color }) => (
        <ShareLink
          key={name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color }}
          aria-label={`Share on ${name}`}
        >
          {icon}
        </ShareLink>
      ))}
    </ShareContainer>
  );
};

export default ShareOptions; 