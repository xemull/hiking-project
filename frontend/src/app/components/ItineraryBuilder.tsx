// src/app/components/ItineraryBuilder.tsx
'use client';

import { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { TMBAccommodation } from '../services/api';
import { Calendar, MapPin, Mountain, Clock, Trash2, Plus, Download, Mail, Printer, ChevronUp, ChevronDown } from 'lucide-react';

interface TrackPoint {
  lon: number;
  lat: number;
  ele: number;
}

interface TrailData {
  id: number;
  name: string;
  track: {
    type: string;
    coordinates: number[][]; // [lon, lat, ele][]
  };
}

interface ItineraryBuilderProps {
  accommodations: TMBAccommodation[];
}

export interface ItineraryBuilderRef {
  addAccommodation: (accommodation: TMBAccommodation) => void;
}

interface ItineraryDay {
  id: string;
  dayNumber: number;
  accommodation: TMBAccommodation;
  distance?: number;
  elevationGain?: number;
  elevationLoss?: number;
  estimatedTime?: string;
  estimatedHours?: number;
}

interface StageGroup {
  stageNumber: number;
  stageName: string;
  stageStart: string;
  stageEnd: string;
  accommodations: TMBAccommodation[];
}

// Haversine formula for calculating distance
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Estimate hiking time using enhanced Naismith's rule with descent and off-trail adjustments
function estimateHikingTime(
  distance: number,
  elevationGain: number,
  elevationLoss: number,
  startAccommodation?: TMBAccommodation,
  endAccommodation?: TMBAccommodation
): { formatted: string; hours: number } {
  // Base time for horizontal distance (5 km/hr on flat terrain)
  let totalHours = distance / 5;

  // Add time for ascent: +10 minutes per 100m (Naismith's rule)
  totalHours += elevationGain / 600;

  // Add time for descent: +10 minutes per 300m steep descent
  // (descent is generally faster than ascent, but still takes time)
  totalHours += elevationLoss / 1800;

  // Add extra time for off-trail accommodations
  const addOffTrailTime = (accommodation: TMBAccommodation | undefined) => {
    if (!accommodation) return 0;

    switch (accommodation.location_type) {
      case 'Off-trail':
        return 0.5; // 30 minutes extra
      case 'Near-trail':
        return 0.17; // 10 minutes extra
      case 'On-trail':
      default:
        return 0;
    }
  };

  // Add time for both start and end accommodations if they're off-trail
  totalHours += addOffTrailTime(startAccommodation);
  totalHours += addOffTrailTime(endAccommodation);

  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);

  let formatted: string;
  if (hours === 0) {
    formatted = `${minutes} min`;
  } else if (minutes === 0) {
    formatted = `${hours}h`;
  } else {
    formatted = `${hours}h ${minutes}min`;
  }

  return { formatted, hours: totalHours };
}

// Find the nearest point on the GPX track to a given location
function findNearestTrackPoint(lat: number, lon: number, trackCoordinates: number[][]): {
  index: number;
  distance: number;
} {
  let minDistance = Infinity;
  let nearestIndex = 0;

  trackCoordinates.forEach((coord, index) => {
    const [trackLon, trackLat] = coord;
    const distance = calculateDistance(lat, lon, trackLat, trackLon);

    if (distance < minDistance) {
      minDistance = distance;
      nearestIndex = index;
    }
  });

  return { index: nearestIndex, distance: minDistance };
}

// Calculate distance and elevation along the GPX track between two points
function calculateTrackSegmentStats(
  startIndex: number,
  endIndex: number,
  trackCoordinates: number[][]
): {
  distance: number;
  elevationGain: number;
  elevationLoss: number;
} {
  if (startIndex >= endIndex || startIndex < 0 || endIndex >= trackCoordinates.length) {
    return { distance: 0, elevationGain: 0, elevationLoss: 0 };
  }

  let totalDistance = 0;
  let totalElevationGain = 0;
  let totalElevationLoss = 0;

  for (let i = startIndex; i < endIndex; i++) {
    const [lon1, lat1, ele1] = trackCoordinates[i];
    const [lon2, lat2, ele2] = trackCoordinates[i + 1];

    // Calculate distance between consecutive points
    const segmentDistance = calculateDistance(lat1, lon1, lat2, lon2);
    totalDistance += segmentDistance;

    // Calculate elevation change
    const elevationDiff = ele2 - ele1;
    if (elevationDiff > 0) {
      totalElevationGain += elevationDiff;
    } else {
      totalElevationLoss += Math.abs(elevationDiff);
    }
  }

  return {
    distance: totalDistance,
    elevationGain: totalElevationGain,
    elevationLoss: totalElevationLoss
  };
}

