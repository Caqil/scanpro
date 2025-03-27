// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16'
});

export async function POST(req: NextRequest) {
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    const body = await req.text();

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error('Webhook Error:', err);
        return NextResponse.json(
            { error: 'Webhook signature verification failed' },
            { status: 400 }
        );
    }

    // Handle different event types
    switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionUpdate(subscription);
            break;

        case 'customer.subscription.deleted':
            const deletedSubscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionCancellation(deletedSubscription);
            break;

        case 'invoice.payment_succeeded':
            const invoice = event.data.object as Stripe.Invoice;
            await handlePaymentSuccess(invoice);
            break;

        case 'invoice.payment_failed':
            const failedInvoice = event.data.object as Stripe.Invoice;
            await handlePaymentFailure(failedInvoice);
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}

// Helper functions to handle subscription events
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;

    // Find user by Stripe customer ID
    const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId }
    });

    if (!user) {
        console.error('User not found for customer ID:', customerId);
        return;
    }

    // Determine plan from Stripe price ID
    const plan = getSubscriptionPlan(subscription.items.data[0].price.id);

    // Update subscription in database
    await prisma.subscription.upsert({
        where: { userId: user.id },
        update: {
            plan,
            status: mapStripeStatusToPrisma(subscription.status),
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            stripeSubscriptionId: subscription.id
        },
        create: {
            userId: user.id,
            plan,
            status: mapStripeStatusToPrisma(subscription.status),
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            stripeSubscriptionId: subscription.id
        }
    });
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;

    // Find user by Stripe customer ID
    const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId }
    });

    if (!user) {
        console.error('User not found for customer ID:', customerId);
        return;
    }

    // Update subscription status
    await prisma.subscription.update({
        where: { userId: user.id },
        data: {
            status: 'CANCELED',
            cancelAtPeriodEnd: true
        }
    });
}

async function handlePaymentSuccess(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;

    // Find user by Stripe customer ID
    const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId }
    });

    if (!user) {
        console.error('User not found for customer ID:', customerId);
        return;
    }

    // Update subscription to active
    await prisma.subscription.update({
        where: { userId: user.id },
        data: {
            status: 'ACTIVE'
        }
    });
}

async function handlePaymentFailure(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;

    // Find user by Stripe customer ID
    const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId }
    });

    if (!user) {
        console.error('User not found for customer ID:', customerId);
        return;
    }

    // Update subscription to past due
    await prisma.subscription.update({
        where: { userId: user.id },
        data: {
            status: 'PAST_DUE'
        }
    });
}

// Utility function to map Stripe subscription status to our enum
function mapStripeStatusToPrisma(status: string): SubscriptionStatus {
    switch (status) {
        case 'active':
            return 'ACTIVE';
        case 'past_due':
            return 'PAST_DUE';
        case 'canceled':
            return 'CANCELED';
        case 'unpaid':
            return 'UNPAID';
        case 'incomplete':
            return 'INCOMPLETE';
        case 'incomplete_expired':
            return 'INCOMPLETE_EXPIRED';
        default:
            return 'CANCELED';
    }
}

// Utility function to map Stripe price ID to our plan enum
function getSubscriptionPlan(priceId: string): SubscriptionPlan {
    // You'll map your Stripe price IDs to plan names
    switch (priceId) {
        case 'price_pro':
            return 'PRO';
        case 'price_enterprise':
            return 'ENTERPRISE';
        default:
            return 'FREE';
    }
}