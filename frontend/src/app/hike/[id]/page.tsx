// src/app/hike/[id]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getHikeById } from '../../services/api'; 
import type { Hike } from '../../../types';
import StrapiRichText from '../../components/StrapiRichText';
import Map from '../../components/Map';
import ElevationProfile from '../../components/ElevationProfile';
import TagBadge from '../../components/TagBadge';
import StatCard from '../../components/StatCard';
import BookCard from '../../components/BookCard';
import VideoEmbed from '../../components/VideoEmbed';
import CommentsSection from '../../components/CommentsSection';

// Generate dynamic page metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hike = await getHikeById(id);
  
  if (!hike) {
    return {
      title: 'Hike Not Found',
    };
  }

  return {
    title: `${hike.content.title} - Multi-day Hiking Guide`,
    description: `Complete guide to ${hike.content.title}: ${hike.content.Length}km, ${hike.content.Difficulty} difficulty. Logistics, itinerary, and everything you need to know.`,
  };
}

export default async function HikeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hike = await getHikeById(id);

  if (!hike || !hike.content) {
    notFound();
  }

  const { content, track, simplified_profile } = hike;
  const {
    title,
    Length,
    Elevation_gain,
    Difficulty,
    routeType,
    Best_time,
    Description,
    Logistics,
    Accommodation,
    mainImage,
    countries, // Back to using countries relation
    sceneries,
    months,
    accommodations,
    Videos,
    Books
  } = content;

  // Get hero image URL
  const heroImageUrl = mainImage?.url 
    ? `http://localhost:1337${mainImage.url}` 
    : null;

  // Debug the entire content object first
  console.log('Full content object:', content);
  console.log('Countries specifically:', content.countries);
  
  // Get countries from relation - handle multiple countries
  const countryNames = countries?.map(country => country.name) || [];
  const primaryCountry = countryNames.length > 0 
    ? countryNames.length === 1 
      ? countryNames[0]
      : countryNames.length === 2
        ? countryNames.join(' & ')
        : `${countryNames.slice(0, -1).join(', ')} & ${countryNames[countryNames.length - 1]}`
    : '';
  
  // Debug logging (remove this after testing)
  console.log('Countries array:', countries);
  console.log('Country names:', countryNames);
  console.log('Primary country result:', primaryCountry);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      {heroImageUrl && (
        <div className="relative w-full h-[60vh] min-h-[400px]">
          <Image
            src={heroImageUrl}
            alt={`${title} hero image`}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority={true}
            className="brightness-75"
          />
          
          {/* Overlay with back button */}
          <div className="absolute top-6 left-6">
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 hover:bg-white transition-colors shadow-lg"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to all hikes
            </Link>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
            <div className="container mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{title}</h1>
              <p className="text-xl md:text-2xl text-white/90">{primaryCountry}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content Container */}
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        
        {/* Fallback header if no hero image */}
        {!heroImageUrl && (
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to all hikes
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-xl md:text-2xl text-gray-600">{primaryCountry}</p>
          </div>
        )}

        {/* Tags Section */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {/* Scenery Tags */}
            {sceneries?.map((scenery) => (
              <TagBadge key={`scenery-${scenery.id}`} label={scenery.SceneryType} type="scenery" />
            ))}
            
            {/* Season Tags */}
            {months?.map((month) => (
              <TagBadge key={`month-${month.id}`} label={month.MonthTag} type="season" />
            ))}
            
            {/* Accommodation Tags */}
            {accommodations?.map((accommodation) => (
              <TagBadge key={`accommodation-${accommodation.id}`} label={accommodation.AccommodationType} type="accommodation" />
            ))}
            
            {/* Best Time */}
            {Best_time && (
              <TagBadge label={`Best: ${Best_time}`} type="time" />
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {Length && (
            <StatCard 
              label="Distance" 
              value={`${Length} km`} 
              icon="distance"
            />
          )}
          {Elevation_gain && (
            <StatCard 
              label="Elevation Gain" 
              value={`${Elevation_gain.toLocaleString()} m`} 
              icon="elevation"
            />
          )}
          {Difficulty && (
            <StatCard 
              label="Difficulty" 
              value={Difficulty} 
              icon="difficulty"
            />
          )}
          {routeType && (
            <StatCard 
              label="Route Type" 
              value={routeType} 
              icon="route"
            />
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description Section */}
            {Description && (
              <section>
                <h2 className="text-3xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">
                  About This Hike
                </h2>
                <div className="prose prose-lg max-w-none">
                  <StrapiRichText content={Description} />
                </div>
              </section>
            )}

            {/* Logistics Section */}
            {Logistics && (
              <section>
                <h2 className="text-3xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">
                  Getting There & Back
                </h2>
                <div className="prose prose-lg max-w-none">
                  <StrapiRichText content={Logistics} />
                </div>
              </section>
            )}

            {/* Accommodation Section */}
            {Accommodation && (
              <section>
                <h2 className="text-3xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">
                  Where to Stay
                </h2>
                <div className="prose prose-lg max-w-none">
                  <StrapiRichText content={Accommodation} />
                </div>
              </section>
            )}

            {/* Interactive Map & Profile */}
            {(track || simplified_profile) && (
              <section>
                <h2 className="text-3xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">
                  Route & Elevation
                </h2>
                
                {/* Map */}
                {track && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Trail Map</h3>
                    <div className="w-full h-96 rounded-lg overflow-hidden border shadow-sm">
                      <Map track={track} />
                    </div>
                  </div>
                )}

                {/* Elevation Profile */}
                {simplified_profile && simplified_profile.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Elevation Profile</h3>
                    <ElevationProfile 
                      data={simplified_profile} 
                      landmarks={content.landmarks}
                      height="320px"
                    />
                  </div>
                )}
              </section>
            )}

            {/* Comments Section - Inside main content column */}
            <CommentsSection 
              hikeId={id} 
              hikeTitle={content.title}
            />

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Quick Stats Sidebar */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Facts</h3>
              <div className="space-y-3 text-sm">
                {Length && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Distance:</span>
                    <span className="font-medium">{Length} km</span>
                  </div>
                )}
                {Elevation_gain && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Elevation Gain:</span>
                    <span className="font-medium">{Elevation_gain.toLocaleString()} m</span>
                  </div>
                )}
                {Difficulty && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="font-medium">{Difficulty}</span>
                  </div>
                )}
                {routeType && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Route Type:</span>
                    <span className="font-medium">{routeType}</span>
                  </div>
                )}
                {Best_time && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Time:</span>
                    <span className="font-medium">{Best_time}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Guidebooks */}
            {Books && Books.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended Guidebooks</h3>
                <div className="space-y-4">
                  {Books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {Videos && Videos.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Watch Videos</h3>
                <div className="space-y-4">
                  {Videos.map((video) => (
                    <VideoEmbed key={video.id} video={video} />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}