// src/app/components/InlineBackButton.tsx
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function InlineBackButton() {
  const styles = {
    backButtonInline: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: 'var(--ds-muted-foreground)',
      textDecoration: 'none',
      fontSize: '0.875rem',
      fontWeight: 500,
      marginBottom: '2rem',
      padding: '0.5rem 0',
      transition: 'color 0.2s ease',
      fontFamily: 'Inter, system-ui, sans-serif'
    }
  };

  return (
    <Link 
      href="/" 
      style={styles.backButtonInline}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--ds-foreground)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--ds-muted-foreground)';
      }}
    >
      <ArrowLeft size={16} />
      Back to all hikes
    </Link>
  );
}