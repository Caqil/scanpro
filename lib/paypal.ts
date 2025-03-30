// lib/paypal.ts
import axios from 'axios';

// PayPal API configuration
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
const PAYPAL_API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

// Fetch PayPal access token
async function getPayPalAccessToken(): Promise<string> {
  try {
    // Validate API credentials
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('PayPal API credentials are not configured');
    }
    
    // Log the API URL for debugging (without sensitive info)
    console.log(`Connecting to PayPal API at: ${PAYPAL_API_URL}`);
    
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const response = await axios({
      method: 'post',
      url: `${PAYPAL_API_URL}/v1/oauth2/token`,
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en_US',
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: 'grant_type=client_credentials',
    });

    if (!response.data.access_token) {
      console.error('PayPal did not return an access token:', response.data);
      throw new Error('Invalid response from PayPal authentication service');
    }
    
    console.log('Successfully obtained PayPal access token');
    return response.data.access_token;
  } catch (error: any) {
    // Enhanced error logging with specific error details
    console.error('Failed to get PayPal access token:', error.message);
    
    if (error.response) {
      console.error('PayPal authentication response status:', error.response.status);
      console.error('PayPal authentication response data:', JSON.stringify(error.response.data, null, 2));
      
      // Use specific error message if available
      if (error.response.data && error.response.data.error_description) {
        throw new Error(`PayPal authentication failed: ${error.response.data.error_description}`);
      }
    }
    
    // Check for common configuration issues
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error(`PayPal API connection failed: ${error.message}. Please check your network or API endpoint configuration.`);
    }
    
    throw new Error('PayPal authentication failed: ' + error.message);
  }
}

// Create a PayPal subscription
export async function createPayPalSubscription(
  userId: string,
  planId: string,
  returnUrl: string,
  cancelUrl: string
): Promise<{ id: string; approvalUrl: string }> {
  try {
    const accessToken = await getPayPalAccessToken();
    
    // Log the request data for debugging
    console.log('Creating PayPal subscription with plan ID:', planId);
    console.log('Return URL:', returnUrl);
    console.log('Cancel URL:', cancelUrl);
    
    // Simplified request payload that follows PayPal's requirements
    const payload = {
      plan_id: planId,
      application_context: {
        brand_name: 'ScanPro',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
      custom_id: userId, // Store user ID as custom ID instead of subscriber object
    };
    
    console.log('Subscription payload:', JSON.stringify(payload, null, 2));
    
    const response = await axios({
      method: 'post',
      url: `${PAYPAL_API_URL}/v1/billing/subscriptions`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data: payload,
    });

    // Log successful response for debugging
    console.log('PayPal subscription created successfully');
    console.log('Subscription ID:', response.data.id);
    console.log('Links:', JSON.stringify(response.data.links, null, 2));

    // Extract the approval URL from the HATEOAS links
    const approvalLink = response.data.links.find(
      (link: any) => link.rel === 'approve'
    );
    
    if (!approvalLink || !approvalLink.href) {
      throw new Error('Approval URL not found in PayPal response');
    }
    
    return {
      id: response.data.id,
      approvalUrl: approvalLink.href,
    };
  } catch (error: any) {
    // Enhanced error logging to see the actual response from PayPal
    console.error('Failed to create PayPal subscription:', error.message);
    
    if (error.response) {
      // Log the response data to see what PayPal is returning
      console.error('PayPal response status:', error.response.status);
      console.error('PayPal response data:', JSON.stringify(error.response.data, null, 2));
      
      // Use the actual error message from PayPal if available
      if (error.response.data && error.response.data.message) {
        throw new Error(`PayPal error: ${error.response.data.message}`);
      }
      
      if (error.response.data && error.response.data.details && error.response.data.details.length > 0) {
        throw new Error(`PayPal error: ${error.response.data.details[0].description}`);
      }
    }
    
    throw new Error('Failed to create subscription: ' + error.message);
  }
}

// Cancel a PayPal subscription
export async function cancelPayPalSubscription(subscriptionId: string, reason?: string): Promise<boolean> {
  try {
    const accessToken = await getPayPalAccessToken();
    
    await axios({
      method: 'post',
      url: `${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        reason: reason || 'Customer canceled the subscription',
      },
    });
    
    return true;
  } catch (error) {
    console.error('Failed to cancel PayPal subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
}

// Get subscription details
export async function getPayPalSubscriptionDetails(subscriptionId: string): Promise<any> {
  try {
    const accessToken = await getPayPalAccessToken();
    
    const response = await axios({
      method: 'get',
      url: `${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to get PayPal subscription details:', error);
    throw new Error('Failed to get subscription details');
  }
}

// Verify webhook signature
export async function verifyPayPalWebhook(
  webhookId: string,
  eventBody: any,
  headers: Record<string, string>
): Promise<boolean> {
  try {
    const accessToken = await getPayPalAccessToken();
    
    const response = await axios({
      method: 'post',
      url: `${PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        webhook_id: webhookId,
        webhook_event: eventBody,
        auth_algo: headers['paypal-auth-algo'],
        cert_url: headers['paypal-cert-url'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
      },
    });
    
    return response.data.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('Failed to verify PayPal webhook signature:', error);
    return false;
  }
}