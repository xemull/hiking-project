// src/app/components/HeroSection.tsx
'use client';

import Link from 'next/link';

export default function HeroSection() {
  const scrollToFeatured = () => {
    document.getElementById('featured-hikes')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  // Updated styles with lighter overlay
  const heroStyles = {
    section: {
      position: 'relative' as const,
      width: '100%',
      height: '75vh',
      minHeight: '600px',
      maxHeight: '800px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    background: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: "url('/IMG_1682.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    },
    gradientOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'var(--gradient-hero)',
      opacity: 0.6, // CHANGED: Reduced from 0.8 to 0.6 for lighter overlay
      zIndex: 1
    },
    darkOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.1)', // CHANGED: Reduced from 0.2 to 0.1
      zIndex: 2
    },
    content: {
      position: 'relative' as const,
      zIndex: 20,
      textAlign: 'center' as const,
      color: 'var(--ds-primary-foreground)',
      maxWidth: '800px',
      padding: '0 2rem',
      marginTop: '-10vh'
    },
    title: {
      fontFamily: 'Inter, system-ui, sans-serif', // CONFIRMED: Inter font
      fontSize: 'clamp(3rem, 8vw, 6rem)',
      fontWeight: 300,
      marginBottom: '1.5rem',
      letterSpacing: '2px',
      textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      lineHeight: 1.1
    },
    subtitle: {
      fontFamily: 'Inter, system-ui, sans-serif', // CONFIRMED: Inter font
      fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
      fontWeight: 300,
      marginBottom: '3rem',
      lineHeight: 1.6,
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
      opacity: 0.95
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '1rem 2.5rem',
      background: 'var(--ds-accent)', // Now ochre yellow
      border: '2px solid transparent',
      color: 'var(--ds-accent-foreground)', // Now black text
      textDecoration: 'none',
      fontFamily: 'Inter, system-ui, sans-serif', // CONFIRMED: Inter font
      fontSize: '1.1rem',
      fontWeight: 600,
      letterSpacing: '1px',
      borderRadius: '50px',
      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      boxShadow: 'var(--shadow-float)',
      cursor: 'pointer'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)'
    },
    arrow: {
      marginLeft: '0.5rem',
      width: '1.25rem',
      height: '1.25rem',
      transition: 'transform 0.3s ease'
    },
    arrowHover: {
      transform: 'translateX(4px)'
    }
  };

  return (
    <section style={heroStyles.section}>
      <div style={heroStyles.background}></div>
      <div style={heroStyles.gradientOverlay}></div>
      <div style={heroStyles.darkOverlay}></div>
      
      <div style={heroStyles.content}>
        {/* CONFIRMED: Inter font, light weight */}
        <h1 style={heroStyles.title}>Path Unfolding.</h1>
        
        {/* CONFIRMED: Inter font, light weight */}
        <p style={heroStyles.subtitle}>
          Discover unforgettable multi-day journeys, with all the essential information at your fingertips.
        </p>
        
        {/* CONFIRMED: Inter font, semi-bold weight */}
        <button 
          onClick={scrollToFeatured} 
          style={heroStyles.button}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, heroStyles.buttonHover);
            const arrow = e.currentTarget.querySelector('svg');
            if (arrow) {
              Object.assign(arrow.style, heroStyles.arrowHover);
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-float)';
            const arrow = e.currentTarget.querySelector('svg');
            if (arrow) {
              arrow.style.transform = 'translateX(0)';
            }
          }}
        >
          <span>Explore the Trails</span>
          <svg 
            style={heroStyles.arrow}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
      
      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          section {
            height: 70vh !important;
            min-height: 500px !important;
          }
        }

        @media (max-width: 480px) {
          section {
            height: 65vh !important;
            min-height: 450px !important;
          }
        }
      `}</style>
    </section>
  );
}