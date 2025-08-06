// src/app/services/api.ts
import type { Hike, HikeSummary } from '../../types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const CUSTOM_BACKEND_URL = process.env.NEXT_PUBLIC_CUSTOM_BACKEND_URL || 'http://localhost:4000';

// Create slug from hike title
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens
}

// Fetches a lightweight list of hikes from STRAPI for the homepage
export async function getHikes(): Promise<HikeSummary[] | null> {
  const fullUrl = `${STRAPI_URL}/api/hikes?populate=*`;

  console.log('Fetching hikes from:', fullUrl);

  try {
    const response = await fetch(fullUrl, { next: { revalidate: 60 } });
    console.log(`Homepage API response status: ${response.status}`);

    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText);
      return null;
    }

    const result = await response.json();
    console.log('Homepage data received:', result);
    console.log('Number of hikes:', result.data?.length);
    
    // Log first hike to check what's populated
    if (result.data && result.data.length > 0) {
      console.log('First hike countries:', result.data[0].countries);
      console.log('First hike mainImage:', result.data[0].mainImage);
      console.log('First hike Description:', result.data[0].Description);
      console.log('First hike sceneries:', result.data[0].sceneries);
    }
    
    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }

    console.error('Invalid data structure received:', result);
    return null;
  } catch (error) {
    console.error('Error fetching hikes from Strapi:', error);
    return null;
  }
}

// NEW: Fetch the featured hike specifically
export async function getFeaturedHike(): Promise<HikeSummary | null> {
  const fullUrl = `${STRAPI_URL}/api/hikes?populate=*&filters[featured][$eq]=true`;

  console.log('Fetching featured hike from:', fullUrl);

  try {
    const response = await fetch(fullUrl, { 
      next: { revalidate: 60 },
      cache: 'no-store' // Force fresh data for debugging
    });
    console.log(`Featured hike API response status: ${response.status}`);

    if (!response.ok) {
      console.error('Featured hike API response not ok:', response.status, response.statusText);
      return null;
    }

    const result = await response.json();
    console.log('Featured hike raw result:', result);
    console.log('Featured hike data array:', result.data);
    console.log('Number of featured hikes found:', result.data?.length || 0);
    
    if (result.data && Array.isArray(result.data) && result.data.length > 0) {
      console.log('✅ Featured hike found:', result.data[0].title);
      console.log('✅ Featured value:', result.data[0].featured);
      return result.data[0];
    }

    console.log('❌ No featured hike found in results');
    return null;
  } catch (error) {
    console.error('Error fetching featured hike from Strapi:', error);
    return null;
  }
}

// New function to get hike by slug
export async function getHikeBySlug(slug: string): Promise<Hike | null> {
  const fullUrl = `${CUSTOM_BACKEND_URL}/api/hikes/slug/${slug}`;

  console.log('🐛 Frontend requesting slug:', slug);
  console.log('🐛 Full URL:', fullUrl);


  console.log('Fetching hike detail by slug from:', fullUrl);

  try {
    const response = await fetch(fullUrl, { cache: 'no-store' });
    
    if (!response.ok) {
      console.error('Detail API response not ok:', response.status, response.statusText);
      return null;
    }

    const hike = await response.json();
    console.log('Detail data received for slug:', slug, hike);
    return hike;
  } catch (error) {
    console.error('Error fetching hike from custom backend:', error);
    return null;
  }
}

// Keep original function for backwards compatibility
export async function getHikeById(id: string): Promise<Hike | null> {
  const fullUrl = `${CUSTOM_BACKEND_URL}/api/hikes/${id}`;

  console.log('Fetching hike detail from:', fullUrl);

  try {
    const response = await fetch(fullUrl, { cache: 'no-store' });
    
    if (!response.ok) {
      console.error('Detail API response not ok:', response.status, response.statusText);
      return null;
    }

    const hike = await response.json();
    console.log('Detail data received for hike:', id, hike);
    return hike;
  } catch (error) {
    console.error('Error fetching hike from custom backend:', error);
    return null;
  }
}