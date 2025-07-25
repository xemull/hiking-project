// src/app/components/ElevationProfile.tsx
'use client';

interface ElevationProfileProps {
  data: Array<[number, number]> | Array<{
    distance: number;
    elevation: number;
  }>;
}

export default function ElevationProfile({ data }: ElevationProfileProps) {
  const dataPoints = Array.isArray(data) ? data.length : 0;
  
  return (
    <div className="w-full h-full bg-white flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
      <div className="text-center text-gray-600">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="text-lg font-medium mb-2">Elevation Profile</h3>
        <p className="text-sm">
          Elevation chart with {dataPoints} data points
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Chart component will be implemented here
        </p>
      </div>
    </div>
  );
}