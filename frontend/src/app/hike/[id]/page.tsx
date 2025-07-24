// src/app/hike/[id]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { getHikeById } from '../../services/api';
import type { Hike } from '../../types';
import StrapiRichText from '../../components/StrapiRichText';

export default async function HikeDetailPage({ params }: { params: { id: string } }) {
  const hike = await getHikeById(params.id);

  if (!hike) {
    return (
      <main className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold">Hike Not Found</h1>
        <p className="mt-4">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to all hikes
          </Link>
        </p>
      </main>
    );
  }

  const imageUrl = hike.mainImage?.url
    ? `http://localhost:1337${hike.mainImage.url}`
    : '/placeholder-image.jpg';

  return (
    <main className="container mx-auto p-4 md:p-8">
      {/* --- Main Image --- */}
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg mb-8">
        <Image
          src={imageUrl}
          alt={`Image of ${hike.title}`}
          fill
          style={{ objectFit: 'cover' }}
          priority={true}
        />
      </div>

      <div className="max-w-4xl mx-auto">
        <p className="mb-8 text-blue-600 hover:underline">
          <Link href="/">← Back to all hikes</Link>
        </p>

        {/* --- HEADER --- */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2">{hike.title}</h1>
        <p className="text-xl text-gray-500 mb-6">{hike.countries?.[0]?.name}</p>

        {/* --- TAGS --- */}
        <div className="flex flex-wrap gap-2 mb-8">
          {hike.sceneries?.map(tag => (
            <span key={tag.id} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{tag.name}</span>
          ))}
          {hike.seasons?.map(tag => (
            <span key={tag.id} className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{tag.name}</span>
          ))}
        </div>

        {/* --- STATS BOX --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8 p-4 bg-gray-50 rounded-lg border">
          <div className="text-center">
            <p className="text-sm text-gray-600">Distance</p>
            <p className="text-2xl font-bold">{hike.Length} km</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Elevation</p>
            <p className="text-2xl font-bold">{hike.Elevation_gain} m</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Difficulty</p>
            <p className="text-2xl font-bold">{hike.Difficulty}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Route Type</p>
            <p className="text-lg font-semibold">{hike.routeType}</p>
          </div>
        </div>

        {/* --- RICH TEXT SECTIONS --- */}
        <div className="space-y-12">
          {hike.Description && (
            <section>
              <h2 className="text-3xl font-bold border-b pb-2 mb-4">Description</h2>
              <StrapiRichText content={hike.Description} />
            </section>
          )}
          {hike.Logistics && (
            <section>
              <h2 className="text-3xl font-bold border-b pb-2 mb-4">Logistics</h2>
              <StrapiRichText content={hike.Logistics} />
            </section>
          )}
          {hike.Accommodation && (
            <section>
              <h2 className="text-3xl font-bold border-b pb-2 mb-4">Accommodation</h2>
              <StrapiRichText content={hike.Accommodation} />
            </section>
          )}
        </div>
      </div>
    </main>
  );
}