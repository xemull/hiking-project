// src/app/components/InteractiveBackButton.tsx
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function InteractiveBackButton() {
  const styles = {
    backButton: {
      position: 'absolute' as const,
      top: '2rem',
      left: '2rem',
      zIndex: 3,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      color: 'var(--ds-foreground)',
      padding: '0.75rem 1.25rem',
      borderRadius: '50px',
      textDecoration: 'none',
      fontSize: '0.875rem',
      fontWeight: 500,
      transition: 'all 0.3s ease',
      boxShadow: 'var(--shadow-soft)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    backButtonHover: {
      background: 'white',
      transform: 'translateY(-2px)',
      boxShadow: 'var(--shadow-float)'
    }
  };

  return (
    <Link 
      href="/" 
      style={styles.backButton}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, styles.backButtonHover);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
      }}
    >
      <ArrowLeft size={16} />
      Back to all hikes
    </Link>
  );
}