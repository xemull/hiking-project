'use client';

import React, { useEffect, useRef } from 'react';

export default function Comments({ hikeId }) {
  const commentBox = useRef(null);

  useEffect(() => {
    // Prevent the script from being added multiple times
    if (document.getElementById('hyvor-talk-embed-script')) {
      return;
    }

    // 1. Load the script that registers the Web Component
    const script = document.createElement('script');
    script.id = 'hyvor-talk-embed-script';
    script.src = 'https://talk.hyvor.com/embed/embed.js';
    script.type = 'module';
    document.head.appendChild(script);

  }, []); // The empty array ensures this effect runs only once

  return (
    <div style={{ marginTop: '3rem' }}>
      {/* This is the custom element from the Hyvor Talk docs.
          React can render it like any other HTML tag. */}
      <hyvor-talk-comments 
        website-id="13722" 
        page-id={`hike-${hikeId}`} 
      />
    </div>
  );
}