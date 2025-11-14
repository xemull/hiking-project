// src/app/components/FeaturedHikeSummary.tsx
import type { HikeSummary } from '../../types';
import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedHikeSummary({ hike }: { hike: HikeSummary }) {
  const { id, title, Length, Difficulty, countries, mainImage } = hike;

  const imageUrl = mainImage?.url
    ? `http://localhost:1337${mainImage.url}`
    : '/placeholder-image.jpg';

  const countryName = countries?.[0]?.name || 'Unknown';

  return (
    <Link href={`/hike/${id}`} className="block group border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 mb-12">
      <div className="md:flex">
        {/* Image Section */}
        <div className="md:w-1/2 relative min-h-64">
          <Image
            src={imageUrl}
            alt={`Image of ${title}`}
            fill
            style={{ objectFit: 'cover' }}
            priority={true}
          />
        </div>
        
        {/* Text Content Section */}
        <div className="md:w-1/2 p-6 flex flex-col justify-center">
          <h3 className="text-3xl font-bold mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
          <p className="text-gray-700 mb-4">{countryName}</p>
          <div className="flex gap-4 mb-4">
            <span className="text-lg font-semibold">{Length} km</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">{Difficulty}</span>
          </div>
          <span className="text-blue-500 font-semibold self-start">Read More →</span>
        </div>
      </div>
    </Link>
  );
}