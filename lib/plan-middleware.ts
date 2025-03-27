// lib/plan-middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from './prisma';

// Define plan features and rate limits
const PLAN_FEATURES = {
    FREE: {
        dailyLimit: 50,
        monthlyLimit: 500,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        convertFormats: ['pdf', 'jpg'],
        features: ['basic_convert']
    },
    PRO: {
        dailyLimit: 500,
        monthlyLimit: 5000,
        maxFileSize: 50 * 1024 * 1024, // 50MB
        convertFormats: ['pdf', 'docx', 'xlsx', 'jpg', 'png', 'html'],
        features: ['basic_convert', 'advanced_convert', 'merge', 'split']
    },
    ENTERPRISE: {
        dailyLimit: 5000,
        monthlyLimit: 50000,
        maxFileSize: 500 * 1024 * 1024, // 500MB
        convertFormats: ['pdf', 'docx', 'xlsx', 'pptx', 'jpg', 'png', 'html', 'txt'],
        features: ['basic_convert', 'advanced_convert', 'merge', 'split', 'api_access', 'priority_support']
    }
};

// Middleware to check plan limitations
export async function checkPlanLimitations(
    req: NextRequest,
    feature: string,
    fileSize?: number
) {
    // Get user from session or API key
    const user = await getUserFromRequest(req);

    if (!user) {
        return {
            allowed: false,
            error: 'Authentication required'
        };
    }

    // Get user's current subscription
    const subscription = await prisma.subscription.findUnique({
        where: { userId: user.id },
        select: { plan: true }
    });

    // Default to FREE if no subscription
    const planName = subscription?.plan || 'FREE';
    const planDetails = PLAN_FEATURES[planName];

    // Check file size limit
    if (fileSize && fileSize > planDetails.maxFileSize) {
        return {
            allowed: false,
            error: `File size exceeds plan limit of ${planDetails.maxFileSize / (1024 * 1024)}MB`
        };
    }

    // Check feature availability
    if (!planDetails.features.includes(feature)) {
        return {
            allowed: false,
            error: 'Feature not available in current plan'
        };
    }

    // Optional: Check daily/monthly usage limits
    const apiUsage = await prisma.apiUsage.groupBy({
        by: ['timestamp'],
        where: {
            userId: user.id,
            timestamp: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today
                lte: new Date() // Now
            }
        },
        _count: { id: true }