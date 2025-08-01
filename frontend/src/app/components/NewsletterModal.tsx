// src/app/components/NewsletterModal.tsx
'use client';

import { useState } from 'react';
import { X, Mail, Check } from 'lucide-react';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('http://localhost:4000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setMessage('Thanks for subscribing! 🎉');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    },
    modal: {
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      maxWidth: '500px',
      width: '100%',
      boxShadow: 'var(--shadow-float)',
      position: 'relative' as const,
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    closeButton: {
      position: 'absolute' as const,
      top: '1rem',
      right: '1rem',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '50%',
      transition: 'background-color 0.2s ease'
    },
    iconContainer: {
      width: '60px',
      height: '60px',
      background: 'var(--ds-primary)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1.5rem auto'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: 'var(--ds-foreground)',
      textAlign: 'center' as const,
      marginBottom: '0.5rem'
    },
    description: {
      color: 'var(--ds-muted-foreground)',
      textAlign: 'center' as const,
      marginBottom: '2rem',
      lineHeight: 1.6
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem'
    },
    input: {
      padding: '0.75rem 1rem',
      border: '2px solid var(--ds-border)',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'Inter, system-ui, sans-serif',
      transition: 'border-color 0.2s ease',
      outline: 'none'
    },
    button: {
      background: 'var(--ds-primary)',
      color: 'white',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    buttonDisabled: {
      background: 'var(--ds-muted)',
      cursor: 'not-allowed'
    },
    successMessage: {
      color: 'var(--ds-primary)',
      textAlign: 'center' as const,
      padding: '1rem',
      background: 'var(--ds-off-white)',
      borderRadius: '8px',
      border: '1px solid var(--ds-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    errorMessage: {
      color: '#dc2626',
      textAlign: 'center' as const,
      padding: '1rem',
      background: '#fef2f2',
      borderRadius: '8px',
      border: '1px solid #dc2626'
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button 
          style={styles.closeButton}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X size={20} />
        </button>

        <div style={styles.iconContainer}>
          <Mail className="h-6 w-6 text-white" />
        </div>

        <h2 style={styles.title}>Stay Updated</h2>
        <p style={styles.description}>
          Get notified when we add new trails and hiking guides. No spam, just trail updates.
        </p>

        {status === 'success' ? (
          <div style={styles.successMessage}>
            <Check size={20} />
            <span>{message}</span>
          </div>
        ) : (
          <form style={styles.form} onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--ds-primary)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--ds-border)';
              }}
              disabled={status === 'loading'}
            />

            {status === 'error' && (
              <div style={styles.errorMessage}>
                {message}
              </div>
            )}

            <button
              type="submit"
              style={{
                ...styles.button,
                ...(status === 'loading' ? styles.buttonDisabled : {})
              }}
              disabled={status === 'loading'}
              onMouseEnter={(e) => {
                if (status !== 'loading') {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-float)';
                }
              }}
              onMouseLeave={(e) => {
                if (status !== 'loading') {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe to Newsletter'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}