// src/app/services/api.ts
import type { Hike, HikeSummary, QuizCompletion, QuizAnalytics, NewsletterSubscription, NewsletterResponse } from '../../types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const CUSTOM_BACKEND_URL = process.env.NEXT_PUBLIC_CUSTOM_BACKEND_URL || 'http://localhost:4000';

// Request timeout configuration
const REQUEST_TIMEOUT = 8000; // 8 seconds
const RETRY_ATTEMPTS = 2;

interface RequestOptions {
  timeout?: number;
  retries?: number;
  cache?: RequestCache;
}

// Simple in-memory cache for client-side
const clientCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

function getCachedData<T>(key: string): T | null {
  const cached = clientCache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > cached.ttl) {
    clientCache.delete(key);
    return null;
  }
  
  return cached.data as T;
}

function setCachedData<T>(key: string, data: T, ttlMs: number = 300000): void {
  clientCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMs
  });
}

// Enhanced fetch with timeout and retry logic
async function fetchWithTimeout(
  url: string, 
  options: RequestInit & RequestOptions = {}
): Promise<Response> {
  const { timeout = REQUEST_TIMEOUT, retries = RETRY_ATTEMPTS, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'application/json',
        ...fetchOptions.headers
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok && retries > 0) {
      console.warn(`Request failed (${response.status}), retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithTimeout(url, { ...options, retries: retries - 1 });
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (retries > 0 && (error as Error).name === 'AbortError') {
      console.warn(`Request timed out, retrying... (${retries} attempts left)`);
      return fetchWithTimeout(url, { ...options, retries: retries - 1 });
    }
    
    throw error;
  }
}

// Create slug from hike title
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens
}

// Optimized function to get hikes list - now uses the new backend endpoint
export async function getHikes(): Promise<HikeSummary[] | null> {
  const cacheKey = 'hikes-list';
  
  // Try client-side cache first
  const cached = getCachedData<HikeSummary[]>(cacheKey);
  if (cached) {
    console.log('✅ Using cached hikes data (client-side)');
    return cached;
  }

  // For homepage, we get the lightweight list from Strapi directly
  // This is faster than going through the backend aggregator
  const fullUrl = `${STRAPI_URL}/api/hikes?populate=mainImage&populate=countries&populate=sceneries&populate=months&populate=accommodations`;

  console.log('🔄 Fetching hikes from Strapi:', fullUrl);

  try {
    const response = await fetchWithTimeout(fullUrl, { 
      cache: 'force-cache',
      next: { revalidate: 300 } as any // 5 minutes revalidation
    });
    
    console.log(`✅ Hikes API response status: ${response.status}`);

    if (!response.ok) {
      console.error('❌ API response not ok:', response.status, response.statusText);
      
      // Try to return expired cache as fallback
      const expiredCache = clientCache.get(cacheKey);
      if (expiredCache) {
        console.warn('⚠️  Using expired cache as fallback');
        return expiredCache.data;
      }
      
      return null;
    }

    const result = await response.json();
    console.log('📊 Hikes data received:', result.data?.length || 0, 'hikes');
    
    if (result.data && Array.isArray(result.data)) {
      // Cache for 5 minutes
      setCachedData(cacheKey, result.data, 300000);
      return result.data;
    }

    console.error('❌ Invalid data structure received:', result);
    return null;
  } catch (error) {
    console.error('❌ Error fetching hikes from Strapi:', error);
    
    // Try to return expired cache as fallback
    const expiredCache = clientCache.get(cacheKey);
    if (expiredCache) {
      console.warn('⚠️  Using expired cache as fallback');
      return expiredCache.data;
    }
    
    return [];
  }
}

// Optimized function to get featured hike - now uses backend endpoint
export async function getFeaturedHike(): Promise<HikeSummary | null> {
  const cacheKey = 'featured-hike';
  
  // Try client-side cache first
  const cached = getCachedData<HikeSummary | null>(cacheKey);
  if (cached !== undefined) { // Check for undefined since null is a valid cached value
    console.log('✅ Using cached featured hike (client-side)');
    return cached;
  }

  const fullUrl = `${CUSTOM_BACKEND_URL}/api/hikes/featured`;

  console.log('🔄 Fetching featured hike from backend:', fullUrl);

  try {
    const response = await fetchWithTimeout(fullUrl, { 
      cache: 'force-cache',
      retries: 1 // Less retries for featured hike
    });
    
    console.log(`✅ Featured hike API response status: ${response.status}`);

    if (!response.ok) {
      console.error('❌ Featured hike API response not ok:', response.status, response.statusText);
      return null;
    }

    const featuredHike = await response.json();
    console.log('📊 Featured hike received:', featuredHike ? featuredHike.title : 'none');
    
    // Cache for 10 minutes (including null values)
    setCachedData(cacheKey, featuredHike, 600000);
    
    return featuredHike;
  } catch (error) {
    console.error('❌ Error fetching featured hike:', error);
    return null;
  }
}

// Optimized function to get hike by slug
export async function getHikeBySlug(slug: string): Promise<Hike | null> {
  const cacheKey = `hike-slug-${slug}`;
  
  // Try client-side cache first
  const cached = getCachedData<Hike>(cacheKey);
  if (cached) {
    console.log('✅ Using cached hike detail (client-side)');
    return cached;
  }

  const fullUrl = `${CUSTOM_BACKEND_URL}/api/hikes/slug/${slug}`;

  console.log('🔄 Fetching hike detail by slug:', slug);

  try {
    const response = await fetchWithTimeout(fullUrl, { 
      cache: 'force-cache',
      timeout: 10000 // Longer timeout for detail pages
    });
    
    if (!response.ok) {
      console.error('❌ Detail API response not ok:', response.status, response.statusText);
      return null;
    }

    const hike = await response.json();
    console.log('✅ Detail data received for slug:', slug);
    
    // Cache for 15 minutes
    setCachedData(cacheKey, hike, 900000);
    
    return hike;
  } catch (error) {
    console.error('❌ Error fetching hike from custom backend:', error);
    return null;
  }
}

// Keep original function for backwards compatibility (also optimized)
export async function getHikeById(id: string): Promise<Hike | null> {
  const cacheKey = `hike-id-${id}`;
  
  // Try client-side cache first
  const cached = getCachedData<Hike>(cacheKey);
  if (cached) {
    console.log('✅ Using cached hike detail by ID (client-side)');
    return cached;
  }

  const fullUrl = `${CUSTOM_BACKEND_URL}/api/hikes/${id}`;

  console.log('🔄 Fetching hike detail by ID:', id);

  try {
    const response = await fetchWithTimeout(fullUrl, { 
      cache: 'force-cache',
      timeout: 10000
    });
    
    if (!response.ok) {
      console.error('❌ Detail API response not ok:', response.status, response.statusText);
      return null;
    }

    const hike = await response.json();
    console.log('✅ Detail data received for hike ID:', id);
    
    // Cache for 15 minutes
    setCachedData(cacheKey, hike, 900000);
    
    return hike;
  } catch (error) {
    console.error('❌ Error fetching hike from custom backend:', error);
    return null;
  }
}

// --- QUIZ API FUNCTIONS ---

// Submit quiz completion
export async function submitQuizCompletion(completion: QuizCompletion): Promise<{ success: boolean; completionId?: number }> {
  const fullUrl = `${CUSTOM_BACKEND_URL}/api/quiz/complete`;

  try {
    const response = await fetchWithTimeout(fullUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(completion),
      timeout: 5000
    });

    if (!response.ok) {
      throw new Error(`Quiz submission failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Quiz completion submitted successfully');
    
    return { success: true, completionId: result.completionId };
  } catch (error) {
    console.error('❌ Error submitting quiz completion:', error);
    return { success: false };
  }
}

// Get quiz analytics (admin function)
export async function getQuizAnalytics(): Promise<QuizAnalytics | null> {
  const cacheKey = 'quiz-analytics';
  
  // Try client-side cache first (shorter TTL for analytics)
  const cached = getCachedData<QuizAnalytics>(cacheKey);
  if (cached) {
    console.log('✅ Using cached quiz analytics');
    return cached;
  }

  const fullUrl = `${CUSTOM_BACKEND_URL}/api/quiz/analytics`;

  try {
    const response = await fetchWithTimeout(fullUrl, { 
      timeout: 10000 
    });

    if (!response.ok) {
      throw new Error(`Analytics fetch failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Quiz analytics received');
    
    // Cache for 5 minutes
    setCachedData(cacheKey, result.data, 300000);
    
    return result.data;
  } catch (error) {
    console.error('❌ Error fetching quiz analytics:', error);
    return null;
  }
}

// --- NEWSLETTER API FUNCTIONS ---

// Enhanced newsletter subscription with quiz source tracking
export async function subscribeToNewsletter(subscription: NewsletterSubscription): Promise<NewsletterResponse> {
  const fullUrl = `${CUSTOM_BACKEND_URL}/api/newsletter/subscribe`;

  try {
    const response = await fetchWithTimeout(fullUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
      timeout: 5000
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Newsletter subscription failed');
    }

    console.log('✅ Newsletter subscription successful');
    return result;
  } catch (error) {
    console.error('❌ Error subscribing to newsletter:', error);
    return {
      success: false,
      message: 'Subscription failed. Please try again.'
    };
  }
}

// Utility function to preload critical data
export async function preloadCriticalData(): Promise<void> {
  console.log('🚀 Preloading critical data...');
  
  // Start both requests in parallel but don't wait for completion
  Promise.allSettled([
    getHikes(),
    getFeaturedHike()
  ]).then(results => {
    const [hikesResult, featuredResult] = results;
    
    if (hikesResult.status === 'fulfilled') {
      console.log('✅ Hikes preloaded successfully');
    } else {
      console.warn('⚠️  Hikes preload failed:', hikesResult.reason);
    }
    
    if (featuredResult.status === 'fulfilled') {
      console.log('✅ Featured hike preloaded successfully');
    } else {
      console.warn('⚠️  Featured hike preload failed:', featuredResult.reason);
    }
  });
}

// Function to clear client cache (useful for development)
export function clearCache(): void {
  clientCache.clear();
  console.log('🗑️  Client cache cleared');
}