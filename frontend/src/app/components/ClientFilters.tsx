// src/app/components/ClientFilters.tsx
'use client';

import { useState, useMemo } from 'react';
import type { HikeSummary } from '../../types';
import HikeCard from './HikeCard';
import FilterBar from './FilterBar';

interface ClientFiltersProps {
  hikes: HikeSummary[];
}

export default function ClientFilters({ hikes }: ClientFiltersProps) {
  const [filters, setFilters] = useState({ country: '', scenery: '' });

  // Filter out undefined values and use the correct field names
  const uniqueCountries = useMemo(() => {
    const countryNames = hikes
      .flatMap(hike => hike.countries)
      .map(c => c.name)
      .filter((name): name is string => !!name);
    return Array.from(new Set(countryNames)).sort();
  }, [hikes]);

  const uniqueSceneries = useMemo(() => {
    const sceneryTypes = hikes
      .flatMap(hike => hike.sceneries)
      .map(s => s.SceneryType)
      .filter((type): type is string => !!type);
    return Array.from(new Set(sceneryTypes)).sort();
  }, [hikes]);

  const filteredHikes = useMemo(() => {
    return hikes.filter(hike => {
      const countryMatch = filters.country ? hike.countries.some(c => c.name === filters.country) : true;
      const sceneryMatch = filters.scenery ? hike.sceneries.some(s => s.SceneryType === filters.scenery) : true;
      return countryMatch && sceneryMatch;
    });
  }, [hikes, filters]);

  function handleFilterChange(filterType: string, value: string) {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  }

  return (
    <>
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
    </>
  );
}