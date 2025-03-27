// app/api/user/api-usage/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Verify user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);

    // Calculate the date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Fetch API usage data
    const usageByDay = await prisma.apiUsage.groupBy({
      by: ['timestamp'],
      where: {
        userId: session.user.id,
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        id: true
      }
    });

    // Transform usage by day into correct format
    const formattedUsageByDay = usageByDay.map(item => ({
      date: item.timestamp.toISOString().split('T')[0],
      count: item._count.id
    }));

    // Fetch usage by endpoint
    const usageByEndpoint = await prisma.apiUsage.groupBy({
      by: ['endpoint'],
      where: {
        userId: session.user.id,
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        id: true
      }
    });

    // Prepare response
    const response = {
      totalRequests: formattedUsageByDay.reduce((sum, item) => sum + item.count, 0),
      usageByDay: formattedUsageByDay,
      usageByEndpoint: usageByEndpoint.map(item => ({
        endpoint: item.endpoint,
        count: item._count.id
      }))
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('API usage statistics error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve API usage statistics' },
      { status: 500 }
    );
  }
}