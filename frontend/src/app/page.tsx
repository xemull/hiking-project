// src/app/page.tsx
import { Suspense } from 'react';
import type { HikeSummary } from '../types';
import HikeCard from './components/HikeCard';
import FeaturedHikeSummary from './components/FeaturedHikeSummary';
import ClientFilters from './components/ClientFilters';
import { getHikes } from './services/api';

export default async function HomePage() {
  const hikes = await getHikes();

  if (!hikes || hikes.length === 0) {
    return (
      <main className="container mx-auto p-4">
        <h1>No hikes found</h1>
        <p>Could not load hikes from the API.</p>
      </main>
    );
  }

  const featuredHike = hikes[0];

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Featured Hike</h1>
      <FeaturedHikeSummary hike={featuredHike} />

      <h2 className="text-3xl font-bold mt-12 mb-4">Explore All Hikes</h2>
      
      <Suspense fallback={<div>Loading filters...</div>}>
        <ClientFilters hikes={hikes} />
      </Suspense>
    </main>
  );
}