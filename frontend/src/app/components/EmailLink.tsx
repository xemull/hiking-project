// src/app/components/EmailLink.tsx
'use client';

export default function EmailLink() {
  const styles = {
    emailLink: {
      color: 'var(--ds-primary)',
      fontSize: '1.5rem',
      fontWeight: 600,
      textDecoration: 'none',
      transition: 'color 0.2s ease'
    }
  };

  return (
    <a 
      href="mailto:stan@yourwebsite.com" 
      style={styles.emailLink}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#2d4f3e';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--ds-primary)';
      }}
    >
      stan@yourwebsite.com
    </a>
  );
}