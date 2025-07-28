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
  
  // Refined filter bar styles with lines and proper sizing
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
      marginBottom: '1.5rem'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem'
    },
    filterRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      justifyContent: 'space-between' // CHANGED: Space between for Clear All placement
    },
    leftFilters: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      flexWrap: 'wrap' as const
    },
    filterLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#374151',
      fontWeight: 600,
      fontSize: '0.875rem',
      fontFamily: 'Inter, system-ui, sans-serif', // FIXED: Explicit Inter font
      minWidth: 'fit-content'
    },
    // DIFFERENT SIZES: Each select has its own width based on content
    selectCountry: {
      padding: '0.5rem 0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.875rem',
      background: 'white',
      color: '#374151',
      cursor: 'pointer',
      fontFamily: 'Inter, system-ui, sans-serif', // FIXED: Explicit Inter font
      width: '140px', // Country names can be long
      transition: 'all 0.2s ease'
    },
    selectContinent: {
      padding: '0.5rem 0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.875rem',
      background: 'white',
      color: '#374151',
      cursor: 'pointer',
      fontFamily: 'Inter, system-ui, sans-serif',
      width: '120px', // Continents are shorter
      transition: 'all 0.2s ease'
    },
    selectDifficulty: {
      padding: '0.5rem 0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.875rem',
      background: 'white',
      color: '#374151',
      cursor: 'pointer',
      fontFamily: 'Inter, system-ui, sans-serif',
      width: '110px', // Difficulty levels are short
      transition: 'all 0.2s ease'
    },
    selectDuration: {
      padding: '0.5rem 0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.875rem',
      background: 'white',
      color: '#374151',
      cursor: 'pointer',
      fontFamily: 'Inter, system-ui, sans-serif',
      width: '100px', // Duration is short
      transition: 'all 0.2s ease'
    },
    selectSeason: {
      padding: '0.5rem 0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.875rem',
      background: 'white',
      color: '#374151',
      cursor: 'pointer',
      fontFamily: 'Inter, system-ui, sans-serif',
      width: '100px', // Seasons are short
      transition: 'all 0.2s ease'
    },
    selectHover: {
      borderColor: 'var(--ds-primary)',
      outline: 'none'
    },
    clearText: {
      color: '#6b7280',
      fontSize: '0.875rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      fontFamily: 'Inter, system-ui, sans-serif', // FIXED: Explicit Inter font
      textDecoration: 'underline',
      marginLeft: 'auto' // PUSH to the right
    },
    clearTextHover: {
      color: '#374151'
    },
    bottomLine: {
      width: '100%',
      height: '1px',
      background: '#e5e7eb',
      marginTop: '1.5rem'
    }
  };

  return (
    <div style={filterStyles.outerContainer}>
      {/* Top Line - Full Width */}
      <div style={filterStyles.topLine}></div>
      
      {/* Filter Content */}
      <div style={filterStyles.container}>
        <div style={filterStyles.filterRow}>
          {/* Left Side: Filter Label + Dropdowns */}
          <div style={filterStyles.leftFilters}>
            {/* Filter Label with Icon */}
            <div style={filterStyles.filterLabel}>
              <Filter size={16} />
              <span>Filter Hikes</span>
            </div>
            
            {/* Country Filter - Custom width */}
            <select 
              style={filterStyles.selectCountry}
              onChange={(e) => onFilterChange('country', e.target.value)}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, filterStyles.selectHover);
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              <option value="">Country</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </select>

            {/* Continent Filter - Custom width */}
            <select 
              style={filterStyles.selectContinent}
              onChange={(e) => onFilterChange('continent', e.target.value)}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, filterStyles.selectHover);
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              <option value="">Continent</option>
              {continents.map((continent, index) => (
                <option key={index} value={continent}>{continent}</option>
              ))}
            </select>

            {/* Difficulty Filter - Custom width */}
            <select 
              style={filterStyles.selectDifficulty}
              onChange={(e) => onFilterChange('difficulty', e.target.value)}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, filterStyles.selectHover);
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              <option value="">Difficulty</option>
              {difficulties.map((difficulty, index) => (
                <option key={index} value={difficulty}>{difficulty}</option>
              ))}
            </select>

            {/* Duration Filter - Custom width */}
            <select 
              style={filterStyles.selectDuration}
              onChange={(e) => onFilterChange('length', e.target.value)}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, filterStyles.selectHover);
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              <option value="">Duration</option>
              {lengthRanges.map((range) => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>

            {/* Season Filter - Custom width */}
            <select 
              style={filterStyles.selectSeason}
              onChange={(e) => onFilterChange('month', e.target.value)}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, filterStyles.selectHover);
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              <option value="">Season</option>
              {months.map((month, index) => (
                <option key={index} value={month}>{month}</option>
              ))}
            </select>
          </div>

          {/* Right Side: Clear All Text */}
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
      </div>
      
      {/* Bottom Line - Full Width */}
      <div style={filterStyles.bottomLine}></div>
    </div>
  );
}