// app/api/subscription/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSubscriptionDetails, isSubscriptionActive } from '@/lib/paypal-api';

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get session_id from query parameters
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Find the subscription by providerSessionId
    const subscription = await prisma.subscription.findFirst({
      where: {
        OR: [
          { providerSessionId: sessionId },
          { providerSubscriptionId: sessionId }
        ]
      }
    });

    if (!subscription) {
      console.log(`Subscription for session ${sessionId} not found`);
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Make sure this is the user's own subscription
    if (subscription.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access to subscription' },
        { status: 403 }
      );
    }

    // If subscription is already active, just return it
    if (subscription.status === 'active') {
      return NextResponse.json({
        success: true,
        subscription
      });
    }

    // Verify with PayPal if the subscription is active
    try {
      let active = false;
      let subDetails = null;

      // Try to fetch subscription details
      if (subscription.providerSubscriptionId) {
        active = await isSubscriptionActive(subscription.providerSubscriptionId);
        subDetails = await getSubscriptionDetails(subscription.providerSubscriptionId);
      } else if (subscription.providerSessionId) {
        // This might be a session ID directly after approval
        try {
          subDetails = await getSubscriptionDetails(subscription.providerSessionId);
          active = subDetails.status === 'ACTIVE';
        } catch (e) {
          console.log(`Could not get subscription details from session ID ${subscription.providerSessionId}`);
          // This is expected if the session ID is not yet a subscription ID
        }
      }

      // Calculate expiration date based on billing cycle
      let expiresAt = null;
      if (subDetails && subDetails.billing_info?.cycle_executions?.[0]) {
        const now = new Date();
        expiresAt = new Date(now);
        const cycle = subDetails.billing_info.cycle_executions[0];
        const frequency = cycle.frequency;

        if (frequency.interval_unit === 'DAY') {
          expiresAt.setDate(now.getDate() + frequency.interval_count);
        } else if (frequency.interval_unit === 'WEEK') {
          expiresAt.setDate(now.getDate() + (frequency.interval_count * 7));
        } else if (frequency.interval_unit === 'MONTH') {
          expiresAt.setMonth(now.getMonth() + frequency.interval_count);
        } else if (frequency.interval_unit === 'YEAR') {
          expiresAt.setFullYear(now.getFullYear() + frequency.interval_count);
        }
      } else {
        // Default to 30 days if cycle not found
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
      }

      // Update subscription status
      const updatedSubscription = await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          // If we have a pending tier, upgrade to it
          tier: subscription.pendingTier || subscription.tier,
          // Set subscription to active if verified with PayPal, otherwise leave as pending
          status: active ? 'active' : subscription.status,
          // Store PayPal subscription ID if available
          providerSubscriptionId:
            subDetails?.id !== subscription.providerSessionId
              ? subDetails?.id || subscription.providerSubscriptionId
              : subscription.providerSubscriptionId,
          // Clear pending tier since we've processed it
          pendingTier: active ? null : subscription.pendingTier,
          pendingProvider: active ? null : subscription.pendingProvider,
          expiresAt: active ? expiresAt : subscription.expiresAt,
          // Update metadata if available
          ...(subDetails ? { metadata: subDetails } : {})
        }
      });

      return NextResponse.json({
        success: true,
        subscription: updatedSubscription,
        verified: active
      });
    } catch (error) {
      console.error('Error verifying subscription with PayPal:', error);

      // If we can't verify with PayPal, mark as 'pending_verification'
      const updatedSubscription = await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'pending_verification'
        }
      });

      return NextResponse.json({
        success: false,
        subscription: updatedSubscription,
        error: 'Failed to verify subscription with PayPal'
      });
    }
  } catch (error) {
    console.error('Subscription verification error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}