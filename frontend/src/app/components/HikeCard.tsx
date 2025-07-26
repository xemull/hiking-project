// src/app/components/HikeCard.tsx
import type { HikeSummary } from '../../types';
import Image from 'next/image';
import Link from 'next/link';
import { createSlug } from '../services/api';

export default function HikeCard({ hike }: { hike: HikeSummary }) {
  const { id, documentId, title, Length, Difficulty, countries, mainImage, hike_id } = hike;
  
  // Handle multiple countries like we did in the detail page
  const countryNames = countries?.map(country => country.name) || [];
  const countryDisplay = countryNames.length > 0 
    ? countryNames.length === 1 
      ? countryNames[0]
      : countryNames.length === 2
        ? countryNames.join(' & ')
        : `${countryNames.slice(0, -1).join(', ')} & ${countryNames[countryNames.length - 1]}`
    : '';
    
  const imageUrl = mainImage?.url ? `http://localhost:1337${mainImage.url}` : null;
  
  // Create slug from title for URL
  const slug = createSlug(title);
  
  // Debug logging
  console.log('HikeCard linking:', { title, slug, hikeId: hike_id });

  return (
    <Link href={`/hike/${slug}`} className="block group h-full">
      <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        
        {/* Image or Placeholder */}
        <div className="relative w-full h-48 flex-shrink-0">
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={`Image of ${title}`} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">No Image</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {title}
            </h3>
            {countryDisplay && <p className="text-gray-600 mb-4">{countryDisplay}</p>}
          </div>
          
          <div className="flex justify-between items-center text-sm mt-auto">
            {Length && <span className="font-semibold">{Length} km</span>}
            {Difficulty && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {Difficulty}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}