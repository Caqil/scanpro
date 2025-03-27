// app/api/subscription/upgrade/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { createCustomer } from '@/lib/revenuecat';

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

        // Create RevenueCat customer if needed
        if (!user.subscription?.revenueCatId) {
            const customer = await createCustomer(user.id, user.email!);

            // Create or update subscription
            await prisma.subscription.upsert({
                where: { userId: user.id },
                update: { revenueCatId: customer.subscriber_id },
                create: {
                    userId: user.id,
                    revenueCatId: customer.subscriber_id,
                    tier: 'free',
                    status: 'active'
                }
            });
        }

        // Get the user's updated RevenueCat ID
        const updatedUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: { subscription: true }
        });

        if (!updatedUser?.subscription?.revenueCatId) {
            return NextResponse.json(
                { error: 'Failed to create RevenueCat customer' },
                { status: 500 }
            );
        }

        // Generate a checkout URL for RevenueCat
        // This would typically link to your RevenueCat checkout page
        const checkoutUrl = `https://your-domain.com/checkout?user_id=${updatedUser.subscription.revenueCatId}&plan=${tier}`;

        // In a real implementation, you would generate a RevenueCat checkout URL
        // or redirect to your payment processor

        return NextResponse.json({
            success: true,
            checkoutUrl
        });
    } catch (error) {
        console.error('Subscription upgrade error:', error);
        return NextResponse.json(
            { error: 'Failed to upgrade subscription' },
            { status: 500 }
        );
    }
}