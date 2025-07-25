// Alternative: src/app/components/HikeCard.tsx (if the ImageWithFallback doesn't work)
import type { HikeSummary } from '../../types';
import Image from 'next/image';
import Link from 'next/link';

export default function HikeCard({ hike }: { hike: HikeSummary }) {
  const { id, documentId, title, Length, Difficulty, countries, mainImage, hike_id } = hike;
  
  const countryName = countries?.[0]?.name || 'N/A';
  const imageUrl = mainImage?.url ? `http://localhost:1337${mainImage.url}` : null;
  
  // Use hike_id (GPX ID) for linking to custom backend
  const linkId = hike_id;
  
  // Debug logging - remove after testing
  console.log('HikeCard linking:', { strapiId: id, hikeId: hike_id, title });

  return (
    <Link href={`/hike/${linkId}`} className="block group h-full">
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
            <p className="text-gray-600 mb-4">{countryName}</p>
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