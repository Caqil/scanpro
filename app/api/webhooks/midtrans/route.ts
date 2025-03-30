// app/api/webhooks/midtrans/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { processMidtransNotification } from '@/lib/midtrans';
import { prisma } from '@/lib/prisma';
import { calculatePeriodEndDate } from '@/lib/midtrans';

export async function POST(request: NextRequest) {
    try {
        // Get the raw notification data
        const notificationData = await request.json();
        console.log('Received Midtrans notification:', JSON.stringify(notificationData));

        // Process notification
        const processedData = await processMidtransNotification(notificationData);

        // Extract order ID from the notification
        const { orderId, status, rawStatus, transactionDetails } = processedData;

        if (!orderId || !orderId.startsWith('SUB-')) {
            console.log('Not a subscription transaction, ignoring');
            return NextResponse.json({ success: true });
        }

        // Find the subscription in our database
        const subscription = await prisma.subscription.findFirst({
            where: { midtransOrderId: orderId },
            include: { user: true }
        });

        if (!subscription) {
            console.error(`Subscription not found for order ID: ${orderId}`);
            return NextResponse.json(
                { error: 'Subscription not found' },
                { status: 404 }
            );
        }

        // Update subscription status
        if (status === 'active') {
            // Extract billing cycle from order ID (SUB-BASIC-TIMESTAMP-USERID)
            const orderParts = orderId.split('-');
            const tier = orderParts[1].toLowerCase();

            // Determine if this is a yearly subscription from the amount
            const amount = transactionDetails.grossAmount;
            const billingCycle = amount > 1000000 ? 'yearly' : 'monthly'; // Simple heuristic

            // Calculate period end date
            const periodEnd = calculatePeriodEndDate(billingCycle);

            // Update subscription
            await prisma.subscription.update({
                where: { id: subscription.id },
                data: {
                    status: 'active',
                    tier: tier.toLowerCase(),
                    midtransResponse: transactionDetails.rawResponse,
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: periodEnd
                }
            });

            console.log(`Subscription ${orderId} activated successfully`);
        } else if (status === 'failed') {
            // Update subscription status to failed
            await prisma.subscription.update({
                where: { id: subscription.id },
                data: {
                    status: 'failed',
                    midtransResponse: transactionDetails.rawResponse
                }
            });

            console.log(`Subscription ${orderId} failed`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook processing error:', error);

        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

// Define an OPTIONS handler to handle preflight requests
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}