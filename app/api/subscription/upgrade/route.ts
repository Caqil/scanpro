// app/api/subscription/upgrade/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { createPayPalSubscription } from '@/lib/paypal';

// Map tiers to PayPal plan IDs
const PAYPAL_PLAN_IDS: Record<string, string> = {
    basic: process.env.PAYPAL_BASIC_PLAN_ID || '',
    pro: process.env.PAYPAL_PRO_PLAN_ID || '',
    enterprise: process.env.PAYPAL_ENTERPRISE_PLAN_ID || ''
};

// Validate PayPal configuration on startup
(function validatePayPalConfig() {
    // Check if PayPal client ID and secret are set
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
        console.warn('⚠️ PayPal API credentials are not configured properly. Subscription functionality will be limited.');
    }

    // Check if plan IDs are set
    if (!PAYPAL_PLAN_IDS.basic || !PAYPAL_PLAN_IDS.pro || !PAYPAL_PLAN_IDS.enterprise) {
        console.warn('⚠️ One or more PayPal plan IDs are not configured. Affected subscription tiers will not work.');

        // Log specific missing plans
        if (!PAYPAL_PLAN_IDS.basic) console.warn('Missing PAYPAL_BASIC_PLAN_ID');
        if (!PAYPAL_PLAN_IDS.pro) console.warn('Missing PAYPAL_PRO_PLAN_ID');
        if (!PAYPAL_PLAN_IDS.enterprise) console.warn('Missing PAYPAL_ENTERPRISE_PLAN_ID');
    }
})();

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { tier } = await request.json();

        if (!tier || !['basic', 'pro', 'enterprise'].includes(tier)) {
            return NextResponse.json(
                { error: 'Invalid subscription tier' },
                { status: 400 }
            );
        }

        // Get user with subscription
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { subscription: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Get the PayPal plan ID for the requested tier
        const planId = PAYPAL_PLAN_IDS[tier];
        if (!planId) {
            return NextResponse.json(
                { error: 'Invalid subscription plan' },
                { status: 400 }
            );
        }

        // Base URL for callbacks
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // Create or update subscription in our database (pending payment)
        const subscription = await prisma.subscription.upsert({
            where: { userId: user.id },
            update: {
                tier: 'free', // Keep as free until payment confirmed
                status: 'pending',
                planId: planId,
            },
            create: {
                userId: user.id,
                tier: 'free', // Keep as free until payment confirmed
                status: 'pending',
                planId: planId,
            }
        });

        // Ensure we have valid plan IDs
        if (!planId) {
            console.error(`Plan ID not found for tier: ${tier}`);
            return NextResponse.json(
                { error: `Subscription plan for ${tier} tier is not configured` },
                { status: 500 }
            );
        }

        // Create PayPal subscription
        const successUrl = `${baseUrl}/en/subscription/success?session_id=${subscription.id}`;
        const cancelUrl = `${baseUrl}/en/subscription/cancel`;

        console.log(`Creating PayPal subscription for user: ${user.id}, plan: ${planId}`);
        console.log(`Success URL: ${successUrl}`);
        console.log(`Cancel URL: ${cancelUrl}`);

        try {
            const paypalSubscription = await createPayPalSubscription(
                user.id,
                planId,
                successUrl,
                cancelUrl
            );

            // Update our subscription with the PayPal subscription ID
            await prisma.subscription.update({
                where: { id: subscription.id },
                data: {
                    paypalId: paypalSubscription.id,
                }
            });

            console.log(`Subscription created, redirecting to: ${paypalSubscription.approvalUrl}`);

            // Return the PayPal approval URL to redirect the user
            return NextResponse.json({
                success: true,
                checkoutUrl: paypalSubscription.approvalUrl
            });
        } catch (error: any) {
            console.error('PayPal subscription creation failed:', error);

            // Update subscription status to failed
            await prisma.subscription.update({
                where: { id: subscription.id },
                data: {
                    status: 'failed',
                }
            });

            return NextResponse.json(
                { error: error.message || 'Failed to create PayPal subscription' },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error('Subscription upgrade error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to upgrade subscription' },
            { status: 500 }
        );
    }
}