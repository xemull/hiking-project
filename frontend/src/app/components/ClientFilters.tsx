// src/app/components/ClientFilters.tsx
'use client';

import { useState, useMemo } from 'react';
import type { HikeSummary } from '../../types';
import HikeCard from './HikeCard';
import FilterBar from './FilterBar';

interface LengthRange {
  label: string;
  value: string;
}

// Transform HikeSummary to match the expected structure for FilterBar
interface TransformedHike {
  country: string;
  continent: string;
  difficulty: string;
  length?: string;
  month?: string;
}

export default function ClientFilters({ hikes }: { hikes: HikeSummary[] }) {
  const [filters, setFilters] = useState({
    country: '',
    continent: '',
    difficulty: '',
    length: '',
    scenery: '',
    month: ''
  });

  const INITIAL_DISPLAY = 12;
  const LOAD_MORE_INCREMENT = 6;
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY);

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const countries = [...new Set(hikes.flatMap(hike => 
      hike.countries?.map(country => country.name) || []
    ))].sort();

    const continents = [...new Set(hikes.map(hike => hike.continent).filter(Boolean))].sort();
    
    const difficulties = [...new Set(hikes.map(hike => hike.Difficulty).filter(Boolean))].sort();
    
    const sceneries = [...new Set(hikes.flatMap(hike => 
      hike.sceneries?.map(scenery => scenery.SceneryType) || []
    ))].sort();

    const months = [...new Set(hikes.flatMap(hike => 
      hike.months?.map(month => month.MonthTag) || []
    ))].sort();

    // Length ranges (you might want to customize these)
    const lengthRanges: LengthRange[] = [
      { label: 'Short (< 50km)', value: 'short' },
      { label: 'Medium (50-150km)', value: 'medium' },
      { label: 'Long (150-250km)', value: 'long' },
      { label: 'Very Long (> 250km)', value: 'very-long' }
    ];

    return { countries, continents, difficulties, sceneries, months, lengthRanges };
  }, [hikes]);

  // Transform hikes data for FilterBar dynamic filtering
  const transformedHikes = useMemo((): TransformedHike[] => {
    const transformed: TransformedHike[] = [];
    
    hikes.forEach(hike => {
      // Create entries for each country the hike spans
      const hikeCountries = hike.countries?.map(c => c.name) || [''];
      const hikeMonths = hike.months?.map(m => m.MonthTag) || [''];
      
      // Determine length category
      let lengthCategory = '';
      const length = hike.Length || 0;
      if (length < 50) lengthCategory = 'short';
      else if (length < 150) lengthCategory = 'medium';
      else if (length < 250) lengthCategory = 'long';
      else lengthCategory = 'very-long';
      
      // Create combinations for each country and month
      hikeCountries.forEach(country => {
        hikeMonths.forEach(month => {
          transformed.push({
            country: country,
            continent: hike.continent || '',
            difficulty: hike.Difficulty || '',
            length: lengthCategory,
            month: month
          });
        });
      });
    });
    
    return transformed;
  }, [hikes]);

  // Filter hikes based on current filters
  const filteredHikes = useMemo(() => {
    return hikes.filter(hike => {
      // Country filter
      if (filters.country && !hike.countries?.some(country => 
        country.name === filters.country
      )) {
        return false;
      }

      // Continent filter
      if (filters.continent && hike.continent !== filters.continent) {
        return false;
      }

      // Difficulty filter
      if (filters.difficulty && hike.Difficulty !== filters.difficulty) {
        return false;
      }

      // Length filter
      if (filters.length) {
        const length = hike.Length || 0;
        switch (filters.length) {
          case 'short':
            if (length >= 50) return false;
            break;
          case 'medium':
            if (length < 50 || length >= 150) return false;
            break;
          case 'long':
            if (length < 150 || length >= 250) return false;
            break;
          case 'very-long':
            if (length < 250) return false;
            break;
        }
      }

      // Scenery filter
      if (filters.scenery && !hike.sceneries?.some(scenery => 
        scenery.SceneryType === filters.scenery
      )) {
        return false;
      }

      // Month filter
      if (filters.month && !hike.months?.some(month => 
        month.MonthTag === filters.month
      )) {
        return false;
      }

      return true;
    });
  }, [hikes, filters]);

  // Get displayed hikes (limited by displayCount)
  const displayedHikes = filteredHikes.slice(0, displayCount);
  const hasMoreHikes = displayCount < filteredHikes.length;

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    // Reset display count when filters change
    setDisplayCount(INITIAL_DISPLAY);
  };

  const handleClearFilters = () => {
    setFilters({
      country: '',
      continent: '',
      difficulty: '',
      length: '',
      scenery: '',
      month: ''
    });
    // Reset display count when clearing filters
    setDisplayCount(INITIAL_DISPLAY);
  };

  // Load more function
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + LOAD_MORE_INCREMENT);
  };

  // Load More button styles
  const loadMoreStyles = {
    container: {
      textAlign: 'center' as const,
      marginTop: '3rem'
    },
    button: {
      background: 'var(--ds-accent)',
      color: 'var(--ds-accent-foreground)',
      padding: '0.75rem 2rem',
      borderRadius: '50px',
      border: 'none',
      fontSize: '0.95rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      boxShadow: 'var(--shadow-float)',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)'
    }
  };

  return (
    <div>
      {/* Filter Bar with Dynamic Filtering */}
      <FilterBar
        countries={filterOptions.countries}
        continents={filterOptions.continents}
        difficulties={filterOptions.difficulties}
        lengthRanges={filterOptions.lengthRanges}
        sceneries={filterOptions.sceneries}
        months={filterOptions.months}
        allHikes={hikes} // CHANGED: Pass original hikes instead of transformed
        currentFilters={filters} // NEW: Pass current filter state
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Hike Grid - Shows limited results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {displayedHikes.map((hike) => (
          <HikeCard key={hike.id} hike={hike} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreHikes && (
        <div style={loadMoreStyles.container}>
          <button
            onClick={handleLoadMore}
            style={loadMoreStyles.button}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, loadMoreStyles.buttonHover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-float)';
            }}
          >
            Load More ({filteredHikes.length - displayCount} remaining)
          </button>
        </div>
      )}

      {/* No results message */}
      {filteredHikes.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 0',
          color: '#6b7280',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No hikes match your current filters</p>
          <p style={{ fontSize: '0.875rem' }}>Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}
