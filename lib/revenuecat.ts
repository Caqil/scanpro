// lib/revenuecat.ts
import axios from 'axios';
import { prisma } from '@/lib/prisma';

const REVENUECAT_API_KEY = process.env.REVENUECAT_API_KEY!;
const REVENUECAT_API_URL = 'https://api.revenuecat.com/v1';

const revenueCatClient = axios.create({
    baseURL: REVENUECAT_API_URL,
    headers: {
        'Authorization': `Bearer ${REVENUECAT_API_KEY}`,
        'Content-Type': 'application/json'
    }
});

export async function createCustomer(userId: string, email: string) {
    try {
        const response = await revenueCatClient.post('/subscribers', {
            app_user_id: userId,
            attributes: {
                $email: email
            }
        });

        return response.data.subscriber;
    } catch (error) {
        console.error('Error creating RevenueCat customer:', error);
        throw error;
    }
}

export async function getCustomerInfo(appUserId: string) {
    try {
        const response = await revenueCatClient.get(`/subscribers/${appUserId}`);
        return response.data.subscriber;
    } catch (error) {
        console.error('Error getting RevenueCat customer info:', error);
        throw error;
    }
}

export async function syncSubscriptionStatus(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: true }
    });

    if (!user) throw new Error('User not found');

    // If no RevenueCat ID, create one
    if (!user.subscription?.revenueCatId) {
        const customer = await createCustomer(userId, user.email!);

        // Create or update subscription
        await prisma.subscription.upsert({
            where: { userId },
            update: { revenueCatId: customer.subscriber_id },
            create: {
                userId,
                revenueCatId: customer.subscriber_id,
                tier: 'free',
                status: 'active'
            }
        });

        return { tier: 'free', status: 'active' };
    }

    // Get subscription info from RevenueCat
    const customerInfo = await getCustomerInfo(user.subscription.revenueCatId);

    // Determine subscription tier based on entitlements
    let tier = 'free';
    let status = 'active';

    if (customerInfo.entitlements.pro?.is_active) {
        tier = 'pro';
    } else if (customerInfo.entitlements.basic?.is_active) {
        tier = 'basic';
    }

    // Update subscription in database
    await prisma.subscription.update({
        where: { userId },
        data: {
            tier,
            status,
            currentPeriodEnd: customerInfo.entitlements[tier]?.expires_date
                ? new Date(customerInfo.entitlements[tier].expires_date)
                : null
        }
    });

    return { tier, status };
}

export async function handleWebhook(payload: any) {
    // Process RevenueCat webhook for subscription updates
    if (payload.event.type === 'SUBSCRIPTION_STARTED' ||
        payload.event.type === 'RENEWAL' ||
        payload.event.type === 'CANCELLATION' ||
        payload.event.type === 'EXPIRATION') {

        const revenueCatId = payload.app_user_id;

        // Find user by RevenueCat ID
        const subscription = await prisma.subscription.findFirst({
            where: { revenueCatId },
            include: { user: true }
        });

        if (subscription) {
            await syncSubscriptionStatus(subscription.userId);
        }
    }
}