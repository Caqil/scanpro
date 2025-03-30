// lib/midtrans.ts
import axios from 'axios';

// Midtrans API URLs
const MIDTRANS_SANDBOX_URL = 'https://app.sandbox.midtrans.com/snap/v1';
const MIDTRANS_PRODUCTION_URL = 'https://app.midtrans.com/snap/v1';

// Midtrans API configuration
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY || '';
const MIDTRANS_MERCHANT_ID = process.env.MIDTRANS_MERCHANT_ID || '';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Base URL based on environment
const BASE_URL = IS_PRODUCTION ? MIDTRANS_PRODUCTION_URL : MIDTRANS_SANDBOX_URL;

// Basic auth for Midtrans API
const auth = {
    username: MIDTRANS_SERVER_KEY,
    password: ''
};

// Midtrans subscription plan IDs
export const MIDTRANS_PLAN_IDS = {
    basic: process.env.MIDTRANS_BASIC_PLAN_ID || '',
    pro: process.env.MIDTRANS_PRO_PLAN_ID || '',
    enterprise: process.env.MIDTRANS_ENTERPRISE_PLAN_ID || ''
};

// Pricing in Indonesian Rupiah (IDR)
export const PLAN_PRICES = {
    basic: {
        monthly: 150000,     // Rp 150,000
        yearly: 1440000      // Rp 1,440,000 (20% discount from 1,800,000)
    },
    pro: {
        monthly: 450000,     // Rp 450,000
        yearly: 4320000      // Rp 4,320,000 (20% discount from 5,400,000)
    },
    enterprise: {
        monthly: 1500000,    // Rp 1,500,000
        yearly: 14400000     // Rp 14,400,000 (20% discount from 18,000,000)
    }
};

/**
 * Create a Midtrans Snap token for subscription payment
 */
export async function createMidtransSubscription(
    userId: string,
    tier: string,
    billingCycle: 'monthly' | 'yearly',
    customerDetails: {
        firstName: string;
        lastName?: string;
        email: string;
    },
    successUrl: string,
    cancelUrl: string
) {
    // Validate tier
    if (!['basic', 'pro', 'enterprise'].includes(tier)) {
        throw new Error(`Invalid subscription tier: ${tier}`);
    }

    // Get price based on tier and billing cycle
    const amount = PLAN_PRICES[tier as keyof typeof PLAN_PRICES][billingCycle];

    if (!amount) {
        throw new Error('Invalid pricing configuration');
    }

    // Generate a unique order ID
    const orderId = `SUB-${tier.toUpperCase()}-${Date.now()}-${userId.substring(0, 8)}`;

    // Prepare subscription data for Midtrans
    const subscriptionData = {
        transaction_details: {
            order_id: orderId,
            gross_amount: amount
        },
        customer_details: {
            first_name: customerDetails.firstName,
            last_name: customerDetails.lastName || '',
            email: customerDetails.email
        },
        item_details: [
            {
                id: MIDTRANS_PLAN_IDS[tier as keyof typeof MIDTRANS_PLAN_IDS],
                price: amount,
                quantity: 1,
                name: `ScanPro ${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan (${billingCycle})`,
                category: 'Subscription'
            }
        ],
        callbacks: {
            finish: successUrl,
            error: cancelUrl,
            pending: cancelUrl
        },
        credit_card: {
            secure: true,
            save_card: true
        },
        user_id: userId
    };

    try {
        // Create transaction in Midtrans
        const response = await axios.post(
            `${BASE_URL}/transactions`,
            subscriptionData,
            { auth }
        );

        return {
            id: orderId,
            midtransToken: response.data.token,
            redirectUrl: response.data.redirect_url,
            tier,
            billingCycle
        };
    } catch (error) {
        console.error('Midtrans API error:', error);
        throw new Error('Failed to create Midtrans subscription');
    }
}

/**
 * Get subscription status from Midtrans
 */
export async function getMidtransTransactionStatus(orderId: string) {
    try {
        const response = await axios.get(
            `${BASE_URL}/transactions/${orderId}/status`,
            { auth }
        );

        return {
            status: response.data.transaction_status,
            grossAmount: response.data.gross_amount,
            paymentType: response.data.payment_type,
            transactionTime: response.data.transaction_time,
            expiryTime: response.data.expiry_time,
            orderId: response.data.order_id,
            rawResponse: response.data
        };
    } catch (error) {
        console.error('Midtrans status check error:', error);
        throw new Error('Failed to check Midtrans transaction status');
    }
}

/**
 * Cancel a Midtrans subscription
 */
export async function cancelMidtransSubscription(orderId: string, reason: string = 'User requested cancellation') {
    try {
        const response = await axios.post(
            `${BASE_URL}/transactions/${orderId}/cancel`,
            { reason },
            { auth }
        );

        return {
            success: response.data.status_code === '200',
            status: response.data.transaction_status,
            orderId: response.data.order_id,
            rawResponse: response.data
        };
    } catch (error) {
        console.error('Midtrans cancel error:', error);
        throw new Error('Failed to cancel Midtrans subscription');
    }
}

/**
 * Process Midtrans webhook notification
 */
export async function processMidtransNotification(notificationData: any) {
    try {
        // Verify notification signature (optional but recommended)
        // For simplicity, we're skipping signature verification in this example

        // Check transaction status
        const { order_id, transaction_status, fraud_status } = notificationData;

        // Get transaction details from Midtrans
        const transactionStatus = await getMidtransTransactionStatus(order_id);

        let paymentStatus = 'pending';

        // Determine status based on Midtrans status codes
        if (transaction_status === 'capture' || transaction_status === 'settlement') {
            if (fraud_status === 'accept') {
                paymentStatus = 'active';
            }
        } else if (transaction_status === 'cancel' ||
            transaction_status === 'deny' ||
            transaction_status === 'expire') {
            paymentStatus = 'failed';
        } else if (transaction_status === 'pending') {
            paymentStatus = 'pending';
        }

        return {
            orderId: order_id,
            status: paymentStatus,
            rawStatus: transaction_status,
            fraudStatus: fraud_status,
            transactionDetails: transactionStatus
        };
    } catch (error) {
        console.error('Midtrans notification processing error:', error);
        throw new Error('Failed to process Midtrans notification');
    }
}

// Export Midtrans keys for client-side use
export function getMidtransClientKey() {
    return MIDTRANS_CLIENT_KEY;
}

// Helper function to determine subscription period end date
export function calculatePeriodEndDate(billingCycle: 'monthly' | 'yearly') {
    const now = new Date();
    const periodEnd = new Date(now);

    if (billingCycle === 'monthly') {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    return periodEnd;
}