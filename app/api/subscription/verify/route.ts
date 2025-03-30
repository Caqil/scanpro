// app/api/subscription/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { getPayPalSubscriptionDetails } from '@/lib/paypal';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get session ID from query parameters
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            return NextResponse.json(
                { error: 'Missing session ID' },
                { status: 400 }
            );
        }

        // Get subscription from database
        const subscription = await prisma.subscription.findFirst({
            where: {
                id: sessionId,
                userId: session.user.id
            }
        });

        if (!subscription) {
            return NextResponse.json(
                { error: 'Subscription not found' },
                { status: 404 }
            );
        }

        // If subscription is 'pending', check with PayPal for the current status
        if (subscription.status === 'pending' && subscription.paypalId) {
            try {
                const paypalSubscriptionDetails = await getPayPalSubscriptionDetails(subscription.paypalId);

                // Update subscription based on PayPal status
                if (paypalSubscriptionDetails.status === 'ACTIVE') {
                    // Determine tier from plan ID
                    let tier = 'free';
                    if (paypalSubscriptionDetails.plan_id === process.env.PAYPAL_BASIC_PLAN_ID) {
                        tier = 'basic';
                    } else if (paypalSubscriptionDetails.plan_id === process.env.PAYPAL_PRO_PLAN_ID) {
                        tier = 'pro';
                    } else if (paypalSubscriptionDetails.plan_id === process.env.PAYPAL_ENTERPRISE_PLAN_ID) {
                        tier = 'enterprise';
                    }

                    // Update subscription in database
                    await prisma.subscription.update({
                        where: { id: subscription.id },
                        data: {
                            status: 'active',
                            tier: tier,
                            currentPeriodStart: new Date(paypalSubscriptionDetails.start_time),
                            currentPeriodEnd: new Date(paypalSubscriptionDetails.billing_info.next_billing_time)
                        }
                    });

                    // Return updated subscription
                    return NextResponse.json({
                        success: true,
                        subscription: {
                            ...subscription,
                            status: 'active',
                            tier: tier
                        }
                    });
                } else {
                    // Subscription is not active yet
                    return NextResponse.json({
                        success: false,
                        message: 'Subscription is not active yet',
                    });
                }
            } catch (error) {
                console.error('Error fetching PayPal subscription details:', error);
                return NextResponse.json(
                    { error: 'Failed to verify subscription status' },
                    { status: 500 }
                );
            }
        }

        // Return subscription data
        return NextResponse.json({
            success: true,
            subscription
        });
    } catch (error) {
        console.error('Subscription verification error:', error);
        return NextResponse.json(
            { error: 'Failed to verify subscription' },
            { status: 500 }
        );
    }
}