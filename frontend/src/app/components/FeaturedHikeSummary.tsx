// src/app/components/FeaturedHikeSummary.tsx
import type { HikeSummary } from '../../types';
import Link from 'next/link';
import Image from 'next/image';

export default function FeaturedHikeSummary({ hike }: { hike: HikeSummary }) {
  const { id, title, Length, Difficulty, countries, mainImage, Description, hike_id } = hike;

  const imageUrl = mainImage?.url ? `http://localhost:1337${mainImage.url}` : '';
  const countryName = countries?.[0]?.name || 'Unknown';
  
  // Use hike_id (GPX ID) for linking to custom backend
  const linkId = hike_id;
  
  // Debug logging - remove after testing
  console.log('FeaturedHike linking:', { strapiId: id, hikeId: hike_id, title });

  // Extract description text from Strapi rich text format
  const getDescriptionPreview = (description: any) => {
    if (!description || !Array.isArray(description)) return '';
    
    let text = '';
    for (const block of description) {
      if (block?.children && Array.isArray(block.children)) {
        for (const child of block.children) {
          if (child?.text) {
            text += child.text + ' ';
          }
        }
      }
    }
    
    // Return first 200 characters with word boundary
    if (text.length > 200) {
      return text.substring(0, 200).split(' ').slice(0, -1).join(' ') + '...';
    }
    return text.trim();
  };

  const descriptionPreview = getDescriptionPreview(Description);

  return (
    <Link href={`/hike/${linkId}`} className="block group border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 mb-12">
      <div className="md:flex">
        {/* Image Section */}
        <div className="md:w-1/2 relative min-h-64">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`Image of ${title}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              priority={true}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">No Image</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Text Content Section */}
        <div className="md:w-1/2 p-6 flex flex-col justify-center">
          <h3 className="text-3xl font-bold mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
          <p className="text-gray-700 mb-4">{countryName}</p>
          
          {descriptionPreview && (
            <p className="text-gray-600 mb-4 leading-relaxed text-sm">
              {descriptionPreview}
            </p>
          )}
          
          <div className="flex gap-4 mb-4">
            {Length && <span className="text-lg font-semibold">{Length} km</span>}
            {Difficulty && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">{Difficulty}</span>}
          </div>
          <span className="text-blue-500 font-semibold self-start">Read More →</span>
        </div>
      </div>
    </Link>
  );
}