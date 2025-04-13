// lib/middleware/file-size-limit.ts
import { MAX_FILE_SIZE } from '@/workers/pdf-worker';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to enforce file size limits on API routes
 * This checks if the request is a FormData request with a file and enforces a 50MB limit
 */
export async function fileSizeLimitMiddleware(
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
    // Only check POST requests
    if (request.method !== 'POST') {
        return handler(request);
    }

    // Check content type header to detect multipart form data
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
        return handler(request);
    }

    // Get content length header
    const contentLength = request.headers.get('content-length');
    if (contentLength) {
        const size = parseInt(contentLength, 10);
        if (size > MAX_FILE_SIZE) {
            return NextResponse.json(
                {
                    error: `File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
                    success: false
                },
                { status: 413 }
            );
        }
    }

    // If we've read the request body before (to check file size),
    // we need to clone the request since the body stream can only be read once
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (file && file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                {
                    error: `File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
                    success: false
                },
                { status: 413 }
            );
        }

        // Reconstruct the request with the same form data
        const newRequest = new NextRequest(request.url, {
            headers: request.headers,
            method: request.method,
            body: formData,
            redirect: request.redirect,
            // @ts-ignore - NextRequest constructor doesn't include signal
            signal: request.signal,
        });

        return handler(newRequest);
    } catch (error) {
        // If we can't read the formData, pass the request through
        // This will handle when the request is not actually FormData
        console.error('Error parsing form data:', error);
        return handler(request);
    }
}

/**
 * Create a handler with file size limit middleware
 * @param handler The API route handler function
 * @returns A wrapped handler with file size checking
 */
export function withFileSizeLimit(
    handler: (request: NextRequest) => Promise<NextResponse>
): (request: NextRequest) => Promise<NextResponse> {
    return async (request: NextRequest) => {
        return fileSizeLimitMiddleware(request, handler);
    };
}