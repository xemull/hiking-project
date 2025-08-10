// src/app/page.tsx
import { Suspense } from 'react';
import type { HikeSummary } from '../types';
import FeaturedHikeSummary from './components/FeaturedHikeSummary';
import ClientFilters from './components/ClientFilters';
import HeroSection from './components/HeroSection';
import Navigation from './components/Navigation';
import { getHikes, getFeaturedHike } from './services/api';
import Footer from './components/Footer';

// Loading components for better UX
function FeaturedHikeLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

function HikesListLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Separate component for featured hike that can load independently
async function FeaturedHikeSection() {
  try {
    const featuredHike = await getFeaturedHike();
    
    if (!featuredHike) {
      // If no featured hike, get first regular hike as fallback
      const hikes = await getHikes();
      if (hikes && hikes.length > 0) {
        return <FeaturedHikeSummary hike={hikes[0]} />;
      }
      return null;
    }

    return <FeaturedHikeSummary hike={featuredHike} />;
  } catch (error) {
    console.error('Error loading featured hike:', error);
    return null;
  }
}

// Separate component for hikes list that can load independently
async function HikesListSection() {
  try {
    const hikes = await getHikes();

    if (!hikes || hikes.length === 0) {
      return (
        <div className="container mx-auto px-4">
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h1 className="section-title">No hikes found</h1>
            <p style={{ 
              color: 'var(--ds-muted-foreground)', 
              fontSize: '1.125rem' 
            }}>
              Could not load hikes from the API.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4" style={{ marginTop: '3rem' }}>
        <div className="explore-all-hikes-header">
          <h2 className="section-title">
            Explore all trails 
          </h2>
          <p className="section-subtitle">
            Discover our complete collection of carefully researched multi-day treks from around the world
          </p>
        </div>
        
        <Suspense fallback={
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '3rem 0' 
          }}>
            <div className="loading-spinner"></div>
            <span style={{ 
              marginLeft: '0.75rem', 
              color: 'var(--ds-muted-foreground)' 
            }}>
              Loading filters...
            </span>
          </div>
        }>
          <ClientFilters hikes={hikes} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading hikes list:', error);
    return (
      <div className="container mx-auto px-4">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h1 className="section-title">Error loading hikes</h1>
          <p style={{ 
            color: 'var(--ds-muted-foreground)', 
            fontSize: '1.125rem' 
          }}>
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }
}

// Lightweight navigation data - only essential fields
async function getNavigationData(): Promise<HikeSummary[]> {
  try {
    // For navigation, we only need basic info, so we can use a lighter query
    // or return an empty array and load navigation data separately
    const hikes = await getHikes();
    return hikes || [];
  } catch (error) {
    console.error('Error loading navigation data:', error);
    return [];
  }
}

export default async function HomePage() {
  // Only get essential data for initial page load
  const hikesForNav = await getNavigationData();

  const sectionStyles = {
    main: {
      background: 'var(--ds-background)',
      minHeight: '100vh'
    }
  };

  return (
    <>
      <Navigation hikes={hikesForNav} />
      <main style={sectionStyles.main}>
        <HeroSection />
        
        <section id="featured-hikes">
          {/* Featured section loads independently */}
          <Suspense fallback={<FeaturedHikeLoading />}>
            <FeaturedHikeSection />
          </Suspense>

          {/* Hikes list loads independently */}
          <Suspense fallback={<HikesListLoading />}>
            <HikesListSection />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}