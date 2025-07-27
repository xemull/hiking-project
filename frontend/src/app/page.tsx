// src/app/page.tsx
import { Suspense } from 'react';
import type { HikeSummary } from '../types';
import HikeCard from './components/HikeCard';
import FeaturedHikeSummary from './components/FeaturedHikeSummary';
import ClientFilters from './components/ClientFilters';
import HeroSection from './components/HeroSection';
import Navigation from './components/Navigation'; // ADD THIS LINE
import { getHikes, getFeaturedHike } from './services/api';

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
        <Navigation /> {/* ADD THIS LINE */}
        <main>
          <HeroSection />
          <div className="container mx-auto p-4">
            <h1>No hikes found</h1>
            <p>Could not load hikes from the API.</p>
          </div>
        </main>
      </>
    );
  }

  // Use the featured hike if available, otherwise fall back to first hike
  const displayFeaturedHike = featuredHike || hikes[0];

  console.log('🎯 Homepage - Will display:', displayFeaturedHike.title);
  console.log('🎯 Homepage - Is actually featured?', !!featuredHike);

  return (
    <>
      <Navigation /> {/* ADD THIS LINE */}
      <main>
        <HeroSection />
        
        <section id="featured-hikes" className="container mx-auto p-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Featured Hike</h1>
            {!featuredHike && (
              <p className="text-gray-600 text-sm">No featured hike selected - showing latest hike</p>
            )}
          </div>
          
          <FeaturedHikeSummary hike={displayFeaturedHike} />

          <h2 className="text-3xl font-bold mt-12 mb-4">Explore All Hikes</h2>
          
          <Suspense fallback={<div>Loading filters...</div>}>
            <ClientFilters hikes={hikes} />
          </Suspense>
        </section>
      </main>
    </>
  );
}