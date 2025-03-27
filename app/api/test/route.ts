// app/api/test/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const userId = request.headers.get('x-user-id');
    const apiKeyId = request.headers.get('x-api-key-id');

    return NextResponse.json({
        message: "API is working!",
        authenticated: true,
        userId,
        apiKeyId,
        timestamp: new Date().toISOString()
    });
}