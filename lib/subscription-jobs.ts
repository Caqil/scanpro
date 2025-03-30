// lib/subscription-jobs.ts
import { prisma } from '@/lib/prisma';

/**
 * Check for subscriptions that have ended and need to be updated
 * 
 * This function should be scheduled to run daily
 */
export async function processSubscriptionPeriodEnds() {
    console.log('[Job] Processing subscription period ends...');
    const now = new Date();

    try {
        // Find canceled subscriptions that have reached their period end
        const expiredSubscriptions = await prisma.subscription.findMany({
            where: {
                status: 'canceled',
                cancelAtPeriodEnd: true,
                currentPeriodEnd: {
                    lt: now
                }
            }
        });

        console.log(`[Job] Found ${expiredSubscriptions.length} expired subscriptions`);

        // Update each expired subscription to free tier
        for (const subscription of expiredSubscriptions) {
            await prisma.subscription.update({
                where: { id: subscription.id },
                data: {
                    tier: 'free',
                    status: 'inactive',
                    cancelAtPeriodEnd: false
                }
            });

            console.log(`[Job] Downgraded subscription ${subscription.id} to free tier`);
        }

        // Find and update subscriptions with past_due status that haven't been updated in 7 days
        const overdueTime = new Date();
        overdueTime.setDate(overdueTime.getDate() - 7);

        const overdueSubscriptions = await prisma.subscription.findMany({
            where: {
                status: 'past_due',
                updatedAt: {
                    lt: overdueTime
                }
            }
        });

        console.log(`[Job] Found ${overdueSubscriptions.length} overdue subscriptions`);

        // Update each overdue subscription to inactive
        for (const subscription of overdueSubscriptions) {
            await prisma.subscription.update({
                where: { id: subscription.id },
                data: {
                    tier: 'free',
                    status: 'inactive'
                }
            });

            console.log(`[Job] Downgraded overdue subscription ${subscription.id} to free tier`);
        }

        return {
            success: true,
            processed: expiredSubscriptions.length + overdueSubscriptions.length
        };
    } catch (error) {
        console.error('[Job] Error processing subscription period ends:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}