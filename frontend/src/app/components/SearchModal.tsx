// src/app/components/SearchModal.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { HikeSummary } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  hikes: HikeSummary[];
}

interface SearchResult extends HikeSummary {
  matchType: 'name' | 'continent' | 'countries' | 'difficulty' | 'description';
  snippet?: string;
  slug: string; // Add slug for routing
}

// Create slug from hike title (same function as in api.ts)
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens
}

export default function SearchModal({ isOpen, onClose, hikes }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect operating system
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Client-side search function
  const searchHikes = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    hikes.forEach(hike => {
      const nameMatch = hike.title.toLowerCase().includes(query);
      const continentMatch = hike.continent?.toLowerCase().includes(query);
      const countryMatch = hike.countries?.some(country => 
        country.name.toLowerCase().includes(query)
      );
      const difficultyMatch = hike.Difficulty?.toLowerCase().includes(query);
      const descriptionMatch = hike.Description && 
        JSON.stringify(hike.Description).toLowerCase().includes(query);

      if (nameMatch) {
        searchResults.push({
          ...hike,
          matchType: 'name',
          slug: createSlug(hike.title)
        });
      } else if (continentMatch) {
        searchResults.push({
          ...hike,
          matchType: 'continent',
          slug: createSlug(hike.title)
        });
      } else if (countryMatch) {
        searchResults.push({
          ...hike,
          matchType: 'countries',
          slug: createSlug(hike.title)
        });
      } else if (difficultyMatch) {
        searchResults.push({
          ...hike,
          matchType: 'difficulty',
          slug: createSlug(hike.title)
        });
      } else if (descriptionMatch) {
        searchResults.push({
          ...hike,
          matchType: 'description',
          snippet: extractSnippet(JSON.stringify(hike.Description) || '', query),
          slug: createSlug(hike.title)
        });
      }
    });

    // Sort by relevance: name matches first, then others
    return searchResults.sort((a, b) => {
      const relevanceOrder = { name: 0, continent: 1, countries: 2, difficulty: 3, description: 4 };
      return relevanceOrder[a.matchType] - relevanceOrder[b.matchType];
    }).slice(0, 8); // Limit to 8 results
  };

  // Extract snippet around the search term
  const extractSnippet = (text: string, query: string): string => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text.substring(0, 100) + '...';
    
    const start = Math.max(0, index - 30);
    const end = Math.min(text.length, index + query.length + 30);
    return (start > 0 ? '...' : '') + text.substring(start, end) + (end < text.length ? '...' : '');
  };

  // Handle search input change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        setIsLoading(true);
        const searchResults = searchHikes(query);
        setResults(searchResults);
        setIsLoading(false);
      } else {
        setResults([]);
      }
    }, 200); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [query, hikes]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getMatchTypeIcon = (matchType: string) => {
    switch (matchType) {
      case 'continent': return <MapPin className="w-4 h-4" />;
      case 'countries': return <MapPin className="w-4 h-4" />;
      case 'difficulty': return <TrendingUp className="w-4 h-4" />;
      default: return null;
    }
  };

  const getMatchTypeLabel = (matchType: string) => {
    switch (matchType) {
      case 'name': return 'Title match';
      case 'continent': return 'Continent match';
      case 'countries': return 'Country match';
      case 'difficulty': return 'Difficulty match';
      case 'description': return 'Description match';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search hikes by name, continent, country, difficulty..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-lg outline-none placeholder-gray-400"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-96">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="loading-spinner"></div>
              <span className="ml-2 text-gray-500">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <Link
                  key={result.documentId}
                  href={`/hike/${result.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  {/* Hike Image */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    {result.mainImage?.url ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${result.mainImage.url}`}
                        alt={result.title}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Hike Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {result.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      {getMatchTypeIcon(result.matchType)}
                      <span>{getMatchTypeLabel(result.matchType)}</span>
                      {result.continent && (
                        <>
                          <span>•</span>
                          <span>{result.continent}</span>
                        </>
                      )}
                    </div>
                    {result.snippet && (
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {result.snippet}
                      </p>
                    )}
                  </div>

                  {/* Duration */}
                  {result.Length && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 flex-shrink-0">
                      <Clock className="w-4 h-4" />
                      <span>{result.Length} days</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>No hikes found for "{query}"</p>
              <p className="text-sm mt-1">Try searching by hike name, continent, country, or difficulty</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>Start typing to search hikes</p>
              <p className="text-sm mt-1">Search by name, continent, country, difficulty, or description</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="border-t p-3 text-center text-sm text-gray-500">
            Showing {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </div>
        )}
      </div>
    </div>
  );
}