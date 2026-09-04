import { MetadataRoute } from 'next'
import { episodes } from '@/lib/data'
import { siteConfig } from '@/lib/config'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Core static routes
  const staticRoutes = [
    '',
    '/season-1',
    '/season-2',
    '/specials',
    '/search',
    '/about',
    '/privacy',
    '/terms',
    '/disclaimer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Dynamic episode routes
  const episodeRoutes = episodes.map((ep) => ({
    url: `${baseUrl}/w/${ep.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9, // High priority for individual episodes since they are the main content
  }))

  return [...staticRoutes, ...episodeRoutes]
}
