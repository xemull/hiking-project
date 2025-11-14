// src/app/guides/tmb-for-beginners/accommodation-directory/page.tsx
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import { getTMBAccommodations, type TMBAccommodation } from '../../../services/api';
import { ChevronDown, ChevronUp, MapPin, Phone, Mail, Globe, Bed, Mountain, Filter, X } from 'lucide-react';

interface StageGroup {
  stageNumber: number;
  stageName: string;
  stageStart: string;
  stageEnd: string;
  accommodations: TMBAccommodation[];
}

// Filter types
interface Filters {
  types: string[];
  locationTypes: string[];
  bookingDifficulty: string[];
}

const defaultFilters: Filters = {
  types: [],
  locationTypes: [],
  bookingDifficulty: []
};

export default function AccommodationDirectoryPage() {
  const [accommodations, setAccommodations] = useState<TMBAccommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedStages, setExpandedStages] = useState<Set<number>>(new Set()); // All collapsed by default
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  // Dropdown states
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isDistanceOpen, setIsDistanceOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Refs for click-outside detection
  const typeRef = useRef<HTMLDivElement>(null);
  const distanceRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setIsTypeOpen(false);
      }
      if (distanceRef.current && !distanceRef.current.contains(event.target as Node)) {
        setIsDistanceOpen(false);
      }
      if (bookingRef.current && !bookingRef.current.contains(event.target as Node)) {
        setIsBookingOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load accommodations
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getTMBAccommodations();
        if (data) {
          setAccommodations(data);
        } else {
          setError('Failed to load accommodations data');
        }
      } catch (err) {
        console.error('Error loading accommodations:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter accommodations
  const filteredAccommodations = useMemo(() => {
    return accommodations.filter(acc => {
      const typeMatch = filters.types.length === 0 || filters.types.includes(acc.type);
      const locationMatch = filters.locationTypes.length === 0 || filters.locationTypes.includes(acc.location_type);
      const difficultyMatch = filters.bookingDifficulty.length === 0 || filters.bookingDifficulty.includes(acc.booking_difficulty);

      return typeMatch && locationMatch && difficultyMatch;
    });
  }, [accommodations, filters]);

  // Group accommodations by stage
  const accommodationsByStage = useMemo<StageGroup[]>(() => {
    const stageMap = new Map<number, StageGroup>();

    filteredAccommodations.forEach(acc => {
      if (acc.stage) {
        const stageNum = acc.stage.stage_number;
        if (!stageMap.has(stageNum)) {
          stageMap.set(stageNum, {
            stageNumber: stageNum,
            stageName: acc.stage.name,
            stageStart: acc.stage.start_location,
            stageEnd: acc.stage.end_location,
            accommodations: []
          });
        }
        stageMap.get(stageNum)!.accommodations.push(acc);
      }
    });

    // Sort stages by number and accommodations alphabetically
    const stages = Array.from(stageMap.values()).sort((a, b) => a.stageNumber - b.stageNumber);
    stages.forEach(stage => {
      stage.accommodations.sort((a, b) => a.name.localeCompare(b.name));
    });

    return stages;
  }, [filteredAccommodations]);

  // Filter options
  const filterOptions = {
    types: ['Refuge', 'Hotel', 'B&B', 'Campsite'],
    locationTypes: ['On-trail', 'Near-trail', 'Off-trail'],
    bookingDifficulty: ['Easy', 'Moderate', 'Hard']
  };

  // Helper function to get display label for dropdowns
  const getDropdownLabel = (category: keyof Filters) => {
    const count = filters[category].length;
    if (count === 0) {
      if (category === 'types') return 'Accommodation type';
      if (category === 'locationTypes') return 'Distance to trail';
      if (category === 'bookingDifficulty') return 'Booking Availability';
    }
    return `${count} selected`;
  };

  const toggleFilter = (category: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);

  // Helper function to handle both relative and absolute URLs
  const getFullUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    return `${baseUrl}${url}`;
  };

  const toggleStage = (stageNumber: number) => {
    setExpandedStages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stageNumber)) {
        newSet.delete(stageNumber);
      } else {
        newSet.add(stageNumber);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedStages(new Set(accommodationsByStage.map(s => s.stageNumber)));
  };

  const collapseAll = () => {
    setExpandedStages(new Set());
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <main style={{ background: 'var(--ds-background)', minHeight: '100vh' }}>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
            <div className="flex items-center justify-center h-96">
              <div className="loading-spinner"></div>
              <span className="ml-4 text-gray-500">Loading accommodations...</span>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <main style={{ background: 'var(--ds-background)', minHeight: '100vh' }}>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-800 font-medium">Error loading accommodations</p>
              <p className="text-red-600 text-sm mt-3">{error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main style={{ background: 'var(--ds-off-white)', minHeight: '100vh' }}>
        {/* Hero Header */}
        <div style={{
          position: 'relative',
          height: '70vh',
          minHeight: '500px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Background Image */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url(/IMG_1633.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }} />

          {/* Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%)',
            zIndex: 1
          }} />

          {/* Content */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            color: 'white',
            padding: '0 clamp(1rem, 3vw, 2rem)',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <h1 style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 700,
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '1rem'
            }}>
              TMB Accommodation Directory
            </h1>
            <p style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
              fontWeight: 400,
              opacity: 0.95,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              lineHeight: 1.5
            }}>
              {accommodations.length} accommodations across {accommodationsByStage.length} stages
            </p>
          </div>
        </div>

        {/* Intro Section */}
        <div style={{ background: 'white', borderBottom: '1px solid var(--ds-border)', padding: '3rem 1rem' }}>
          <div className="container mx-auto px-4" style={{ maxWidth: '1200px', textAlign: 'center' }}>
            <p style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--ds-foreground)',
              marginBottom: '1.5rem',
              maxWidth: '900px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Browse all accommodations along the Tour du Mont Blanc, organized by stage. From refuges and mountain huts to hotels and campsites, find the perfect place to rest after each day on the trail.
            </p>
          </div>
        </div>

        {/* Itinerary Builder Link Card */}
        <div style={{ background: 'var(--ds-off-white)', padding: '3rem 1rem', borderBottom: '1px solid var(--ds-border)' }}>
          <div className="container mx-auto px-4" style={{ maxWidth: '1200px' }}>
            <div style={{
              background: 'linear-gradient(135deg, hsl(145, 60%, 95%) 0%, hsl(145, 50%, 92%) 100%)',
              border: '2px solid hsl(145, 60%, 85%)',
              borderRadius: '12px',
              padding: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <h3 style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: 'hsl(145, 60%, 25%)',
                  marginBottom: '0.5rem',
                  lineHeight: 1.2
                }}>
                  Plan Your Itinerary
                </h3>
                <p style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '1rem',
                  color: 'hsl(145, 60%, 30%)',
                  lineHeight: 1.5
                }}>
                  Use our interactive map and itinerary builder to plan your trek. Select accommodations, calculate distances and elevation, and export your custom route.
                </p>
              </div>
              <a
                href="/guides/tmb-for-beginners/accommodations"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2rem',
                  background: 'hsl(145, 60%, 40%)',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.background = 'hsl(145, 60%, 35%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.background = 'hsl(145, 60%, 40%)';
                }}
              >
                Open Itinerary Builder →
              </a>
            </div>
          </div>
        </div>

        {/* Accommodations by Stage */}
        <div style={{ padding: '4rem 1rem', background: 'var(--ds-off-white)' }}>
          <div className="container mx-auto px-4" style={{ maxWidth: '1200px' }}>

            {/* Filter Bar */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Filter Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter style={{ width: '1.125rem', height: '1.125rem', color: 'var(--ds-muted-foreground)' }} />
                    <span style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--ds-foreground)'
                    }}>Filter Accommodations</span>
                  </div>

                  {hasActiveFilters && (
                    <span
                      onClick={clearAllFilters}
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: 'var(--ds-muted-foreground)',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ds-foreground)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ds-muted-foreground)'; }}
                    >
                      Clear All
                    </span>
                  )}
                </div>

                {/* Filter Dropdowns Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>

                  {/* Accommodation Type Dropdown */}
                  <div style={{ position: 'relative' }} ref={typeRef}>
                    <button
                      onClick={() => setIsTypeOpen(!isTypeOpen)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--ds-border)',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        background: 'white',
                        color: 'var(--ds-foreground)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{getDropdownLabel('types')}</span>
                      <ChevronDown
                        style={{
                          width: '1rem',
                          height: '1rem',
                          transform: isTypeOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }}
                      />
                    </button>

                    {isTypeOpen && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: 'white',
                        border: '1px solid var(--ds-border)',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                        marginTop: '4px',
                        maxHeight: '250px',
                        overflowY: 'auto'
                      }}>
                        {filterOptions.types.map(type => (
                          <label
                            key={type}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.75rem',
                              cursor: 'pointer',
                              borderBottom: '1px solid var(--ds-border)',
                              fontSize: '0.875rem',
                              transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--ds-off-white)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                          >
                            <input
                              type="checkbox"
                              checked={filters.types.includes(type)}
                              onChange={() => toggleFilter('types', type)}
                              style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
                            />
                            <span>{type}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Distance to Trail Dropdown */}
                  <div style={{ position: 'relative' }} ref={distanceRef}>
                    <button
                      onClick={() => setIsDistanceOpen(!isDistanceOpen)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--ds-border)',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        background: 'white',
                        color: 'var(--ds-foreground)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{getDropdownLabel('locationTypes')}</span>
                      <ChevronDown
                        style={{
                          width: '1rem',
                          height: '1rem',
                          transform: isDistanceOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }}
                      />
                    </button>

                    {isDistanceOpen && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: 'white',
                        border: '1px solid var(--ds-border)',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                        marginTop: '4px',
                        maxHeight: '250px',
                        overflowY: 'auto'
                      }}>
                        {filterOptions.locationTypes.map(locType => (
                          <label
                            key={locType}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.75rem',
                              cursor: 'pointer',
                              borderBottom: '1px solid var(--ds-border)',
                              fontSize: '0.875rem',
                              transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--ds-off-white)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                          >
                            <input
                              type="checkbox"
                              checked={filters.locationTypes.includes(locType)}
                              onChange={() => toggleFilter('locationTypes', locType)}
                              style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
                            />
                            <span>{locType}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Booking Availability Dropdown */}
                  <div style={{ position: 'relative' }} ref={bookingRef}>
                    <button
                      onClick={() => setIsBookingOpen(!isBookingOpen)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--ds-border)',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        background: 'white',
                        color: 'var(--ds-foreground)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{getDropdownLabel('bookingDifficulty')}</span>
                      <ChevronDown
                        style={{
                          width: '1rem',
                          height: '1rem',
                          transform: isBookingOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }}
                      />
                    </button>

                    {isBookingOpen && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: 'white',
                        border: '1px solid var(--ds-border)',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                        marginTop: '4px',
                        maxHeight: '250px',
                        overflowY: 'auto'
                      }}>
                        {filterOptions.bookingDifficulty.map(difficulty => (
                          <label
                            key={difficulty}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.75rem',
                              cursor: 'pointer',
                              borderBottom: '1px solid var(--ds-border)',
                              fontSize: '0.875rem',
                              transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--ds-off-white)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                          >
                            <input
                              type="checkbox"
                              checked={filters.bookingDifficulty.includes(difficulty)}
                              onChange={() => toggleFilter('bookingDifficulty', difficulty)}
                              style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
                            />
                            <span>{difficulty}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Results Count */}
                {hasActiveFilters && (
                  <div style={{ fontSize: '0.875rem', color: 'var(--ds-muted-foreground)' }}>
                    Showing {filteredAccommodations.length} of {accommodations.length} accommodations
                  </div>
                )}
              </div>
            </div>

            {/* Expand/Collapse All Controls */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <button
                onClick={expandAll}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'white',
                  border: '1px solid var(--ds-border)',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  cursor: 'pointer',
                  color: 'var(--ds-foreground)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'white',
                  border: '1px solid var(--ds-border)',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  cursor: 'pointer',
                  color: 'var(--ds-foreground)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                Collapse All
              </button>
            </div>

            {/* Stage Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {accommodationsByStage.map(stage => (
                <div
                  key={stage.stageNumber}
                  style={{
                    background: 'white',
                    border: '1px solid #f3f4f6',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  {/* Stage Header */}
                  <button
                    onClick={() => toggleStage(stage.stageNumber)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      background: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <div style={{
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        color: 'var(--ds-foreground)',
                        marginBottom: '0.375rem'
                      }}>
                        Stage {stage.stageNumber}
                      </div>
                      <div style={{
                        fontSize: '1rem',
                        color: 'var(--ds-muted-foreground)',
                        marginBottom: '0.25rem'
                      }}>
                        {stage.stageStart} → {stage.stageEnd}
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: 'var(--ds-muted-foreground)'
                      }}>
                        {stage.accommodations.length} {stage.accommodations.length === 1 ? 'accommodation' : 'accommodations'}
                      </div>
                    </div>
                    {expandedStages.has(stage.stageNumber) ?
                      <ChevronUp style={{ width: '1.5rem', height: '1.5rem', color: 'var(--ds-muted-foreground)' }} /> :
                      <ChevronDown style={{ width: '1.5rem', height: '1.5rem', color: 'var(--ds-muted-foreground)' }} />
                    }
                  </button>

                  {/* Accommodations Grid */}
                  {expandedStages.has(stage.stageNumber) && (
                    <div style={{
                      borderTop: '1px solid var(--ds-border)',
                      padding: '1.5rem',
                      background: '#fafafa'
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '1.25rem'
                      }}>
                        {stage.accommodations.map(accommodation => (
                          <div
                            key={accommodation.id}
                            style={{
                              background: 'white',
                              border: '1px solid #f3f4f6',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-4px)';
                              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                            }}
                          >
                            {/* Image */}
                            {accommodation.photos && accommodation.photos.length > 0 && (
                              <div style={{
                                width: '100%',
                                height: '200px',
                                position: 'relative',
                                overflow: 'hidden',
                                background: '#e5e7eb'
                              }}>
                                <img
                                  src={getFullUrl(accommodation.photos[0].url)}
                                  alt={accommodation.photos[0].alternativeText || accommodation.name}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                              </div>
                            )}

                            {/* Content */}
                            <div style={{ padding: '1.25rem' }}>
                              {/* Name and Type */}
                              <div style={{ marginBottom: '0.75rem' }}>
                                <h3 style={{
                                  fontFamily: 'Inter, system-ui, sans-serif',
                                  fontSize: '1.125rem',
                                  fontWeight: 600,
                                  color: 'var(--ds-foreground)',
                                  marginBottom: '0.5rem',
                                  lineHeight: 1.2
                                }}>
                                  {accommodation.name}
                                </h3>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                  <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    padding: '0.25rem 0.625rem',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    background: 'hsl(208, 70%, 95%)',
                                    color: 'hsl(208, 70%, 35%)'
                                  }}>
                                    {accommodation.type}
                                  </span>
                                  {accommodation.location_type && (
                                    <span style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      padding: '0.25rem 0.625rem',
                                      borderRadius: '4px',
                                      fontSize: '0.75rem',
                                      fontWeight: 600,
                                      background: 'hsl(145, 60%, 95%)',
                                      color: 'hsl(145, 60%, 35%)'
                                    }}>
                                      {accommodation.location_type}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Key Info */}
                              <div style={{
                                fontSize: '0.875rem',
                                color: 'var(--ds-muted-foreground)',
                                marginBottom: '1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.375rem'
                              }}>
                                {accommodation.altitude && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                    <Mountain style={{ width: '0.875rem', height: '0.875rem' }} />
                                    <span>{accommodation.altitude}m altitude</span>
                                  </div>
                                )}
                                {accommodation.capacity && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                    <Bed style={{ width: '0.875rem', height: '0.875rem' }} />
                                    <span>{accommodation.capacity} beds</span>
                                  </div>
                                )}
                                {accommodation.price_range && (
                                  <div style={{ fontWeight: 600, color: 'hsl(145, 60%, 35%)' }}>
                                    {accommodation.price_range}
                                  </div>
                                )}
                              </div>

                              {/* Contact Links */}
                              <div style={{
                                borderTop: '1px solid var(--ds-border)',
                                paddingTop: '0.875rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem'
                              }}>
                                {accommodation.website && (
                                  <a
                                    href={accommodation.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.5rem',
                                      fontSize: '0.875rem',
                                      color: 'hsl(208, 70%, 45%)',
                                      textDecoration: 'none',
                                      transition: 'color 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(208, 70%, 35%)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(208, 70%, 45%)'}
                                  >
                                    <Globe style={{ width: '0.875rem', height: '0.875rem' }} />
                                    Visit Website
                                  </a>
                                )}
                                {accommodation.phone && (
                                  <a
                                    href={`tel:${accommodation.phone}`}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.5rem',
                                      fontSize: '0.875rem',
                                      color: 'hsl(208, 70%, 45%)',
                                      textDecoration: 'none',
                                      transition: 'color 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(208, 70%, 35%)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(208, 70%, 45%)'}
                                  >
                                    <Phone style={{ width: '0.875rem', height: '0.875rem' }} />
                                    {accommodation.phone}
                                  </a>
                                )}
                                {accommodation.email && (
                                  <a
                                    href={`mailto:${accommodation.email}`}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.5rem',
                                      fontSize: '0.875rem',
                                      color: 'hsl(208, 70%, 45%)',
                                      textDecoration: 'none',
                                      transition: 'color 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(208, 70%, 35%)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(208, 70%, 45%)'}
                                  >
                                    <Mail style={{ width: '0.875rem', height: '0.875rem' }} />
                                    {accommodation.email}
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
