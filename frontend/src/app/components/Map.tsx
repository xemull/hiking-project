// Add this debug version of your Map component to check data flow

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

export default function DebugMap({ track, className = '', height = '400px' }: MapProps) {
  const [mapComponents, setMapComponents] = useState<any>(null);
  const [leaflet, setLeaflet] = useState<any>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);


  // Process track data
  const processedTrack = useMemo(() => {
    console.log('Processing track data...');
    
    if (!track?.coordinates || track.coordinates.length === 0) {
      console.log('No coordinates found');
      return null;
    }

    console.log('Track coordinates structure:', track.coordinates[0]);
    
    // Check if coordinates are in the right format
    const firstCoord = track.coordinates[0];
    if (!Array.isArray(firstCoord) || firstCoord.length < 2) {
      console.error('Invalid coordinate format:', firstCoord);
      return null;
    }

    // Convert GeoJSON [lon, lat] to Leaflet [lat, lon] format
    const positions = track.coordinates.map(coord => {
      if (!Array.isArray(coord) || coord.length < 2) {
        console.warn('Invalid coordinate:', coord);
        return [0, 0] as [number, number];
      }
      return [coord[1], coord[0]] as [number, number];
    });
    
    console.log('Processed positions:', positions.slice(0, 3)); // First 3 positions
    
    // Calculate bounds for better initial view
    const lats = positions.map(pos => pos[0]);
    const lngs = positions.map(pos => pos[1]);
    const rawMinLat = Math.min(...lats);
    const rawMaxLat = Math.max(...lats);
    const rawMinLng = Math.min(...lngs);
    const rawMaxLng = Math.max(...lngs);

    // Add padding (roughly 10% on each side)
    const latPadding = (rawMaxLat - rawMinLat) * 0.1;
    const lngPadding = (rawMaxLng - rawMinLng) * 0.1;

    const minLat = rawMinLat - latPadding;
    const maxLat = rawMaxLat + latPadding;
    const minLng = rawMinLng - lngPadding;
    const maxLng = rawMaxLng + lngPadding;
    
    // Calculate center point
    const center: [number, number] = [
      (minLat + maxLat) / 2,
      (minLng + maxLng) / 2
    ];
    
    console.log('Map center calculated:', center);
    console.log('Bounds:', { minLat, maxLat, minLng, maxLng });
    
    return {
      positions,
      center,
      start: positions[0],
      end: positions[positions.length - 1],
      totalPoints: positions.length,
      bounds: { minLat, maxLat, minLng, maxLng }
    };
  }, [track?.coordinates]);

  // Load map components
  useEffect(() => {
    const loadMapComponents = async () => {
      try {
        console.log('Loading map components...');
        
        const [reactLeaflet, L] = await Promise.all([
          import('react-leaflet'),
          import('leaflet')
        ]);

        console.log('Map components loaded successfully');

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
        console.log('Map components set successfully');
      } catch (error) {
        console.error('Failed to load map components:', error);
        setDebugInfo(prev => prev + '\nMap load error: ' + error.message);
      }
    };

    loadMapComponents();
  }, []);

  // Debug render states
  if (!processedTrack) {
    return (
      <div 
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-sm font-medium">No GPS track available</p>
          <p className="text-xs text-gray-500">GPS coordinates not found</p>
        </div>
      </div>
    );
  }

  if (!mapComponents || !leaflet) {
    return (
      <div 
        className={`bg-gray-100 rounded-lg flex flex-col items-center justify-center p-4 ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-600 mb-4">
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
        bounds={[[processedTrack.bounds.minLat, processedTrack.bounds.minLng], [processedTrack.bounds.maxLat, processedTrack.bounds.maxLng]]}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        className="z-0"
        whenCreated={(mapInstance) => {
          setMapInstance(mapInstance);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Polyline 
          positions={processedTrack.positions}
          color="#3b82f6"
          weight={4}
          opacity={0.8}
          lineCap="round"
          lineJoin="round"
        />
        
        <Marker position={processedTrack.start} icon={startIcon}>
          <Popup>Trail Start</Popup>
        </Marker>
        
        <Marker position={processedTrack.end} icon={endIcon}>
          <Popup>Trail End</Popup>
        </Marker>
      </MapContainer>

    </div>
  );
}