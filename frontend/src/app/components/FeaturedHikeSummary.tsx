// src/app/components/FeaturedHikeSummary.tsx
import type { HikeSummary } from '../../types';
import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedHikeSummary({ hike }: { hike: HikeSummary }) {
  const { id, title, Length, Difficulty, countries, mainImage, hike_id, Description } = hike;

  const imageUrl = mainImage?.url
    ? `http://localhost:1337${mainImage.url}`
    : '/placeholder-image.jpg';

  // Handle multiple countries like we did in the detail page
  const countryNames = countries?.map(country => country.name) || [];
  const countryDisplay = countryNames.length > 0 
    ? countryNames.length === 1 
      ? countryNames[0]
      : countryNames.length === 2
        ? countryNames.join(' & ')
        : `${countryNames.slice(0, -1).join(', ')} & ${countryNames[countryNames.length - 1]}`
    : '';

  // Extract first few sentences from rich text description
  const getDescriptionPreview = (description: any[]) => {
    if (!description || !Array.isArray(description)) return '';
    
    // Find the first paragraph with text
    const firstParagraph = description.find(block => 
      block.type === 'paragraph' && 
      block.children && 
      block.children.some((child: any) => child.type === 'text' && child.text?.trim())
    );
    
    if (!firstParagraph) return '';
    
    // Extract all text from the paragraph
    const fullText = firstParagraph.children
      .filter((child: any) => child.type === 'text')
      .map((child: any) => child.text)
      .join('')
      .trim();
    
    // Get first 2-3 sentences (approximately 150-200 characters)
    const sentences = fullText.split(/[.!?]+/);
    let preview = '';
    let charCount = 0;
    
    for (let i = 0; i < sentences.length && charCount < 200; i++) {
      const sentence = sentences[i].trim();
      if (sentence) {
        preview += (preview ? '. ' : '') + sentence;
        charCount = preview.length;
      }
    }
    
    return preview ? preview + (preview.endsWith('.') ? '' : '.') : '';
  };

  const descriptionPreview = getDescriptionPreview(Description);

  // Use hike_id (GPX ID) for linking to custom backend, like HikeCard does
  const linkId = hike_id;

  // Debug logging
  console.log('FeaturedHike:', { title, countries, countryDisplay, hasDescription: !!Description });

  return (
    <Link href={`/hike/${linkId}`} className="block group border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 mb-12">
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
          {countryDisplay && <p className="text-gray-700 mb-3 font-medium">{countryDisplay}</p>}
          {descriptionPreview && (
            <p className="text-gray-600 mb-4 leading-relaxed">{descriptionPreview}</p>
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