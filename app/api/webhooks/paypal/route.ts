// app/api/webhooks/paypal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { processSubscriptionWebhook } from '@/lib/paypal';

// PayPal webhook verification
function verifyPayPalWebhook(requestBody: string, paypalSignature: string | null): boolean {
  // In production, you should verify the signature using PayPal's webhook signature verification
  // https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature

  // This is a simplified version - in production use the PayPal SDK or implement proper verification
  if (!paypalSignature || !process.env.PAYPAL_WEBHOOK_ID) {
    return false;
  }

  // For proper implementation, verify using WebhookEvent.verify
  // return paypal.notification.webhookEvent.verify(
  //    JSON.parse(requestBody),
  //    paypalSignature,
  //    process.env.PAYPAL_WEBHOOK_ID
  // );

  // For now, we'll accept all webhooks in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Development mode: Skipping webhook signature verification');
    return true;
  }

  // Placeholder - this should be replaced with proper verification
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get the request body as text
    const requestBody = await request.text();
    
    // Parse the request body
    const event = JSON.parse(requestBody);
    
    // Get the PayPal signature from headers
    const paypalSignature = request.headers.get('paypal-transmission-sig');
    
    // Verify the webhook signature
    const isVerified = verifyPayPalWebhook(requestBody, paypalSignature);
    
    if (!isVerified) {
      console.error('Invalid PayPal webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Process the webhook event
    await processSubscriptionWebhook(event);
    
    // Return success response
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}