const ItineraryBuilder = forwardRef<ItineraryBuilderRef, ItineraryBuilderProps>(
  ({ accommodations }, ref) => {
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [expandedStages, setExpandedStages] = useState<Set<number>>(new Set());
  const [trailData, setTrailData] = useState<TrailData | null>(null);

  // Fetch GPX track data on mount
  useEffect(() => {
    const fetchTrailData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_CUSTOM_BACKEND_URL || 'http://localhost:4000'}/api/tmb/trail`);
        if (response.ok) {
          const data = await response.json();
          setTrailData(data);
          console.log('✅ GPX track data loaded:', data.track.coordinates.length, 'points');
        }
      } catch (error) {
        console.error('❌ Failed to load GPX track data:', error);
      }
    };

    fetchTrailData();
  }, []);

  // Group accommodations by stage
  const accommodationsByStage = useMemo<StageGroup[]>(() => {
    const stageMap = new Map<number, StageGroup>();

    accommodations.forEach(acc => {
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

    // Sort stages by number and accommodations by distance from stage start
    // For now, we'll sort alphabetically within each stage
    // TODO: Calculate distance from stage start point
    const stages = Array.from(stageMap.values()).sort((a, b) => a.stageNumber - b.stageNumber);
    stages.forEach(stage => {
      stage.accommodations.sort((a, b) => a.name.localeCompare(b.name));
    });

    return stages;
  }, [accommodations]);

  // Calculate distances and times when itinerary changes
  const enrichedItinerary = useMemo(() => {
    if (itinerary.length === 0) return [];

    return itinerary.map((day, index) => {
      if (index === 0) {
        // First day - no previous accommodation
        return { ...day, distance: 0, elevationGain: 0, elevationLoss: 0, estimatedTime: 'Start', estimatedHours: 0 };
      }

      const prevDay = itinerary[index - 1];

      // Use GPX track data if available, otherwise fall back to simple calculation
      if (trailData && trailData.track.coordinates.length > 0) {
        try {
          // Find nearest points on the track for both accommodations
          const prevPoint = findNearestTrackPoint(
            prevDay.accommodation.latitude,
            prevDay.accommodation.longitude,
            trailData.track.coordinates
          );
          const currentPoint = findNearestTrackPoint(
            day.accommodation.latitude,
            day.accommodation.longitude,
            trailData.track.coordinates
          );

          // Calculate stats along the actual trail
          const stats = calculateTrackSegmentStats(
            prevPoint.index,
            currentPoint.index,
            trailData.track.coordinates
          );

          const { formatted: estimatedTime, hours: estimatedHours } = estimateHikingTime(
            stats.distance,
            stats.elevationGain,
            stats.elevationLoss,
            prevDay.accommodation,
            day.accommodation
          );

          return {
            ...day,
            distance: stats.distance,
            elevationGain: stats.elevationGain,
            elevationLoss: stats.elevationLoss,
            estimatedTime,
            estimatedHours
          };
        } catch (error) {
          console.error('Error calculating GPX-based stats:', error);
          // Fall through to simple calculation
        }
      }

      // Fallback: simple straight-line calculation
      const distance = calculateDistance(
        prevDay.accommodation.latitude,
        prevDay.accommodation.longitude,
        day.accommodation.latitude,
        day.accommodation.longitude
      );

      const elevationDiff = (day.accommodation.altitude || 0) - (prevDay.accommodation.altitude || 0);
      const elevationGain = Math.max(0, elevationDiff);
      const elevationLoss = Math.max(0, -elevationDiff);
      const { formatted: estimatedTime, hours: estimatedHours } = estimateHikingTime(
        distance,
        elevationGain,
        elevationLoss,
        prevDay.accommodation,
        day.accommodation
      );

      return {
        ...day,
        distance,
        elevationGain,
        elevationLoss,
        estimatedTime,
        estimatedHours
      };
    });
  }, [itinerary, trailData]);

  // Total stats
  const totalStats = useMemo(() => {
    if (enrichedItinerary.length === 0) return null;

    const totalDistance = enrichedItinerary.reduce((sum, day) => sum + (day.distance || 0), 0);
    const totalElevationGain = enrichedItinerary.reduce((sum, day) => sum + (day.elevationGain || 0), 0);
    const totalElevationLoss = enrichedItinerary.reduce((sum, day) => sum + (day.elevationLoss || 0), 0);

    return {
      days: Math.max(0, enrichedItinerary.length - 1),
      distance: totalDistance,
      elevationGain: totalElevationGain,
      elevationLoss: totalElevationLoss
    };
  }, [enrichedItinerary]);

  const addAccommodation = (accommodation: TMBAccommodation) => {
    const newDay: ItineraryDay = {
      id: `${Date.now()}-${accommodation.id}`,
      dayNumber: itinerary.length + 1,
      accommodation
    };
    setItinerary([...itinerary, newDay]);
  };

  const removeDay = (dayId: string) => {
    const updatedItinerary = itinerary
      .filter(day => day.id !== dayId)
      .map((day, index) => ({ ...day, dayNumber: index + 1 }));
    setItinerary(updatedItinerary);
  };

  const moveDay = (dayId: string, direction: 'up' | 'down') => {
    const index = itinerary.findIndex(day => day.id === dayId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= itinerary.length) return;

    const newItinerary = [...itinerary];
    [newItinerary[index], newItinerary[newIndex]] = [newItinerary[newIndex], newItinerary[index]];

    // Renumber days
    const renumbered = newItinerary.map((day, idx) => ({ ...day, dayNumber: idx + 1 }));
    setItinerary(renumbered);
  };

  const clearItinerary = () => {
    if (confirm('Clear your entire itinerary? This cannot be undone.')) {
      setItinerary([]);
    }
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

  // Expose addAccommodation to parent component via ref
  useImperativeHandle(ref, () => ({
    addAccommodation
  }));

  const exportAsText = () => {
    let text = '🏔️ MY TMB ITINERARY\n';
    text += '==================\n\n';

    enrichedItinerary.forEach(day => {
      text += `Day ${day.dayNumber}: ${day.accommodation.name}\n`;
      text += `  Type: ${day.accommodation.type}\n`;
      text += `  Location: ${day.accommodation.location_type}\n`;
      if (day.accommodation.altitude) text += `  Altitude: ${day.accommodation.altitude}m\n`;
      if (day.distance && day.distance > 0) {
        text += `  Distance from previous: ${day.distance.toFixed(1)} km\n`;
        text += `  Elevation gain: ${day.elevationGain}m\n`;
        text += `  Estimated time: ${day.estimatedTime}\n`;
      }
      if (day.accommodation.website) text += `  Website: ${day.accommodation.website}\n`;
      if (day.accommodation.phone) text += `  Phone: ${day.accommodation.phone}\n`;
      text += '\n';
    });

    if (totalStats) {
      text += '\n📊 TOTAL STATS\n';
      text += '==============\n';
      text += `Total days: ${totalStats.days}\n`;
      text += `Total distance: ${totalStats.distance.toFixed(1)} km\n`;
      text += `Total elevation gain: ${totalStats.elevationGain.toFixed(0)}m\n`;
      text += `Total elevation loss: ${totalStats.elevationLoss.toFixed(0)}m\n`;
    }

    text += '\n---\nCreated with Trailhead - https://trailhead.at\n';

    // Download as .txt file
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-tmb-itinerary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printItinerary = () => {
    window.print();
  };

  const emailItinerary = () => {
    let body = '🏔️ MY TMB ITINERARY\n\n';

    enrichedItinerary.forEach(day => {
      body += `Day ${day.dayNumber}: ${day.accommodation.name} (${day.accommodation.type})\n`;
      if (day.distance && day.distance > 0) {
        body += `  ${day.distance.toFixed(1)} km, ${day.elevationGain}m ↑, ~${day.estimatedTime}\n`;
      }
      if (day.accommodation.website) body += `  ${day.accommodation.website}\n`;
      body += '\n';
    });

    const subject = 'My Tour du Mont Blanc Itinerary';
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const isAccommodationInItinerary = (accommodationId: number): boolean => {
    return itinerary.some(day => day.accommodation.id === accommodationId);
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #ffffff, #fafafa)',
      borderRadius: '12px',
      border: '1px solid #f3f4f6'
    }}>
      {/* Header */}
      <div
        style={{
          padding: '0.75rem 1rem',
          borderBottom: '1px solid #f3f4f6',
          cursor: 'pointer',
          transition: 'background 0.2s ease'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <div className="itinerary-header-mobile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="itinerary-title-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar style={{ width: '1.25rem', height: '1.25rem', color: 'hsl(208, 70%, 45%)' }} />
            <h3 style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 600,
              fontSize: '1.125rem',
              color: 'var(--ds-foreground)'
            }}>
              Your Itinerary
              {itinerary.length > 0 && (
                <span className="itinerary-count-mobile" style={{
                  marginLeft: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  color: 'var(--ds-muted-foreground)'
                }}>
                  ({itinerary.length} {itinerary.length === 1 ? 'day' : 'days'})
                </span>
              )}
            </h3>
          </div>
          <div className="itinerary-buttons-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {itinerary.length > 0 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowExportMenu(!showExportMenu);
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'hsl(208, 70%, 45%)',
                    color: 'white',
                    fontSize: '0.875rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 500,
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(208, 70%, 40%)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'hsl(208, 70%, 45%)'}
                >
                  <Download style={{ width: '1rem', height: '1rem' }} />
                  Export
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearItinerary();
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#fee2e2',
                    color: '#b91c1c',
                    fontSize: '0.875rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 500,
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                >
                  Clear All
                </button>
              </>
            )}
            {isExpanded ? <ChevronUp style={{ width: '1.25rem', height: '1.25rem', color: 'var(--ds-muted-foreground)' }} /> : <ChevronDown style={{ width: '1.25rem', height: '1.25rem', color: 'var(--ds-muted-foreground)' }} />}
          </div>
        </div>
      </div>

      {/* Export Menu */}
      {showExportMenu && (
        <div style={{
          borderBottom: '1px solid var(--ds-border)',
          background: '#fafafa',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button
              onClick={exportAsText}
              style={{
                padding: '0.5rem 1rem',
                background: 'white',
                border: '1px solid var(--ds-border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <Download style={{ width: '1rem', height: '1rem' }} />
              Download as Text
            </button>
            <button
              onClick={printItinerary}
              style={{
                padding: '0.5rem 1rem',
                background: 'white',
                border: '1px solid var(--ds-border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <Printer style={{ width: '1rem', height: '1rem' }} />
              Print
            </button>
            <button
              onClick={emailItinerary}
              style={{
                padding: '0.5rem 1rem',
                background: 'white',
                border: '1px solid var(--ds-border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <Mail style={{ width: '1rem', height: '1rem' }} />
              Email to Myself
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {isExpanded && (
        <div style={{ padding: '2rem' }}>
          {itinerary.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Calendar style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', color: '#9ca3af' }} />
              <p style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                color: '#6b7280',
                marginBottom: '0.5rem',
                fontSize: '1rem'
              }}>Your itinerary is empty</p>
              <p style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '0.875rem',
                color: '#9ca3af'
              }}>Click the + button on accommodations below to add them to your plan</p>
            </div>
          ) : (
            <>
              {/* Itinerary Days - Condensed */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0rem', marginBottom: '2rem' }}>
                {enrichedItinerary.map((day, index) => (
                  <div key={day.id}>
                    {/* Accommodation Card */}
                    <div
                      style={{
                        background: 'white',
                        border: '1px solid #f3f4f6',
                        borderRadius: '8px',
                        padding: '0.625rem 0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fafafa';
                        e.currentTarget.style.borderColor = 'hsl(208, 70%, 80%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.borderColor = '#f3f4f6';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flex: 1 }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '1.25rem',
                          height: '1.25rem',
                          background: 'hsl(208, 70%, 45%)',
                          color: 'white',
                          fontSize: '0.625rem',
                          fontWeight: 700,
                          borderRadius: '50%',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          flexShrink: 0
                        }}>
                          {day.dayNumber}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            color: 'var(--ds-foreground)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {day.accommodation.name}
                          </div>
                          {day.accommodation.stage && (
                            <div style={{
                              fontFamily: 'Inter, system-ui, sans-serif',
                              fontSize: '0.75rem',
                              color: 'var(--ds-muted-foreground)',
                              marginTop: '0.125rem'
                            }}>
                              Stage {day.accommodation.stage.stage_number}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeDay(day.id)}
                        style={{
                          padding: '0.25rem',
                          borderRadius: '4px',
                          border: 'none',
                          background: 'transparent',
                          color: '#b91c1c',
                          cursor: 'pointer',
                          transition: 'background 0.2s ease',
                          flexShrink: 0
                        }}
                        title="Remove"
                        onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Trash2 style={{ width: '0.875rem', height: '0.875rem' }} />
                      </button>
                    </div>

                    {/* Distance connector between cards */}
                    {index < enrichedItinerary.length - 1 && enrichedItinerary[index + 1].distance && enrichedItinerary[index + 1].distance! > 0 && (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '0.75rem 0',
                        position: 'relative'
                      }}>
                        {(() => {
                          const nextSegment = enrichedItinerary[index + 1];
                          const ascent = Math.round(nextSegment.elevationGain || 0);
                          const descent = Math.round(nextSegment.elevationLoss || 0);
                          const roundedHours = nextSegment.estimatedHours != null
                            ? Math.max(0, Math.round(nextSegment.estimatedHours))
                            : null;

                          return (
                            <>
                        {/* Vertical line */}
                        <div style={{
                          width: '2px',
                          height: '1rem',
                          background: 'linear-gradient(to bottom, #e5e7eb, hsl(145, 60%, 75%))',
                          marginBottom: '0.375rem'
                        }} />

                        {/* Distance info box */}
                        <div style={{
                          background: 'hsl(145, 60%, 97%)',
                          border: '1px solid hsl(145, 60%, 85%)',
                          borderRadius: '6px',
                          padding: '0.5rem 0.75rem',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.75rem',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          color: 'hsl(145, 60%, 30%)',
                          fontWeight: 600,
                          fontFamily: 'Inter, system-ui, sans-serif'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <MapPin style={{ width: '0.75rem', height: '0.75rem' }} />
                            {nextSegment.distance!.toFixed(1)} km
                          </span>
                          <span>↑ {ascent}m</span>
                          <span>↓ {descent}m</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock style={{ width: '0.75rem', height: '0.75rem' }} />
                            {roundedHours !== null ? `~${roundedHours}h` : `~${nextSegment.estimatedTime}`}
                          </span>
                        </div>

                        {/* Vertical line */}
                        <div style={{
                          width: '2px',
                          height: '1rem',
                          background: 'linear-gradient(to bottom, hsl(145, 60%, 75%), #e5e7eb)',
                          marginTop: '0.375rem'
                        }} />
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Total Stats */}
              {totalStats && (
                <div style={{
                  background: 'hsl(145, 60%, 97%)',
                  border: '1px solid hsl(145, 60%, 85%)',
                  borderRadius: '12px',
                  padding: '1.25rem'
                }}>
                  <h4 style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 600,
                    color: 'hsl(145, 60%, 25%)',
                    marginBottom: '0.75rem',
                    fontSize: '1rem'
                  }}>Total Stats</h4>
                  <div className="itinerary-stats-grid-mobile" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '1rem',
                    fontSize: '0.875rem'
                  }}>
                    <div>
                      <span style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        color: 'hsl(145, 60%, 35%)',
                        display: 'block',
                        marginBottom: '0.25rem'
                      }}>Days:</span>
                      <div style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontWeight: 600,
                        color: 'hsl(145, 60%, 25%)',
                        fontSize: '1rem'
                      }}>{totalStats.days}</div>
                    </div>
                    <div>
                      <span style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        color: 'hsl(145, 60%, 35%)',
                        display: 'block',
                        marginBottom: '0.25rem'
                      }}>Distance:</span>
                      <div style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontWeight: 600,
                        color: 'hsl(145, 60%, 25%)',
                        fontSize: '1rem'
                      }}>{totalStats.distance.toFixed(1)} km</div>
                    </div>
                    <div>
                      <span style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        color: 'hsl(145, 60%, 35%)',
                        display: 'block',
                        marginBottom: '0.25rem'
                      }}>Ascent:</span>
                      <div style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontWeight: 600,
                        color: 'hsl(145, 60%, 25%)',
                        fontSize: '1rem'
                      }}>{totalStats.elevationGain.toFixed(0)} m</div>
                    </div>
                    <div>
                      <span style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        color: 'hsl(145, 60%, 35%)',
                        display: 'block',
                        marginBottom: '0.25rem'
                      }}>Descent:</span>
                      <div style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontWeight: 600,
                        color: 'hsl(145, 60%, 25%)',
                        fontSize: '1rem'
                      }}>{totalStats.elevationLoss.toFixed(0)} m</div>
                    </div>
                  </div>
                  <p style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '0.75rem',
                    color: 'hsl(145, 60%, 35%)',
                    marginTop: '0.75rem',
                    lineHeight: '1.4'
                  }}>
                    {trailData
                      ? '* Distances calculated using actual TMB GPX track data. Times use enhanced Naismith\'s rule (5km/h base + 10min/100m ascent + 10min/300m descent) with additional time for off-trail accommodations.'
                      : '* Loading trail data for accurate calculations...'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Add Accommodation Section - Organized by Stage */}
      {isExpanded && (
        <div style={{
          borderTop: '1px solid var(--ds-border)',
          padding: '2rem',
          background: '#fafafa'
        }}>
          <h4 style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 600,
            marginBottom: '0.75rem',
            fontSize: '0.875rem',
            color: 'var(--ds-muted-foreground)'
          }}>Add Accommodations by Stage:</h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {accommodationsByStage.map(stage => (
              <div key={stage.stageNumber} style={{
                background: 'white',
                border: '1px solid var(--ds-border)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                {/* Stage Header */}
                <button
                  onClick={() => toggleStage(stage.stageNumber)}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    background: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: 'var(--ds-foreground)',
                      marginBottom: '0.125rem'
                    }}>
                      Stage {stage.stageNumber}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--ds-muted-foreground)'
                    }}>
                      {stage.stageStart} to {stage.stageEnd} ({stage.accommodations.length} options)
                    </div>
                  </div>
                  {expandedStages.has(stage.stageNumber) ?
                    <ChevronUp style={{ width: '1.125rem', height: '1.125rem', color: 'var(--ds-muted-foreground)' }} /> :
                    <ChevronDown style={{ width: '1.125rem', height: '1.125rem', color: 'var(--ds-muted-foreground)' }} />
                  }
                </button>

                {/* Accommodations List */}
                {expandedStages.has(stage.stageNumber) && (
                  <div style={{
                    borderTop: '1px solid var(--ds-border)',
                    maxHeight: '16rem',
                    overflowY: 'auto'
                  }}>
                    {stage.accommodations.map(accommodation => {
                      const alreadyAdded = isAccommodationInItinerary(accommodation.id);

                      return (
                        <button
                          key={accommodation.id}
                          onClick={() => !alreadyAdded && addAccommodation(accommodation)}
                          disabled={alreadyAdded}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.75rem',
                            borderBottom: '1px solid #f3f4f6',
                            background: alreadyAdded ? '#f3f4f6' : 'white',
                            border: 'none',
                            cursor: alreadyAdded ? 'not-allowed' : 'pointer',
                            opacity: alreadyAdded ? 0.5 : 1,
                            transition: 'all 0.2s ease',
                            display: 'block'
                          }}
                          onMouseEnter={(e) => {
                            if (!alreadyAdded) {
                              e.currentTarget.style.background = 'hsl(208, 60%, 97%)';
                              e.currentTarget.style.borderColor = 'hsl(208, 70%, 45%)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!alreadyAdded) {
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.style.borderColor = '#f3f4f6';
                            }
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{
                                fontFamily: 'Inter, system-ui, sans-serif',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                color: 'var(--ds-foreground)',
                                marginBottom: '0.25rem'
                              }}>{accommodation.name}</div>
                              <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--ds-muted-foreground)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                flexWrap: 'wrap'
                              }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  padding: '0.125rem 0.375rem',
                                  borderRadius: '3px',
                                  fontSize: '0.625rem',
                                  fontWeight: 600,
                                  background: accommodation.type === 'Refuge' ? 'hsl(145, 60%, 95%)' :
                                            accommodation.type === 'Hotel' ? 'hsl(208, 60%, 95%)' :
                                            accommodation.type === 'B&B' ? 'hsl(270, 60%, 95%)' :
                                            'hsl(30, 60%, 95%)',
                                  color: accommodation.type === 'Refuge' ? 'hsl(145, 60%, 35%)' :
                                        accommodation.type === 'Hotel' ? 'hsl(208, 60%, 35%)' :
                                        accommodation.type === 'B&B' ? 'hsl(270, 60%, 35%)' :
                                        'hsl(30, 60%, 35%)'
                                }}>
                                  {accommodation.type}
                                </span>
                                <span style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                                  {accommodation.location_type}
                                </span>
                              </div>
                            </div>
                            {!alreadyAdded && (
                              <Plus style={{ width: '1.25rem', height: '1.25rem', color: 'hsl(208, 70%, 45%)', flexShrink: 0, marginLeft: '0.5rem' }} />
                            )}
                            {alreadyAdded && (
                              <span style={{
                                fontSize: '0.75rem',
                                color: 'var(--ds-muted-foreground)',
                                fontFamily: 'Inter, system-ui, sans-serif',
                                flexShrink: 0,
                                marginLeft: '0.5rem'
                              }}>Added</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

ItineraryBuilder.displayName = 'ItineraryBuilder';

export default ItineraryBuilder;
