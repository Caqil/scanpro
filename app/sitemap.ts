// app/sitemap.ts
import { MetadataRoute } from 'next';

// Domain configuration
const domain = 'https://scanpro.cc';
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
    // Main pages
    const mainPages = [
        {
            url: `${domain}/`,
            lastModified,
            changeFrequency: 'weekly' as const,
            priority: 1.0,
        },
        {
            url: `${domain}/tools`,
            lastModified,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        },
    ];

    // Core tools
    const coreTools = [
        {
            url: `${domain}/merge`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${domain}/split`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${domain}/compress`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${domain}/rotate`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${domain}/watermark`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${domain}/edit`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${domain}/ocr`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
    ];

    // Conversion tools - PDF to other formats
    const pdfToOtherFormats = [
        {
            url: `${domain}/convert/pdf-to-docx`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${domain}/convert/pdf-to-xlsx`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${domain}/convert/pdf-to-pptx`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${domain}/convert/pdf-to-jpg`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${domain}/convert/pdf-to-png`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${domain}/convert/pdf-to-html`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
    ];

    // Conversion tools - other formats to PDF
    const otherFormatsToPdf = [
        {
            url: `${domain}/convert/docx-to-pdf`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${domain}/convert/xlsx-to-pdf`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${domain}/convert/pptx-to-pdf`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${domain}/convert/jpg-to-pdf`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${domain}/convert/png-to-pdf`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${domain}/convert/html-to-pdf`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
    ];

    // Security tools
    const securityTools = [
        {
            url: `${domain}/protect`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${domain}/unlock`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${domain}/sign`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
    ];

    // Company pages
    const companyPages = [
        {
            url: `${domain}/about`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
        {
            url: `${domain}/pricing`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${domain}/features`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${domain}/api-docs`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
    ];

    // Support pages
    const supportPages = [
        {
            url: `${domain}/contact`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
        {
            url: `${domain}/terms`,
            lastModified,
            changeFrequency: 'yearly' as const,
            priority: 0.4,
        },
        {
            url: `${domain}/privacy`,
            lastModified,
            changeFrequency: 'yearly' as const,
            priority: 0.4,
        },
    ];

    // Combine all routes
    return [
        ...mainPages,
        ...coreTools,
        ...pdfToOtherFormats,
        ...otherFormatsToPdf,
        ...securityTools,
        ...companyPages,
        ...supportPages,
    ];
}