// src/app/components/Map.tsx
'use client';

interface MapProps {
  track: {
    points: Array<{ lat: number; lng: number; elevation?: number }>;
    bounds?: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  };
}

export default function Map({ track }: MapProps) {
  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
      <div className="text-center text-gray-600">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <h3 className="text-lg font-medium mb-2">Interactive Map</h3>
        <p className="text-sm">
          Trail map with {track.points?.length || 0} GPS points
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Install react-leaflet to enable interactive maps
        </p>
        <div className="mt-4 text-xs bg-gray-200 rounded p-2 text-left">
          <code>npm install react-leaflet leaflet</code>
        </div>
      </div>
    </div>
  );
}