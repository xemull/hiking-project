// src/app/components/HeroSection.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const [isExploreHovered, setIsExploreHovered] = useState(false);
  const [isQuizHovered, setIsQuizHovered] = useState(false);

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
        
        {/* Hero Subtitle */}
        <p className="hero-subtitle">The world's most rewarding trails. Memories that last a lifetime.</p>
        
        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-md)',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Primary CTA - Explore Trails */}
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
              boxShadow: isExploreHovered ? '0 15px 50px rgba(0, 0, 0, 0.3)' : 'var(--shadow-float)',
              cursor: 'pointer',
              transform: isExploreHovered ? 'translateY(-2px)' : 'translateY(0)'
            }}
            onMouseEnter={() => setIsExploreHovered(true)}
            onMouseLeave={() => setIsExploreHovered(false)}
          >
            <span>Explore the trails</span>
            <svg 
              style={{
                marginLeft: 'var(--space-xs)',
                width: '1.25rem',
                height: '1.25rem',
                transition: 'transform 0.3s ease',
                transform: isExploreHovered ? 'translateX(4px)' : 'translateX(0)'
              }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          {/* Secondary CTA - Take Quiz */}
          <Link 
            href="/quiz"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: 'var(--space-md) var(--space-2xl)',
              background: 'transparent',
              border: '2px solid var(--ds-primary-foreground)',
              color: 'var(--ds-primary-foreground)',
              textDecoration: 'none',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              letterSpacing: '1px',
              borderRadius: '50px',
              transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              boxShadow: isQuizHovered ? '0 15px 50px rgba(0, 0, 0, 0.2)' : 'none',
              transform: isQuizHovered ? 'translateY(-2px)' : 'translateY(0)',
              backdropFilter: 'blur(10px)',
              backgroundColor: isQuizHovered ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'
            }}
            onMouseEnter={() => setIsQuizHovered(true)}
            onMouseLeave={() => setIsQuizHovered(false)}
          >
            <svg 
              style={{
                marginRight: 'var(--space-xs)',
                width: '1.25rem',
                height: '1.25rem',
                transition: 'transform 0.3s ease'
              }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Find my perfect hike</span>
          </Link>
        </div>
      </div>
    </section>
  );
}