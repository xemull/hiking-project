'use client';

import Link from 'next/link';

interface ItineraryProps {
  title: string;
  duration: string;
  difficulty: string;
  whoFor: string;
  description: string;
  highlights: string[];
  link: string;
}

export function ItineraryCard({ title, duration, difficulty, whoFor, description, highlights, link }: ItineraryProps) {
  return (
    <div 
      className="itinerary-card"
      style={{
        background: 'linear-gradient(135deg, white, var(--ds-off-white))',
        border: `1px solid var(--ds-border)`,
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-soft)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      
      {/* "Our Pick For" Label */}
      <div style={{
        background: 'var(--ds-accent)',
        color: 'black',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        fontSize: 'var(--text-sm)',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: '1rem',
        minHeight: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: '1.4'
      }}>
        Our Pick For: {whoFor}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: 'var(--text-xl)',
        fontWeight: '600',
        color: 'var(--ds-foreground)',
        marginBottom: '0.75rem'
      }}>
        {title}
      </h3>

      {/* Duration and Difficulty Badges */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{
          background: 'rgba(var(--ds-primary-rgb, 59, 130, 246), 0.1)',
          color: 'var(--ds-primary)',
          padding: '0.25rem 0.75rem',
          borderRadius: '12px',
          fontSize: 'var(--text-sm)',
          fontWeight: '600'
        }}>
          {duration}
        </div>
        <div style={{
          background: 'var(--ds-muted)',
          color: 'var(--ds-muted-foreground)',
          padding: '0.25rem 0.75rem',
          borderRadius: '12px',
          fontSize: 'var(--text-sm)',
          fontWeight: '600'
        }}>
          {difficulty}
        </div>
      </div>
      
      {/* Description */}
      <p style={{
        color: 'var(--ds-muted-foreground)',
        marginBottom: '1rem',
        flexGrow: 1
      }}>
        {description}
      </p>
      
      {/* Key Highlights */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{
          fontWeight: '600',
          color: 'var(--ds-foreground)',
          marginBottom: '0.5rem'
        }}>
          Key Highlights:
        </h4>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0, 
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          {highlights.map((highlight, index) => (
            <li key={index} style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--ds-muted-foreground)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                backgroundColor: 'var(--ds-primary)',
                borderRadius: '50%'
              }} />
              {highlight}
            </li>
          ))}
        </ul>
      </div>
      
      {/* CTA Button */}
      <Link
        href={link}
        className="itinerary-link"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--ds-primary)',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '25px',
          textDecoration: 'none',
          fontSize: 'var(--text-sm)',
          fontWeight: '600',
          width: '100%'
        }}
      >
        View Detailed Guide
      </Link>
    </div>
  );
}