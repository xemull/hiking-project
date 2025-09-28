'use client';

import dynamic from 'next/dynamic';

// This dynamically imports your ElevationProfile component with SSR turned off
const ElevationProfile = dynamic(() => import('./ElevationProfile'), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-100 rounded-lg flex items-center justify-center p-4" style={{ height: '320px' }}>
      <div className="text-center text-gray-600">
        <svg className="w-8 h-8 mx-auto mb-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <p className="text-sm">Loading elevation chart...</p>
      </div>
    </div>
  )
});

export default ElevationProfile;