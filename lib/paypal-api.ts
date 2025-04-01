// lib/paypal-api.ts
import fetch from 'node-fetch';

// PayPal API URLs
const PAYPAL_API_URL = process.env.NODE_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

// Get PayPal access token
export async function getPayPalAccessToken(): Promise<string> {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('PayPal client ID or secret not configured');
    }

    try {
        const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
            },
            body: 'grant_type=client_credentials'
        });

        const data = await response.json() as any;
        if (!response.ok) {
            console.error('PayPal token error:', data);
            throw new Error(`Failed to get PayPal access token: ${data.error_description || 'Unknown error'}`);
        }

        return data.access_token;
    } catch (error) {
        console.error('Error getting PayPal access token:', error);
        throw error;
    }
}

// Create a subscription
export async function createSubscription(planId: string, returnUrl: string, cancelUrl: string): Promise<{
    id: string;
    approvalUrl: string;
}> {
    try {
        const accessToken = await getPayPalAccessToken();

        const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
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
                        payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
                    },
                    return_url: returnUrl,
                    cancel_url: cancelUrl
                }
            })
        });

        const data = await response.json() as any;
        if (!response.ok) {
            console.error('PayPal subscription creation error:', data);
            throw new Error(`Failed to create PayPal subscription: ${data.message || 'Unknown error'}`);
        }

        // Extract the approval URL from the HATEOAS links
        const approvalLink = data.links.find((link: any) => link.rel === 'approve');
        const approvalUrl = approvalLink ? approvalLink.href : '';

        return {
            id: data.id,
            approvalUrl
        };
    } catch (error) {
        console.error('Error creating PayPal subscription:', error);
        throw error;
    }
}

// Get subscription details
export async function getSubscriptionDetails(subscriptionId: string): Promise<any> {
    try {
        const accessToken = await getPayPalAccessToken();

        const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('PayPal get subscription details error:', data);
            throw new Error(`Failed to get subscription details: ${data.message || 'Unknown error'}`);
        }

        return data;
    } catch (error) {
        console.error(`Error getting subscription details for ${subscriptionId}:`, error);
        throw error;
    }
}

// Cancel a subscription
export async function cancelSubscription(subscriptionId: string, reason: string = 'User requested cancellation'): Promise<boolean> {
    try {
        const accessToken = await getPayPalAccessToken();

        const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                reason
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('PayPal cancel subscription error:', errorData);
            throw new Error(`Failed to cancel subscription: ${errorData.message || 'Unknown error'}`);
        }

        return true;
    } catch (error) {
        console.error(`Error cancelling subscription ${subscriptionId}:`, error);
        throw error;
    }
}

// Verify webhook signature
export async function verifyWebhookSignature(
    webhookBody: string,
    headers: {
        'paypal-auth-algo': string;
        'paypal-cert-url': string;
        'paypal-transmission-id': string;
        'paypal-transmission-sig': string;
        'paypal-transmission-time': string;
    }
): Promise<boolean> {
    try {
        const webhookId = process.env.PAYPAL_WEBHOOK_ID;
        if (!webhookId) {
            throw new Error('PayPal webhook ID not configured');
        }

        const accessToken = await getPayPalAccessToken();

        const response = await fetch(`${PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                auth_algo: headers['paypal-auth-algo'],
                cert_url: headers['paypal-cert-url'],
                transmission_id: headers['paypal-transmission-id'],
                transmission_sig: headers['paypal-transmission-sig'],
                transmission_time: headers['paypal-transmission-time'],
                webhook_id: webhookId,
                webhook_event: JSON.parse(webhookBody)
            })
        });

        const data = await response.json() as any;
        if (!response.ok) {
            console.error('PayPal verify webhook signature error:', data);
            return false;
        }

        return data.verification_status === 'SUCCESS';
    } catch (error) {
        console.error('Error verifying PayPal webhook signature:', error);
        return false;
    }
}

// Check if a subscription is active
export async function isSubscriptionActive(subscriptionId: string): Promise<boolean> {
    try {
        const details = await getSubscriptionDetails(subscriptionId);
        return details.status === 'ACTIVE';
    } catch (error) {
        console.error(`Error checking if subscription ${subscriptionId} is active:`, error);
        return false;
    }
}

// Map subscription tier to plan ID
export function getTierPlanId(tier: string): string | null {
    switch (tier.toLowerCase()) {
        case 'basic':
            return process.env.PAYPAL_PLAN_BASIC || null;
        case 'pro':
            return process.env.PAYPAL_PLAN_PRO || null;
        case 'enterprise':
            return process.env.PAYPAL_PLAN_ENTERPRISE || null;
        default:
            return null;
    }
}

// Get tier from plan ID
export function getTierFromPlanId(planId: string | null): string {
    if (!planId) return 'free';

    if (planId === process.env.PAYPAL_PLAN_BASIC) return 'basic';
    if (planId === process.env.PAYPAL_PLAN_PRO) return 'pro';
    if (planId === process.env.PAYPAL_PLAN_ENTERPRISE) return 'enterprise';

    return 'free';
}