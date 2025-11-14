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

  const styles = {
    sectionTitle: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '1.75rem',
      fontWeight: 600,
      color: 'var(--ds-foreground)',
      marginBottom: '1.5rem',
      paddingBottom: '0.75rem',
      borderBottom: '2px solid var(--ds-border)'
    }
  };

  return (
    <section>
      <h2 style={styles.sectionTitle}>
        Comments & Discussion
      </h2>
      
      <div style={{ 
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '1rem',
        lineHeight: 1.7,
        color: '#4a5568'
      }}>
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