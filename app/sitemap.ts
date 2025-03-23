// app/sitemap.ts
import { MetadataRoute } from 'next';
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';

// Base URL of your site
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://scanpro.cc';

// Get current date in ISO format for lastModified
const currentDate = new Date().toISOString();

// Define all static pages
const staticPages = [
    '', // Home page
    '/tools',
    '/about',
    '/features',
    '/privacy',
    '/terms',
    '/contact',
    '/api-docs',
    '/sitemap'
];

// Define all tool pages
const toolPages = [
    '/compress',
    '/merge',
    '/watermark',
    '/ocr',
    '/protect',
    '/unlock'
];

// Define all conversion pages
const conversionPages = [
    // PDF to other formats
    '/convert/pdf-to-docx',
    '/convert/pdf-to-xlsx',
    '/convert/pdf-to-pptx',
    '/convert/pdf-to-jpg',
    '/convert/pdf-to-png',
    '/convert/pdf-to-html',

    // Other formats to PDF
    '/convert/docx-to-pdf',
    '/convert/xlsx-to-pdf',
    '/convert/pptx-to-pdf',
    '/convert/jpg-to-pdf',
    '/convert/png-to-pdf',
    '/convert/html-to-pdf'
];

// Define page change frequencies and priorities
const pageSettings = {
    home: { changeFrequency: 'daily', priority: 1.0 },
    tools: { changeFrequency: 'weekly', priority: 0.9 },
    conversion: { changeFrequency: 'weekly', priority: 0.8 },
    static: { changeFrequency: 'monthly', priority: 0.7 }
};

// Generate sitemap
export default function sitemap(): MetadataRoute.Sitemap {
    // Array to store all sitemap entries
    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Add entries for all languages
    SUPPORTED_LANGUAGES.forEach(language => {
        // Home page (special case with higher priority)
        sitemapEntries.push({
            url: language === 'en' ? baseUrl : `${baseUrl}/${language}`,
            lastModified: currentDate,
            changeFrequency: pageSettings.home.changeFrequency as 'daily',
            priority: pageSettings.home.priority
        });

        // Add static pages
        staticPages.forEach(page => {
            if (page === '') return; // Skip home page as it's already added

            sitemapEntries.push({
                url: `${baseUrl}/${language}${page}`,
                lastModified: currentDate,
                changeFrequency: pageSettings.static.changeFrequency as 'monthly',
                priority: pageSettings.static.priority
            });
        });

        // Add tool pages
        toolPages.forEach(page => {
            sitemapEntries.push({
                url: `${baseUrl}/${language}${page}`,
                lastModified: currentDate,
                changeFrequency: pageSettings.tools.changeFrequency as 'weekly',
                priority: pageSettings.tools.priority
            });
        });

        // Add conversion pages
        conversionPages.forEach(page => {
            sitemapEntries.push({
                url: `${baseUrl}/${language}${page}`,
                lastModified: currentDate,
                changeFrequency: pageSettings.conversion.changeFrequency as 'weekly',
                priority: pageSettings.conversion.priority
            });
        });
    });

    return sitemapEntries;
}