// src/app/components/FilterBar.tsx
'use client';

import { Filter } from 'lucide-react';

interface LengthRange {
  label: string;
  value: string;
}

interface Hike {
  id: number;
  countries?: Array<{ name: string }>;
  continent: string;
  Difficulty: string;
  Length?: number;
  months?: Array<{ MonthTag: string }>;
  // Add other hike properties as needed
}

interface FilterBarProps {
  countries: string[];
  sceneries: string[];
  difficulties: string[];
  lengthRanges: LengthRange[];
  continents: string[];
  months: string[];
  allHikes: Hike[]; // Add this to calculate filtered options
  currentFilters: {
    continent?: string;
    country?: string;
    difficulty?: string;
    length?: string;
    month?: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
  onClearFilters: () => void;
}

export default function FilterBar({ 
  countries, 
  sceneries, 
  difficulties,
  lengthRanges,
  continents,
  months,
  allHikes,
  currentFilters,
  onFilterChange,
  onClearFilters
}: FilterBarProps) {
  
  // Function to get available options and counts based on current selections
  const getOptionsWithCounts = () => {
    // Work directly with the original hikes data to count unique hikes
    const getUniqueHikesCount = (filterType: string, optionValue: string) => {
      return allHikes.filter((hike: Hike) => {
        // Apply all current filters except the one we're calculating for
        if (filterType !== 'continent' && currentFilters.continent && hike.continent !== currentFilters.continent) return false;
        if (filterType !== 'country' && currentFilters.country && !hike.countries?.some(c => c.name === currentFilters.country)) return false;
        if (filterType !== 'difficulty' && currentFilters.difficulty && hike.Difficulty !== currentFilters.difficulty) return false;
        
        if (filterType !== 'length' && currentFilters.length) {
          const length = hike.Length || 0;
          let hikeCategory = '';
          if (length < 50) hikeCategory = 'short';
          else if (length < 150) hikeCategory = 'medium';
          else if (length < 250) hikeCategory = 'long';
          else hikeCategory = 'very-long';
          if (hikeCategory !== currentFilters.length) return false;
        }
        
        if (filterType !== 'month' && currentFilters.month && !hike.months?.some(m => m.MonthTag === currentFilters.month)) return false;
        
        // Then check if this hike matches the option we're testing
        if (filterType === 'continent' && hike.continent !== optionValue) return false;
        if (filterType === 'country' && !hike.countries?.some(c => c.name === optionValue)) return false;
        if (filterType === 'difficulty' && hike.Difficulty !== optionValue) return false;
        
        if (filterType === 'length') {
          const length = hike.Length || 0;
          let hikeCategory = '';
          if (length < 50) hikeCategory = 'short';
          else if (length < 150) hikeCategory = 'medium';
          else if (length < 250) hikeCategory = 'long';
          else hikeCategory = 'very-long';
          if (hikeCategory !== optionValue) return false;
        }
        
        if (filterType === 'month' && !hike.months?.some(m => m.MonthTag === optionValue)) return false;
        
        return true;
      }).length;
    };

    // Calculate counts for each filter option - only include options with >0 count
    const continentCounts = new Map<string, number>();
    continents.forEach(continent => {
      const count = getUniqueHikesCount('continent', continent);
      if (count > 0 || currentFilters.continent === continent) {
        continentCounts.set(continent, count);
      }
    });

    const countryCounts = new Map<string, number>();
    countries.forEach(country => {
      const count = getUniqueHikesCount('country', country);
      if (count > 0 || currentFilters.country === country) {
        countryCounts.set(country, count);
      }
    });

    const difficultyCounts = new Map<string, number>();
    difficulties.forEach(difficulty => {
      const count = getUniqueHikesCount('difficulty', difficulty);
      if (count > 0 || currentFilters.difficulty === difficulty) {
        difficultyCounts.set(difficulty, count);
      }
    });

    const lengthCounts = new Map<string, number>();
    lengthRanges.forEach(range => {
      const count = getUniqueHikesCount('length', range.value);
      if (count > 0 || currentFilters.length === range.value) {
        lengthCounts.set(range.value, count);
      }
    });

    const monthCounts = new Map<string, number>();
    months.forEach(month => {
      const count = getUniqueHikesCount('month', month);
      if (count > 0 || currentFilters.month === month) {
        monthCounts.set(month, count);
      }
    });

    return {
      continentCounts,
      countryCounts,
      difficultyCounts,
      lengthCounts,
      monthCounts
    };
  };

  const optionCounts = getOptionsWithCounts();
  
  // Sort months in chronological order
  const sortedMonths = [...months].filter(Boolean).sort((a, b) => {
    // Safety check - ensure both a and b are defined
    if (!a || !b) return 0;
    
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const aIndex = monthOrder.findIndex(month => month.toLowerCase().includes(a.toLowerCase()) || a.toLowerCase().includes(month.toLowerCase()));
    const bIndex = monthOrder.findIndex(month => month.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(month.toLowerCase()));
    
    // If both months are found in the order array, sort by their position
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    // If only one is found, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    // If neither is found, fall back to alphabetical
    return a.localeCompare(b);
  });
  
  // Mobile-responsive filter bar styles
  const filterStyles = {
    outerContainer: {
      width: '100vw',
      marginLeft: '-50vw',
      left: '50%',
      position: 'relative' as const
    },
    topLine: {
      width: '100%',
      height: '1px',
      background: '#e5e7eb',
      marginBottom: '1rem'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem'
    },
    filterRow: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem'
    },
    filterHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem'
    },
    filterLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#374151',
      fontWeight: 600,
      fontSize: '0.875rem',
      fontFamily: 'Inter, system-ui, sans-serif',
      minWidth: 'fit-content'
    },
    filtersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '0.75rem',
      width: '100%'
    },
    select: {
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.875rem',
      background: 'white',
      color: '#374151',
      cursor: 'pointer',
      fontFamily: 'Inter, system-ui, sans-serif',
      width: '100%',
      minWidth: '0',
      transition: 'all 0.2s ease',
      WebkitAppearance: 'none' as const,
      MozAppearance: 'none' as const,
      appearance: 'none' as const,
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
      backgroundRepeat: 'no-repeat' as const,
      backgroundPosition: 'right 0.75rem center',
      backgroundSize: '16px',
      paddingRight: '2.5rem'
    } as React.CSSProperties,
    selectHover: {
      borderColor: 'var(--ds-primary, #3b82f6)',
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    option: {
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem'
    },
    selectedOption: {
      fontWeight: 600,
      background: '#f3f4f6'
    },
    disabledOption: {
      color: '#9ca3af',
      fontStyle: 'italic'
    },
    clearText: {
      color: '#6b7280',
      fontSize: '0.875rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      fontFamily: 'Inter, system-ui, sans-serif',
      textDecoration: 'underline',
      whiteSpace: 'nowrap' as const
    },
    clearTextHover: {
      color: '#374151'
    },
    bottomLine: {
      width: '100%',
      height: '1px',
      background: '#e5e7eb',
      marginTop: '1rem'
    }
  };

  // Helper function to render option with count and styling
  const renderOption = (value: string, label: string, count: number, isSelected: boolean) => {
    return (
      <option 
        key={value} 
        value={value}
        style={{
          ...filterStyles.option,
          ...(isSelected ? filterStyles.selectedOption : {})
        }}
      >
        {isSelected ? '✓ ' : ''}{label} ({count})
      </option>
    );
  };

  return (
    <div style={filterStyles.outerContainer}>
      {/* Top Line - Full Width */}
      <div style={filterStyles.topLine}></div>
      
      {/* Filter Content */}
      <div style={filterStyles.container}>
        <div style={filterStyles.filterRow}>
          {/* Header with label and clear button */}
          <div style={filterStyles.filterHeader}>
            <div style={filterStyles.filterLabel}>
              <Filter size={16} />
              <span>Filter Hikes</span>
            </div>
            
            <span
              onClick={onClearFilters}
              style={filterStyles.clearText}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, filterStyles.clearTextHover);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              Clear All
            </span>
          </div>

          {/* Filters Grid - Note: Continent and Country are swapped */}
          <div style={filterStyles.filtersGrid}>
            {/* Continent Filter - Now first */}
            <select 
              style={filterStyles.select}
              value={currentFilters.continent || ''}
              onChange={(e) => onFilterChange('continent', e.target.value)}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, filterStyles.selectHover);
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="" style={filterStyles.option}>Continent</option>
              {Array.from(optionCounts.continentCounts.entries()).map(([continent, count]) => 
                renderOption(
                  continent, 
                  continent, 
                  count,
                  currentFilters.continent === continent
                )
              )}
            </select>

            {/* Country Filter - Now second */}
            <select 
              style={filterStyles.select}
              value={currentFilters.country || ''}
              onChange={(e) => onFilterChange('country', e.target.value)}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, filterStyles.selectHover);
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="" style={filterStyles.option}>Country</option>
              {Array.from(optionCounts.countryCounts.entries()).map(([country, count]) => 
                renderOption(
                  country, 
                  country, 
                  count,
                  currentFilters.country === country
                )
              )}
            </select>

            {/* Difficulty Filter */}
            <select 
              style={filterStyles.select}
              value={currentFilters.difficulty || ''}
              onChange={(e) => onFilterChange('difficulty', e.target.value)}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, filterStyles.selectHover);
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="" style={filterStyles.option}>Difficulty</option>
              {Array.from(optionCounts.difficultyCounts.entries()).map(([difficulty, count]) => 
                renderOption(
                  difficulty, 
                  difficulty, 
                  count,
                  currentFilters.difficulty === difficulty
                )
              )}
            </select>

            {/* Duration Filter */}
            <select 
              style={filterStyles.select}
              value={currentFilters.length || ''}
              onChange={(e) => onFilterChange('length', e.target.value)}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, filterStyles.selectHover);
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="" style={filterStyles.option}>Duration</option>
              {Array.from(optionCounts.lengthCounts.entries()).map(([lengthValue, count]) => {
                const range = lengthRanges.find(r => r.value === lengthValue);
                return range ? renderOption(
                  range.value, 
                  range.label, 
                  count,
                  currentFilters.length === range.value
                ) : null;
              })}
            </select>

            {/* Season Filter */}
            <select 
              style={filterStyles.select}
              value={currentFilters.month || ''}
              onChange={(e) => onFilterChange('month', e.target.value)}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, filterStyles.selectHover);
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="" style={filterStyles.option}>Season</option>
              {Array.from(optionCounts.monthCounts.entries())
                .sort(([a], [b]) => {
                  // Sort by month order
                  const monthOrder = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ];
                  const aIndex = monthOrder.findIndex(month => month.toLowerCase().includes(a.toLowerCase()) || a.toLowerCase().includes(month.toLowerCase()));
                  const bIndex = monthOrder.findIndex(month => month.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(month.toLowerCase()));
                  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                  if (aIndex !== -1) return -1;
                  if (bIndex !== -1) return 1;
                  return a.localeCompare(b);
                })
                .map(([month, count]) => 
                  renderOption(
                    month, 
                    month, 
                    count,
                    currentFilters.month === month
                  )
                )}
            </select>
          </div>
        </div>
      </div>
      
      {/* Bottom Line - Full Width */}
      <div style={filterStyles.bottomLine}></div>
      
      <style jsx>{`
        @media (max-width: 640px) {
          .filter-container {
            padding: 0 1rem;
          }
          .filter-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .filters-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }
          .filter-select {
            font-size: 0.8125rem;
            padding: 0.625rem;
          }
          .filter-label {
            font-size: 0.8125rem;
          }
          .clear-text {
            font-size: 0.8125rem;
            align-self: flex-end;
          }
        }
        
        @media (max-width: 480px) {
          .filters-grid {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}