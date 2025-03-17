import React, { useState } from 'react';
import { colors } from './StyledComponents';

interface ShareOptionsProps {
  compact?: boolean;
}

const ShareOptions: React.FC<ShareOptionsProps> = ({ compact = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const currentUrl = window.location.href;
  const encodedUrl = encodeURIComponent(currentUrl);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    });
  };
  
  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: (
        <svg viewBox="0 0 24 24" width={compact ? 16 : 20} height={compact ? 16 : 20} fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      url: `https://wa.me/?text=${encodedUrl}`,
      color: '#25D366'
    },
    {
      name: 'Email',
      icon: '📧',
      url: `mailto:?subject=XIRR Calculator Results&body=Check out these investment returns: ${encodedUrl}`,
      color: '#D44638'
    },
    {
      name: 'Twitter',
      icon: '𝕏',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=Check out these investment returns with the XIRR Calculator:`,
      color: '#1DA1F2'
    },
    {
      name: 'Reddit',
      icon: (
        <svg viewBox="0 0 24 24" width={compact ? 16 : 20} height={compact ? 16 : 20} fill="#FF4500">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
        </svg>
      ),
      url: `https://www.reddit.com/submit?url=${encodedUrl}&title=XIRR Calculator Results`,
      color: '#FF4500'
    }
  ];
  
  return (
    <div style={{ 
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: compact ? '0.5rem' : '0.75rem',
      position: 'relative',
      justifyContent: compact ? 'flex-end' : 'center'
    }}>
      <button
        onClick={copyToClipboard}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary.light,
          color: colors.primary.dark,
          border: 'none',
          borderRadius: '4px',
          padding: compact ? '0.3rem 0.5rem' : '0.5rem 0.75rem',
          fontSize: compact ? '0.7rem' : '0.8rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          position: 'relative',
          minWidth: compact ? 'auto' : '90px'
        }}
      >
        <span style={{ marginRight: '4px' }}>📋</span>
        <span>Copy URL</span>
        {showTooltip && (
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: colors.neutral.dark,
            color: 'white',
            padding: '0.3rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.7rem',
            marginBottom: '5px',
            whiteSpace: 'nowrap',
            zIndex: 10
          }}>
            URL copied!
          </div>
        )}
      </button>
      
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`Share via ${link.name}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: link.color + '20',
            color: link.color,
            border: 'none',
            borderRadius: '4px',
            padding: compact ? '0.3rem' : '0.5rem 0.75rem',
            fontSize: compact ? '0.8rem' : '1rem',
            cursor: 'pointer',
            textDecoration: 'none',
            minWidth: compact ? 'auto' : '90px'
          }}
        >
          <span role="img" aria-label={link.name} style={{ display: 'flex', alignItems: 'center' }}>
            {typeof link.icon === 'string' ? link.icon : link.icon}
          </span>
          {!compact && <span style={{ marginLeft: '0.3rem', fontSize: '0.8rem' }}>{link.name}</span>}
        </a>
      ))}
    </div>
  );
};

export default ShareOptions; 