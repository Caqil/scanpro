// app/api/webhooks/paypal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyWebhookSignature, getSubscriptionDetails } from '@/lib/paypal-api';

export async function POST(request: NextRequest) {
    try {
        // Get raw body
        const bodyText = await request.text();

        // Get required headers for verification
        const webhookId = process.env.PAYPAL_WEBHOOK_ID;

        if (!webhookId) {
            console.error('PayPal webhook ID not configured');
            return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
        }

        const headers = {
            'paypal-auth-algo': request.headers.get('paypal-auth-algo') || '',
            'paypal-cert-url': request.headers.get('paypal-cert-url') || '',
            'paypal-transmission-id': request.headers.get('paypal-transmission-id') || '',
            'paypal-transmission-sig': request.headers.get('paypal-transmission-sig') || '',
            'paypal-transmission-time': request.headers.get('paypal-transmission-time') || '',
        };

        // Parse webhook event data
        const eventData = JSON.parse(bodyText);

        // Store the webhook event in the database first
        try {
            await prisma.paymentWebhookEvent.create({
                data: {
                    eventId: eventData.id,
                    eventType: eventData.event_type,
                    resourceType: eventData.resource_type,
                    resourceId: eventData.resource.id,
                    status: 'pending',
                    rawData: bodyText,
                },
            });
        } catch (e) {
            // If it's a duplicate eventId, just return success (prevent duplicate processing)
            if (e instanceof Error && e.message.includes('Unique constraint')) {
                return NextResponse.json({ success: true, message: 'Webhook already processed' });
            }
            throw e;
        }

        // Skip verification in development environment for easier testing
        let isVerified = true;
        if (process.env.NODE_ENV === 'production') {
            // Verify the webhook signature
            isVerified = await verifyWebhookSignature(bodyText, headers);

            if (!isVerified) {
                // Update status to failed
                await prisma.paymentWebhookEvent.update({
                    where: { eventId: eventData.id },
                    data: { status: 'failed' },
                });

                console.error('Invalid webhook signature');
                return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
            }
        }

        // Process the webhook based on event type
        const eventType = eventData.event_type;
        const resourceId = eventData.resource.id;

        // Handle different event types
        switch (eventType) {
            case 'BILLING.SUBSCRIPTION.CREATED':
                await handleSubscriptionCreated(resourceId);
                break;

            case 'BILLING.SUBSCRIPTION.ACTIVATED':
                await handleSubscriptionActivated(resourceId);
                break;

            case 'BILLING.SUBSCRIPTION.UPDATED':
                await handleSubscriptionUpdated(resourceId);
                break;

            case 'BILLING.SUBSCRIPTION.CANCELLED':
                await handleSubscriptionCancelled(resourceId);
                break;

            case 'BILLING.SUBSCRIPTION.EXPIRED':
                await handleSubscriptionExpired(resourceId);
                break;

            case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
                await handlePaymentFailed(resourceId);
                break;

            case 'PAYMENT.SALE.COMPLETED':
                await handlePaymentCompleted(eventData.resource);
                break;

            default:
                console.log(`Unhandled webhook event type: ${eventType}`);
        }

        // Update webhook event status to processed
        await prisma.paymentWebhookEvent.update({
            where: { eventId: eventData.id },
            data: { status: 'processed' },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json(
            { error: 'Error processing webhook' },
            { status: 500 }
        );
    }
}

// Handle subscription created event
async function handleSubscriptionCreated(subscriptionId: string) {
    try {
        // Get subscription details from PayPal
        const subscriptionDetails = await getSubscriptionDetails(subscriptionId);

        // Find the subscription in our database
        const subscription = await prisma.subscription.findFirst({
            where: { providerSessionId: subscriptionId },
        });

        if (!subscription) {
            console.log(`Subscription ${subscriptionId} not found in database`);
            return;
        }

        // Update with the subscription ID
        await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
                providerSubscriptionId: subscriptionId,
                updatedAt: new Date(),
            },
        });
    } catch (error) {
        console.error(`Error handling subscription created event for ${subscriptionId}:`, error);
    }
}

