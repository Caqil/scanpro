// app/api/subscription/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSubscriptionDetails, updateUserSubscription, PAYPAL_PLAN_IDS } from '@/lib/paypal';

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

    // Get session_id from query params
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('session_id') || searchParams.get('subscription_id');

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // Find the subscription in our database
    const subscription = await prisma.subscription.findFirst({
      where: {
        paypalSubscriptionId: subscriptionId,
        userId: session.user.id,
      },
    });

    if (!subscription) {
      // Check PayPal directly
      try {
        const paypalSubscriptionDetails = await getSubscriptionDetails(subscriptionId);
        
        // If subscription exists in PayPal but not in our database, create it
        if (paypalSubscriptionDetails && paypalSubscriptionDetails.id) {
          const status = paypalSubscriptionDetails.status.toLowerCase();
          const planId = paypalSubscriptionDetails.plan_id;
          
          // Determine tier from plan ID
          let tier = 'basic';
          Object.entries(PAYPAL_PLAN_IDS).forEach(([key, value]) => {
            if (value === planId) {
              tier = key;
            }
          });

          // Parse billing cycle dates
          const currentPeriodStart = paypalSubscriptionDetails.billing_info.last_payment?.time
            ? new Date(paypalSubscriptionDetails.billing_info.last_payment.time)
            : new Date();
            
          const currentPeriodEnd = paypalSubscriptionDetails.billing_info.next_billing_time
            ? new Date(paypalSubscriptionDetails.billing_info.next_billing_time)
            : new Date(currentPeriodStart.getTime() + 30 * 24 * 60 * 60 * 1000);

          // Create subscription in our database
          const newSubscription = await updateUserSubscription(session.user.id, {
            paypalSubscriptionId: subscriptionId,
            paypalPlanId: planId,
            tier,
            status: status === 'active' ? 'active' : 'pending',
            currentPeriodStart,
            currentPeriodEnd,
          });

          return NextResponse.json({
            success: true,
            subscription: newSubscription,
          });
        }
      } catch (paypalError) {
        console.error('Error verifying with PayPal:', paypalError);
        return NextResponse.json(
          { error: 'Subscription not found' },
          { status: 404 }
        );
      }
    }

    // If subscription is already in our database, return it
    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error('Error verifying subscription:', error);
    
    return NextResponse.json(
      { error: 'Failed to verify subscription' },
      { status: 500 }
    );
  }
}