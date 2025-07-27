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
  const [filters, setFilters] = useState({ 
    country: '', 
    scenery: '', 
    difficulty: '', 
    length: '', 
    continent: '', 
    month: '' 
  });

  // Extract unique countries from the data
  const uniqueCountries = useMemo(() => {
    const countryNames = hikes
      .flatMap(hike => hike.countries || [])  // Handle undefined countries
      .filter(c => c && c.name)              // Filter out undefined/null items
      .map(c => c.name)
      .filter((name): name is string => !!name);
    return Array.from(new Set(countryNames)).sort();
  }, [hikes]);

  // Extract unique sceneries from the data
  const uniqueSceneries = useMemo(() => {
    const sceneryTypes = hikes
      .flatMap(hike => hike.sceneries || [])  // Handle undefined sceneries
      .filter(s => s && s.SceneryType)        // Filter out undefined/null items
      .map(s => s.SceneryType)
      .filter((type): type is string => !!type);
    return Array.from(new Set(sceneryTypes)).sort();
  }, [hikes]);

  // Extract unique difficulties from the data
  const uniqueDifficulties = useMemo(() => {
    const difficulties = hikes
      .map(hike => hike.Difficulty)
      .filter((difficulty): difficulty is string => !!difficulty);
    return Array.from(new Set(difficulties)).sort();
  }, [hikes]);

  // Define length ranges
  const lengthRanges = [
    { label: 'Under 100km', value: 'under-100' },
    { label: '100-200km', value: '100-200' },
    { label: '200-400km', value: '200-400' },
    { label: '400km+', value: '400-plus' }
  ];

  // Extract unique continents from the data
  const uniqueContinents = useMemo(() => {
    const continents = hikes
      .map(hike => hike.continent)
      .filter((continent): continent is string => !!continent);
    return Array.from(new Set(continents)).sort();
  }, [hikes]);

  // Extract unique months from the data and sort chronologically
  const uniqueMonths = useMemo(() => {
    const monthNames = hikes
      .flatMap(hike => hike.months || [])     // Handle undefined months
      .filter(m => m && m.MonthTag)           // Filter out undefined/null items
      .map(m => m.MonthTag)
      .filter((month): month is string => !!month);
    return Array.from(new Set(monthNames)).sort((a, b) => {
      // Sort months in chronological order
      const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
      return monthOrder.indexOf(a) - monthOrder.indexOf(b);
    });
  }, [hikes]);

  const filteredHikes = useMemo(() => {
    return hikes.filter(hike => {
      const countryMatch = filters.country 
        ? (hike.countries || []).some(c => c && c.name === filters.country)
        : true;
      
      const sceneryMatch = filters.scenery 
        ? (hike.sceneries || []).some(s => s && s.SceneryType === filters.scenery)
        : true;
      
      const difficultyMatch = filters.difficulty 
        ? hike.Difficulty === filters.difficulty
        : true;
      
      const lengthMatch = filters.length ? (() => {
        const length = hike.Length || 0;
        switch (filters.length) {
          case 'under-100':
            return length < 100;
          case '100-200':
            return length >= 100 && length < 200;
          case '200-400':
            return length >= 200 && length < 400;
          case '400-plus':
            return length >= 400;
          default:
            return true;
        }
      })() : true;
      
      const continentMatch = filters.continent 
        ? hike.continent === filters.continent
        : true;
      
      const monthMatch = filters.month 
        ? (hike.months || []).some(m => m && m.MonthTag === filters.month)
        : true;

      return countryMatch && sceneryMatch && difficultyMatch && lengthMatch && continentMatch && monthMatch;
    });
  }, [hikes, filters]);

  function handleFilterChange(filterType: string, value: string) {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  }

  function clearFilters() {
    setFilters({ 
      country: '', 
      scenery: '', 
      difficulty: '', 
      length: '', 
      continent: '', 
      month: '' 
    });
  }

  return (
    <>
      <FilterBar 
        countries={uniqueCountries} 
        sceneries={uniqueSceneries}
        difficulties={uniqueDifficulties}
        lengthRanges={lengthRanges}
        continents={uniqueContinents}
        months={uniqueMonths}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredHikes.length} of {hikes.length} hikes
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHikes.map((hike) => (
          <HikeCard key={hike.id} hike={hike} />
        ))}
      </div>
    </>
  );
}