// Handle subscription activated event
async function handleSubscriptionActivated(subscriptionId: string) {
    try {
        // Get subscription details from PayPal
        const subscriptionDetails = await getSubscriptionDetails(subscriptionId);

        // Find the subscription in our database by either providerSessionId or providerSubscriptionId
        const subscription = await prisma.subscription.findFirst({
            where: {
                OR: [
                    { providerSessionId: subscriptionId },
                    { providerSubscriptionId: subscriptionId },
                ]
            },
        });

        if (!subscription) {
            console.log(`Subscription ${subscriptionId} not found in database`);
            return;
        }

        // Calculate expiration date based on billing cycle
        const now = new Date();
        let expiresAt = new Date(now);

        if (subscriptionDetails.billing_info?.cycle_executions?.[0]) {
            const cycle = subscriptionDetails.billing_info.cycle_executions[0];
            const frequency = subscriptionDetails.billing_info.cycle_executions[0].frequency;

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
            expiresAt.setDate(now.getDate() + 30);
        }

        // Update subscription status
        await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
                status: 'active',
                tier: subscription.pendingTier || subscription.tier,
                pendingTier: null,
                providerSubscriptionId: subscriptionId,
                expiresAt,
                updatedAt: now,
            },
        });

        // Record payment
        if (subscriptionDetails.billing_info?.last_payment) {
            await prisma.paymentHistory.create({
                data: {
                    userId: subscription.userId,
                    amount: parseFloat(subscriptionDetails.billing_info.last_payment.amount.value),
                    currency: subscriptionDetails.billing_info.last_payment.amount.currency_code,
                    status: 'completed',
                    paymentProvider: 'paypal',
                    providerTransactionId: subscriptionId,
                    metadata: subscriptionDetails,
                },
            });
        }
    } catch (error) {
        console.error(`Error handling subscription activated event for ${subscriptionId}:`, error);
    }
}

// Handle subscription updated event
async function handleSubscriptionUpdated(subscriptionId: string) {
    try {
        // Get subscription details from PayPal
        const subscriptionDetails = await getSubscriptionDetails(subscriptionId);

        // Find the subscription in our database
        const subscription = await prisma.subscription.findFirst({
            where: {
                OR: [
                    { providerSessionId: subscriptionId },
                    { providerSubscriptionId: subscriptionId },
                ]
            },
        });

        if (!subscription) {
            console.log(`Subscription ${subscriptionId} not found in database`);
            return;
        }

        // Determine tier from plan ID
        let tier = subscription.tier;
        const planId = subscriptionDetails.plan_id;

        if (planId === process.env.PAYPAL_PLAN_BASIC) {
            tier = 'basic';
        } else if (planId === process.env.PAYPAL_PLAN_PRO) {
            tier = 'pro';
        } else if (planId === process.env.PAYPAL_PLAN_ENTERPRISE) {
            tier = 'enterprise';
        }

        // Update subscription status
        await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
                tier,
                updatedAt: new Date(),
            },
        });
    } catch (error) {
        console.error(`Error handling subscription updated event for ${subscriptionId}:`, error);
    }
}

// Handle subscription cancelled event
async function handleSubscriptionCancelled(subscriptionId: string) {
    try {
        // Find the subscription in our database
        const subscription = await prisma.subscription.findFirst({
            where: {
                OR: [
                    { providerSessionId: subscriptionId },
                    { providerSubscriptionId: subscriptionId },
                ]
            },
        });

        if (!subscription) {
            console.log(`Subscription ${subscriptionId} not found in database`);
            return;
        }

        // Update subscription status
        await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
                status: 'canceled',
                canceledAt: new Date(),
                updatedAt: new Date(),
            },
        });
    } catch (error) {
        console.error(`Error handling subscription cancelled event for ${subscriptionId}:`, error);
    }
}

// Handle subscription expired event
async function handleSubscriptionExpired(subscriptionId: string) {
    try {
        // Find the subscription in our database
        const subscription = await prisma.subscription.findFirst({
            where: {
                OR: [
                    { providerSessionId: subscriptionId },
                    { providerSubscriptionId: subscriptionId },
                ]
            },
        });

        if (!subscription) {
            console.log(`Subscription ${subscriptionId} not found in database`);
            return;
        }

        // Update subscription status
        await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
                status: 'expired',
                tier: 'free',
                updatedAt: new Date(),
            },
        });
    } catch (error) {
        console.error(`Error handling subscription expired event for ${subscriptionId}:`, error);
    }
}

