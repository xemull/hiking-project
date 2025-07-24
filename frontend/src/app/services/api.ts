import type { Hike } from '../../types';

const STRAPI_URL = 'http://localhost:1337';

/**
 * Fetches all hikes from the Strapi API.
 * @returns {Promise<Hike[] | null>} A promise that resolves to an array of hikes or null if an error occurs.
 */
export async function getHikes(): Promise<Hike[] | null> {
  const API_ENDPOINT = '/api/hikes';
  const POPULATE_QUERY = '?populate=*';
  const fullUrl = `${STRAPI_URL}${API_ENDPOINT}${POPULATE_QUERY}`;

  try {
    const res = await fetch(fullUrl, { next: { revalidate: 60 } });

    if (!res.ok) {
      console.error("Failed to fetch hikes:", res.statusText);
      return null;
    }

    const data = await res.json();
    return data.data; // The array of hikes
  } catch (error) {
    console.error("An error occurred while fetching hikes:", error);
    return null;
  }
}

/**
 * Fetches a single hike by its ID from the Strapi API.
 * @param {string} id - The ID of the hike to fetch.
 * @returns {Promise<Hike | null>} A promise that resolves to a single hike object or null if not found or an error occurs.
 */
export async function getHikeById(id: string): Promise<Hike | null> {
  const API_ENDPOINT = `/api/hikes/${id}`;
  const POPULATE_QUERY = '?populate=*';
  const fullUrl = `${STRAPI_URL}${API_ENDPOINT}${POPULATE_QUERY}`;

  try {
    const res = await fetch(fullUrl);
    if (!res.ok) {
      console.error("Failed to fetch hike:", res.statusText);
      return null;
    }
    const data = await res.json();
    return data.data; // The single hike object
  } catch (error) {
    console.error("An error occurred while fetching a hike:", error);
    return null;
  }
}