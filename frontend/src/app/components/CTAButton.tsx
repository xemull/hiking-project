// src/app/components/CTAButton.tsx
'use client';

import Link from 'next/link';
import { CSSProperties } from 'react';

type Variant = 'primary' | 'secondary' | 'accent';

interface CTAButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  style?: CSSProperties;
}

const baseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 var(--space-2xl)',
  height: '52px',
  borderRadius: '50px',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 'clamp(0.95rem, 2.6vw, var(--text-base))',
  fontWeight: 600,
  letterSpacing: '0.5px',
  whiteSpace: 'nowrap',
  width: 'min(90vw, 340px)',
  textDecoration: 'none',
  transition: 'all 0.25s ease',
};

const variants: Record<Variant, CSSProperties> = {
  primary: {
    background: 'var(--ds-accent)',
    color: 'var(--ds-accent-foreground)',
    border: '2px solid transparent',
    boxShadow: 'var(--shadow-float)'
  },
  secondary: {
    background: 'rgba(255,255,255,0.06)',
    color: 'var(--ds-primary-foreground)',
    border: '2px solid var(--ds-primary-foreground)',
    backdropFilter: 'blur(10px)'
  },
  accent: {
    background: 'var(--ds-primary)',
    color: '#fff',
    border: '2px solid transparent',
    boxShadow: '0 15px 35px rgba(16, 185, 129, 0.3)'
  },
};

export default function CTAButton({ label, href, onClick, variant = 'primary', className, style }: CTAButtonProps) {
  const mergedStyle: CSSProperties = { ...baseStyle, ...variants[variant], ...style };

  if (href) {
    return (
      <Link href={href} style={mergedStyle} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} style={mergedStyle} className={className}>
      {label}
    </button>
  );
}