// Handle payment failed event
async function handlePaymentFailed(subscriptionId: string) {
    try {
        // Get subscription details from PayPal
        const subscriptionDetails = await getSubscriptionDetails(subscriptionId);

        // Find the subscription in our database
        const subscription = await prisma.subscription.findFirst({
            where: {
                OR: [
                    { providerSessionId: subscriptionId },
                    { providerSubscriptionId: subscriptionId },
                ]
            },
        });

        if (!subscription) {
            console.log(`Subscription ${subscriptionId} not found in database`);
            return;
        }

        // Update subscription status to past_due if it's currently active
        if (subscription.status === 'active') {
            await prisma.subscription.update({
                where: { id: subscription.id },
                data: {
                    status: 'past_due',
                    updatedAt: new Date(),
                },
            });
        }

        // Record failed payment
        await prisma.paymentHistory.create({
            data: {
                userId: subscription.userId,
                amount: subscriptionDetails.billing_info?.last_payment?.amount?.value
                    ? parseFloat(subscriptionDetails.billing_info.last_payment.amount.value)
                    : 0,
                currency: subscriptionDetails.billing_info?.last_payment?.amount?.currency_code || 'USD',
                status: 'failed',
                paymentProvider: 'paypal',
                providerTransactionId: subscriptionId,
                errorMessage: 'Payment failed',
                metadata: subscriptionDetails,
            },
        });
    } catch (error) {
        console.error(`Error handling payment failed event for ${subscriptionId}:`, error);
    }
}

// Handle payment completed event
async function handlePaymentCompleted(paymentResource: any) {
    try {
        // Extract subscription ID and payment details
        const subscriptionId = paymentResource.billing_agreement_id;
        if (!subscriptionId) {
            console.log('Payment not associated with a subscription');
            return;
        }

        // Find the subscription in our database
        const subscription = await prisma.subscription.findFirst({
            where: {
                OR: [
                    { providerSessionId: subscriptionId },
                    { providerSubscriptionId: subscriptionId },
                ]
            },
        });

        if (!subscription) {
            console.log(`Subscription ${subscriptionId} not found in database`);
            return;
        }

        // Calculate new expiration date
        const now = new Date();
        let expiresAt = new Date(now);

        // Default to 30 days
        expiresAt.setDate(now.getDate() + 30);

        // Get subscription details for better expiration calculation
        try {
            const subDetails = await getSubscriptionDetails(subscriptionId);

            if (subDetails.billing_info?.cycle_executions?.[0]) {
                const frequency = subDetails.billing_info.cycle_executions[0].frequency;

                if (frequency.interval_unit === 'DAY') {
                    expiresAt.setDate(now.getDate() + frequency.interval_count);
                } else if (frequency.interval_unit === 'WEEK') {
                    expiresAt.setDate(now.getDate() + (frequency.interval_count * 7));
                } else if (frequency.interval_unit === 'MONTH') {
                    expiresAt.setMonth(now.getMonth() + frequency.interval_count);
                } else if (frequency.interval_unit === 'YEAR') {
                    expiresAt.setFullYear(now.getFullYear() + frequency.interval_count);
                }
            }
        } catch (error) {
            console.log(`Error getting subscription details for expiration calculation: ${error}`);
            // Continue with default expiration
        }

        // Update subscription status
        await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
                status: 'active',
                expiresAt,
                lastPaymentAmount: parseFloat(paymentResource.amount.total),
                lastPaymentCurrency: paymentResource.amount.currency,
                lastPaymentDate: new Date(),
                updatedAt: new Date(),
            },
        });

        // Record payment
        await prisma.paymentHistory.create({
            data: {
                userId: subscription.userId,
                amount: parseFloat(paymentResource.amount.total),
                currency: paymentResource.amount.currency,
                status: 'completed',
                paymentProvider: 'paypal',
                providerTransactionId: paymentResource.id,
                metadata: paymentResource,
            },
        });
    } catch (error) {
        console.error(`Error handling payment completed event:`, error);
    }
}