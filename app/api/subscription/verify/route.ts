// app/api/subscription/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { getMidtransTransactionStatus } from '@/lib/midtrans';

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

        // If subscription is 'pending', check with Midtrans for the current status
        if (subscription.status === 'pending' && subscription.midtransOrderId) {
            try {
                const midtransStatus = await getMidtransTransactionStatus(subscription.midtransOrderId);

                // Update subscription based on Midtrans status
                if (midtransStatus.status === 'settlement' || midtransStatus.status === 'capture') {
                    // Extract tier from order ID (SUB-TIER-TIMESTAMP-USERID)
                    const orderParts = subscription.midtransOrderId.split('-');
                    const tier = orderParts[1].toLowerCase();

                    // Determine billing cycle based on amount (simple heuristic)
                    const isYearly = midtransStatus.grossAmount > 1000000;

                    // Calculate period end
                    const periodStart = new Date();
                    const periodEnd = new Date(periodStart);

                    if (isYearly) {
                        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
                    } else {
                        periodEnd.setMonth(periodEnd.getMonth() + 1);
                    }

                    // Update subscription in database
                    await prisma.subscription.update({
                        where: { id: subscription.id },
                        data: {
                            status: 'active',
                            tier: tier,
                            currentPeriodStart: periodStart,
                            currentPeriodEnd: periodEnd,
                            midtransResponse: midtransStatus.rawResponse || {}
                        }
                    });

                    // Return updated subscription
                    return NextResponse.json({
                        success: true,
                        subscription: {
                            ...subscription,
                            status: 'active',
                            tier: tier,
                            currentPeriodStart: periodStart,
                            currentPeriodEnd: periodEnd
                        }
                    });
                } else if (midtransStatus.status === 'pending') {
                    // Subscription is still pending
                    return NextResponse.json({
                        success: false,
                        message: 'Payment is still being processed',
                        status: midtransStatus.status
                    });
                } else if (midtransStatus.status === 'not_found') {
                    // Handle the case where the transaction doesn't exist in Midtrans
                    // Calculate how old the subscription is
                    const subscriptionAge = Date.now() - new Date(subscription.createdAt).getTime();
                    const oneHourInMs = 60 * 60 * 1000;
                    
                    if (subscriptionAge > oneHourInMs) {
                        // If the subscription is older than 1 hour, mark it as failed
                        await prisma.subscription.update({
                            where: { id: subscription.id },
                            data: {
                                status: 'failed',
                                midtransResponse: midtransStatus.rawResponse || {}
                            }
                        });

                        return NextResponse.json({
                            success: false,
                            message: 'Payment has expired or was not completed',
                            status: 'failed'
                        });
                    } else {
                        // If less than 1 hour old, still treat as pending
                        return NextResponse.json({
                            success: false,
                            message: 'Payment is still being processed or has not been initiated',
                            status: 'pending'
                        });
                    }
                } else {
                    // Payment failed or expired
                    await prisma.subscription.update({
                        where: { id: subscription.id },
                        data: {
                            status: 'failed',
                            midtransResponse: midtransStatus.rawResponse || {}
                        }
                    });

                    return NextResponse.json({
                        success: false,
                        message: 'Payment failed or expired',
                        status: midtransStatus.status
                    });
                }
            } catch (error) {
                console.error('Error fetching Midtrans status:', error);
                
                // Don't fail the entire request just because we couldn't check with Midtrans
                // Instead, return the subscription data we have with a warning
                return NextResponse.json({
                    success: true,
                    subscription,
                    warning: 'Could not verify status with payment provider'
                });
            }
        }

        // Return subscription data as is
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