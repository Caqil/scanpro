// lib/paypal.ts
import { PrismaClient, User, Subscription } from '@prisma/client';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const prisma = new PrismaClient();

// Define plan IDs for different tiers
export const PAYPAL_PLAN_IDS = {
  basic: process.env.PAYPAL_BASIC_PLAN_ID,
  pro: process.env.PAYPAL_PRO_PLAN_ID,
  enterprise: process.env.PAYPAL_ENTERPRISE_PLAN_ID,
};

// Get access token for PayPal API
async function getAccessToken(): Promise<string> {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`PayPal API error: ${data.error_description || 'Failed to get access token'}`);
    }
    
    return data.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error);
    throw error;
  }
}

// Create a subscription
export async function createSubscription(userId: string, plan: string): Promise<{ subscriptionId: string, approvalUrl: string }> {
  const accessToken = await getAccessToken();
  const planId = PAYPAL_PLAN_IDS[plan as keyof typeof PAYPAL_PLAN_IDS];
  
  if (!planId) {
    throw new Error(`Invalid plan: ${plan}`);
  }

  // Get the user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Create return and cancel URLs
  const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`;
  const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/subscription/cancel`;

  try {
    const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `${userId}-${Date.now()}`, // Idempotency key
      },
      body: JSON.stringify({
        plan_id: planId,
        application_context: {
          brand_name: 'ScanPro',
          locale: 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          payment_method: {
            payer_selected: 'PAYPAL',
            payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
          },
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
        subscriber: {
          name: {
            given_name: user.name?.split(' ')[0] || 'User',
            surname: user.name?.split(' ')[1] || '',
          },
          email_address: user.email || undefined,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`PayPal API error: ${data.message || JSON.stringify(data)}`);
    }

    // Find approval URL
    const approvalUrl = data.links.find((link: any) => link.rel === 'approve').href;

    return { 
      subscriptionId: data.id,
      approvalUrl 
    };
  } catch (error) {
    console.error('Error creating PayPal subscription:', error);
    throw error;
  }
}

// Get subscription details
export async function getSubscriptionDetails(subscriptionId: string) {
  const accessToken = await getAccessToken();

  try {
    const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`PayPal API error: ${data.message || JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error('Error getting subscription details:', error);
    throw error;
  }
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string, reason?: string) {
  const accessToken = await getAccessToken();

  try {
    const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        reason: reason || 'Canceled by user',
      }),
    });

    // No content is returned for successful cancellation
    if (response.status !== 204) {
      const data = await response.json();
      throw new Error(`PayPal API error: ${data.message || JSON.stringify(data)}`);
    }

    return true;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

// Update user's subscription in database
export async function updateUserSubscription(
  userId: string, 
  subscriptionData: {
    paypalSubscriptionId?: string;
    paypalPlanId?: string;
    tier: string;
    status: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    canceledAt?: Date | null;
  }
) {
  try {
    // Check if user already has a subscription
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (existingSubscription) {
      // Update existing subscription
      return prisma.subscription.update({
        where: { userId },
        data: subscriptionData,
      });
    } else {
      // Create new subscription
      return prisma.subscription.create({
        data: {
          userId,
          ...subscriptionData,
        },
      });
    }
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
}

// Process a subscription webhook event
export async function processSubscriptionWebhook(event: any) {
  // Record the webhook event
  const eventRecord = await prisma.paymentWebhookEvent.create({
    data: {
      eventId: event.id,
      eventType: event.event_type,
      resourceType: event.resource_type,
      resourceId: event.resource.id,
      rawData: JSON.stringify(event),
    },
  });

  // Check if we've already processed this event
  const existingEvent = await prisma.paymentWebhookEvent.findFirst({
    where: {
      eventId: event.id,
      status: 'processed',
    },
  });

  if (existingEvent) {
    console.log(`Event ${event.id} already processed. Skipping.`);
    return { success: true, message: 'Event already processed' };
  }

  try {
    // Process based on event type
    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.CREATED':
        await handleSubscriptionCreated(event.resource);
        break;
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await handleSubscriptionActivated(event.resource);
        break;
      case 'BILLING.SUBSCRIPTION.UPDATED':
        await handleSubscriptionUpdated(event.resource);
        break;
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handleSubscriptionCancelled(event.resource);
        break;
      case 'BILLING.SUBSCRIPTION.EXPIRED':
        await handleSubscriptionExpired(event.resource);
        break;
      case 'PAYMENT.SALE.COMPLETED':
        await handlePaymentCompleted(event.resource);
        break;
      default:
        console.log(`Unhandled event type: ${event.event_type}`);
    }

    // Mark event as processed
    await prisma.paymentWebhookEvent.update({
      where: { id: eventRecord.id },
      data: { status: 'processed' },
    });

    return { success: true };
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    // Mark event as failed
    await prisma.paymentWebhookEvent.update({
      where: { id: eventRecord.id },
      data: { status: 'failed' },
    });
    
    throw error;
  }
}

// Handle BILLING.SUBSCRIPTION.CREATED
async function handleSubscriptionCreated(resource: any) {
  // Get the subscription ID and plan ID
  const subscriptionId = resource.id;
  const planId = resource.plan_id;

  // Map PayPal plan ID to ScanPro tier
  let tier = 'basic';
  Object.entries(PAYPAL_PLAN_IDS).forEach(([key, value]) => {
    if (value === planId) {
      tier = key;
    }
  });

  // Get custom ID from the subscription (should be the user ID)
  // Note: In real implementation, you'd need a way to identify the user
  // This could be through custom fields or through a separate record
  // For simplicity, we're assuming the user ID can be found
  
  // This is a placeholder - you'll need a real implementation
  const findUserBySubscriptionPromise = prisma.subscription.findFirst({
    where: { paypalSubscriptionId: subscriptionId },
    include: { user: true },
  });

  const subscription = await findUserBySubscriptionPromise;
  
  if (!subscription) {
    console.log(`No user found for subscription ${subscriptionId}`);
    return;
  }

  // Update the subscription in the database
  await updateUserSubscription(subscription.userId, {
    tier,
    status: 'pending', // Will be updated to 'active' when activated
    paypalSubscriptionId: subscriptionId,
    paypalPlanId: planId,
  });
}

// Handle BILLING.SUBSCRIPTION.ACTIVATED
async function handleSubscriptionActivated(resource: any) {
  const subscriptionId = resource.id;

  // Find the user with this subscription
  const subscription = await prisma.subscription.findFirst({
    where: { paypalSubscriptionId: subscriptionId },
  });

  if (!subscription) {
    console.log(`No subscription found with ID ${subscriptionId}`);
    return;
  }

  // Parse billing cycle dates
  const currentPeriodStart = resource.billing_info.last_payment?.time
    ? new Date(resource.billing_info.last_payment.time)
    : new Date();
    
  const currentPeriodEnd = resource.billing_info.next_billing_time
    ? new Date(resource.billing_info.next_billing_time)
    : new Date(currentPeriodStart.getTime() + 30 * 24 * 60 * 60 * 1000); // Default to 30 days

  // Update subscription to active
  await updateUserSubscription(subscription.userId, {
    status: 'active',
    currentPeriodStart,
    currentPeriodEnd,
    tier: subscription.tier, // Keep the existing tier
    paypalSubscriptionId: subscription.paypalSubscriptionId,
    paypalPlanId: subscription.paypalPlanId,
  });
}

// Handle BILLING.SUBSCRIPTION.UPDATED
async function handleSubscriptionUpdated(resource: any) {
  const subscriptionId = resource.id;
  const status = resource.status.toLowerCase();

  // Find the subscription
  const subscription = await prisma.subscription.findFirst({
    where: { paypalSubscriptionId: subscriptionId },
  });

  if (!subscription) {
    console.log(`No subscription found with ID ${subscriptionId}`);
    return;
  }

  // Handle different status updates
  if (status === 'active') {
    // Parse billing cycle dates
    const currentPeriodStart = resource.billing_info.last_payment?.time
      ? new Date(resource.billing_info.last_payment.time)
      : new Date();
      
    const currentPeriodEnd = resource.billing_info.next_billing_time
      ? new Date(resource.billing_info.next_billing_time)
      : new Date(currentPeriodStart.getTime() + 30 * 24 * 60 * 60 * 1000);

    await updateUserSubscription(subscription.userId, {
      status: 'active',
      currentPeriodStart,
      currentPeriodEnd,
      tier: subscription.tier,
      paypalSubscriptionId: subscription.paypalSubscriptionId,
      paypalPlanId: subscription.paypalPlanId,
    });
  } else if (status === 'suspended') {
    await updateUserSubscription(subscription.userId, {
      status: 'past_due',
      tier: subscription.tier,
      paypalSubscriptionId: subscription.paypalSubscriptionId,
      paypalPlanId: subscription.paypalPlanId,
    });
  } else {
    // Generic update for other statuses
    await updateUserSubscription(subscription.userId, {
      status: status,
      tier: subscription.tier,
      paypalSubscriptionId: subscription.paypalSubscriptionId,
      paypalPlanId: subscription.paypalPlanId,
    });
  }
}

// Handle BILLING.SUBSCRIPTION.CANCELLED
async function handleSubscriptionCancelled(resource: any) {
  const subscriptionId = resource.id;

  // Find the subscription
  const subscription = await prisma.subscription.findFirst({
    where: { paypalSubscriptionId: subscriptionId },
  });

  if (!subscription) {
    console.log(`No subscription found with ID ${subscriptionId}`);
    return;
  }

  // Update subscription to canceled status
  await updateUserSubscription(subscription.userId, {
    status: 'canceled',
    canceledAt: new Date(),
    tier: subscription.tier,
    paypalSubscriptionId: subscription.paypalSubscriptionId,
    paypalPlanId: subscription.paypalPlanId,
    currentPeriodStart: subscription.currentPeriodStart,
    currentPeriodEnd: subscription.currentPeriodEnd,
  });
}

// Handle BILLING.SUBSCRIPTION.EXPIRED
async function handleSubscriptionExpired(resource: any) {
  const subscriptionId = resource.id;

  // Find the subscription
  const subscription = await prisma.subscription.findFirst({
    where: { paypalSubscriptionId: subscriptionId },
  });

  if (!subscription) {
    console.log(`No subscription found with ID ${subscriptionId}`);
    return;
  }

  // Reset to free tier
  await updateUserSubscription(subscription.userId, {
    status: 'active',
    tier: 'free',
    paypalSubscriptionId: null,
    paypalPlanId: null,
    canceledAt: new Date(),
  });
}

// Handle PAYMENT.SALE.COMPLETED
async function handlePaymentCompleted(resource: any) {
  // In a real implementation, you might want to record the payment
  // and potentially update the subscription period
  console.log('Payment completed:', resource.id);
}