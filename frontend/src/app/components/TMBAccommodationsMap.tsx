// src/app/components/TMBAccommodationsMap.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { TMBAccommodation, TMBTrailData } from '../services/api';

interface TMBAccommodationsMapProps {
  trailData: TMBTrailData;
  accommodations: TMBAccommodation[];
  selectedAccommodation?: TMBAccommodation | null;
  onAccommodationSelect?: (accommodation: TMBAccommodation | null) => void;
  distanceMode?: boolean;
  selectedForDistance?: TMBAccommodation[];
  onDistanceSelect?: (accommodation: TMBAccommodation) => void;
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
  className = '', 
  height = '500px' 
}: TMBAccommodationsMapProps) {
  const [mapComponents, setMapComponents] = useState<any>(null);
  const [leaflet, setLeaflet] = useState<any>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  // Process trail data for map
  const processedTrail = useMemo(() => {
    if (!trailData?.track?.coordinates || trailData.track.coordinates.length === 0) {
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
  }, [trailData]);

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

        // Create accommodation type icons
        const createAccommodationIcon = (type: string, isSelected: boolean = false) => {
          const colors = {
            Refuge: isSelected ? '#059669' : '#10b981',
            Hotel: isSelected ? '#2563eb' : '#3b82f6', 
            'B&B': isSelected ? '#7c3aed' : '#8b5cf6',
            Campsite: isSelected ? '#ea580c' : '#f97316'
          };
          
          const color = colors[type as keyof typeof colors] || '#6b7280';
          
          return new L.Icon({
            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${isSelected ? 'red' : 'blue'}.png`,
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
            iconSize: isSelected ? [30, 49] : [25, 41],
            iconAnchor: isSelected ? [15, 49] : [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
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
        
        {/* Trail polyline */}
        <Polyline 
          positions={processedTrail.positions}
          color="#ef4444"
          weight={3}
          opacity={0.8}
          lineCap="round"
          lineJoin="round"
        />
        
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
                <div className="min-w-64">
                  <div className="flex items-start justify-between mb-sm">
                    <h4 className="font-semibold text-sm">{accommodation.name}</h4>
                    <div className="flex items-center space-x-1 ml-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        accommodation.type === 'Refuge' ? 'bg-green-100 text-green-800' :
                        accommodation.type === 'Hotel' ? 'bg-blue-100 text-blue-800' :
                        accommodation.type === 'B&B' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {accommodation.type}
                      </span>
                      {isSelectedForDistance && (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full">
                          {distanceSelectionNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>{accommodation.location_type}</div>
                    {accommodation.altitude && <div>Altitude: {accommodation.altitude}m</div>}
                    {accommodation.price_range && <div className="text-green-600 font-medium">{accommodation.price_range}</div>}
                    {accommodation.stage && <div className="bg-gray-100 px-1 py-0.5 rounded">{accommodation.stage.name}</div>}
                  </div>
                  
                  {accommodation.notes && (
                    <p className="text-xs text-gray-700 mt-sm border-t pt-sm">{accommodation.notes}</p>
                  )}
                  
                  <div className="mt-sm pt-sm border-t flex space-x-sm text-xs">
                    {accommodation.website && (
                      <a 
                        href={accommodation.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Website
                      </a>
                    )}
                    {accommodation.phone && (
                      <a 
                        href={`tel:${accommodation.phone}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Call
                      </a>
                    )}
                  </div>
                  
                  {distanceMode && (
                    <div className="mt-sm pt-sm border-t">
                      <button
                        onClick={() => onDistanceSelect?.(accommodation)}
                        className="w-full px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
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

      {/* Map legend */}
      <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm rounded px-sm py-xs text-xs shadow-sm z-10">
        <div className="flex items-center space-x-md">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-xs"></div>
            <span>TMB Trail</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-xs"></div>
            <span>Accommodations</span>
          </div>
        </div>
      </div>
      
      {/* Accommodation count */}
      <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm rounded px-sm py-xs text-xs shadow-sm z-10">
        {accommodations.length} accommodations
      </div>
    </div>
  );
}