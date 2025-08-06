// src/app/components/FilterBar.tsx
'use client';

import { Filter } from 'lucide-react';

interface LengthRange {
  label: string;
  value: string;
}

interface FilterBarProps {
  countries: string[];
  sceneries: string[];
  difficulties: string[];
  lengthRanges: LengthRange[];
  continents: string[];
  months: string[];
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
  onFilterChange,
  onClearFilters
}: FilterBarProps) {
  
  // Sort months in chronological order
  const sortedMonths = [...months].sort((a, b) => {
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
    },
    // Mobile-specific styles
    '@media (max-width: 640px)': {
      container: {
        padding: '0 1rem'
      },
      filterHeader: {
        flexDirection: 'column' as const,
        alignItems: 'flex-start',
        gap: '0.75rem'
      },
      filtersGrid: {
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.5rem'
      },
      select: {
        fontSize: '0.8125rem',
        padding: '0.625rem'
      },
      filterLabel: {
        fontSize: '0.8125rem'
      },
      clearText: {
        fontSize: '0.8125rem',
        alignSelf: 'flex-end'
      }
    },
    // Extra small mobile
    '@media (max-width: 480px)': {
      filtersGrid: {
        gridTemplateColumns: '1fr',
        gap: '0.5rem'
      }
    }
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

          {/* Filters Grid */}
          <div style={filterStyles.filtersGrid}>
            {/* Country Filter */}
            <select 
              style={filterStyles.select}
              onChange={(e) => onFilterChange('country', e.target.value)}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, filterStyles.selectHover);
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="">Country</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </select>

            {/* Continent Filter */}
            <select 
              style={filterStyles.select}
              onChange={(e) => onFilterChange('continent', e.target.value)}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, filterStyles.selectHover);
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="">Continent</option>
              {continents.map((continent, index) => (
                <option key={index} value={continent}>{continent}</option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select 
              style={filterStyles.select}
              onChange={(e) => onFilterChange('difficulty', e.target.value)}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, filterStyles.selectHover);
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="">Difficulty</option>
              {difficulties.map((difficulty, index) => (
                <option key={index} value={difficulty}>{difficulty}</option>
              ))}
            </select>

            {/* Duration Filter */}
            <select 
              style={filterStyles.select}
              onChange={(e) => onFilterChange('length', e.target.value)}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, filterStyles.selectHover);
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="">Duration</option>
              {lengthRanges.map((range) => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>

            {/* Season Filter */}
            <select 
              style={filterStyles.select}
              onChange={(e) => onFilterChange('month', e.target.value)}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, filterStyles.selectHover);
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="">Season</option>
              {sortedMonths.map((month, index) => (
                <option key={index} value={month}>{month}</option>
              ))}
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