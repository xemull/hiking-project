// src/app/services/api.ts
import type { Hike, HikeSummary } from '../../types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const CUSTOM_BACKEND_URL = process.env.NEXT_PUBLIC_CUSTOM_BACKEND_URL || 'http://localhost:4000';

// Fetches a lightweight list of hikes from STRAPI for the homepage
export async function getHikes(): Promise<HikeSummary[] | null> {
  // Use the wildcard populate since it works
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

// Fetches a single, fully combined hike object from the CUSTOM BACKEND for the detail page
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