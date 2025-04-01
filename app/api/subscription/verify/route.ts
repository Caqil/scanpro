// app/api/subscription/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSubscriptionDetails, updateUserSubscription, PAYPAL_PLAN_IDS } from '@/lib/paypal';
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscription_id');

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    // Verify with PayPal
    const paypalSubscriptionDetails = await getSubscriptionDetails(subscriptionId);

    if (!paypalSubscriptionDetails || !paypalSubscriptionDetails.id) {
      // If PayPal doesn’t recognize the subscription, assume it was canceled or abandoned
      // Check if user has an existing subscription; if not, ensure they’re on free
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { subscription: true },
      });

      if (user && !user.subscription?.paypalSubscriptionId) {
        await updateUserSubscription(session.user.id, {
          tier: 'free',
          status: 'active',
          paypalSubscriptionId: null,
          paypalPlanId: null,
        });
      }

      return NextResponse.json({ error: 'Subscription not found or was canceled' }, { status: 404 });
    }

    const status = paypalSubscriptionDetails.status.toLowerCase();

    if (status === 'active' || status === 'approved') {
      const planId = paypalSubscriptionDetails.plan_id;
      let tier = 'basic';
      Object.entries(PAYPAL_PLAN_IDS).forEach(([key, value]) => {
        if (value === planId) tier = key;
      });

      const currentPeriodStart = paypalSubscriptionDetails.billing_info.last_payment?.time
        ? new Date(paypalSubscriptionDetails.billing_info.last_payment.time)
        : new Date();
      const currentPeriodEnd = paypalSubscriptionDetails.billing_info.next_billing_time
        ? new Date(paypalSubscriptionDetails.billing_info.next_billing_time)
        : new Date(currentPeriodStart.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Update subscription only when PayPal confirms it’s active
      const subscription = await updateUserSubscription(session.user.id, {
        paypalSubscriptionId: subscriptionId,
        paypalPlanId: planId,
        tier,
        status: 'active',
        currentPeriodStart,
        currentPeriodEnd,
      });

      return NextResponse.json({ success: true, subscription });
    }

    // If not active (e.g., canceled or pending), revert to free if no prior subscription exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    });

    if (user && !user.subscription?.paypalSubscriptionId) {
      await updateUserSubscription(session.user.id, {
        tier: 'free',
        status: 'active',
        paypalSubscriptionId: null,
        paypalPlanId: null,
      });
    }

    return NextResponse.json({ success: false, message: 'Subscription not yet active or was canceled' });
  } catch (error) {
    console.error('Error verifying subscription:', error);
    return NextResponse.json({ error: 'Failed to verify subscription' }, { status: 500 });
  }
}