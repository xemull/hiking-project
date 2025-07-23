// app/components/HikeCard.js
import Image from 'next/image';

export default function HikeCard({ hike }) {
  // We now get mainImage directly from the hike object
  const { title, Length, Difficulty, countries, mainImage } = hike;

  const countryName = countries?.[0]?.name || 'N/A';

  // **THE FIX IS HERE**
  // We access the image url directly from mainImage.url
  const imageUrl = mainImage?.url
    ? `http://localhost:1337${mainImage.url}`
    : '/placeholder-image.jpg'; // A fallback image

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={`Image of ${title}`}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{countryName}</p>
        
        <div className="flex justify-between text-sm">
          <span className="font-semibold">{Length} km</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{Difficulty}</span>
        </div>
      </div>
    </div>
  );
}