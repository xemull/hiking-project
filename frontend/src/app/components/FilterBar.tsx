// src/app/components/FilterBar.tsx
'use client';

import { Filter, ChevronDown, MapPin } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

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
}

interface FilterBarProps {
  countries: string[];
  sceneries: string[];
  difficulties: string[];
  lengthRanges: LengthRange[];
  continents: string[];
  months: string[];
  allHikes: Hike[];
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

interface GeographyOption {
  type: 'continent' | 'country';
  value: string;
  label: string;
  count: number;
  continent?: string; // For countries, which continent they belong to
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
  
  const [isGeographyOpen, setIsGeographyOpen] = useState(false);
  const [expandedContinents, setExpandedContinents] = useState<Set<string>>(new Set());
  const geographyRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (geographyRef.current && !geographyRef.current.contains(event.target as Node)) {
        setIsGeographyOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Group countries by continent from the hike data
  const getCountriesByContinent = () => {
    const continentMap = new Map<string, Set<string>>();
    
    allHikes.forEach(hike => {
      if (hike.continent && hike.countries) {
        if (!continentMap.has(hike.continent)) {
          continentMap.set(hike.continent, new Set());
        }
        hike.countries.forEach(country => {
          continentMap.get(hike.continent)?.add(country.name);
        });
      }
    });

    return continentMap;
  };

  const countriesByContinent = getCountriesByContinent();

  // Function to get geography options with counts
  const getGeographyOptions = (): GeographyOption[] => {
    const options: GeographyOption[] = [];

    // Helper function to count hikes for geography selection
    const getHikeCount = (type: 'continent' | 'country', value: string) => {
      return allHikes.filter(hike => {
        // Apply all current filters except geography
        if (currentFilters.difficulty && hike.Difficulty !== currentFilters.difficulty) return false;
        
        if (currentFilters.length) {
          const length = hike.Length || 0;
          let hikeCategory = '';
          if (length < 50) hikeCategory = 'short';
          else if (length < 150) hikeCategory = 'medium';
          else if (length < 250) hikeCategory = 'long';
          else hikeCategory = 'very-long';
          if (hikeCategory !== currentFilters.length) return false;
        }
        
        if (currentFilters.month && !hike.months?.some(m => m.MonthTag === currentFilters.month)) return false;
        
        // Check geography match
        if (type === 'continent') {
          return hike.continent === value;
        } else {
          return hike.countries?.some(c => c.name === value);
        }
      }).length;
    };

    // Add continent options
    continents.forEach(continent => {
      const count = getHikeCount('continent', continent);
      if (count > 0 || currentFilters.continent === continent) {
        options.push({
          type: 'continent',
          value: continent,
          label: continent,
          count
        });
      }
    });

    // Add country options
    countries.forEach(country => {
      const count = getHikeCount('country', country);
      if (count > 0 || currentFilters.country === country) {
        // Find which continent this country belongs to
        let continent = '';
        for (const [cont, countrySet] of countriesByContinent.entries()) {
          if (countrySet.has(country)) {
            continent = cont;
            break;
          }
        }
        
        options.push({
          type: 'country',
          value: country,
          label: country,
          count,
          continent
        });
      }
    });

    return options;
  };

  const geographyOptions = getGeographyOptions();

  // Get non-geography filter counts
  const getFilterCounts = () => {
    const getHikeCountForFilter = (filterType: string, value: string) => {
      return allHikes.filter(hike => {
        // Apply all current filters except the one we're calculating
        if (filterType !== 'continent' && filterType !== 'country') {
          if (currentFilters.continent && hike.continent !== currentFilters.continent) return false;
          if (currentFilters.country && !hike.countries?.some(c => c.name === currentFilters.country)) return false;
        }
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
        
        // Check the filter we're testing
        if (filterType === 'difficulty' && hike.Difficulty !== value) return false;
        if (filterType === 'length') {
          const length = hike.Length || 0;
          let hikeCategory = '';
          if (length < 50) hikeCategory = 'short';
          else if (length < 150) hikeCategory = 'medium';
          else if (length < 250) hikeCategory = 'long';
          else hikeCategory = 'very-long';
          if (hikeCategory !== value) return false;
        }
        if (filterType === 'month' && !hike.months?.some(m => m.MonthTag === value)) return false;
        
        return true;
      }).length;
    };

    const difficultyCounts = new Map<string, number>();
    difficulties.forEach(difficulty => {
      const count = getHikeCountForFilter('difficulty', difficulty);
      if (count > 0 || currentFilters.difficulty === difficulty) {
        difficultyCounts.set(difficulty, count);
      }
    });

    const lengthCounts = new Map<string, number>();
    lengthRanges.forEach(range => {
      const count = getHikeCountForFilter('length', range.value);
      if (count > 0 || currentFilters.length === range.value) {
        lengthCounts.set(range.value, count);
      }
    });

    const monthCounts = new Map<string, number>();
    months.forEach(month => {
      const count = getHikeCountForFilter('month', month);
      if (count > 0 || currentFilters.month === month) {
        monthCounts.set(month, count);
      }
    });

    return { difficultyCounts, lengthCounts, monthCounts };
  };

  const filterCounts = getFilterCounts();

  // Handle geography selection
  const handleGeographySelect = (option: GeographyOption) => {
    if (option.type === 'continent') {
      // Clear country filter and set continent
      onFilterChange('country', '');
      onFilterChange('continent', option.value);
    } else {
      // Set country and clear continent (country is more specific)
      onFilterChange('continent', '');
      onFilterChange('country', option.value);
    }
    setIsGeographyOpen(false);
  };

  const toggleContinentExpansion = (continent: string) => {
    const newExpanded = new Set(expandedContinents);
    if (newExpanded.has(continent)) {
      newExpanded.delete(continent);
    } else {
      newExpanded.add(continent);
    }
    setExpandedContinents(newExpanded);
  };

  // Get current geography selection for display
  const getCurrentGeographyLabel = () => {
    if (currentFilters.country) {
      const countryOption = geographyOptions.find(opt => opt.type === 'country' && opt.value === currentFilters.country);
      return countryOption ? `${countryOption.label} (${countryOption.count})` : currentFilters.country;
    }
    if (currentFilters.continent) {
      const continentOption = geographyOptions.find(opt => opt.type === 'continent' && opt.value === currentFilters.continent);
      return continentOption ? `${continentOption.label} (${continentOption.count})` : currentFilters.continent;
    }
    return 'Geography';
  };

  // Sort months chronologically
  const sortedMonthCounts = Array.from(filterCounts.monthCounts.entries()).sort(([a], [b]) => {
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
  });

  // Styles
  const styles = {
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
    geographyDropdown: {
      position: 'relative' as const,
      width: '100%'
    },
    geographyButton: {
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.875rem',
      background: 'white',
      color: '#374151',
      cursor: 'pointer',
      fontFamily: 'Inter, system-ui, sans-serif',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.2s ease'
    },
    geographyMenu: {
      position: 'absolute' as const,
      top: '100%',
      left: 0,
      right: 0,
      background: 'white',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      maxHeight: '300px',
      overflowY: 'auto' as const,
      marginTop: '4px'
    },
    continentItem: {
      padding: '0.75rem',
      borderBottom: '1px solid #f3f4f6',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#374151',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'background-color 0.2s ease'
    },
    countryItem: {
      padding: '0.625rem 1.5rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      color: '#6b7280',
      display: 'flex',
      justifyContent: 'space-between',
      transition: 'background-color 0.2s ease'
    },
    selectedItem: {
      background: '#f3f4f6',
      color: '#3b82f6',
      fontWeight: 600
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
    bottomLine: {
      width: '100%',
      height: '1px',
      background: '#e5e7eb',
      marginTop: '1rem'
    }
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.topLine}></div>
      
      <div style={styles.container}>
        <div style={styles.filterRow}>
          <div style={styles.filterHeader}>
            <div style={styles.filterLabel}>
              <Filter size={16} />
              <span>Filter Hikes</span>
            </div>
            
            <span
              onClick={onClearFilters}
              style={styles.clearText}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              Clear All
            </span>
          </div>

          <div style={styles.filtersGrid}>
            {/* Geography Dropdown */}
            <div style={styles.geographyDropdown} ref={geographyRef}>
              <button
                style={{
                  ...styles.geographyButton,
                  borderColor: isGeographyOpen ? '#3b82f6' : '#d1d5db',
                  boxShadow: isGeographyOpen ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none'
                }}
                onClick={() => setIsGeographyOpen(!isGeographyOpen)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} />
                  <span>{getCurrentGeographyLabel()}</span>
                </div>
                <ChevronDown 
                  size={16} 
                  style={{ 
                    transform: isGeographyOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }} 
                />
              </button>

              {isGeographyOpen && (
                <div style={styles.geographyMenu}>
                  {continents.map(continent => {
                    const continentOption = geographyOptions.find(opt => opt.type === 'continent' && opt.value === continent);
                    if (!continentOption) return null;
                    
                    const isExpanded = expandedContinents.has(continent);
                    const continentCountries = geographyOptions.filter(opt => 
                      opt.type === 'country' && opt.continent === continent
                    );
                    const isSelected = currentFilters.continent === continent;

                    return (
                      <div key={continent}>
                        <div
                          style={{
                            ...styles.continentItem,
                            ...(isSelected ? styles.selectedItem : {}),
                            backgroundColor: isSelected ? '#f3f4f6' : 'white'
                          }}
                          onClick={() => handleGeographySelect(continentOption)}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = '#f9fafb';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = 'white';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {isSelected && <span>✓</span>}
                            <span>{continent}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>({continentOption.count})</span>
                            {continentCountries.length > 0 && (
                              <ChevronDown 
                                size={14}
                                style={{ 
                                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.2s ease'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleContinentExpansion(continent);
                                }}
                              />
                            )}
                          </div>
                        </div>
                        
                        {isExpanded && continentCountries.map(countryOption => {
                          const isCountrySelected = currentFilters.country === countryOption.value;
                          return (
                            <div
                              key={countryOption.value}
                              style={{
                                ...styles.countryItem,
                                ...(isCountrySelected ? styles.selectedItem : {}),
                                backgroundColor: isCountrySelected ? '#f3f4f6' : 'white'
                              }}
                              onClick={() => handleGeographySelect(countryOption)}
                              onMouseEnter={(e) => {
                                if (!isCountrySelected) e.currentTarget.style.backgroundColor = '#f9fafb';
                              }}
                              onMouseLeave={(e) => {
                                if (!isCountrySelected) e.currentTarget.style.backgroundColor = 'white';
                              }}
                            >
                              <span>
                                {isCountrySelected && '✓ '}
                                {countryOption.label}
                              </span>
                              <span>({countryOption.count})</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Difficulty Filter */}
            <select 
              style={styles.select}
              value={currentFilters.difficulty || ''}
              onChange={(e) => onFilterChange('difficulty', e.target.value)}
            >
              <option value="">Difficulty</option>
              {Array.from(filterCounts.difficultyCounts.entries()).map(([difficulty, count]) => (
                <option key={difficulty} value={difficulty}>
                  {currentFilters.difficulty === difficulty ? '✓ ' : ''}{difficulty} ({count})
                </option>
              ))}
            </select>

            {/* Duration Filter */}
            <select 
              style={styles.select}
              value={currentFilters.length || ''}
              onChange={(e) => onFilterChange('length', e.target.value)}
            >
              <option value="">Duration</option>
              {Array.from(filterCounts.lengthCounts.entries()).map(([lengthValue, count]) => {
                const range = lengthRanges.find(r => r.value === lengthValue);
                return range ? (
                  <option key={range.value} value={range.value}>
                    {currentFilters.length === range.value ? '✓ ' : ''}{range.label} ({count})
                  </option>
                ) : null;
              })}
            </select>

            {/* Season Filter */}
            <select 
              style={styles.select}
              value={currentFilters.month || ''}
              onChange={(e) => onFilterChange('month', e.target.value)}
            >
              <option value="">Season</option>
              {sortedMonthCounts.map(([month, count]) => (
                <option key={month} value={month}>
                  {currentFilters.month === month ? '✓ ' : ''}{month} ({count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div style={styles.bottomLine}></div>
    </div>
  );
}
