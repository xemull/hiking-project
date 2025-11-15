// src/app/components/BookCard.tsx
import Image from 'next/image';
import { resolveMediaUrl } from '../utils/media';

interface BookCardProps {
  book: {
    id: number;
    title: string;
    url: string;
    cover_image?: {
      url: string;
    };
  };
}

export default function BookCard({ book }: BookCardProps) {
  const coverImageUrl = resolveMediaUrl(book.cover_image);

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('BookCard Debug:', {
      originalUrl: book.cover_image?.url,
      finalUrl: coverImageUrl,
    });
  }

  return (
    <a 
      href={book.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors group"
    >
      {/* Book Cover */}
      <div className="flex-shrink-0 w-16 h-20 relative">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={`Cover of ${book.title}`}
            fill
            sizes="64px"
            quality={85}
            unoptimized
            style={{ objectFit: 'cover' }}
            className="rounded"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm leading-tight mb-1">
          {book.title}
        </h4>
        <div className="flex items-center text-xs text-blue-600 group-hover:text-blue-700">
          <span>View on retailer</span>
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
    </a>
  );
}
