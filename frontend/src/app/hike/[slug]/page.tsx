// src/app/hike/[slug]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getHikeBySlug, getHikes } from '../../services/api'; 
import type { Hike } from '../../../types';
import StrapiRichText from '../../components/StrapiRichText';
import DynamicMap from '../../components/DynamicMap';
import DynamicElevationProfile from '../../components/DynamicElevationProfile';
import TagBadge from '../../components/TagBadge';
import StatCard from '../../components/StatCard';
import BookCard from '../../components/BookCard';
import Navigation from '../../components/Navigation';
import VideoEmbed from '../../components/VideoEmbed';
import BlogList from '../../components/BlogList';
import { MapPin, Route, TrendingUp, Mountain, AlertTriangle } from 'lucide-react';
import InlineBackButton from '../../components/InlineBackButton';
import Footer from '../../components/Footer';
import CacheClearButton from '../../components/CacheClearButton';

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
  
  // Fetch both the specific hike and all hikes (for search functionality)
  const [hike, allHikes] = await Promise.all([
    getHikeBySlug(slug),
    getHikes()
  ]);

  if (!hike || !hike.content) {
    notFound();
  }

  const { content, track, simplified_profile } = hike;

  // Debug logging
  console.log('🔍 Hike content received:', content);
  console.log('🔍 Countries:', content?.countries);
  console.log('🔍 Sceneries:', content?.sceneries);
  console.log('🔍 Accommodations:', content?.accommodations);

  const {
    title,
    Length,
    Elevation_gain,
    Difficulty,
    routeType,
    Best_time,
    Description,
    Logistics,
    accommodation,
    mainImage,
    countries,
    sceneries,
    months,
    accommodations,
    Videos,
    Books,
    Blogs
  } = content;

  // Get hero image URL - prefer optimized sized variants first for faster LCP
  const heroImageUrl = mainImage ? (() => {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

    // Helper function to handle both relative and absolute URLs
    const getFullUrl = (url: string) => {
      // If URL already starts with http:// or https://, it's absolute - return as-is
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      // Otherwise it's relative, prepend baseUrl
      return `${baseUrl}${url}`;
    };

    // Prefer sized variants (large → medium) to reduce bytes and decode time
    if (mainImage.formats?.large?.url) {
      return getFullUrl(mainImage.formats.large.url);
    }
    if (mainImage.formats?.medium?.url) {
      return getFullUrl(mainImage.formats.medium.url);
    }
    // Fallback to original
    if (mainImage.url) {
      return getFullUrl(mainImage.url);
    }
    return null;
  })() : null;

  // Get countries from relation - handle multiple countries
  const countryNames = countries?.map(country => country.name) || [];
  const primaryCountry = countryNames.length > 0
    ? countryNames.length === 1
      ? countryNames[0]
      : countryNames.length === 2
        ? countryNames.join(' & ')
        : `${countryNames.slice(0, -1).join(', ')} & ${countryNames[countryNames.length - 1]}`
    : '';

  // Debug logging for processed data
  console.log('🔍 Country names extracted:', countryNames);
  console.log('🔍 Primary country:', primaryCountry);
  console.log('🔍 Sceneries count:', sceneries?.length);
  console.log('🔍 Accommodations count:', accommodations?.length);

  // Helper function to get icon for stats
  const getStatIcon = (type: string) => {
    const iconStyle = {
      width: '20px',
      height: '20px',
      color: 'var(--ds-primary)',
      margin: '0 auto 0.5rem auto',
      display: 'block'
    };
    
    switch (type) {
      case 'distance':
        return <Route style={iconStyle} />;
      case 'elevation':
        return <TrendingUp style={iconStyle} />;
      case 'difficulty':
        return <AlertTriangle style={iconStyle} />;
      case 'route':
        return <Mountain style={iconStyle} />;
      case 'country':
        return <MapPin style={iconStyle} />;
      default:
        return <Route style={iconStyle} />;
    }
  };

  return (
    <div style={{ background: 'var(--ds-background)', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Navigation with search support */}
      <Navigation hikes={allHikes || []} />
      
      {/* Hero Section - Responsive Height */}
      <div className="hike-hero">
        {heroImageUrl && (
          <Image
            src={heroImageUrl}
            alt={`${title} hero image`}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 90vw, 750px"
            quality={75}
            style={{ objectFit: 'cover', zIndex: 0 }}
            priority={true}
            fetchPriority="high"
          />
        )}
        
        {/* Overlay */}
        <div className="hero-overlay"></div>

        {/* Hero Content */}
        <div className="hero-content">
          <h1 className="hero-title">{title}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ background: 'var(--ds-background)', minHeight: '50vh' }}>
        <div className="content-wrapper">
          <div style={{ padding: '2rem 0' }}>
          
            {/* Inline Back Button */}
            <InlineBackButton />
            
            {/* Stats Grid - Mobile Responsive */}
            <div className="stats-grid">
              {primaryCountry && (
                <div className="stat-card">
                  {getStatIcon('country')}
                  <div className="stat-label">Country</div>
                  <div className="stat-value">{primaryCountry}</div>
                </div>
              )}
              {Length && (
                <div className="stat-card">
                  {getStatIcon('distance')}
                  <div className="stat-label">Distance</div>
                  <div className="stat-value">{Length} km</div>
                </div>
              )}
              {Elevation_gain && (
                <div className="stat-card">
                  {getStatIcon('elevation')}
                  <div className="stat-label">Elevation</div>
                  <div className="stat-value">{Elevation_gain.toLocaleString()} m</div>
                </div>
              )}
              {Difficulty && (
                <div className="stat-card">
                  {getStatIcon('difficulty')}
                  <div className="stat-label">Difficulty</div>
                  <div className="stat-value">{Difficulty}</div>
                </div>
              )}
              {routeType && (
                <div className="stat-card">
                  {getStatIcon('route')}
                  <div className="stat-label">Type</div>
                  <div className="stat-value">{routeType}</div>
                </div>
              )}
            </div>

            {/* Tags Section - Mobile Responsive */}
            <div className="tags-section">
              {/* Scenery */}
              <div className="tag-group">
                <h3 className="tag-group-title">Scenery</h3>
                <div className="tag-list">
                  {sceneries && sceneries.length > 0 ? (
                    sceneries.map((scenery, index) => (
                      <span key={`scenery-${scenery.id}`} className="tag">
                        {scenery.SceneryType}
                      </span>
                    ))
                  ) : (
                    <span className="tag tag-empty">Not specified</span>
                  )}
                </div>
              </div>
              
              {/* Best Time */}
              <div className="tag-group">
                <h3 className="tag-group-title">Best Time</h3>
                <div className="tag-list">
                  {Best_time ? (
                    <span className="tag">{Best_time}</span>
                  ) : (
                    <span className="tag tag-empty">Not specified</span>
                  )}
                </div>
              </div>
              
              {/* Accommodation */}
              <div className="tag-group">
                <h3 className="tag-group-title">Stay</h3>
                <div className="tag-list">
                  {accommodations && accommodations.length > 0 ? (
                    accommodations.map((accommodation, index) => (
                      <span key={`accommodation-${accommodation.id}`} className="tag">
                        {accommodation.AccommodationType}
                      </span>
                    ))
                  ) : (
                    <span className="tag tag-empty">Not specified</span>
                  )}
                </div>
              </div>
            </div>

            {/* Content Layout - Desktop: Grid, Mobile: Stack */}
            <div className="content-layout">
              
              {/* Main Content */}
              <div className="main-content">
                
                {/* Description Section */}
                {Description && (
                  <div className="content-section">
                    <h2 className="section-title">Description</h2>
                    <div className="prose-content">
                      <StrapiRichText content={Description} />
                    </div>
                  </div>
                )}

                {/* Route Section */}
                {track && (
                  <div className="content-section">
                    <h2 className="section-title">Route</h2>
                    <div className="map-container">
                      <DynamicMap track={track} />
                    </div>
                  </div>
                )}

                {/* Elevation Section */}
                {simplified_profile && simplified_profile.length > 0 && (
                  <div className="content-section">
                    <h2 className="section-title">Elevation</h2>
                    <DynamicElevationProfile
                      data={simplified_profile}
                      landmarks={content.landmarks}
                      height="320px"
                    />
                  </div>
                )}

                {/* Getting There Section */}
                {Logistics && (
                  <div className="content-section">
                    <h2 className="section-title">Getting There & Back</h2>
                    <div className="prose-content">
                      <StrapiRichText content={Logistics} />
                    </div>
                  </div>
                )}

                {/* Accommodation Section */}
                {accommodation && (
                  <div className="content-section">
                    <h2 className="section-title">Accommodation</h2>
                    <div className="prose-content">
                      <StrapiRichText content={accommodation} />
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar - Desktop Only, Mobile: Below Main Content */}
              <div className="sidebar">
                
                {/* Guidebooks */}
                {Books && Books.length > 0 && (
                  <div className="sidebar-section">
                    <h3 className="sidebar-title">Guidebooks</h3>
                    <div className="sidebar-content">
                      {Books.map((book) => (
                        <BookCard key={book.id} book={book} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos */}
                {Videos && Videos.length > 0 && (
                  <div className="sidebar-section">
                    <h3 className="sidebar-title">Videos</h3>
                    <div className="sidebar-content">
                      {Videos.map((video) => (
                        <VideoEmbed key={video.id} video={video} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Blogs */}
                {Blogs && Blogs.length > 0 && (
                  <div className="sidebar-section">
                    <h3 className="sidebar-title">Related Articles</h3>
                    <BlogList blogs={Blogs} />
                  </div>
                )}

              </div>
            </div>

            {/* Comments Section temporarily disabled */}

          </div>
        </div>
      </div>
      <Footer />

      {/* Responsive CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Hero Section - Responsive */
          .hike-hero {
            position: relative;
            width: 100%;
            height: 50vh; /* Reduced from 70vh */
            min-height: 300px; /* Reduced from 500px */
            background: var(--gradient-hero);
            display: flex;
            align-items: flex-end;
            justify-content: flex-start;
          }
          
          .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%);
            z-index: 1;
          }
          
          .hero-content {
            position: relative;
            z-index: 2;
            color: white;
            padding: 0 1rem 2rem 1rem; /* Reduced padding */
            width: 100%;
          }
          
          .hero-title {
            font-family: 'Inter', system-ui, sans-serif;
            font-size: var(--text-3xl); /* Mobile: 30px */
            font-weight: 700;
            line-height: 1.1;
            text-shadow: 0 4px 20px rgba(0,0,0,0.3);
            margin: 0;
          }
          
          /* Content Wrapper */
          .content-wrapper {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
          }
          
          /* Stats Grid - Mobile Responsive */
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr); /* 2 columns on mobile */
            gap: 0.75rem;
            margin-bottom: 2rem;
          }
          
          .stat-card {
            background: white;
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
            box-shadow: var(--shadow-soft);
          }
          
          .stat-label {
            font-size: var(--text-xs);
            color: var(--ds-muted-foreground);
            margin-bottom: 0.25rem;
            font-weight: 500;
          }
          
          .stat-value {
            font-size: var(--text-sm);
            font-weight: 600;
            color: var(--ds-foreground);
          }
          
          /* Tags Section - Mobile Stack */
          .tags-section {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin-bottom: 2.5rem;
            text-align: center;
          }
          
          .tag-group {
            text-align: center;
          }
          
          .tag-group-title {
            font-size: var(--text-base);
            font-weight: 600;
            color: var(--ds-foreground);
            margin-bottom: 0.75rem;
          }
          
          .tag-list {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .tag {
            background: var(--ds-muted);
            color: var(--ds-foreground);
            padding: 0.25rem 0.75rem;
            border-radius: 16px;
            font-size: var(--text-xs);
            font-weight: 500;
          }
          
          .tag-empty {
            opacity: 0.6;
          }
          
          /* Content Layout - Mobile Stack */
          .content-layout {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }
          
          .main-content {
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
          }
          
          .content-section {
            background: transparent;
            padding: 0;
          }
          
          .section-title {
            font-family: 'Inter', system-ui, sans-serif;
            font-size: var(--text-xl);
            font-weight: 600;
            color: var(--ds-foreground);
            margin-bottom: 1.5rem;
            padding-bottom: 0;
          }
          
          /* Prose Content - Mobile Optimized */
          .prose-content {
            font-family: 'Inter', system-ui, sans-serif;
            font-size: var(--text-base);
            line-height: 1.7;
            color: var(--ds-foreground);
          }
          
          /* Remove left border on mobile */
          .prose-content p {
            margin-bottom: 1.5rem;
            padding: 0; /* Remove padding */
            border-left: none; /* Remove left border */
            padding-left: 0; /* Remove left padding */
          }
          
          .prose-content p:not(:last-child) {
            padding-bottom: 0rem;
            margin-bottom: 1.75rem;
          }
          
          .prose-content ul {
            margin: 0;
            padding: 0; /* Remove padding */
            border-left: none; /* Remove left border */
            padding-left: 1rem; /* Just basic list padding */
            margin-bottom: 1.5rem;
          }
          
          .prose-content li {
            margin-bottom: 0.5rem;
            color: var(--ds-foreground);
            font-family: 'Inter', system-ui, sans-serif;
            line-height: 1.7;
          }
          
          .prose-content ul li {
            list-style-type: disc;
          }
          
          /* Map Container */
          .map-container {
            width: 100%;
            height: 300px; /* Smaller on mobile */
            border-radius: 8px;
            overflow: hidden;
          }
          
          /* Sidebar - Mobile Below Content */
          .sidebar {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }
          
          .sidebar-section {
            background: transparent;
            padding: 0;
            margin-bottom: 1.5rem;
          }
          
          .sidebar-title {
            font-size: var(--text-lg);
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--ds-foreground);
          }
          
          .sidebar-content {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          
          /* Tablet Adjustments */
          @media (min-width: 768px) {
            .hike-hero {
              height: 60vh;
              min-height: 400px;
            }
            
            .hero-content {
              padding: 0 2rem 3rem 2rem;
            }
            
            .hero-title {
              font-size: var(--text-4xl); /* Desktop: 48px */
            }
            
            .content-wrapper {
              padding: 0 2rem;
            }
            
            .stats-grid {
              grid-template-columns: repeat(3, 1fr); /* 3 columns on tablet */
              gap: 1rem;
            }
            
            .stat-card {
              padding: 1.25rem;
            }
            
            .stat-label {
              font-size: var(--text-sm);
            }
            
            .stat-value {
              font-size: var(--text-base);
            }
            
            .tags-section {
              flex-direction: row;
              justify-content: space-between;
              text-align: center;
            }
            
            .tag-group {
              flex: 1;
            }
            
            .section-title {
              font-size: var(--text-2xl);
              margin-bottom: 2rem; /* More generous spacing */
            }
            
            .map-container {
              height: 400px;
            }
            
            /* Restore left borders on desktop for prose */
            .prose-content p {
              padding-left: 0;
            }
            
            .prose-content ul {
              padding-left: 1rem;
            }
          }
          
          /* Desktop Layout */
          @media (min-width: 1024px) {
            .stats-grid {
              grid-template-columns: repeat(5, 1fr); /* 5 columns on desktop */
            }
            
            .content-layout {
              display: grid;
              grid-template-columns: 2fr 1fr;
              gap: 3rem;
              align-items: flex-start;
            }
            
            .sidebar {
              position: sticky;
              top: 2rem;
            }
          }
        `
      }} />

      {/* Debug Cache Clear Button - Development Only */}
      <CacheClearButton />
    </div>
  );
}
