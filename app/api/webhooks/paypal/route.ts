// app/api/webhooks/paypal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyPayPalWebhook } from '@/lib/paypal';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    // Get the raw request body as text
    const rawBody = await request.text();
    let event;
    
    try {
        // Parse the event
        event = JSON.parse(rawBody);
        
        // Get PayPal webhook signature headers
        const headers: Record<string, string> = {};
        request.headers.forEach((value, key) => {
            if (key.toLowerCase().startsWith('paypal-')) {
                headers[key] = value;
            }
        });
        
        // Verify webhook signature
        const webhookId = process.env.PAYPAL_WEBHOOK_ID;
        if (!webhookId) {
            console.error('PayPal webhook ID not configured');
            return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
        }
        
        const isValid = await verifyPayPalWebhook(webhookId, event, headers);
        if (!isValid) {
            console.error('Invalid PayPal webhook signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }
        
        // Handle the event based on its type
        const eventType = event.event_type;
        const resourceType = event.resource_type;
        
        console.log(`Processing PayPal webhook: ${eventType}, Resource: ${resourceType}`);
        
        if (resourceType === 'subscription') {
            const subscription = event.resource;
            const paypalSubscriptionId = subscription.id;
            
            // Find the corresponding subscription in our database
            const dbSubscription = await prisma.subscription.findFirst({
                where: { paypalId: paypalSubscriptionId },
                include: { user: true }
            });
            
            if (!dbSubscription) {
                console.error(`No subscription found for PayPal ID: ${paypalSubscriptionId}`);
                return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
            }
            
            // Handle different subscription events
            switch (eventType) {
                case 'BILLING.SUBSCRIPTION.ACTIVATED':
                    // Subscription is active, update our records
                    await prisma.subscription.update({
                        where: { id: dbSubscription.id },
                        data: {
                            status: 'active',
                            // Extract plan/tier from PayPal data
                            tier: subscription.plan_id === process.env.PAYPAL_BASIC_PLAN_ID ? 'basic' :
                                  subscription.plan_id === process.env.PAYPAL_PRO_PLAN_ID ? 'pro' :
                                  subscription.plan_id === process.env.PAYPAL_ENTERPRISE_PLAN_ID ? 'enterprise' : 
                                  'free',
                            currentPeriodStart: new Date(subscription.start_time),
                            currentPeriodEnd: new Date(subscription.billing_info.next_billing_time)
                        }
                    });
                    break;
                    
                case 'BILLING.SUBSCRIPTION.UPDATED':
                    // Subscription details were updated
                    await prisma.subscription.update({
                        where: { id: dbSubscription.id },
                        data: {
                            status: subscription.status === 'ACTIVE' ? 'active' : 
                                    subscription.status === 'SUSPENDED' ? 'past_due' : 
                                    subscription.status === 'CANCELLED' ? 'canceled' : 
                                    dbSubscription.status,
                            currentPeriodEnd: subscription.billing_info.next_billing_time ? 
                                new Date(subscription.billing_info.next_billing_time) : 
                                dbSubscription.currentPeriodEnd
                        }
                    });
                    break;
                    
                case 'BILLING.SUBSCRIPTION.CANCELLED':
                    // Subscription was canceled
                    await prisma.subscription.update({
                        where: { id: dbSubscription.id },
                        data: {
                            status: 'canceled',
                            // Keep tier until the end of period
                            // We'll handle downgrade to free at period end
                        }
                    });
                    break;
                    
                case 'BILLING.SUBSCRIPTION.EXPIRED':
                    // Subscription expired/ended - downgrade to free
                    await prisma.subscription.update({
                        where: { id: dbSubscription.id },
                        data: {
                            tier: 'free',
                            status: 'inactive'
                        }
                    });
                    break;
                    
                case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
                    // Payment failed, mark as past_due
                    await prisma.subscription.update({
                        where: { id: dbSubscription.id },
                        data: {
                            status: 'past_due'
                        }
                    });
                    break;
                    
                case 'BILLING.SUBSCRIPTION.SUSPENDED':
                    // Subscription suspended due to payment issues
                    await prisma.subscription.update({
                        where: { id: dbSubscription.id },
                        data: {
                            status: 'past_due'
                        }
                    });
                    break;
            }
        }
        
        // Acknowledge receipt of the event
        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Error processing PayPal webhook:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}