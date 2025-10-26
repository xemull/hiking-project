'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function CollapsibleFAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      border: `1px solid var(--ds-border)`,
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '1rem',
          background: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'left',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--ds-muted)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
      >
        <h4 style={{
          fontWeight: '600',
          color: 'var(--ds-foreground)',
          margin: 0,
          paddingRight: '1rem'
        }}>
          {question}
        </h4>
        <ChevronDown
          size={20}
          style={{
            color: 'var(--ds-muted-foreground)',
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        />
      </button>
      <div style={{
        maxHeight: isOpen ? '500px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease'
      }}>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--ds-muted-foreground)',
          margin: 0,
          padding: '0 1rem 1rem 1rem',
          lineHeight: '1.6'
        }}>
          {answer}
        </p>
      </div>
    </div>
  );
}
