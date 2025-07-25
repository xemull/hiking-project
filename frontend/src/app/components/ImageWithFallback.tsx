// src/app/components/ImageWithFallback.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  className?: string;
}

export default function ImageWithFallback({ 
  src, 
  alt, 
  fill, 
  sizes, 
  style, 
  priority, 
  className 
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError || !src) {
    return (
      <div 
        className={`bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center ${className || ''}`}
        style={fill ? { ...style, position: 'absolute', inset: 0 } : style}
      >
        <div className="text-center text-gray-600">
          <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <p className="text-sm">No Image</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      style={style}
      priority={priority}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}