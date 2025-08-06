// src/app/components/FeaturedHikeSummary.tsx
'use client';

import type { HikeSummary } from '../../types';
import Image from 'next/image';
import Link from 'next/link';
import { createSlug } from '../services/api';
import { MapPin, Route, TrendingUp, Calendar, Mountain, Home } from 'lucide-react';

export default function FeaturedHikeSummary({ hike }: { hike: HikeSummary }) {
  // UPDATED: Now includes accommodations and routeType
  const { id, title, Length, Difficulty, countries, mainImage, hike_id, Description, Best_time, sceneries, accommodations, routeType } = hike;
  
  // For full hike data, we'd need to fetch it separately or modify the type
  // For now, we'll work with what's available in HikeSummary

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

  // Extract first few sentences from rich text description (API data)
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
        // Stop after first paragraph or when we have enough text
        if (text.length > 200) break;
      }
    }
    
    // Truncate to first 2-3 sentences
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
      gridTemplateColumns: '1fr 1fr',
      gap: '3rem',
      alignItems: 'flex-start'
    },
    imageContainer: {
      position: 'relative' as const,
      width: '100%',  
      height: '500px',
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
      justifyContent: 'flex-start'
    },
    locationRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1rem',
      color: 'var(--ds-muted-foreground)',
      fontSize: '0.9rem'
    },
    hikeTitle: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '2rem',
      fontWeight: 600,
      color: 'var(--ds-foreground)',
      marginBottom: '0.75rem',
      lineHeight: 1.2
    },
    description: {
      color: '#4a5568',
      fontSize: '1rem',
      lineHeight: 1.6,
      marginBottom: '1.25rem'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.75rem',
      marginBottom: '1.25rem'
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
      fontWeight: 500
    },
    tagList: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap' as const
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
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    ctaButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)'
    }
  };

  return (
    <div style={styles.fullWidthSection}>
      <div style={styles.innerContainer}>
        {/* Use consistent header structure */}
        <div className="section-header">
          {/* Featured Trek Badge with star icon */}
          <span className="featured-badge">
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured Trek
          </span>
          
          {/* Section Title - now using consistent class */}
          <h2 className="section-title">This Month's Spotlight</h2>
          <p className="section-subtitle">
            Our most recommended hike this season, personally tested and thoroughly documented.
          </p>
        </div>

        {/* Main Hike Content */}
        <div style={styles.hikeContainer} className="featured-hike-container">
          
          {/* Mobile: Title First (will be reordered with CSS) */}
          <div style={styles.hikeDetails} className="hike-details">
            {/* Location with pin icon */}
            <div style={styles.locationRow}>
              <MapPin size={16} />
              <span>{countryDisplay}</span>
            </div>

            {/* Hike name - Now clickable */}
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

            {/* Description from API */}
            <p style={styles.description}>
              {descriptionText || "Experience this incredible multi-day journey through stunning landscapes and diverse terrain."}
            </p>

            {/* Info Grid - All available fields */}
            <div style={styles.infoGrid}>
              {/* Length */}
              {Length && (
                <div style={styles.infoRow}>
                  <Route size={16} />
                  <span>{Length} km</span>
                </div>
              )}
              
              {/* Difficulty */}
              {Difficulty && (
                <div style={styles.infoRow}>
                  <TrendingUp size={16} />
                  <span>{Difficulty}</span>
                </div>
              )}
              
              {/* Best time */}
              {Best_time && (
                <div style={styles.infoRow}>
                  <Calendar size={16} />
                  <span>Best: {Best_time}</span>
                </div>
              )}
              
              {/* Route type */}
              {routeType && (
                <div style={styles.infoRow}>
                  <Mountain size={16} />
                  <span>{routeType}</span>
                </div>
              )}
            </div>

            {/* Tags Section - All available fields */}
            <div style={styles.tagsSection}>
              {/* Sceneries */}
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
              
              {/* Accommodations - now available! */}
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

            {/* CTA Button */}
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
          </div>

          {/* Image - Now clickable */}
          <Link href={`/hike/${slug}`} style={{ textDecoration: 'none' }} className="hike-image">
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
      </div>

      {/* Mobile-Responsive CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 768px) {
            .featured-hike-container {
              grid-template-columns: 1fr !important;
              gap: 2rem !important;
            }
            
            /* Reorder: Title first, then image */
            .hike-details {
              order: 1;
              text-align: center;
              padding: 0 !important;
            }
            
            .hike-image {
              order: 2;
            }
            
            /* Adjust mobile image height */
            .hike-image > div {
              height: 300px !important;
            }
            
            /* Center mobile content */
            .hike-details > div:first-child {
              justify-content: center !important;
            }
            
            /* Make button full width on small screens */
            .hike-details button {
              width: fit-content;
              margin: 0 auto;
            }
            
            /* Adjust title size for mobile */
            .hike-details h3 {
              font-size: 1.75rem !important;
            }
            
            /* Stack info grid on mobile */
            .hike-details > div:nth-child(4) {
              grid-template-columns: 1fr !important;
              gap: 0.5rem !important;
              justify-items: center;
            }
            
            /* Center tags on mobile */
            .hike-details > div:nth-child(5) > div > div:last-child {
              justify-content: center !important;
            }
          }
          
          @media (max-width: 480px) {
            .featured-hike-container {
              gap: 1.5rem !important;
            }
            
            .hike-image > div {
              height: 250px !important;
            }
            
            .hike-details h3 {
              font-size: 1.5rem !important;
            }
          }
        `
      }} />
    </div>
  );
}