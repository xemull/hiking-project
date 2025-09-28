'use client';

import { clearCache } from '../services/api';

export default function CacheClearButton() {
  const handleClearCache = async () => {
    await clearCache();
    window.location.reload();
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <button
      onClick={handleClearCache}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        padding: '10px 15px',
        background: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '12px',
        cursor: 'pointer',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}
    >
      🗑️ Clear Cache
    </button>
  );
}