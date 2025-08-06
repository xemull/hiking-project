'use client';

import type { HikeSummary } from '../../types';
import Image from 'next/image';
import Link from 'next/link';
import { createSlug } from '../services/api';
import { MapPin, Route, TrendingUp, Calendar, Mountain } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FeaturedHikeSummary({ hike }: { hike: HikeSummary }) {
  const { title, Length, Difficulty, countries, mainImage, Description, Best_time, sceneries, accommodations, routeType } = hike;
  
  // Hook to detect screen size
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); // Only mobile and tablets, laptops get desktop layout
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const imageUrl = mainImage?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${mainImage.url}`
    : '/placeholder-image.jpg';
  
  const countryNames = countries?.map(country => country.name) || [];
  const countryDisplay = countryNames.length > 0 
    ? countryNames.length === 1 
      ? countryNames[0]
      : countryNames.length === 2
        ? countryNames.join(', ')
        : `${countryNames.slice(0, -1).join(', ')}, ${countryNames[countryNames.length - 1]}`
    : '';

  const slug = createSlug(title);

  // Extract description preview
  const getDescriptionPreview = (description: any[]) => {
    if (!description || !Array.isArray(description)) return '';
    
    let text = '';
    for (const block of description) {
      if (block.type === 'paragraph' && block.children) {
        for (const child of block.children) {
          if (child.text) {
            text += child.text;
          }
        }
        text += ' ';
        if (text.length > 200) break;
      }
    }
    
    const sentences = text.split('. ');
    return sentences.slice(0, 3).join('. ') + (sentences.length > 3 ? '.' : '');
  };

  const descriptionText = getDescriptionPreview(Description);

  const styles = {
    fullWidthSection: {
      width: '100vw',
      marginLeft: '-50vw',
      left: '50%',
      position: 'relative' as const,
      background: 'var(--ds-off-white)',
      padding: '4rem 0'
    },
    innerContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem'
    },
    hikeContainer: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? '2rem' : '3rem',
      alignItems: 'flex-start'
    },
    imageContainer: {
      position: 'relative' as const,
      width: '100%',  
      height: isMobile ? '300px' : '500px',
      borderRadius: '12px',
      overflow: 'hidden',
      cursor: 'pointer'
    },
    image: {
      transition: 'transform 0.3s ease'
    },
    imageHover: {
      transform: 'scale(1.05)'
    },
    hikeDetails: {
      padding: '0.5rem 0',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'flex-start',
      textAlign: isMobile ? 'center' as const : 'left' as const
    },
    locationRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-xs)',
      marginBottom: 'var(--space-md)',
      color: 'var(--ds-muted-foreground)',
      fontSize: 'var(--text-sm)',
      justifyContent: isMobile ? 'center' as const : 'flex-start' as const
    },
    hikeTitle: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 'var(--text-2xl)', // Uses CSS custom properties for consistency
      fontWeight: 600,
      color: 'var(--ds-foreground)',
      marginBottom: 'var(--space-sm)',
      lineHeight: 1.2
    },
    description: {
      color: '#4a5568',
      fontSize: 'var(--text-base)',
      lineHeight: 1.6,
      marginBottom: 'var(--space-lg)',
      textAlign: isMobile ? 'center' as const : 'left' as const
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: '0.75rem',
      marginBottom: '1.25rem',
      justifyItems: isMobile ? 'center' as const : 'flex-start' as const
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#4a5568',
      fontSize: '0.9rem',
      fontWeight: 500
    },
    tagsSection: {
      marginBottom: '1.5rem'
    },
    tagRow: {
      marginBottom: '0.5rem'
    },
    tagLabel: {
      fontSize: '0.8rem',
      color: 'var(--ds-muted-foreground)',
      marginBottom: '0.25rem',
      fontWeight: 500,
      textAlign: isMobile ? 'center' as const : 'left' as const
    },
    tagList: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap' as const,
      justifyContent: isMobile ? 'center' as const : 'flex-start' as const
    },
    tag: {
      background: '#e2e8f0',
      color: '#4a5568',
      padding: '0.2rem 0.6rem',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 500
    },
    ctaButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'var(--ds-accent)',
      color: 'var(--ds-accent-foreground)',
      padding: '0.75rem 1.5rem',
      borderRadius: '50px',
      textDecoration: 'none',
      fontSize: '0.875rem',
      fontWeight: 600,
      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      border: 'none',
      cursor: 'pointer',
      boxShadow: 'var(--shadow-float)',
      fontFamily: 'Inter, system-ui, sans-serif',
      alignSelf: isMobile ? 'center' as const : 'flex-start' as const
    },
    ctaButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)'
    }
  };

  // Reusable image component
  const ImageComponent = () => (
    <div style={{ 
      marginTop: isMobile ? '2rem' : '0',
      marginBottom: isMobile ? '2rem' : '0'
    }}>
      <Link href={`/hike/${slug}`} style={{ textDecoration: 'none' }}>
        <div 
          style={styles.imageContainer}
          onMouseEnter={(e) => {
            const img = e.currentTarget.querySelector('img');
            if (img) {
              Object.assign(img.style, styles.imageHover);
            }
          }}
          onMouseLeave={(e) => {
            const img = e.currentTarget.querySelector('img');
            if (img) {
              img.style.transform = 'scale(1)';
            }
          }}
        >
          <Image
            src={imageUrl}
            alt={`Image of ${title}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ ...styles.image, objectFit: 'cover' }}
            priority={true}
          />
        </div>
      </Link>
    </div>
  );

  // Location and title section
  const LocationAndTitle = () => (
    <>
      <div style={styles.locationRow}>
        <MapPin size={16} />
        <span>{countryDisplay}</span>
      </div>

      <Link href={`/hike/${slug}`} style={{ textDecoration: 'none' }}>
        <h3 
          style={{
            ...styles.hikeTitle,
            cursor: 'pointer',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--ds-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--ds-foreground)';
          }}
        >
          {title}
        </h3>
      </Link>
    </>
  );

  // Content sections
  const ContentSections = () => (
    <>
      <p style={styles.description}>
        {descriptionText || "Experience this incredible multi-day journey through stunning landscapes and diverse terrain."}
      </p>

      <div style={styles.infoGrid}>
        {Length && (
          <div style={styles.infoRow}>
            <Route size={16} />
            <span>{Length} km</span>
          </div>
        )}
        
        {Difficulty && (
          <div style={styles.infoRow}>
            <TrendingUp size={16} />
            <span>{Difficulty}</span>
          </div>
        )}
        
        {Best_time && (
          <div style={styles.infoRow}>
            <Calendar size={16} />
            <span>Best: {Best_time}</span>
          </div>
        )}
        
        {routeType && (
          <div style={styles.infoRow}>
            <Mountain size={16} />
            <span>{routeType}</span>
          </div>
        )}
      </div>

      <div style={styles.tagsSection}>
        {sceneries && sceneries.length > 0 && (
          <div style={styles.tagRow}>
            <div style={styles.tagLabel}>Scenery:</div>
            <div style={styles.tagList}>
              {sceneries.map((scenery: any, index: number) => (
                <span key={index} style={styles.tag}>
                  {scenery.SceneryType || scenery.name || scenery}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {accommodations && accommodations.length > 0 && (
          <div style={styles.tagRow}>
            <div style={styles.tagLabel}>Accommodation:</div>
            <div style={styles.tagList}>
              {accommodations.map((accommodation: any, index: number) => (
                <span key={index} style={styles.tag}>
                  {accommodation.AccommodationType || accommodation}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <Link href={`/hike/${slug}`} style={{ textDecoration: 'none' }}>
        <button 
          style={styles.ctaButton}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, styles.ctaButtonHover);
            const arrow = e.currentTarget.querySelector('svg');
            if (arrow) {
              arrow.style.transform = 'translateX(4px)';
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
          <span>View Complete Guide</span>
          <svg 
            width="16" 
            height="16" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{ transition: 'transform 0.3s ease' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </Link>
    </>
  );

  return (
    <div style={styles.fullWidthSection}>
      <div style={styles.innerContainer}>
        <div className="section-header">
          <span className="featured-badge">
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured Trek
          </span>
          
          <h2 className="section-title">This Month's Spotlight</h2>
          <p className="section-subtitle">
            Our most recommended hike this season, personally tested and thoroughly documented.
          </p>
        </div>

        <div style={styles.hikeContainer}>
          {isMobile ? (
            // Mobile/Tablet Layout: Location → Title → Image → Content → Button
            <div style={styles.hikeDetails}>
              <LocationAndTitle />
              <ImageComponent />
              <ContentSections />
            </div>
          ) : (
            // Desktop Layout: Text on left, Image on right
            <>
              <div style={styles.hikeDetails}>
                <LocationAndTitle />
                <ContentSections />
              </div>
              <ImageComponent />
            </>
          )}
        </div>
      </div>
    </div>
  );
}