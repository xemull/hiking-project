// src/app/guides/tmb-for-beginners/accommodations/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import TMBAccommodationsMap from '../../../components/TMBAccommodationsMap';
import DistanceCalculator from '../../../components/DistanceCalculator';
import { getTMBAccommodations, getTMBTrailData, type TMBAccommodation, type TMBTrailData } from '../../../services/api';
import { MapPin, Bed, Star, Phone, Mail, Globe, Filter, X } from 'lucide-react';

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
  const [selectedForDistance, setSelectedForDistance] = useState<TMBAccommodation[]>([]);
  const [distanceMode, setDistanceMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
    bookingDifficulty: ['Easy', 'Moderate', 'Hard', 'Very Hard']
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
      <div className="container-responsive py-2xl">
        <div className="flex items-center justify-center h-96">
          <div className="loading-spinner"></div>
          <span className="ml-md text-muted-foreground">Loading accommodations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-responsive py-2xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-lg text-center">
          <p className="text-red-800 font-medium">Error loading accommodations</p>
          <p className="text-red-600 text-sm mt-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container-responsive py-xl">
          <div className="section-header">
            <h1 className="section-title">TMB Accommodations</h1>
            <p className="section-subtitle">
              Complete guide to refuges, hotels, B&Bs, and campsites along the Tour de Mont Blanc. 
              Filter by type and booking difficulty to plan your perfect itinerary.
            </p>
          </div>
        </div>
      </div>

      <div className="container-responsive py-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-lg sticky top-lg">
              <div className="flex items-center justify-between mb-lg">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-sm rounded-lg hover:bg-gray-100"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-lg`}>
                {/* Type Filter */}
                <div>
                  <h4 className="font-medium mb-sm">Accommodation Type</h4>
                  <div className="space-y-xs">
                    {filterOptions.types.map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.types.includes(type)}
                          onChange={() => toggleFilter('types', type)}
                          className="mr-sm rounded border-gray-300"
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <h4 className="font-medium mb-sm">Location</h4>
                  <div className="space-y-xs">
                    {filterOptions.locationTypes.map(locType => (
                      <label key={locType} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.locationTypes.includes(locType)}
                          onChange={() => toggleFilter('locationTypes', locType)}
                          className="mr-sm rounded border-gray-300"
                        />
                        <span className="text-sm">{locType}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Booking Difficulty Filter */}
                <div>
                  <h4 className="font-medium mb-sm">Booking Difficulty</h4>
                  <div className="space-y-xs">
                    {filterOptions.bookingDifficulty.map(difficulty => (
                      <label key={difficulty} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.bookingDifficulty.includes(difficulty)}
                          onChange={() => toggleFilter('bookingDifficulty', difficulty)}
                          className="mr-sm rounded border-gray-300"
                        />
                        <span className="text-sm">{difficulty}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full px-md py-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center justify-center"
                  >
                    <X className="w-4 h-4 mr-xs" />
                    Clear All Filters
                  </button>
                )}
              </div>

              {/* Results Count */}
              <div className="mt-lg pt-lg border-t">
                <p className="text-sm text-gray-600">
                  Showing {filteredAccommodations.length} of {accommodations.length} accommodations
                </p>
              </div>
            </div>

            {/* Distance Calculator */}
            <div className="mt-xl">
              <DistanceCalculator 
                accommodations={filteredAccommodations}
                selectedAccommodations={selectedForDistance}
                onSelectionChange={setSelectedForDistance}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Map */}
            <div className="bg-white rounded-lg border mb-xl overflow-hidden">
              <div className="p-lg border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Trail Map</h3>
                    <p className="text-sm text-gray-600">
                      {distanceMode ? 'Click markers to select for distance calculation' : 'Click markers to view accommodation details'}
                    </p>
                  </div>
                  <button
                    onClick={() => setDistanceMode(!distanceMode)}
                    className={`px-sm py-xs rounded-lg text-sm font-medium transition-colors ${
                      distanceMode 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {distanceMode ? 'Exit Distance Mode' : 'Distance Mode'}
                  </button>
                </div>
              </div>
              {trailData && (
                <TMBAccommodationsMap 
                  trailData={trailData}
                  accommodations={filteredAccommodations}
                  selectedAccommodation={selectedAccommodation}
                  onAccommodationSelect={setSelectedAccommodation}
                  distanceMode={distanceMode}
                  selectedForDistance={selectedForDistance}
                  onDistanceSelect={(accommodation) => {
                    setSelectedForDistance(prev => {
                      if (prev.find(p => p.id === accommodation.id)) {
                        return prev.filter(p => p.id !== accommodation.id);
                      } else if (prev.length < 2) {
                        return [...prev, accommodation];
                      } else {
                        return [prev[1], accommodation];
                      }
                    });
                  }}
                  className="w-full" 
                  height="500px"
                />
              )}
            </div>

            {/* Accommodations List */}
            <div className="space-y-lg">
              {filteredAccommodations.map(accommodation => (
                <div
                  key={accommodation.id}
                  className="bg-white rounded-lg border p-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedAccommodation(accommodation)}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-md">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-sm">
                        <h3 className="card-title">{accommodation.name}</h3>
                        <div className="flex items-center space-x-xs ml-md">
                          <span className={`inline-flex items-center px-xs py-1 rounded text-xs font-medium ${
                            accommodation.type === 'Refuge' ? 'bg-green-100 text-green-800' :
                            accommodation.type === 'Hotel' ? 'bg-blue-100 text-blue-800' :
                            accommodation.type === 'B&B' ? 'bg-purple-100 text-purple-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {accommodation.type}
                          </span>
                          <span className={`inline-flex items-center px-xs py-1 rounded text-xs ${
                            accommodation.booking_difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                            accommodation.booking_difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                            accommodation.booking_difficulty === 'Hard' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {accommodation.booking_difficulty} booking
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 mb-sm">
                        <MapPin className="w-4 h-4 mr-xs" />
                        <span className="mr-lg">{accommodation.location_type}</span>
                        {accommodation.altitude && (
                          <>
                            <span className="mr-xs">Altitude:</span>
                            <span className="font-medium">{accommodation.altitude}m</span>
                          </>
                        )}
                      </div>

                      {accommodation.stage && (
                        <div className="flex items-center text-sm text-gray-600 mb-sm">
                          <span className="bg-gray-100 px-sm py-1 rounded text-xs">
                            {accommodation.stage.name}
                          </span>
                        </div>
                      )}

                      {accommodation.price_range && (
                        <div className="flex items-center text-sm mb-sm">
                          <span className="text-gray-600 mr-xs">Price:</span>
                          <span className="font-medium text-green-600">{accommodation.price_range}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-md text-sm">
                    {accommodation.website && (
                      <a 
                        href={accommodation.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe className="w-4 h-4 mr-xs" />
                        Website
                      </a>
                    )}
                    {accommodation.phone && (
                      <a 
                        href={`tel:${accommodation.phone}`}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="w-4 h-4 mr-xs" />
                        {accommodation.phone}
                      </a>
                    )}
                    {accommodation.email && (
                      <a 
                        href={`mailto:${accommodation.email}`}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail className="w-4 h-4 mr-xs" />
                        Email
                      </a>
                    )}
                  </div>

                  {accommodation.notes && (
                    <p className="text-sm text-gray-600 mt-md">{accommodation.notes}</p>
                  )}
                </div>
              ))}

              {filteredAccommodations.length === 0 && (
                <div className="text-center py-xl">
                  <p className="text-gray-500 mb-md">No accommodations match your current filters.</p>
                  <button
                    onClick={clearAllFilters}
                    className="btn-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}