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
import Navigation from '../../components/Navigation';
import BlogList from '../../components/BlogList';
import { MapPin, Route, TrendingUp, Mountain, AlertTriangle } from 'lucide-react';
import InlineBackButton from '../../components/InlineBackButton';
import Footer from '../../components/Footer';

// Generate dynamic page metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hike = await getHikeBySlug(slug);
  
  if (!hike) {
    return {
      title: 'Hike Not Found',
    };
  }

  // Get countries from relation - handle multiple countries (same logic as in component)
  const countryNames = hike.content.countries?.map(country => country.name) || [];
  const countryDisplay = countryNames.length > 0 
    ? countryNames.length === 1 
      ? countryNames[0]
      : countryNames.length === 2
        ? countryNames.join(' & ')
        : `${countryNames.slice(0, -1).join(', ')} & ${countryNames[countryNames.length - 1]}`
    : 'Unknown';

  return {
    title: `${hike.content.title}: A Complete Guide | ${countryDisplay} | Trailhead`,
    description: `Plan the ${hike.content.title} hike with confidence. Our beginner-friendly guide covers logistics, itinerary, and maps.`,
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
    Books,
    Blogs
  } = content;

  // Get hero image URL
  const heroImageUrl = mainImage?.url 
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${mainImage.url}` 
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
      alignItems: 'flex-end',
      justifyContent: 'flex-start'
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
      color: 'white',
      padding: '0 2rem 3rem 2rem'
    },
    heroTitle: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: 700,
      lineHeight: 1.1,
      textShadow: '0 4px 20px rgba(0,0,0,0.3)'
    },
    mainContainer: {
      background: 'var(--ds-background)',
      minHeight: '50vh'
    },
    contentWrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem'
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
      borderRadius: '6px',
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
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '2rem',
      marginBottom: '3rem'
    },
    tagColumn: {
      textAlign: 'center' as const
    },
    tagColumnTitle: {
      fontSize: '1rem',
      fontWeight: 600,
      color: 'var(--ds-foreground)',
      marginBottom: '1rem'
    },
    tagList: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap' as const,
      justifyContent: 'center'
    },
    tag: {
      color: 'var(--ds-muted-foreground)',
      fontSize: '0.875rem',
      fontWeight: 400,
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    tagSeparator: {
      margin: '0 0.5rem',
      color: 'var(--ds-muted-foreground)',
      opacity: 0.6
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
    sidebar: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '2rem',
      position: 'sticky' as const,
      top: '2rem'
    },
    sidebarCard: {
      background: 'transparent',
      padding: '0',
      borderRadius: '0',
      boxShadow: 'none',
      border: 'none',
      marginBottom: '2rem'
    },
    sidebarTitle: {
      fontSize: '1.125rem',
      fontWeight: 600,
      marginBottom: '1rem',
      color: 'var(--ds-foreground)'
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
        return <AlertTriangle style={styles.statIcon} />;
      case 'route':
        return <Mountain style={styles.statIcon} />;
      case 'country':
        return <MapPin style={styles.statIcon} />;
      default:
        return <Route style={styles.statIcon} />;
    }
  };

  return (
    <div style={{ background: 'var(--ds-background)', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Navigation */}
      <Navigation />
      
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

        {/* Hero Content - Bottom Left */}
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>{title}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContainer}>
        <div style={styles.contentWrapper}>
          <div style={{ padding: '3rem 0' }}>
          
          {/* Inline Back Button */}
          <InlineBackButton />
          
          {/* Stats Grid - Including Country */}
          <div style={styles.statsGrid}>
            {primaryCountry && (
              <div style={styles.statCard}>
                {getStatIcon('country')}
                <div style={styles.statLabel}>Country</div>
                <div style={styles.statValue}>{primaryCountry}</div>
              </div>
            )}
            {Length && (
              <div style={styles.statCard}>
                {getStatIcon('distance')}
                <div style={styles.statLabel}>Distance</div>
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

          {/* Tags Section - Three Columns */}
          <div style={styles.tagsSection}>
            {/* Scenery Column */}
            <div style={styles.tagColumn}>
              <h3 style={styles.tagColumnTitle}>Scenery</h3>
              <div style={styles.tagList}>
                {sceneries && sceneries.length > 0 ? (
                  sceneries.map((scenery, index) => (
                    <span key={`scenery-${scenery.id}`}>
                      <span style={styles.tag}>{scenery.SceneryType}</span>
                      {index < sceneries.length - 1 && <span style={styles.tagSeparator}>•</span>}
                    </span>
                  ))
                ) : (
                  <span style={{ ...styles.tag, opacity: 0.5 }}>Not specified</span>
                )}
              </div>
            </div>
            
            {/* Best Time Column */}
            <div style={styles.tagColumn}>
              <h3 style={styles.tagColumnTitle}>Best Time to Visit</h3>
              <div style={styles.tagList}>
                {Best_time ? (
                  <span style={styles.tag}>{Best_time}</span>
                ) : (
                  <span style={{ ...styles.tag, opacity: 0.5 }}>Not specified</span>
                )}
              </div>
            </div>
            
            {/* Accommodation Column */}
            <div style={styles.tagColumn}>
              <h3 style={styles.tagColumnTitle}>Accommodation</h3>
              <div style={styles.tagList}>
                {accommodations && accommodations.length > 0 ? (
                  accommodations.map((accommodation, index) => (
                    <span key={`accommodation-${accommodation.id}`}>
                      <span style={styles.tag}>{accommodation.AccommodationType}</span>
                      {index < accommodations.length - 1 && <span style={styles.tagSeparator}>•</span>}
                    </span>
                  ))
                ) : (
                  <span style={{ ...styles.tag, opacity: 0.5 }}>Not specified</span>
                )}
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div style={styles.contentGrid}>
            
            {/* Main Content */}
            <div style={styles.mainContent}>
              
              {/* Description Section */}
              {Description && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Description</h2>
                  <div style={styles.proseContent} className="prose-custom">
                    <StrapiRichText content={Description} />
                  </div>
                </div>
              )}

              {/* Route Section */}
              {track && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Route</h2>
                  <div style={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden' }}>
                    <Map track={track} />
                  </div>
                </div>
              )}

              {/* Elevation Section */}
              {simplified_profile && simplified_profile.length > 0 && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Elevation</h2>
                  <ElevationProfile 
                    data={simplified_profile} 
                    landmarks={content.landmarks}
                    height="320px"
                  />
                </div>
              )}

              {/* Getting There Section */}
              {Logistics && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Getting There & Back</h2>
                  <div style={styles.proseContent} className="prose-custom">
                    <StrapiRichText content={Logistics} />
                  </div>
                </div>
              )}

              {/* Accommodation Section */}
              {Accommodation && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Accommodation</h2>
                  <div style={styles.proseContent} className="prose-custom">
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

            {/* Right Sidebar */}
            <div style={styles.sidebar}>
              
              {/* Guidebooks */}
              {Books && Books.length > 0 && (
                <div style={styles.sidebarCard}>
                  <h3 style={styles.sidebarTitle}>Guidebooks</h3>
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
                  <h3 style={styles.sidebarTitle}>Videos</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {Videos.map((video) => (
                      <VideoEmbed key={video.id} video={video} />
                    ))}
                  </div>
                </div>
              )}

              {/* Blogs */}
              {Blogs && Blogs.length > 0 && (
                <div style={styles.sidebarCard}>
                  <h3 style={styles.sidebarTitle}>Related Articles</h3>
                  <BlogList blogs={Blogs} />
                </div>
              )}

            </div>
          </div>
          </div>
        </div>
      </div>
      <Footer />  {/* Add this line */}

      {/* Custom CSS for prose styling */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .prose-custom p {
            margin-bottom: 1.25rem;
            padding: 1rem 0;
            border-left: 3px solid #e2e8f0;
            padding-left: 1.5rem;
          }
          .prose-custom p:not(:last-child) {
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 1.5rem;
            margin-bottom: 1.5rem;
          }
          .prose-custom ul {
            margin: 0;
            padding: 1rem 0;
            border-left: 3px solid #e2e8f0;
            padding-left: 1.5rem;
            margin-bottom: 1.25rem;
          }
          .prose-custom li {
            margin-bottom: 0.5rem;
            color: #4a5568;
            font-family: 'Inter', system-ui, sans-serif;
            line-height: 1.7;
          }
          .prose-custom ul li {
            list-style-type: disc;
            margin-left: 1rem;
          }
          .prose-custom p + ul {
            margin-top: -1rem;
            border-top: none;
            padding-top: 0;
          }
        `
      }} />
    </div>
  );
}