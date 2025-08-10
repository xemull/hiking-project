// src/app/components/HeroSection.tsx
'use client';

import { useState } from 'react';

export default function HeroSection() {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const scrollToExploreAll = () => {
    const target = document.querySelector('.explore-all-hikes-header');
    if (target) {
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section 
      style={{
        position: 'relative',
        width: '100%',
        height: '75vh',
        minHeight: '600px',
        maxHeight: '800px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      className="hero-section-responsive"
    >
      {/* Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: "url('/IMG_1682.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }} />
      
      {/* Gradient Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'var(--gradient-hero)',
        opacity: 0.6,
        zIndex: 1
      }} />
      
      {/* Dark Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.1)',
        zIndex: 2
      }} />
      
      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 20,
        textAlign: 'center',
        color: 'var(--ds-primary-foreground)',
        maxWidth: '800px',
        padding: '0 var(--space-xl)',
        marginTop: '-10vh'
      }}>
        {/* Hero Title */}
        <h1 className="hero-title">Path Unfolding.</h1>
        
        {/* Hero Subtitle - fixed whitespace */}
        <p className="hero-subtitle">The world's most rewarding trails. Memories that last a lifetime.</p>
        
        {/* CTA Button */}
        <button 
          onClick={scrollToExploreAll} 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: 'var(--space-md) var(--space-2xl)',
            background: 'var(--ds-accent)',
            border: '2px solid transparent',
            color: 'var(--ds-accent-foreground)',
            textDecoration: 'none',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 'var(--text-base)',
            fontWeight: 600,
            letterSpacing: '1px',
            borderRadius: '50px',
            transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            boxShadow: isButtonHovered ? '0 15px 50px rgba(0, 0, 0, 0.3)' : 'var(--shadow-float)',
            cursor: 'pointer',
            transform: isButtonHovered ? 'translateY(-2px)' : 'translateY(0)'
          }}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          <span>Explore the trails</span>
          <svg 
            style={{
              marginLeft: 'var(--space-xs)',
              width: '1.25rem',
              height: '1.25rem',
              transition: 'transform 0.3s ease',
              transform: isButtonHovered ? 'translateX(4px)' : 'translateX(0)'
            }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </section>
  );
}