// src/app/page.tsx
"use client"; 

import { useState, useMemo, useEffect } from 'react';
import type { Hike } from '../types';

import HikeCard from './components/HikeCard';
import FeaturedHike from './components/FeaturedHike';
import FilterBar from './components/FilterBar';
import { getHikes } from './services/api';

export default function HomePage() {
  const [hikes, setHikes] = useState<Hike[]>([]);
  const [filters, setFilters] = useState({ country: '', scenery: '' });

  useEffect(() => {
    async function loadHikes() {
      const fetchedHikes = await getHikes();
      if (fetchedHikes) {
        setHikes(fetchedHikes);
      }
    }
    loadHikes();
  }, []);

  const uniqueCountries = useMemo(() => Array.from(new Set(hikes.flatMap(hike => hike.countries.map(c => c.name)))).sort(), [hikes]);
  const uniqueSceneries = useMemo(() => Array.from(new Set(hikes.flatMap(hike => hike.sceneries.map(s => s.name)))).sort(), [hikes]);

  const filteredHikes = useMemo(() => {
    return hikes.filter(hike => {
      const countryMatch = filters.country ? hike.countries.some(c => c.name === filters.country) : true;
      const sceneryMatch = filters.scenery ? hike.sceneries.some(s => s.name === filters.scenery) : true;
      return countryMatch && sceneryMatch;
    });
  }, [hikes, filters]);

  function handleFilterChange(filterType: string, value: string) {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  }

  if (hikes.length === 0) {
    return <main className="container mx-auto p-4"><h1>Loading hikes...</h1></main>;
  }

  const featuredHike = hikes[0];

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Featured Hike</h1>
      <FeaturedHike hike={featuredHike} />

      <h2 className="text-3xl font-bold mt-12 mb-4">Explore All Hikes</h2>
      <FilterBar 
        countries={uniqueCountries} 
        sceneries={uniqueSceneries} 
        onFilterChange={handleFilterChange} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHikes.map((hike) => (
          <HikeCard key={hike.id} hike={hike} />
        ))}
      </div>
    </main>
  );
}