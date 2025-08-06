// src/app/components/HikeCard.tsx
import type { HikeSummary } from '../../types';
import Image from 'next/image';
import Link from 'next/link';
import { createSlug } from '../services/api';
import { MapPin, Route, Calendar } from 'lucide-react';

export default function HikeCard({ hike }: { hike: HikeSummary }) {
  const { id, documentId, title, Length, Difficulty, countries, mainImage, hike_id, sceneries, accommodations, Best_time } = hike;
  
  // Handle multiple countries
  const countryNames = countries?.map(country => country.name) || [];
  const countryDisplay = countryNames.length > 0 
    ? countryNames.length === 1 
      ? countryNames[0]
      : countryNames.length === 2
        ? countryNames.join(' & ')
        : `${countryNames.slice(0, -1).join(', ')} & ${countryNames[countryNames.length - 1]}`
    : '';
    
  const imageUrl = mainImage?.url 
  ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${mainImage.url}` 
  : null;
  
  const slug = createSlug(title);

  // Get difficulty badge color based on difficulty level with transparency
  const getDifficultyStyle = (difficulty: string) => {
    const normalizedDifficulty = difficulty?.toLowerCase().trim();
    
    if (normalizedDifficulty === 'easy') {
      return { backgroundColor: 'rgba(16, 185, 129, 0.9)', color: '#ffffff' }; // Green
    } else if (normalizedDifficulty === 'moderate') {
      return { backgroundColor: 'rgba(245, 158, 11, 0.9)', color: '#ffffff' }; // Yellow/Amber
    } else if (normalizedDifficulty === 'challenging' || normalizedDifficulty === 'hard' || normalizedDifficulty === 'difficult') {
      return { backgroundColor: 'rgba(239, 68, 68, 0.9)', color: '#ffffff' }; // Red
    } else {
      // Default case - let's see what the actual value is
      console.log('Unknown difficulty value:', difficulty);
      return { backgroundColor: 'rgba(107, 114, 128, 0.9)', color: '#ffffff' }; // Gray fallback
    }
  };

  const cardStyles = {
    card: {
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', // ADDED: Base shadow
      transition: 'all 0.3s ease',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      background: 'white',
      textDecoration: 'none',
      border: '1px solid #f3f4f6'
    },
    cardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)' // ENHANCED: Deeper shadow on hover
    },
    imageContainer: {
      position: 'relative' as const,
      width: '100%',
      height: '280px', // INCREASED: From 12rem (192px) to 280px
      flexShrink: 0,
      overflow: 'hidden'
    },
    image: {
      transition: 'transform 0.5s ease'
    },
    imageHover: {
      transform: 'scale(1.05)'
    },
    difficultyBadge: {
      position: 'absolute' as const,
      top: '12px',
      left: '12px',
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '0.75rem',
      fontWeight: 600,
      fontFamily: 'Inter, system-ui, sans-serif',
      textTransform: 'capitalize' as const,
      zIndex: 10,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      ...getDifficultyStyle(Difficulty)
    },
    placeholder: {
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    placeholderContent: {
      textAlign: 'center' as const,
      color: '#9ca3af'
    },
    content: {
      padding: '1.5rem',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column' as const
    },
    title: {
      fontSize: '1.25rem',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: 600,
      marginBottom: '0.5rem', // REDUCED: Closer to country
      transition: 'color 0.3s ease',
      color: '#1f2937',
      lineHeight: 1.3
    },
    titleHover: {
      color: 'var(--ds-primary)'
    },
    countryRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      marginBottom: '0.75rem',
      fontSize: '0.8rem', // SMALLER: Reduced font size
      color: '#6b7280',
      fontWeight: 500,
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    lengthRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      marginBottom: '0.75rem',
      fontSize: '0.875rem',
      color: '#374151',
      fontWeight: 500,
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    tagSection: {
      marginTop: 'auto' // PUSH to bottom
    },
    tagRow: {
      marginBottom: '0.25rem'
    },
    tagList: {
      fontSize: '0.75rem', // SMALL typeface
      color: '#6b7280',
      fontFamily: 'Inter, system-ui, sans-serif',
      lineHeight: 1.4
    }
  };

  return (
    <Link href={`/hike/${slug}`} className="block group h-full" style={{ textDecoration: 'none' }}>
      <div 
        style={cardStyles.card}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, cardStyles.cardHover);
          // Update title color on hover
          const title = e.currentTarget.querySelector('.hike-title');
          if (title) {
            Object.assign((title as HTMLElement).style, cardStyles.titleHover);
          }
          // Scale image on hover
          const image = e.currentTarget.querySelector('.hike-image');
          if (image) {
            Object.assign((image as HTMLElement).style, cardStyles.imageHover);
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
          // Reset title color
          const title = e.currentTarget.querySelector('.hike-title');
          if (title) {
            (title as HTMLElement).style.color = '#1f2937';
          }
          // Reset image scale
          const image = e.currentTarget.querySelector('.hike-image');
          if (image) {
            (image as HTMLElement).style.transform = 'scale(1)';
          }
        }}
      >
        {/* Image with Overlaid Difficulty Badge */}
        <div style={cardStyles.imageContainer}>
          {/* Difficulty Badge - Overlaid on top-left */}
          {Difficulty && (
            <div style={cardStyles.difficultyBadge}>
              {Difficulty}
            </div>
          )}
          
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={`Image of ${title}`} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="hike-image"
              style={{ ...cardStyles.image, objectFit: 'cover' }}
            />
          ) : (
            <div style={cardStyles.placeholder}>
              <div style={cardStyles.placeholderContent}>
                <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20" style={{ width: '3rem', height: '3rem', marginBottom: '0.5rem' }}>
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>No Image</p>
              </div>
            </div>
          )}
        </div>
        
        <div style={cardStyles.content}>
          {/* Title */}
          <h3 
            className="hike-title"
            style={cardStyles.title}
          >
            {title}
          </h3>

          {/* Country with Pin Icon - Smaller, Higher */}
          {countryDisplay && (
            <div style={cardStyles.countryRow}>
              <MapPin size={12} />
              <span>{countryDisplay}</span>
            </div>
          )}

          {/* Length/Duration with Icon */}
          {Length && (
            <div style={cardStyles.lengthRow}>
              <Route size={14} />
              <span>{Length} km</span>
            </div>
          )}

          {/* Tags Section - Pushed to bottom */}
          <div style={cardStyles.tagSection}>
            {/* Scenery */}
            {sceneries && sceneries.length > 0 && (
              <div style={cardStyles.tagRow}>
                <div style={cardStyles.tagList}>
                  {sceneries.map((scenery: any, index: number) => (
                    <span key={index}>
                      {scenery.SceneryType || scenery.name || scenery}
                      {index < sceneries.length - 1 ? ' • ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Accommodation */}
            {accommodations && accommodations.length > 0 && (
              <div style={cardStyles.tagRow}>
                <div style={cardStyles.tagList}>
                  {accommodations.map((accommodation: any, index: number) => (
                    <span key={index}>
                      {accommodation.AccommodationType || accommodation}
                      {index < accommodations.length - 1 ? ' • ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}