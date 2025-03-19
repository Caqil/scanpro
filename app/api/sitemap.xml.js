// pages/api/sitemap.xml.js
import { SitemapStream, streamToPromise } from 'sitemap';

export default async function handler(req, res) {
    // Set response header
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=1200, stale-while-revalidate=600');

    // Create sitemap stream
    const smStream = new SitemapStream({
        hostname: 'https://scanpro.cc'
    });

    try {
        // List of all pages
        const pages = [
            { url: '/', changefreq: 'weekly', priority: 1.0 },
            { url: '/tools', changefreq: 'weekly', priority: 0.9 },
            // Core tools
            { url: '/merge', changefreq: 'monthly', priority: 0.8 },
            { url: '/split', changefreq: 'monthly', priority: 0.8 },
            { url: '/compress', changefreq: 'monthly', priority: 0.8 },
            { url: '/rotate', changefreq: 'monthly', priority: 0.7 },
            { url: '/watermark', changefreq: 'monthly', priority: 0.7 },
            { url: '/edit', changefreq: 'monthly', priority: 0.8 },
            { url: '/ocr', changefreq: 'monthly', priority: 0.8 },
            // Conversion tools - PDF to other formats
            { url: '/convert/pdf-to-docx', changefreq: 'monthly', priority: 0.8 },
            { url: '/convert/pdf-to-xlsx', changefreq: 'monthly', priority: 0.7 },
            { url: '/convert/pdf-to-pptx', changefreq: 'monthly', priority: 0.7 },
            { url: '/convert/pdf-to-jpg', changefreq: 'monthly', priority: 0.7 },
            { url: '/convert/pdf-to-png', changefreq: 'monthly', priority: 0.7 },
            { url: '/convert/pdf-to-html', changefreq: 'monthly', priority: 0.7 },
            // Conversion tools - other formats to PDF
            { url: '/convert/docx-to-pdf', changefreq: 'monthly', priority: 0.8 },
            { url: '/convert/xlsx-to-pdf', changefreq: 'monthly', priority: 0.7 },
            { url: '/convert/pptx-to-pdf', changefreq: 'monthly', priority: 0.7 },
            { url: '/convert/jpg-to-pdf', changefreq: 'monthly', priority: 0.7 },
            { url: '/convert/png-to-pdf', changefreq: 'monthly', priority: 0.7 },
            { url: '/convert/html-to-pdf', changefreq: 'monthly', priority: 0.7 },
            // Security tools
            { url: '/protect', changefreq: 'monthly', priority: 0.7 },
            { url: '/unlock', changefreq: 'monthly', priority: 0.7 },
            { url: '/sign', changefreq: 'monthly', priority: 0.7 },
            // Company pages
            { url: '/about', changefreq: 'monthly', priority: 0.6 },
            { url: '/pricing', changefreq: 'monthly', priority: 0.8 },
            { url: '/features', changefreq: 'monthly', priority: 0.7 },
            { url: '/api-docs', changefreq: 'monthly', priority: 0.6 },
            // Support pages
            { url: '/contact', changefreq: 'monthly', priority: 0.6 },
            { url: '/terms', changefreq: 'yearly', priority: 0.4 },
            { url: '/privacy', changefreq: 'yearly', priority: 0.4 },
        ];

        // Add each URL to the sitemap stream
        pages.forEach(page => {
            smStream.write({
                url: page.url,
                changefreq: page.changefreq,
                priority: page.priority,
                lastmod: new Date().toISOString()
            });
        });

        // End the stream
        smStream.end();

        // Generate the XML
        const sitemapOutput = await streamToPromise(smStream);

        // Return the XML
        res.write(sitemapOutput.toString());
        res.end();
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
}