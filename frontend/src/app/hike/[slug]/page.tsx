// src/app/hike/[slug]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getHikeBySlug } from '../../services/api'; 
import type { Hike } from '../../../types';
import StrapiRichText from '../../components/StrapiRichText';
import Map from '../../components/Map';
import ElevationProfile from '../../components/ElevationProfile';
import TagBadge from '../../components/TagBadge';
import StatCard from '../../components/StatCard';
import BookCard from '../../components/BookCard';
import VideoEmbed from '../../components/VideoEmbed';
import CommentsSection from '../../components/CommentsSection';
import { MapPin, Route, TrendingUp, Calendar, Mountain } from 'lucide-react';
import InteractiveBackButton from '../../components/InteractiveBackButton';

// Generate dynamic page metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hike = await getHikeBySlug(slug);
  
  if (!hike) {
    return {
      title: 'Hike Not Found',
    };
  }

  return {
    title: `${hike.content.title} - Multi-day Hiking Guide`,
    description: `Complete guide to ${hike.content.title}: ${hike.content.Length}km, ${hike.content.Difficulty} difficulty. Logistics, itinerary, and everything you need to know.`,
  };
}

export default async function HikeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hike = await getHikeBySlug(slug);

  if (!hike || !hike.content) {
    notFound();
  }

  const { content, track, simplified_profile } = hike;
  const {
    title,
    Length,
    Elevation_gain,
    Difficulty,
    routeType,
    Best_time,
    Description,
    Logistics,
    Accommodation,
    mainImage,
    countries,
    sceneries,
    months,
    accommodations,
    Videos,
    Books
  } = content;

  // Get hero image URL
  const heroImageUrl = mainImage?.url 
    ? `http://localhost:1337${mainImage.url}` 
    : null;

  // Get countries from relation - handle multiple countries
  const countryNames = countries?.map(country => country.name) || [];
  const primaryCountry = countryNames.length > 0 
    ? countryNames.length === 1 
      ? countryNames[0]
      : countryNames.length === 2
        ? countryNames.join(' & ')
        : `${countryNames.slice(0, -1).join(', ')} & ${countryNames[countryNames.length - 1]}`
    : '';

  const styles = {
    heroSection: {
      position: 'relative' as const,
      width: '100%',
      height: '70vh',
      minHeight: '500px',
      background: heroImageUrl ? 'transparent' : 'var(--gradient-hero)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    backButtonHover: {
      background: 'white',
      transform: 'translateY(-2px)',
      boxShadow: 'var(--shadow-float)'
    },
    heroOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
      zIndex: 1
    },
    heroContent: {
      position: 'relative' as const,
      zIndex: 2,
      textAlign: 'center' as const,
      color: 'white',
      maxWidth: '800px',
      padding: '0 2rem'
    },
    heroTitle: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: 700,
      marginBottom: '1rem',
      lineHeight: 1.1,
      textShadow: '0 4px 20px rgba(0,0,0,0.3)'
    },
    heroLocation: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontSize: '1.25rem',
      opacity: 0.95,
      marginBottom: '2rem'
    },
    mainContainer: {
      background: 'var(--ds-background)',
      minHeight: '50vh'
    },
    contentWrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '3rem 2rem'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '3rem'
    },
    statCard: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: 'var(--shadow-card)',
      textAlign: 'center' as const,
      border: '1px solid var(--ds-border)'
    },
    statIcon: {
      width: '24px',
      height: '24px',
      color: 'var(--ds-primary)',
      margin: '0 auto 0.75rem auto'
    },
    statLabel: {
      fontSize: '0.875rem',
      color: 'var(--ds-muted-foreground)',
      marginBottom: '0.25rem',
      fontWeight: 500
    },
    statValue: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: 'var(--ds-foreground)'
    },
    tagsSection: {
      marginBottom: '3rem'
    },
    tagGroup: {
      marginBottom: '1rem'
    },
    tagLabel: {
      fontSize: '0.875rem',
      color: 'var(--ds-muted-foreground)',
      marginBottom: '0.5rem',
      fontWeight: 500
    },
    tagList: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap' as const
    },
    tag: {
      background: 'var(--ds-muted)',
      color: 'var(--ds-foreground)',
      padding: '0.375rem 0.875rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: 500,
      border: '1px solid var(--ds-border)'
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '3rem',
      alignItems: 'flex-start'
    },
    mainContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '3rem'
    },
    section: {
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: 'var(--shadow-card)',
      border: '1px solid var(--ds-border)'
    },
    sectionTitle: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '1.5rem',
      fontWeight: 600,
      color: 'var(--ds-foreground)',
      marginBottom: '1.5rem',
      paddingBottom: '0.75rem',
      borderBottom: '2px solid var(--ds-border)'
    },
    sidebar: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '2rem',
      position: 'sticky' as const,
      top: '2rem'
    },
    sidebarCard: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: 'var(--shadow-card)',
      border: '1px solid var(--ds-border)'
    },
    quickFactRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 0',
      borderBottom: '1px solid #f1f5f9',
      fontSize: '0.875rem'
    },
    quickFactLabel: {
      color: 'var(--ds-muted-foreground)',
      fontWeight: 500
    },
    quickFactValue: {
      color: 'var(--ds-foreground)',
      fontWeight: 600
    }
  };

  // Helper function to get icon for stats
  const getStatIcon = (type: string) => {
    switch (type) {
      case 'distance':
        return <Route style={styles.statIcon} />;
      case 'elevation':
        return <TrendingUp style={styles.statIcon} />;
      case 'difficulty':
        return <Mountain style={styles.statIcon} />;
      case 'route':
        return <Mountain style={styles.statIcon} />;
      default:
        return <Route style={styles.statIcon} />;
    }
  };

  return (
    <div style={{ background: 'var(--ds-background)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        {heroImageUrl && (
          <Image
            src={heroImageUrl}
            alt={`${title} hero image`}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', zIndex: 0 }}
            priority={true}
          />
        )}
        
        {/* Overlay */}
        <div style={styles.heroOverlay}></div>
        
        {/* Back Button */}
        <InteractiveBackButton />

        {/* Hero Content */}
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>{title}</h1>
          {primaryCountry && (
            <div style={styles.heroLocation}>
              <MapPin size={20} />
              <span>{primaryCountry}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContainer}>
        <div style={styles.contentWrapper}>
          
          {/* Stats Grid - Consolidated */}
          <div style={styles.statsGrid}>
            {Length && (
              <div style={styles.statCard}>
                {getStatIcon('distance')}
                <div style={styles.statLabel}>Total Distance</div>
                <div style={styles.statValue}>{Length} km</div>
              </div>
            )}
            {Elevation_gain && (
              <div style={styles.statCard}>
                {getStatIcon('elevation')}
                <div style={styles.statLabel}>Elevation Gain</div>
                <div style={styles.statValue}>{Elevation_gain.toLocaleString()} m</div>
              </div>
            )}
            {Difficulty && (
              <div style={styles.statCard}>
                {getStatIcon('difficulty')}
                <div style={styles.statLabel}>Difficulty</div>
                <div style={styles.statValue}>{Difficulty}</div>
              </div>
            )}
            {routeType && (
              <div style={styles.statCard}>
                {getStatIcon('route')}
                <div style={styles.statLabel}>Route Type</div>
                <div style={styles.statValue}>{routeType}</div>
              </div>
            )}
          </div>

          {/* Tags Section - Consolidated and organized */}
          <div style={styles.tagsSection}>
            {/* Scenery Tags */}
            {sceneries && sceneries.length > 0 && (
              <div style={styles.tagGroup}>
                <div style={styles.tagLabel}>Scenery & Landscapes:</div>
                <div style={styles.tagList}>
                  {sceneries.map((scenery) => (
                    <span key={`scenery-${scenery.id}`} style={styles.tag}>
                      {scenery.SceneryType}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Best Time / Seasons - consolidated */}
            {(Best_time || (months && months.length > 0)) && (
              <div style={styles.tagGroup}>
                <div style={styles.tagLabel}>Best Time to Visit:</div>
                <div style={styles.tagList}>
                  {Best_time && (
                    <span style={styles.tag}>{Best_time}</span>
                  )}
                  {months?.map((month) => (
                    <span key={`month-${month.id}`} style={styles.tag}>
                      {month.MonthTag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Accommodation Tags */}
            {accommodations && accommodations.length > 0 && (
              <div style={styles.tagGroup}>
                <div style={styles.tagLabel}>Accommodation Types:</div>
                <div style={styles.tagList}>
                  {accommodations.map((accommodation) => (
                    <span key={`accommodation-${accommodation.id}`} style={styles.tag}>
                      {accommodation.AccommodationType}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content Grid */}
          <div style={styles.contentGrid}>
            
            {/* Main Content */}
            <div style={styles.mainContent}>
              
              {/* Description Section */}
              {Description && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>About This Hike</h2>
                  <div className="prose prose-lg max-w-none">
                    <StrapiRichText content={Description} />
                  </div>
                </div>
              )}

              {/* Map & Elevation Section */}
              {(track || simplified_profile) && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Route & Elevation</h2>
                  
                  {/* Map */}
                  {track && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--ds-foreground)' }}>
                        Trail Map
                      </h3>
                      <div style={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--ds-border)' }}>
                        <Map track={track} />
                      </div>
                    </div>
                  )}

                  {/* Elevation Profile */}
                  {simplified_profile && simplified_profile.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--ds-foreground)' }}>
                        Elevation Profile
                      </h3>
                      <ElevationProfile 
                        data={simplified_profile} 
                        landmarks={content.landmarks}
                        height="320px"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Logistics Section */}
              {Logistics && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Getting There & Back</h2>
                  <div className="prose prose-lg max-w-none">
                    <StrapiRichText content={Logistics} />
                  </div>
                </div>
              )}

              {/* Accommodation Section */}
              {Accommodation && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Where to Stay</h2>
                  <div className="prose prose-lg max-w-none">
                    <StrapiRichText content={Accommodation} />
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div style={styles.section}>
                <CommentsSection 
                  hikeId={slug} 
                  hikeTitle={content.title}
                />
              </div>

            </div>

            {/* Sidebar */}
            <div style={styles.sidebar}>
              
              {/* Quick Facts */}
              <div style={styles.sidebarCard}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--ds-foreground)' }}>
                  Planning Details
                </h3>
                <div>
                  {Best_time && (
                    <div style={styles.quickFactRow}>
                      <span style={styles.quickFactLabel}>Best Time:</span>
                      <span style={styles.quickFactValue}>{Best_time}</span>
                    </div>
                  )}
                  {primaryCountry && (
                    <div style={styles.quickFactRow}>
                      <span style={styles.quickFactLabel}>Location:</span>
                      <span style={styles.quickFactValue}>{primaryCountry}</span>
                    </div>
                  )}
                  {Length && Elevation_gain && (
                    <div style={styles.quickFactRow}>
                      <span style={styles.quickFactLabel}>Avg. Daily Distance:</span>
                      <span style={styles.quickFactValue}>~{Math.round(Length / 7)} km</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Guidebooks */}
              {Books && Books.length > 0 && (
                <div style={styles.sidebarCard}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--ds-foreground)' }}>
                    Recommended Guidebooks
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {Books.map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {Videos && Videos.length > 0 && (
                <div style={styles.sidebarCard}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--ds-foreground)' }}>
                    Watch Videos
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {Videos.map((video) => (
                      <VideoEmbed key={video.id} video={video} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}