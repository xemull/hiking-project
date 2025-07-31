import { Mail } from 'lucide-react';
import Navigation from '../components/Navigation';
import EmailLink from '../components/EmailLink';
import Footer from '../components/Footer';

export default function ContactPage() {
  const styles = {
    mainContainer: {
      background: 'var(--ds-background)',
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    contentWrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '3rem 2rem'
    },
    heroSection: {
      textAlign: 'center' as const,
      marginBottom: '3rem'
    },
    iconContainer: {
      width: '80px',
      height: '80px',
      margin: '0 auto 2rem auto',
      background: 'var(--ds-primary)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--shadow-card)'
    },
    heroTitle: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '3rem',
      fontWeight: 700,
      color: 'var(--ds-foreground)',
      marginBottom: '1rem',
      lineHeight: 1.2
    },
    heroSubtitle: {
      color: 'var(--ds-muted-foreground)',
      fontSize: '1.125rem',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: 1.75
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '3rem',
      maxWidth: '800px',
      margin: '0 auto'
    },
    section: {
      background: 'transparent',
      padding: '0'
    },
    sectionTitle: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '1.75rem',
      fontWeight: 600,
      color: 'var(--ds-foreground)',
      marginBottom: '1.5rem',
      paddingBottom: '0.75rem',
      borderBottom: '2px solid var(--ds-border)'
    },
    proseContent: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '1rem',
      lineHeight: 1.7,
      color: '#4a5568'
    },
    paragraph: {
      marginBottom: '1.25rem',
      padding: '1rem 0',
      borderLeft: '3px solid #e2e8f0',
      paddingLeft: '1.5rem'
    },
    lastParagraph: {
      marginBottom: '1.25rem',
      padding: '1rem 0',
      borderLeft: '3px solid #e2e8f0',
      paddingLeft: '1.5rem'
    },
    emailCard: {
      background: 'var(--ds-off-white)',
      border: '2px solid var(--ds-primary)',
      borderRadius: '12px',
      padding: '2rem',
      margin: '1.5rem 0',
      textAlign: 'center' as const
    },
    emailLabel: {
      color: 'var(--ds-muted-foreground)',
      marginBottom: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: 500
    },
    emailLink: {
      color: 'var(--ds-primary)',
      fontSize: '1.5rem',
      fontWeight: 600,
      textDecoration: 'none',
      transition: 'color 0.2s ease'
    },
    signature: {
      fontWeight: 500,
      color: 'var(--ds-foreground)',
      textAlign: 'center' as const,
      marginTop: '1rem'
    }
  };

  return (
    <>
      <Navigation />
      <main style={styles.mainContainer}>
        <div style={styles.contentWrapper}>
          
          {/* Hero Section */}
          <div style={styles.heroSection}>
            <div style={styles.iconContainer}>
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h1 style={styles.heroTitle}>Get in Touch</h1>
            <p style={styles.heroSubtitle}>
              Questions, suggestions, or trail stories welcome
            </p>
          </div>

          {/* Content Section */}
          <div style={styles.contentGrid}>
            
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Let's Connect</h2>
              <div style={styles.proseContent}>
                <p style={{...styles.paragraph, borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '1.5rem'}}>
                  Have a question about a trail, a suggestion for the site, or just want to share a story from 
                  your own adventure? I'd love to hear from you.
                </p>
                
                <p style={{...styles.paragraph, borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '1.5rem'}}>
                  This project is a labor of love, and feedback from fellow hikers is the most valuable tool for 
                  making it better. Whether you've found a mistake, want to suggest a new trail, or have a question 
                  about planning your first multi-day hike, please don't hesitate to reach out.
                </p>

                <div style={styles.emailCard}>
                  <p style={styles.emailLabel}>You can email me directly at:</p>
                  <EmailLink />
                </div>

                <p style={styles.lastParagraph}>
                  <span style={styles.signature}>
                    Happy trails,<br />
                    Stan
                  </span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />  {/* Add this line */}
    </>
  );
}