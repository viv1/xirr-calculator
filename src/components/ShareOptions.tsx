import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toggleUrlFormat, isShortUrlFormat } from '../utils/urlUtils';
import { InvestmentPlan } from '../types';

interface ShareOptionsProps {
  compact?: boolean;
  plan: InvestmentPlan;
}

// Use transient props with $ prefix to avoid passing them to the DOM
const ShareContainer = styled.div<{ $compact?: boolean }>`
  display: flex;
  gap: ${props => props.$compact ? '0.5rem' : '1rem'};
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
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #333;
  }
`;

const ShareLink = styled.a`
  color: #666;
  text-decoration: none;
  padding: 0.5rem;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

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

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
`;

const ToggleLabel = styled.span`
  font-size: 0.75rem;
  color: #666;
  margin-right: 0.25rem;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 30px;
  height: 16px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .3s;
    border-radius: 16px;
    
    &:before {
      position: absolute;
      content: "";
      height: 12px;
      width: 12px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: .3s;
      border-radius: 50%;
    }
  }
  
  input:checked + span {
    background-color: #2196F3;
  }
  
  input:checked + span:before {
    transform: translateX(14px);
  }
`;

const ShareOptions: React.FC<ShareOptionsProps> = ({ compact = false, plan }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [useShortUrl, setUseShortUrl] = useState(true);
  const [shareUrl, setShareUrl] = useState('');
  
  // Calculate the URL to share
  useEffect(() => {
    // Generate URL based on current state
    const newUrl = toggleUrlFormat(plan, useShortUrl);
    setShareUrl(newUrl);
  }, [plan, useShortUrl]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };
  
  const handleToggleUrlFormat = () => {
    setUseShortUrl(!useShortUrl);
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: (
        <svg viewBox="0 0 24 24" width={compact ? 16 : 20} height={compact ? 16 : 20} fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      url: `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
      color: '#25D366'
    },
    {
      name: 'Email',
      icon: '📧',
      url: `mailto:?body=${encodeURIComponent(shareUrl)}`,
      color: '#EA4335'
    },
    {
      name: 'X',
      icon: '𝕏',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
      color: '#000000'
    },
    {
      name: 'Reddit',
      icon: (
        <svg viewBox="0 0 24 24" width={compact ? 16 : 20} height={compact ? 16 : 20} fill="#FF4500">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
        </svg>
      ),
      url: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}`,
      color: '#FF4500'
    }
  ];

  return (
    <ShareContainer 
      $compact={compact} 
      role="group" 
      aria-label="Share options" 
      data-compact={compact ? "true" : "false"}
    >
      <ShareButton onClick={handleCopyUrl} aria-label="Copy URL">
        <span>📋</span>
        {!compact && <span>Copy URL</span>}
        {showTooltip && <Tooltip role="tooltip">URL copied to clipboard!</Tooltip>}
      </ShareButton>

      {!compact && (
        <ToggleContainer>
          <ToggleLabel>Short URL</ToggleLabel>
          <ToggleSwitch>
            <input 
              type="checkbox" 
              checked={useShortUrl} 
              onChange={handleToggleUrlFormat}
              aria-label="Use short URL format"
            />
            <span />
          </ToggleSwitch>
        </ToggleContainer>
      )}

      {shareLinks.map(({ name, icon, url, color }) => {
        // Update each share link with the current URL format
        const updatedUrl = url.replace(
          /encodeURIComponent\([^)]+\)/,
          `encodeURIComponent('${shareUrl}')`
        );
        
        return (
          <ShareLink
            key={name}
            href={updatedUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color }}
            aria-label={`Share on ${name}`}
          >
            {icon}
            {!compact && <span>{name}</span>}
          </ShareLink>
        );
      })}
    </ShareContainer>
  );
};

export default ShareOptions; 