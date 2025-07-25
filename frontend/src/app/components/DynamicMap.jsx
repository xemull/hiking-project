'use client';

import dynamic from 'next/dynamic';

// This dynamically imports your Map component with SSR (Server-Side Rendering) turned off.
const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <p>Loading map...</p> // Optional: a placeholder while the map loads
});

export default Map;