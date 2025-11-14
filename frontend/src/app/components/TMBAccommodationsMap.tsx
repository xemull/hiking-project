// src/app/components/TMBAccommodationsMap.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { TMBAccommodation, TMBTrailData } from '../services/api';

interface TMBAccommodationsMapProps {
  trailData: TMBTrailData | null;
  accommodations: TMBAccommodation[];
  selectedAccommodation?: TMBAccommodation | null;
  onAccommodationSelect?: (accommodation: TMBAccommodation | null) => void;
  distanceMode?: boolean;
  selectedForDistance?: TMBAccommodation[];
  onDistanceSelect?: (accommodation: TMBAccommodation) => void;
  onAddToItinerary?: (accommodation: TMBAccommodation) => void;
  className?: string;
  height?: string;
}

export default function TMBAccommodationsMap({
  trailData,
  accommodations,
  selectedAccommodation,
  onAccommodationSelect,
  distanceMode = false,
  selectedForDistance = [],
  onDistanceSelect,
  onAddToItinerary,
  className = '',
  height = '500px'
}: TMBAccommodationsMapProps) {
  const [mapComponents, setMapComponents] = useState<any>(null);
  const [leaflet, setLeaflet] = useState<any>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  // Process trail data for map
  const processedTrail = useMemo(() => {
    if (!trailData?.track?.coordinates || trailData.track.coordinates.length === 0) {
      // If no trail data, calculate center from accommodations
      if (accommodations.length > 0) {
        const lats = accommodations.map(acc => acc.latitude);
        const lngs = accommodations.map(acc => acc.longitude);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        return {
          positions: null,
          center: [(minLat + maxLat) / 2, (minLng + maxLng) / 2] as [number, number],
          bounds: {
            minLat: minLat - 0.1,
            maxLat: maxLat + 0.1,
            minLng: minLng - 0.1,
            maxLng: maxLng + 0.1
          }
        };
      }
      return null;
    }

    // Convert GeoJSON [lon, lat] to Leaflet [lat, lon] format
    const positions = trailData.track.coordinates.map(coord => [coord[1], coord[0]] as [number, number]);

    // Calculate bounds
    const lats = positions.map(pos => pos[0]);
    const lngs = positions.map(pos => pos[1]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Add padding to bounds
    const latPadding = (maxLat - minLat) * 0.1;
    const lngPadding = (maxLng - minLng) * 0.1;

    return {
      positions,
      center: [(minLat + maxLat) / 2, (minLng + maxLng) / 2] as [number, number],
      bounds: {
        minLat: minLat - latPadding,
        maxLat: maxLat + latPadding,
        minLng: minLng - lngPadding,
        maxLng: maxLng + lngPadding
      }
    };
  }, [trailData, accommodations]);

  // Dynamically import react-leaflet and leaflet
  useEffect(() => {
    const loadMapComponents = async () => {
      try {
        const [reactLeaflet, L] = await Promise.all([
          import('react-leaflet'),
          import('leaflet')
        ]);

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Create accommodation icons with stage numbers
        const createAccommodationIcon = (type: string, stageNumber: number | undefined, isSelected: boolean = false) => {
          const size = isSelected ? 32 : 28;
          const fontSize = isSelected ? 14 : 12;

          // Color based on accommodation type instead of stage
          const typeColors: { [key: string]: string } = {
            'Refuge': '#2563eb', // blue
            'Hotel': '#dc2626', // red
            'Gite': '#16a34a', // green
            'Camping': '#ea580c', // orange
            'B&B': '#9333ea' // purple
          };

          const bgColor = typeColors[type] || '#6b7280'; // grey default

          const html = `
            <div style="
              position: relative;
              width: ${size}px;
              height: ${size}px;
            ">
              <div style="
                width: 100%;
                height: 100%;
                background: ${bgColor};
                border: 3px solid white;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <span style="
                  transform: rotate(45deg);
                  color: white;
                  font-weight: 700;
                  font-size: ${fontSize}px;
                  font-family: 'Inter', system-ui, sans-serif;
                  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                ">${stageNumber || '?'}</span>
              </div>
            </div>
          `;

          return new L.DivIcon({
            html,
            className: 'custom-marker-icon',
            iconSize: [size, size],
            iconAnchor: [size / 2, size],
            popupAnchor: [0, -size]
          });
        };

        setMapComponents({
          MapContainer: reactLeaflet.MapContainer,
          TileLayer: reactLeaflet.TileLayer,
          Polyline: reactLeaflet.Polyline,
          Marker: reactLeaflet.Marker,
          Popup: reactLeaflet.Popup,
          createAccommodationIcon
        });
        setLeaflet(L);
      } catch (error) {
        console.error('Failed to load map components:', error);
      }
    };

    loadMapComponents();
  }, []);

  // Auto-fit map bounds
  useEffect(() => {
    if (!mapInstance || !processedTrail || !leaflet) return;

    setTimeout(() => {
      const bounds = leaflet.latLngBounds(processedTrail.positions);

      // Include accommodation markers in bounds
      accommodations.forEach(acc => {
        bounds.extend([acc.latitude, acc.longitude]);
      });

      mapInstance.fitBounds(bounds, {
        padding: [20, 20],
        maxZoom: 12
      });
    }, 100);
  }, [mapInstance, processedTrail, accommodations, leaflet]);

  // Re-center map when accommodation is selected
  useEffect(() => {
    if (!mapInstance || !leaflet || !selectedAccommodation) return;

    setTimeout(() => {
      // Smooth pan to the selected accommodation
      mapInstance.setView(
        [selectedAccommodation.latitude, selectedAccommodation.longitude],
        12, // zoom level
        {
          animate: true,
          duration: 0.5 // animation duration in seconds
        }
      );
    }, 100);
  }, [selectedAccommodation, mapInstance, leaflet]);

  if (!processedTrail) {
    return (
      <div 
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-600">
          <p className="text-sm font-medium">No trail data available</p>
        </div>
      </div>
    );
  }

  if (!mapComponents || !leaflet) {
    return (
      <div 
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-600">
          <div className="loading-spinner mb-sm"></div>
          <p className="text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Polyline, Marker, Popup, createAccommodationIcon } = mapComponents;

  return (
    <div className={`rounded-lg overflow-hidden shadow-sm border relative ${className}`} style={{ height }}>
      <MapContainer
        center={processedTrail.center}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        className="z-0"
        whenCreated={setMapInstance}
      >
        {/* Base map tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Trail polyline - only show if trail data exists */}
        {processedTrail.positions && (
          <Polyline
            positions={processedTrail.positions}
            color="#ef4444"
            weight={3}
            opacity={0.8}
            lineCap="round"
            lineJoin="round"
          />
        )}
        
        {/* Accommodation markers */}
        {accommodations.map(accommodation => {
          const isSelected = selectedAccommodation?.id === accommodation.id;
          const isSelectedForDistance = selectedForDistance.some(acc => acc.id === accommodation.id);
          const distanceSelectionNumber = selectedForDistance.findIndex(acc => acc.id === accommodation.id) + 1;
          
          return (
            <Marker
              key={accommodation.id}
              position={[accommodation.latitude, accommodation.longitude]}
              icon={createAccommodationIcon(
                accommodation.type,
                accommodation.stage?.stage_number,
                isSelected || isSelectedForDistance
              )}
              eventHandlers={{
                click: () => {
                  if (distanceMode && onDistanceSelect) {
                    onDistanceSelect(accommodation);
                  } else {
                    onAccommodationSelect?.(accommodation);
                  }
                }
              }}
            >
              <Popup>
                <div style={{ minWidth: '280px', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'var(--ds-foreground)',
                        lineHeight: 1.2,
                        margin: 0
                      }}>
                        {accommodation.name}
                      </h4>
                      {accommodation.website && (
                        <a
                          href={accommodation.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            color: 'hsl(208, 70%, 45%)',
                            textDecoration: 'none'
                          }}
                          title="Visit website"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                      )}
                    </div>

                    {/* Stage Reference - Same as right panel */}
                    {accommodation.stage && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ds-muted-foreground)', flexShrink: 0 }}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span style={{
                          fontFamily: 'Inter, system-ui, sans-serif',
                          fontSize: '0.875rem',
                          color: 'var(--ds-muted-foreground)',
                          lineHeight: 1.5
                        }}>
                          Stage {accommodation.stage.stage_number}: {accommodation.stage.start_location} to {accommodation.stage.end_location}
                        </span>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
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
                      {isSelectedForDistance && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '1.25rem',
                          height: '1.25rem',
                          background: 'hsl(208, 70%, 45%)',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          borderRadius: '50%'
                        }}>
                          {distanceSelectionNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.875rem', color: 'var(--ds-muted-foreground)', marginBottom: '0.75rem' }}>
                    {accommodation.altitude && (
                      <div style={{ marginBottom: '0.25rem' }}>
                        <strong>Altitude:</strong> {accommodation.altitude}m
                      </div>
                    )}
                    {accommodation.price_range && (
                      <div style={{
                        color: 'hsl(145, 60%, 35%)',
                        fontWeight: 600,
                        marginBottom: '0.25rem'
                      }}>
                        {accommodation.price_range}
                      </div>
                    )}
                  </div>

                  {accommodation.notes && (
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'var(--ds-foreground)',
                      marginTop: '0.75rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--ds-border)',
                      lineHeight: 1.5
                    }}>
                      {accommodation.notes}
                    </p>
                  )}

                  {!distanceMode && onAddToItinerary && (
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--ds-border)' }}>
                      <button
                        onClick={() => onAddToItinerary(accommodation)}
                        style={{
                          width: '100%',
                          padding: '0.375rem 0.75rem',
                          background: 'var(--ds-accent)',
                          color: 'var(--ds-accent-foreground)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '0.9';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                      >
                        + Add to Itinerary
                      </button>
                    </div>
                  )}

                  {distanceMode && (
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--ds-border)' }}>
                      <button
                        onClick={() => onDistanceSelect?.(accommodation)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          background: 'hsl(208, 70%, 45%)',
                          color: 'white',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {isSelectedForDistance ? 'Remove from Distance Calc' : 'Add to Distance Calc'}
                      </button>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

    </div>
  );
}