// app/api/validate-purchase/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
    validatePurchaseCode,
    validateAndGenerateApiKey,
    getApiKeyForPurchaseCode,
    isPurchaseCodeValidated
} from '@/lib/purchase-validation';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { purchaseCode, email } = body;

        // Validate required fields
        if (!purchaseCode || !email) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Purchase code and email are required'
                },
                { status: 400 }
            );
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid email format'
                },
                { status: 400 }
            );
        }

        // Check if the purchase code has already been validated
        const isValidated = await isPurchaseCodeValidated(purchaseCode);
        if (isValidated) {
            // Get the API key for this purchase code
            const apiKey = await getApiKeyForPurchaseCode(purchaseCode);

            if (apiKey) {
                // If the email matches, return the API key
                if (apiKey.email.toLowerCase() === email.toLowerCase()) {
                    return NextResponse.json({
                        success: true,
                        message: 'API key retrieved successfully',
                        apiKey: {
                            key: apiKey.key,
                            createdAt: apiKey.createdAt
                        }
                    });
                } else {
                    // Email doesn't match
                    return NextResponse.json(
                        {
                            success: false,
                            message: 'This purchase code is registered to a different email address'
                        },
                        { status: 400 }
                    );
                }
            }
        }

        // Validate the purchase code
        const validation = await validatePurchaseCode(purchaseCode, email);

        if (!validation.valid) {
            return NextResponse.json(
                {
                    success: false,
                    message: validation.message
                },
                { status: 400 }
            );
        }

        // Generate API key
        const result = await validateAndGenerateApiKey(purchaseCode, email);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: result.message
                },
                { status: 400 }
            );
        }

        // Return the API key
        return NextResponse.json({
            success: true,
            message: result.message,
            apiKey: {
                key: result.apiKey?.key,
                createdAt: result.apiKey?.createdAt
            }
        });

    } catch (error) {
        console.error('Error validating purchase code:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while validating the purchase code'
            },
            { status: 500 }
        );
    }
}