import { MetadataRoute } from 'next'
import { getHikes, createSlug } from './services/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://trailhead.at'
  
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Dynamic hike routes
  try {
    const hikes = await getHikes()
    
    if (hikes && Array.isArray(hikes)) {
      const hikeRoutes: MetadataRoute.Sitemap = hikes.map((hike) => ({
        url: `${baseUrl}/hike/${createSlug(hike.title)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))

      console.log(`Generated sitemap with ${hikeRoutes.length} hike routes`)
      return [...staticRoutes, ...hikeRoutes]
    }
  } catch (error) {
    console.error('Error generating sitemap:', error)
  }

  // Return static routes if dynamic routes fail
  return staticRoutes
}