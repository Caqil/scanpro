// app/api/subscription/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createSubscription, updateUserSubscription } from '@/lib/paypal';

// Get subscription details for the current user
export async function GET(request: NextRequest) {
    try {
        // Get the current session
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Get the user with subscription details
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { subscription: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Return the subscription details
        return NextResponse.json({
            success: true,
            subscription: user.subscription || {
                tier: 'free',
                status: 'active',
            },
        });
    } catch (error) {
        console.error('Error getting subscription details:', error);

        return NextResponse.json(
            { error: 'Failed to get subscription details' },
            { status: 500 }
        );
    }
}

// Initialize subscription upgrade/change
export async function POST(request: NextRequest) {
    try {
        // Get the current session
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Get the request body
        const { tier } = await request.json();

        if (!tier || !['basic', 'pro', 'enterprise'].includes(tier)) {
            return NextResponse.json(
                { error: 'Invalid subscription tier' },
                { status: 400 }
            );
        }

        // Get the user with current subscription
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { subscription: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // If downgrading to free, handle separately
        if (tier === 'free') {
            if (user.subscription?.paypalSubscriptionId) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Please cancel your existing subscription from the dashboard first'
                    },
                    { status: 400 }
                );
            }

            // Update to free tier directly
            await updateUserSubscription(user.id, {
                tier: 'free',
                status: 'active',
            });

            return NextResponse.json({
                success: true,
                message: 'Subscription downgraded to free tier',
            });
        }

        // Create PayPal subscription
        const { subscriptionId, approvalUrl } = await createSubscription(user.id, tier);

        // Update pending subscription in database
        await updateUserSubscription(user.id, {
            paypalSubscriptionId: subscriptionId,
            tier,
            status: 'pending', // Will be updated to 'active' when activated via webhook
        });

        // Return the PayPal approval URL
        return NextResponse.json({
            success: true,
            checkoutUrl: approvalUrl,
            message: 'Please complete the payment process on PayPal',
        });
    } catch (error) {
        console.error('Error creating subscription:', error);

        return NextResponse.json(
            {
                error: 'Failed to create subscription',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}