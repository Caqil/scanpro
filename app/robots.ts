// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    // Base URL of your site
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://scanpro.cc'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/',
                // Add other paths you want to block from indexing
                // '/admin/',
                // '/internal/',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}