// src/utils/slugs.ts

/**
 * Generate a URL-friendly slug from a hike title and country
 */
export function generateHikeSlug(title: string, country?: string): string {
  // Clean and normalize the title
  let slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  // Add country if provided
  if (country) {
    const countrySlug = country
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    slug = `${slug}-${countrySlug}`;
  }

  return slug;
}

/**
 * Create a lookup map of slugs to hike IDs for routing
 */
export function createSlugMap(hikes: Array<{ id: number; title: string; countries?: Array<{ name: string }> }>): Map<string, number> {
  const slugMap = new Map<string, number>();
  
  hikes.forEach(hike => {
    const country = hike.countries?.[0]?.name;
    const slug = generateHikeSlug(hike.title, country);
    slugMap.set(slug, hike.id);
  });
  
  return slugMap;
}

/**
 * Examples of generated slugs:
 * "Alta Via 2" + "Italy" → "alta-via-2-italy"
 * "Camiño dos Faros (The Lighthouse Way)" + "Spain" → "camino-dos-faros-the-lighthouse-way-spain"
 * "Tour du Mont Blanc" + "France" → "tour-du-mont-blanc-france"
 */