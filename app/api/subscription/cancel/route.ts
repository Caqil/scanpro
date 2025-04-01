// app/api/subscription/cancel/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cancelSubscription } from '@/lib/paypal-api';

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find user's subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Check if there's a pending subscription
    if (subscription.status === 'pending' && subscription.pendingTier) {
      // Just cancel the pending upgrade without calling PayPal
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'active', // Revert to active if already on a paid plan
          pendingTier: null,
          pendingProvider: null,
          canceledAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Pending subscription upgrade cancelled'
      });
    }

    // If there's an active PayPal subscription, cancel it
    if (subscription.status === 'active' && subscription.providerSubscriptionId) {
      try {
        await cancelSubscription(subscription.providerSubscriptionId);
      } catch (error) {
        console.error('Error cancelling PayPal subscription:', error);
        // Continue regardless of errors, as we still want to update our database
      }
    }

    // Update subscription in database
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'canceled',
        tier: 'free', // Downgrade immediately to free tier
        canceledAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}