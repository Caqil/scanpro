// app/api/subscription/cancel/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { cancelMidtransSubscription } from '@/lib/midtrans';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user with subscription
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { subscription: true }
        });

        if (!user || !user.subscription) {
            return NextResponse.json(
                { error: 'No active subscription found' },
                { status: 404 }
            );
        }

        if (user.subscription.tier === 'free') {
            return NextResponse.json(
                { error: 'No paid subscription to cancel' },
                { status: 400 }
            );
        }

        // If there's a Midtrans order ID, cancel it
        if (user.subscription.midtransOrderId) {
            try {
                await cancelMidtransSubscription(
                    user.subscription.midtransOrderId,
                    'Customer requested cancellation'
                );
            } catch (midtransError) {
                console.error('Midtrans cancel error:', midtransError);
                // Continue anyway to update our database
            }
        }

        // Update subscription status in our database
        // Most payment providers will keep the subscription active until the end of the billing period
        await prisma.subscription.update({
            where: { userId: user.id },
            data: {
                status: 'canceled',
                cancelAtPeriodEnd: true
                // Note: We don't change the tier immediately, as users typically
                // maintain access until the end of their billing period
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Subscription canceled successfully'
        });
    } catch (error) {
        console.error('Subscription cancellation error:', error);
        return NextResponse.json(
            { error: 'Failed to cancel subscription' },
            { status: 500 }
        );
    }
}