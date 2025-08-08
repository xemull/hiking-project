// src/app/page.tsx
import { Suspense } from 'react';
import type { HikeSummary } from '../types';
import HikeCard from './components/HikeCard';
import FeaturedHikeSummary from './components/FeaturedHikeSummary';
import ClientFilters from './components/ClientFilters';
import HeroSection from './components/HeroSection';
import Navigation from './components/Navigation';
import { getHikes, getFeaturedHike } from './services/api';
import Footer from './components/Footer';

export default async function HomePage() {
  // Fetch both regular hikes and featured hike
  const [hikes, featuredHike] = await Promise.all([
    getHikes(),
    getFeaturedHike()
  ]);

  // Debug logging
  console.log('🏠 Homepage - All hikes count:', hikes?.length || 0);
  console.log('⭐ Homepage - Featured hike:', featuredHike ? featuredHike.title : 'null');
  console.log('⭐ Homepage - Featured hike object:', featuredHike);

  if (!hikes || hikes.length === 0) {
    return (
      <>
        <Navigation hikes={[]} />
        <main style={{ background: 'var(--ds-background)', minHeight: '100vh' }}>
          <HeroSection />
          <div className="container mx-auto p-4">
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <h1 className="section-title">
                No hikes found
              </h1>
              <p style={{ 
                color: 'var(--ds-muted-foreground)', 
                fontSize: '1.125rem' 
              }}>
                Could not load hikes from the API.
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Use the featured hike if available, otherwise fall back to first hike
  const displayFeaturedHike = featuredHike || hikes[0];

  console.log('🎯 Homepage - Will display:', displayFeaturedHike.title);
  console.log('🎯 Homepage - Is actually featured?', !!featuredHike);

  // Simplified styles using CSS classes
  const sectionStyles = {
    main: {
      background: 'var(--ds-background)',
      minHeight: '100vh'
    },
    allHikesContainer: {
      marginTop: '3rem'
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 0'
    },
    loadingText: {
      marginLeft: '0.75rem',
      color: 'var(--ds-muted-foreground)'
    }
  };

  return (
    <>
      <Navigation hikes={hikes} />
      <main style={sectionStyles.main}>
        <HeroSection />
        
        {/* Featured section - now uses consistent styling */}
        <section id="featured-hikes">
          <FeaturedHikeSummary hike={displayFeaturedHike} />

          {/* All Hikes Section - now uses consistent CSS classes with closer spacing */}
          <div className="container mx-auto px-4" style={sectionStyles.allHikesContainer}>
            <div className="explore-all-hikes-header">
              <h2 className="section-title">
                Explore all trails 
              </h2>
              <p className="section-subtitle">
                Discover our complete collection of carefully researched multi-day treks from around the world
              </p>
            </div>
            
            <Suspense fallback={
              <div style={sectionStyles.loadingContainer}>
                <div className="loading-spinner"></div>
                <span style={sectionStyles.loadingText}>Loading filters...</span>
              </div>
            }>
              <ClientFilters hikes={hikes} />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}