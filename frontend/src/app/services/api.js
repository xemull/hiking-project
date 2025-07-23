// app/services/api.js

export async function getHikes() {
  // This is the URL of your Strapi backend
  const STRAPI_URL = 'http://localhost:1337';
  
  // This is the API endpoint for your hikes
  const API_ENDPOINT = '/api/hikes';
  
  // The `populate=*` parameter is crucial.
  // It tells Strapi to include all related data like countries, scenery, etc.
  const POPULATE_QUERY = '?populate=*';

  // Construct the full URL
  const fullUrl = `${STRAPI_URL}${API_ENDPOINT}${POPULATE_QUERY}`;

  try {
    const res = await fetch(fullUrl, {
      // This helps Next.js cache the data for better performance
      next: { revalidate: 60 } 
    });

    if (!res.ok) {
      console.error("Failed to fetch data from Strapi:", res.statusText);
      return null;
    }

    const data = await res.json();
    
    // Strapi wraps the array in a 'data' object. We return the array itself.
    return data.data;

  } catch (error) {
    console.error("An error occurred while fetching from Strapi:", error);
    return null;
  }
}