// src/app/guides/tmb-for-beginners/accommodations/page.tsx
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import UniversalHero from '../../../components/UniversalHero';
import TMBAccommodationsMap from '../../../components/TMBAccommodationsMap';
import ItineraryBuilder, { type ItineraryBuilderRef } from '../../../components/ItineraryBuilder';
import { getTMBAccommodations, getTMBTrailData, type TMBAccommodation, type TMBTrailData } from '../../../services/api';
import { MapPin, Bed, Phone, Mail, Globe, Filter, X, ChevronDown } from 'lucide-react';

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

export default function TMBAccommodationsPage() {
  const [accommodations, setAccommodations] = useState<TMBAccommodation[]>([]);
  const [trailData, setTrailData] = useState<TMBTrailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedAccommodation, setSelectedAccommodation] = useState<TMBAccommodation | null>(null);
  const [showAddedNotification, setShowAddedNotification] = useState(false);

  // Dropdown states
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isDistanceOpen, setIsDistanceOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Refs for click-outside detection
  const typeRef = useRef<HTMLDivElement>(null);
  const distanceRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const itineraryBuilderRef = useRef<ItineraryBuilderRef>(null);

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

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [accommodationsData, trailDataResult] = await Promise.all([
          getTMBAccommodations(),
          getTMBTrailData()
        ]);

        if (accommodationsData) {
          setAccommodations(accommodationsData);
        } else {
          setError('Failed to load accommodations data');
        }

        if (trailDataResult) {
          setTrailData(trailDataResult);
        }

      } catch (err) {
        console.error('Error loading TMB data:', err);
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
      <main style={{
        background: 'var(--ds-off-white)',
        minHeight: '100vh'
      }}>
        {/* Success Notification Toast */}
        {showAddedNotification && selectedAccommodation && (
          <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: '#10b981',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: 9999,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 500,
            maxWidth: '400px',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ flexShrink: 0 }}
            >
              <circle cx="10" cy="10" r="10" fill="white" fillOpacity="0.2"/>
              <path
                d="M14 7L8.5 12.5L6 10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Added <strong>{selectedAccommodation.name}</strong> to your itinerary</span>
          </div>
        )}

        <div className="min-h-screen" style={{ background: 'var(--ds-off-white)' }}><a id="content-start"></a>
      {/* Hero Header with Image */}
      <UniversalHero title="Tour du Mont Blanc Accommodations" subtitle="Plan your perfect multi-day hiking adventure around the Mont Blanc massif" backgroundSrc="/IMG_1633.jpg" ctas={[{ label: "Start Planning", href: "#content-start", variant: "primary" }]} overlay="gradient" height="standard" />

      {/* Intro Section */}
      <div id="intro-section" style={{ background: 'white', borderBottom: '1px solid var(--ds-border)', padding: '4rem 1rem' }}>
        <div className="container mx-auto px-4" style={{ maxWidth: '1200px', textAlign: 'center' }}>
          <p style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            fontWeight: 600,
            color: 'var(--ds-foreground)',
            marginBottom: '1rem',
            maxWidth: '1000px',
            margin: '0 auto',
            lineHeight: 1.5
          }}>
            The <span style={{ color: 'var(--ds-accent)', fontWeight: 700 }}>Tour du Mont Blanc</span> offers various accommodation types, but availability is <span style={{ background: 'hsl(45, 100%, 85%)', padding: '0.125rem 0.375rem', borderRadius: '4px', fontWeight: 700 }}>extremely limited</span> during peak season.
          </p>
          <p style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--ds-muted-foreground)',
            maxWidth: '900px',
            margin: '1rem auto 0',
            lineHeight: 1.6,
            fontWeight: 400
          }}>
            Many refuges and mountain huts book out months in advance, so early planning is essential to secure your preferred spots along the trail.
          </p>
        </div>
      </div>

      {/* Accommodation Type Cards */}
      <div id="accommodation-types" style={{ background: 'var(--ds-off-white)', padding: '4rem 1rem', borderBottom: '1px solid var(--ds-border)' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div style={{
              background: 'white',
              border: '1px solid #f3f4f6',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏔️</div>
              <h3 style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--ds-foreground)',
                marginBottom: '0.75rem',
                lineHeight: 1.2
              }}>
                Refuges
              </h3>
              <p style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '1rem',
                color: 'var(--ds-muted-foreground)',
                lineHeight: 1.6
              }}>
                Mountain huts offering dormitory accommodation and meals. Authentic alpine experience, book early for peak season.
              </p>
            </div>

            <div style={{
              background: 'white',
              border: '1px solid #f3f4f6',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏨</div>
              <h3 style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--ds-foreground)',
                marginBottom: '0.75rem',
                lineHeight: 1.2
              }}>
                Hotels
              </h3>
              <p style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '1rem',
                color: 'var(--ds-muted-foreground)',
                lineHeight: 1.6
              }}>
                Comfortable private rooms with modern amenities. Usually located in valleys and villages along the route.
              </p>
            </div>

            <div style={{
              background: 'white',
              border: '1px solid #f3f4f6',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏡</div>
              <h3 style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--ds-foreground)',
                marginBottom: '0.75rem',
                lineHeight: 1.2
              }}>
                B&Bs
              </h3>
              <p style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '1rem',
                color: 'var(--ds-muted-foreground)',
                lineHeight: 1.6
              }}>
                Cozy guesthouses with breakfast included. Personal touch and local hospitality in charming settings.
              </p>
            </div>

            <div style={{
              background: 'white',
              border: '1px solid #f3f4f6',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⛺</div>
              <h3 style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--ds-foreground)',
                marginBottom: '0.75rem',
                lineHeight: 1.2
              }}>
                Campsites
              </h3>
              <p style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '1rem',
                color: 'var(--ds-muted-foreground)',
                lineHeight: 1.6
              }}>
                Budget-friendly option for tent camping. Basic facilities with beautiful mountain settings.
              </p>
            </div>
          </div>

          {/* Info Boxes */}
          <div style={{ background: 'hsl(208, 60%, 92%)', border: '1px solid hsl(208, 70%, 85%)', borderRadius: '8px', padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📅</span>
                <div>
                  <h4 style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: 'hsl(208, 70%, 25%)',
                    marginBottom: '0.5rem',
                    lineHeight: 1.2
                  }}>
                    Seasonality & Booking
                  </h4>
                  <p style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '1rem',
                    color: 'hsl(208, 70%, 35%)',
                    lineHeight: 1.6
                  }}>
                    Peak season (July-August) requires booking 3-6 months in advance, especially for refuges. June and September offer more availability but check if high-altitude refuges are open.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>💳</span>
                <div>
                  <h4 style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: 'hsl(208, 70%, 25%)',
                    marginBottom: '0.5rem',
                    lineHeight: 1.2
                  }}>
                    Payment & Practicalities
                  </h4>
                  <p style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '1rem',
                    color: 'hsl(208, 70%, 35%)',
                    lineHeight: 1.6
                  }}>
                    Many refuges prefer cash (euros or Swiss francs). Hotels and B&Bs typically accept cards. Meals are often included at refuges (half-board), while hotels may be room-only.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
                <div>
                  <h4 style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: 'hsl(208, 70%, 25%)',
                    marginBottom: '0.5rem',
                    lineHeight: 1.2
                  }}>
                    What to Expect
                  </h4>
                  <p style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '1rem',
                    color: 'hsl(208, 70%, 35%)',
                    lineHeight: 1.6
                  }}>
                    Refuges typically offer dormitory beds (bring earplugs!) with shared bathrooms. Private rooms are available at some refuges and all hotels/B&Bs. Laundry facilities are limited.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Full Directory Link Card */}
          <div style={{
            background: 'linear-gradient(135deg, hsl(208, 70%, 95%) 0%, hsl(208, 60%, 92%) 100%)',
            border: '2px solid hsl(208, 70%, 85%)',
            borderRadius: '12px',
            padding: '2rem',
            marginTop: '2rem',
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
                color: 'hsl(208, 70%, 25%)',
                marginBottom: '0.5rem',
                lineHeight: 1.2
              }}>
                Browse All TMB Accommodations
              </h3>
              <p style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '1rem',
                color: 'hsl(208, 70%, 35%)',
                lineHeight: 1.5
              }}>
                View all 85 accommodations organized by stage with photos, details, and filters in our comprehensive directory.
              </p>
            </div>
            <a
              href="/guides/tmb-for-beginners/accommodation-directory"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                background: 'hsl(208, 70%, 45%)',
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
                e.currentTarget.style.background = 'hsl(208, 70%, 40%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.background = 'hsl(208, 70%, 45%)';
              }}
            >
              View Directory →
            </a>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div id="map-section" style={{ background: 'white', padding: '4rem 1rem', scrollSnapAlign: 'start', minHeight: '100vh' }}>
        <div className="container mx-auto px-4">
          <h2 style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 'clamp(1.875rem, 4vw, 2.25rem)',
            fontWeight: 600,
            color: 'var(--ds-foreground)',
            marginBottom: '0.75rem',
            lineHeight: 1.2
          }}>
            Trail Map and Itinerary Builder
          </h2>
          <p style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
            color: 'var(--ds-muted-foreground)',
            marginBottom: '1rem',
            lineHeight: 1.6
          }}>
            Click on accommodation markers to view details. Use the itinerary builder below to plan your TMB journey - select accommodations to add them to your route, and the builder will automatically calculate distances, elevation changes, and estimated hiking times using Naismith's rule. You can reorder days, export your itinerary, or print it for offline reference.
          </p>

          {/* Filter Bar with Dropdowns */}
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

          {/* Map and Info Grid */}
          <div className="tmb-map-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>

            {/* Map Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Map */}
              <div className="tmb-map-container" style={{
                background: 'white',
                border: '1px solid #f3f4f6',
                borderRadius: '12px',
                overflow: 'hidden',
                height: '800px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
              }}>
                <TMBAccommodationsMap
                  trailData={trailData}
                  accommodations={filteredAccommodations}
                  selectedAccommodation={selectedAccommodation}
                  onAccommodationSelect={setSelectedAccommodation}
                  onAddToItinerary={(accommodation) => {
                    if (itineraryBuilderRef.current) {
                      itineraryBuilderRef.current.addAccommodation(accommodation);
                      setSelectedAccommodation(accommodation);
                      setShowAddedNotification(true);
                      setTimeout(() => setShowAddedNotification(false), 3000);
                    }
                  }}
                  className="w-full"
                  height="100%"
                />
              </div>

              {/* Map Legend */}
              <div style={{
                background: 'white',
                border: '1px solid #f3f4f6',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}>
                <h4 style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  marginBottom: '0.75rem',
                  color: 'var(--ds-foreground)'
                }}>Map Legend</h4>

                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--ds-muted-foreground)',
                    marginBottom: '0.5rem'
                  }}>Accommodation Types:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        background: '#2563eb',
                        borderRadius: '50% 50% 50% 0',
                        transform: 'rotate(-45deg)',
                        border: '2px solid white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        display: 'inline-block'
                      }} />
                      <span style={{ fontSize: '0.75rem' }}>Refuge</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        background: '#dc2626',
                        borderRadius: '50% 50% 50% 0',
                        transform: 'rotate(-45deg)',
                        border: '2px solid white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        display: 'inline-block'
                      }} />
                      <span style={{ fontSize: '0.75rem' }}>Hotel</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        background: '#16a34a',
                        borderRadius: '50% 50% 50% 0',
                        transform: 'rotate(-45deg)',
                        border: '2px solid white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        display: 'inline-block'
                      }} />
                      <span style={{ fontSize: '0.75rem' }}>Campsite</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        background: '#9333ea',
                        borderRadius: '50% 50% 50% 0',
                        transform: 'rotate(-45deg)',
                        border: '2px solid white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        display: 'inline-block'
                      }} />
                      <span style={{ fontSize: '0.75rem' }}>B&B</span>
                    </div>
                  </div>

                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.7rem',
                    color: 'var(--ds-muted-foreground)',
                    fontStyle: 'italic'
                  }}>
                    Numbers show TMB stage (1-11)
                  </div>
                </div>

                <div style={{
                  marginTop: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--ds-muted-foreground)'
                }}>
                  <div style={{
                    width: '24px',
                    height: '3px',
                    background: '#ef4444',
                    borderRadius: '1px'
                  }}></div>
                  <span>TMB Trail</span>
                </div>

                <div style={{
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #f3f4f6',
                  fontSize: '0.7rem',
                  color: 'var(--ds-muted-foreground)'
                }}>
                  {filteredAccommodations.length} of {accommodations.length} accommodations shown
                </div>
              </div>
            </div>

            {/* Right Column: Accommodation Details + Itinerary Builder */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Selected Accommodation Details */}
              {selectedAccommodation && (
                <div style={{
                  background: 'linear-gradient(180deg, #ffffff, #fafafa)',
                  border: '1px solid #f3f4f6',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  maxHeight: '350px',
                  overflowY: 'auto',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#e5e7eb transparent'
                }}
                className="accommodation-panel">
                  {/* Title and Button Row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      color: 'var(--ds-foreground)',
                      lineHeight: 1.1,
                      flex: 1
                    }}>
                      {selectedAccommodation.name}
                    </h3>

                    <button
                      onClick={() => {
                        if (selectedAccommodation && itineraryBuilderRef.current) {
                          itineraryBuilderRef.current.addAccommodation(selectedAccommodation);
                          setShowAddedNotification(true);
                          setTimeout(() => setShowAddedNotification(false), 3000);
                        }
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.375rem',
                        padding: '0.5rem 1rem',
                        background: 'var(--ds-accent)',
                        color: 'var(--ds-accent-foreground)',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        fontFamily: 'Inter, system-ui, sans-serif',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.2s ease',
                        flexShrink: 0,
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      + Add to Itinerary
                    </button>
                  </div>

                  {/* Stage Reference - Right under name */}
                  {selectedAccommodation.stage && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <MapPin style={{ width: '0.875rem', height: '0.875rem', color: 'var(--ds-muted-foreground)' }} />
                      <span style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: '0.875rem',
                        color: 'var(--ds-muted-foreground)',
                        lineHeight: 1.3
                      }}>
                        Stage {selectedAccommodation.stage.stage_number}: {selectedAccommodation.stage.start_location} to {selectedAccommodation.stage.end_location}
                      </span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      background: 'hsl(208, 70%, 95%)',
                      color: 'hsl(208, 70%, 35%)'
                    }}>
                      {selectedAccommodation.type}
                    </span>
                    {selectedAccommodation.location_type && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        background: 'hsl(145, 60%, 95%)',
                        color: 'hsl(145, 60%, 35%)'
                      }}>
                        {selectedAccommodation.location_type}
                      </span>
                    )}
                    {selectedAccommodation.booking_difficulty && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        background: selectedAccommodation.booking_difficulty === 'Easy' ? 'hsl(145, 60%, 95%)' :
                                  selectedAccommodation.booking_difficulty === 'Moderate' ? 'hsl(45, 60%, 95%)' :
                                  'hsl(0, 60%, 95%)',
                        color: selectedAccommodation.booking_difficulty === 'Easy' ? 'hsl(145, 60%, 35%)' :
                              selectedAccommodation.booking_difficulty === 'Moderate' ? 'hsl(45, 60%, 35%)' :
                              'hsl(0, 60%, 35%)'
                      }}>
                        {selectedAccommodation.booking_difficulty}
                      </span>
                    )}
                  </div>

                  {selectedAccommodation.notes && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--ds-muted-foreground)', marginBottom: '1rem', lineHeight: 1.4 }}>
                      {selectedAccommodation.notes}
                    </p>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    {selectedAccommodation.altitude && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <MapPin style={{ width: '1rem', height: '1rem', color: 'var(--ds-muted-foreground)' }} />
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ds-muted-foreground)', textTransform: 'uppercase' }}>Altitude</span>
                        </div>
                        <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ds-foreground)' }}>
                          {selectedAccommodation.altitude}m
                        </span>
                      </div>
                    )}
                    {selectedAccommodation.capacity && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <Bed style={{ width: '1rem', height: '1rem', color: 'var(--ds-muted-foreground)' }} />
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ds-muted-foreground)', textTransform: 'uppercase' }}>Capacity</span>
                        </div>
                        <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ds-foreground)' }}>
                          {selectedAccommodation.capacity} beds
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedAccommodation.price_range && (
                    <div style={{ marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ds-muted-foreground)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                        Price Range
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ds-foreground)' }}>
                        {selectedAccommodation.price_range}
                      </span>
                    </div>
                  )}

                  {selectedAccommodation.booking_method && (
                    <div style={{ marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ds-muted-foreground)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                        Booking Method
                      </span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--ds-foreground)' }}>
                        {selectedAccommodation.booking_method}
                      </span>
                    </div>
                  )}


                  {selectedAccommodation.Accommodation_Service && selectedAccommodation.Accommodation_Service.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ds-foreground)', display: 'block', marginBottom: '0.5rem' }}>
                        Available Services
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                        {selectedAccommodation.Accommodation_Service.filter(service => service.available).map(service => (
                          <span
                            key={service.id}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '0.25rem 0.625rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              background: 'var(--ds-muted)',
                              color: 'var(--ds-foreground)'
                            }}
                          >
                            {service.service_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid var(--ds-border)', paddingTop: '0.75rem', marginBottom: '0' }}>
                    {selectedAccommodation.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Phone style={{ width: '1rem', height: '1rem', color: 'var(--ds-muted-foreground)' }} />
                        <a href={`tel:${selectedAccommodation.phone}`} style={{ fontSize: '0.875rem', color: 'hsl(208, 70%, 45%)', textDecoration: 'none' }}>
                          {selectedAccommodation.phone}
                        </a>
                      </div>
                    )}
                    {selectedAccommodation.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Mail style={{ width: '1rem', height: '1rem', color: 'var(--ds-muted-foreground)' }} />
                        <a href={`mailto:${selectedAccommodation.email}`} style={{ fontSize: '0.875rem', color: 'hsl(208, 70%, 45%)', textDecoration: 'none' }}>
                          {selectedAccommodation.email}
                        </a>
                      </div>
                    )}
                    {selectedAccommodation.website && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Globe style={{ width: '1rem', height: '1rem', color: 'var(--ds-muted-foreground)' }} />
                        <a
                          href={selectedAccommodation.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '0.875rem', color: 'hsl(208, 70%, 45%)', textDecoration: 'none' }}
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Itinerary Builder Section */}
              <ItineraryBuilder ref={itineraryBuilderRef} accommodations={accommodations} />

            </div>
          </div>

        </div>
      </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


