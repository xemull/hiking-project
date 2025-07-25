// src/app/components/VideoEmbed.tsx
'use client';

import { useState } from 'react';

interface VideoEmbedProps {
  video: {
    id: number;
    title: string;
    youtube_url: string;
  };
}

// Helper function to get YouTube video ID from URL
function getYouTubeId(url: string | null) {
  if (!url) return null;
  const regExp = /^.*(youtube\.com\/watch\?v=|v\/|u\/\w\/|embed\/|youtu\.be\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Helper function to get YouTube thumbnail URL
function getYouTubeThumbnail(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export default function VideoEmbed({ video }: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = getYouTubeId(video.youtube_url);

  if (!videoId) return null;

  const thumbnailUrl = getYouTubeThumbnail(videoId);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
      {!isPlaying ? (
        // Thumbnail with play button
        <div 
          className="relative cursor-pointer group"
          onClick={() => setIsPlaying(true)}
        >
          <div className="aspect-video relative">
            <img
              src={thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            
            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <div className="bg-red-600 group-hover:bg-red-700 transition-colors rounded-full p-3 shadow-lg">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="p-3">
            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm leading-tight">
              {video.title}
            </h4>
          </div>
        </div>
      ) : (
        // Embedded iframe
        <div>
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          
          <div className="p-3 flex items-center justify-between">
            <h4 className="font-medium text-gray-900 text-sm leading-tight">
              {video.title}
            </h4>
            <button
              onClick={() => setIsPlaying(false)}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}