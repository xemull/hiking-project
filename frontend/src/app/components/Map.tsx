// src/app/components/Map.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';

interface TrackData {
  coordinates?: Array<[number, number]>; // [longitude, latitude] format
  type?: string;
}

interface MapProps {
  track: TrackData;
  className?: string;
  height?: string;
}

// Component to handle map logic and auto-fitting
function MapController({ track, map }: { track: TrackData; map: any }) {
  useEffect(() => {
    if (!map || !track?.coordinates || track.coordinates.length === 0) return;

    // Dynamic import L inside useEffect
    import('leaflet').then((L) => {
      // Convert GeoJSON [lon, lat] to Leaflet [lat, lon]
      const positions = track.coordinates!.map(coord => [coord[1], coord[0]] as [number, number]);
      
      // Create bounds and fit map with more generous padding
      const bounds = L.latLngBounds(positions);
      
      // Use setTimeout to ensure map is fully rendered before fitting bounds
      setTimeout(() => {
        map.fitBounds(bounds, { 
          padding: [50, 50], // Increased padding
          maxZoom: 14 // Reduced max zoom to show more area
        });
      }, 100);
    });
  }, [track, map]);

  return null;
}

// Main Map component
export default function Map({ track, className = '', height = '400px' }: MapProps) {
  const [mapComponents, setMapComponents] = useState<any>(null);
  const [leaflet, setLeaflet] = useState<any>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  // Process track data - ALWAYS call useMemo before any early returns
  const processedTrack = useMemo(() => {
    if (!track?.coordinates || track.coordinates.length === 0) {
      return null;
    }

    // Convert GeoJSON [lon, lat] to Leaflet [lat, lon] format
    const positions = track.coordinates.map(coord => [coord[1], coord[0]] as [number, number]);
    
    // Calculate bounds for better initial view
    const lats = positions.map(pos => pos[0]);
    const lngs = positions.map(pos => pos[1]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    // Add padding to bounds
    const latPadding = (maxLat - minLat) * 0.1; // 10% padding
    const lngPadding = (maxLng - minLng) * 0.1;
    
    // Calculate center point
    const center: [number, number] = [
      (minLat + maxLat) / 2,
      (minLng + maxLng) / 2
    ];
    
    return {
      positions,
      center,
      start: positions[0],
      end: positions[positions.length - 1],
      totalPoints: positions.length,
      bounds: {
        minLat: minLat - latPadding,
        maxLat: maxLat + latPadding,
        minLng: minLng - lngPadding,
        maxLng: maxLng + lngPadding
      }
    };
  }, [track?.coordinates]);

  // Dynamically import react-leaflet and leaflet only on client side
  useEffect(() => {
    const loadMapComponents = async () => {
      try {
        // Import all needed components
        const [reactLeaflet, L] = await Promise.all([
          import('react-leaflet'),
          import('leaflet')
        ]);

        // Fix for default markers in Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Create custom icons
        const startIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        const endIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        setMapComponents({
          MapContainer: reactLeaflet.MapContainer,
          TileLayer: reactLeaflet.TileLayer,
          Polyline: reactLeaflet.Polyline,
          Marker: reactLeaflet.Marker,
          Popup: reactLeaflet.Popup,
          startIcon,
          endIcon
        });
        setLeaflet(L);
      } catch (error) {
        console.error('Failed to load map components:', error);
      }
    };

    loadMapComponents();
  }, []);

  // Early return for no track data - AFTER all hooks
  if (!processedTrack) {
    return (
      <div 
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-600">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-sm font-medium">No GPS track available</p>
          <p className="text-xs text-gray-500">GPS coordinates not found</p>
        </div>
      </div>
    );
  }

  // Show loading state while components are loading - AFTER all hooks
  if (!mapComponents || !leaflet) {
    return (
      <div 
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-600">
          <svg className="w-8 h-8 mx-auto mb-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <p className="text-sm">Loading interactive map...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Polyline, Marker, Popup, startIcon, endIcon } = mapComponents;

  return (
    <div className={`rounded-lg overflow-hidden shadow-sm border relative ${className}`} style={{ height }}>
      <MapContainer
        center={processedTrack.center}
        zoom={8} // Start with lower zoom level
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
          positions={processedTrack.positions}
          color="#3b82f6" // Blue color
          weight={4}
          opacity={0.8}
          lineCap="round"
          lineJoin="round"
        />
        
        {/* Start marker */}
        <Marker position={processedTrack.start} icon={startIcon}>
          <Popup>
            <div className="text-center">
              <strong className="text-green-700">Trail Start</strong>
              <br />
              <span className="text-sm text-gray-600">
                {processedTrack.start[0].toFixed(4)}, {processedTrack.start[1].toFixed(4)}
              </span>
            </div>
          </Popup>
        </Marker>
        
        {/* End marker */}
        <Marker position={processedTrack.end} icon={endIcon}>
          <Popup>
            <div className="text-center">
              <strong className="text-red-700">Trail End</strong>
              <br />
              <span className="text-sm text-gray-600">
                {processedTrack.end[0].toFixed(4)}, {processedTrack.end[1].toFixed(4)}
              </span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Map controller for auto-fitting */}
      {mapInstance && <MapController track={track} map={mapInstance} />}
      
      {/* Map info overlay */}
      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-gray-600 shadow-sm z-10">
        {processedTrack.totalPoints.toLocaleString()} GPS points
      </div>
    </div>
  );
}