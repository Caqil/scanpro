// app/api/webhooks/revenuecat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleWebhook } from '@/lib/revenuecat';

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();
        await handleWebhook(payload);

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('RevenueCat webhook error:', error);
        return NextResponse.json(
            { error: 'Failed to process webhook' },
            { status: 500 }
        );
    }
}