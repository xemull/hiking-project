// src/app/components/CommentsSection.tsx
'use client';

import { useEffect } from 'react';

interface CommentsSectionProps {
  hikeId: string | number;
  hikeTitle: string;
}

export default function CommentsSection({ hikeId, hikeTitle }: CommentsSectionProps) {
  useEffect(() => {
    // Check if Hyvor Talk is already loaded
    if (document.getElementById('hyvor-talk-script')) {
      return;
    }

    // Load Hyvor Talk script dynamically
    const script = document.createElement('script');
    script.id = 'hyvor-talk-script';
    script.src = 'https://talk.hyvor.com/web-api/embed.js';
    script.async = true;
    
    // Set Hyvor Talk configuration as global variables
    window.HYVOR_TALK_WEBSITE = 13722; // Your website ID
    window.HYVOR_TALK_CONFIG = {
      id: `hike-${hikeId}`, // Unique page ID
      title: hikeTitle, // Page title
      url: `${window.location.origin}/hike/${hikeId}`, // Page URL
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup when component unmounts
      const existingScript = document.getElementById('hyvor-talk-script');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [hikeId, hikeTitle]);

  return (
    <section>
      <h2 className="text-3xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">
        Comments & Discussion
      </h2>
      
      <div className="prose prose-lg max-w-none">
        {/* Hyvor Talk will inject comments here */}
        <div id="hyvor-talk-view"></div>
      </div>
    </section>
  );
}

// TypeScript declaration for Hyvor Talk global variables
declare global {
  interface Window {
    HYVOR_TALK_WEBSITE: number;
    HYVOR_TALK_CONFIG: {
      id: string;
      title: string;
      url: string;
    };
  }
}