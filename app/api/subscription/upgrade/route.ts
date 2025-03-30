// app/api/subscription/upgrade/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { createMidtransSubscription } from '@/lib/midtrans';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { tier, billingCycle = 'monthly' } = await request.json();

        if (!tier || !['basic', 'pro', 'enterprise'].includes(tier)) {
            return NextResponse.json(
                { error: 'Invalid subscription tier' },
                { status: 400 }
            );
        }

        // Get user with subscription
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

        // Base URL for callbacks
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // Create or update subscription in our database (pending payment)
        const subscription = await prisma.subscription.upsert({
            where: { userId: user.id },
            update: {
                tier: 'free', // Keep as free until payment confirmed
                status: 'pending',
            },
            create: {
                userId: user.id,
                tier: 'free', // Keep as free until payment confirmed
                status: 'pending',
            }
        });

        // Create customer details for Midtrans
        const nameParts = user.name?.split(' ') || ['User', ''];
        const customerDetails = {
            firstName: nameParts[0],
            lastName: nameParts.slice(1).join(' '),
            email: user.email || ''
        };

        // Define success and cancel URLs
        const successUrl = `${baseUrl}/en/subscription/success?session_id=${subscription.id}`;
        const cancelUrl = `${baseUrl}/en/subscription/cancel`;

        console.log(`Creating Midtrans subscription for user: ${user.id}, tier: ${tier}`);
        console.log(`Success URL: ${successUrl}`);
        console.log(`Cancel URL: ${cancelUrl}`);

        try {
            // Create Midtrans subscription
            const midtransSubscription = await createMidtransSubscription(
                user.id,
                tier,
                billingCycle as 'monthly' | 'yearly',
                customerDetails,
                successUrl,
                cancelUrl
            );

            // Update our subscription with the Midtrans order ID
            await prisma.subscription.update({
                where: { id: subscription.id },
                data: {
                    midtransOrderId: midtransSubscription.id,
                    midtransToken: midtransSubscription.midtransToken,
                }
            });

            console.log(`Subscription created, redirecting to: ${midtransSubscription.redirectUrl}`);

            // Return the Midtrans redirect URL to redirect the user
            return NextResponse.json({
                success: true,
                checkoutUrl: midtransSubscription.redirectUrl
            });
        } catch (error: any) {
            console.error('Midtrans subscription creation failed:', error);

            // Update subscription status to failed
            await prisma.subscription.update({
                where: { id: subscription.id },
                data: {
                    status: 'failed',
                }
            });

            return NextResponse.json(
                { error: error.message || 'Failed to create Midtrans subscription' },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error('Subscription upgrade error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to upgrade subscription' },
            { status: 500 }
        );
    }
}