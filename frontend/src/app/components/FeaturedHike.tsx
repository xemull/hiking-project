// src/app/components/FeaturedHike.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { Hike } from '../../types';

export default function FeaturedHike({ hike }: { hike: Hike }) {
  // FIX: Destructure directly from 'hike', not 'hike.attributes'
  const { documentId, title, Description, mainImage } = hike;

  // FIX: Access the image URL directly from 'mainImage.url'
  const imageUrl = mainImage?.url
    ? `http://localhost:1337${mainImage.url}`
    : '/placeholder-image.jpg';

  const shortDescription = Description?.[0]?.children?.[0]?.text || 'No description available.';

  return (
    <Link href={`/hike/${documentId}`} className="block group border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 mb-12">
      <div className="md:flex">
        <div className="md:w-1/2 relative min-h-64">
          <Image
            src={imageUrl}
            alt={`Image of ${title}`}
            fill
            style={{ objectFit: 'cover' }}
            priority={true}
          />
        </div>
        
        <div className="md:w-1/2 p-6 flex flex-col justify-center">
          <h3 className="text-3xl font-bold mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
          <p className="text-gray-700 mb-4">{shortDescription.substring(0, 150)}...</p>
          <span className="text-blue-500 font-semibold self-start">Read More →</span>
        </div>
      </div>
    </Link>
  );
}