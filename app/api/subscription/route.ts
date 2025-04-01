// app/api/subscription/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createSubscription, getTierPlanId } from '@/lib/paypal-api';

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

    // Parse request body
    const { tier } = await request.json();

    if (!tier) {
      return NextResponse.json(
        { error: 'Subscription tier is required' },
        { status: 400 }
      );
    }

    // Validate tier
    const validTiers = ['basic', 'pro', 'enterprise'];
    if (!validTiers.includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      );
    }

    // Get user's current subscription
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

    // Get plan ID for the requested tier
    const planId = getTierPlanId(tier);
    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID not configured for this tier' },
        { status: 500 }
      );
    }

    // Determine base URL for callbacks
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const returnUrl = `${baseUrl}/en/subscription/success`;
    const cancelUrl = `${baseUrl}/en/subscription/cancel`;

    // Check if the user is downgrading to free tier
    if (tier === 'free') {
      // If user has an active subscription, cancel it
      if (user.subscription && user.subscription.status === 'active' && user.subscription.providerSubscriptionId) {
        try {
          // Import cancelSubscription dynamically to avoid circular dependencies
          const { cancelSubscription } = require('@/lib/paypal-api');
          await cancelSubscription(user.subscription.providerSubscriptionId);
        } catch (error) {
          console.error('Error cancelling subscription:', error);
          // Continue regardless of errors, as we still want to update our database
        }
      }

      // Update subscription to free tier
      await prisma.subscription.update({
        where: { userId: user.id },
        data: {
          tier: 'free',
          status: 'active', // Keep status as active for free tier
          canceledAt: new Date(),
          pendingTier: null,
          pendingProvider: null,
          updatedAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Subscription downgraded to free tier',
      });
    }

    // Create a new PayPal subscription
    const { id: sessionId, approvalUrl } = await createSubscription(planId, returnUrl, cancelUrl);

    // Update user's subscription status to pending with new tier
    if (user.subscription) {
      await prisma.subscription.update({
        where: { userId: user.id },
        data: {
          pendingTier: tier,
          pendingProvider: 'paypal',
          providerSessionId: sessionId,
          status: 'pending',
          updatedAt: new Date()
        }
      });
    } else {
      // Create new subscription record if user doesn't have one
      await prisma.subscription.create({
        data: {
          userId: user.id,
          tier: 'free', // Start with free tier
          pendingTier: tier, // Mark pending upgrade
          pendingProvider: 'paypal',
          providerSessionId: sessionId,
          status: 'pending'
        }
      });
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: approvalUrl,
      sessionId
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

// GET endpoint to check subscription status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    });

    return NextResponse.json({ 
      success: true, 
      subscription 
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription details' },
      { status: 500 }
    );
  }
}