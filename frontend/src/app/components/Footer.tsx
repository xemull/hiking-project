// src/app/components/Footer.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mountain, Heart, Mail } from 'lucide-react';
import NewsletterModal from './NewsletterModal';

export default function Footer() {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  const styles = {
    footerContainer: {
      background: 'var(--ds-off-white)',
      borderTop: '1px solid var(--ds-border)',
      padding: '3rem 0 2rem 0',
      marginTop: '4rem',
      overflow: 'hidden' // Prevent horizontal scroll
    },
    contentWrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem' // Reduced padding for mobile
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr',
      gap: '3rem',
      marginBottom: '2rem'
    },
    brandSection: {
      display: 'flex',
      flexDirection: 'column' as const
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1rem',
      color: 'var(--ds-foreground)',
      textDecoration: 'none'
    },
    logoIcon: {
      color: 'var(--ds-primary)'
    },
    logoText: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '1.5rem',
      fontWeight: 700
    },
    description: {
      color: 'var(--ds-muted-foreground)',
      fontSize: '0.95rem',
      lineHeight: 1.6,
      marginBottom: '1.5rem',
      maxWidth: '400px'
    },
    madeWithLove: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      color: 'var(--ds-muted-foreground)',
      fontSize: '0.875rem'
    },
    heart: {
      color: '#ef4444',
      width: '14px',
      height: '14px'
    },
    linkSection: {
      display: 'flex',
      flexDirection: 'column' as const
    },
    sectionTitle: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '1rem',
      fontWeight: 600,
      color: 'var(--ds-foreground)',
      marginBottom: '1rem'
    },
    linkList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem'
    },
    footerLink: {
      color: 'var(--ds-muted-foreground)',
      textDecoration: 'none',
      fontSize: '0.9rem',
      transition: 'color 0.2s ease',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    footerButton: {
      color: 'var(--ds-muted-foreground)',
      textDecoration: 'none',
      fontSize: '0.9rem',
      transition: 'color 0.2s ease',
      fontFamily: 'Inter, system-ui, sans-serif',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      textAlign: 'left' as const
    },
    contactSection: {
      display: 'flex',
      flexDirection: 'column' as const
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: 'var(--ds-muted-foreground)',
      fontSize: '0.9rem',
      marginBottom: '0.75rem'
    },
    contactText: {
      color: 'var(--ds-muted-foreground)',
      fontSize: '0.875rem',
      lineHeight: 1.5,
      marginBottom: '1rem'
    },
    bottomBorder: {
      borderTop: '1px solid var(--ds-border)',
      paddingTop: '1.5rem',
      textAlign: 'center' as const
    },
    copyright: {
      color: 'var(--ds-muted-foreground)',
      fontSize: '0.8rem',
      fontFamily: 'Inter, system-ui, sans-serif'
    }
  };

  return (
    <>
      <footer style={styles.footerContainer}>
        <div style={styles.contentWrapper}>
          <div style={styles.footerGrid} className="footer-grid">
            
            {/* Brand Section */}
            <div style={styles.brandSection}>
              <Link href="/" style={styles.logo}>
                <Mountain style={styles.logoIcon} size={24} />
                <span style={styles.logoText}>Trailhead</span>
              </Link>
              
              <p style={styles.description}>
                Your trusted digital guide for multi-day hiking adventures. We research, vet, and document the world's most spectacular long-distance trails to make them accessible to everyone.
              </p>
              
              <div style={styles.madeWithLove}>
                <span>Made with</span>
                <Heart style={styles.heart} fill="currentColor" />
                <span>by outdoor enthusiasts</span>
              </div>
            </div>

            {/* Quick Links */}
            <div style={styles.linkSection}>
              <h3 style={styles.sectionTitle}>Quick Links</h3>
              <div style={styles.linkList}>
                <Link 
                  href="/" 
                  style={styles.footerLink}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--ds-foreground)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--ds-muted-foreground)';
                  }}
                >
                  All Hikes
                </Link>
                <Link 
                  href="/about" 
                  style={styles.footerLink}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--ds-foreground)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--ds-muted-foreground)';
                  }}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  style={styles.footerLink}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--ds-foreground)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--ds-muted-foreground)';
                  }}
                >
                  Contact
                </Link>
                <button 
                  onClick={() => setIsNewsletterOpen(true)}
                  style={styles.footerButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--ds-foreground)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--ds-muted-foreground)';
                  }}
                >
                  Newsletter
                </button>
              </div>
            </div>

            {/* Get in Touch */}
            <div style={styles.contactSection}>
              <h3 style={styles.sectionTitle}>Get in Touch</h3>
              
              <div style={styles.contactItem}>
                <Mail size={16} />
                <a 
                  href="mailto:hello@trailhead.at" 
                  style={styles.footerLink}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--ds-foreground)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--ds-muted-foreground)';
                  }}
                >
                  hello@trailhead.at
                </a>
              </div>
              
              <p style={styles.contactText}>
                Questions about a trail? Found an error? We'd love to hear from you.
              </p>
            </div>

          </div>

          {/* Bottom Border */}
          <div style={styles.bottomBorder}>
            <p style={styles.copyright}>
              © {new Date().getFullYear()} Trailhead. All rights reserved.
            </p>
          </div>
        </div>

        {/* Improved Mobile CSS */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 768px) {
              .footer-grid {
                grid-template-columns: 1fr !important;
                gap: 2rem !important;
                text-align: center;
              }
              
              .footer-grid > div:first-child {
                text-align: center;
                align-items: center;
              }
              
              .footer-grid > div:first-child p {
                max-width: none !important;
                margin-left: auto !important;
                margin-right: auto !important;
              }
              
              .footer-grid > div:first-child > div:last-child {
                justify-content: center !important;
              }
              
              .footer-grid > div:nth-child(2),
              .footer-grid > div:nth-child(3) {
                text-align: center;
                align-items: center;
              }
              
              .footer-grid > div:nth-child(2) > div:last-child {
                align-items: center !important;
              }
              
              .footer-grid > div:nth-child(2) button {
                text-align: center !important;
              }
              
              .footer-grid > div:nth-child(3) > div:first-child {
                justify-content: center !important;
              }
              
              .footer-grid > div:nth-child(3) > div:first-child a {
                text-align: center !important;
              }
            }
            
            @media (max-width: 480px) {
              .footer-grid {
                gap: 1.5rem !important;
              }
            }
          `
        }} />
      </footer>

      {/* Newsletter Modal */}
      <NewsletterModal 
        isOpen={isNewsletterOpen} 
        onClose={() => setIsNewsletterOpen(false)} 
      />
    </>
  );
}