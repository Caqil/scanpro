// components/dashboard/usage-stats.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UsageStatsProps {
  user: any;
  usageStats: {
    totalOperations: number;
    operationCounts: Record<string, number>;
  };
}

export function UsageStats({ user, usageStats }: UsageStatsProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Determine limits based on subscription tier
  const usageLimit = 
    user?.subscription?.tier === "enterprise" ? 100000 :
    user?.subscription?.tier === "pro" ? 10000 :
    user?.subscription?.tier === "basic" ? 1000 : 100;
  
  // Format operation name for display
  const formatOperation = (op: string) => {
    return op.charAt(0).toUpperCase() + op.slice(1);
  };
  
  // Format percentage
  const formatPercentage = (value: number, total: number) => {
    if (total === 0) return "0%";
    return `${Math.round((value / total) * 100)}%`;
  };
  
  // Prepare chart data
  useEffect(() => {
    const data = Object.entries(usageStats.operationCounts).map(([operation, count]) => ({
      name: formatOperation(operation),
      value: count
    }));
    
    setChartData(data);
  }, [usageStats]);
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageStats.totalOperations}</div>
            <p className="text-xs text-muted-foreground">
              of {usageLimit} operations this month
            </p>
            <Progress
              value={(usageStats.totalOperations / usageLimit) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {user?.subscription?.tier || "Free"}
            </div>
            <p className="text-xs text-muted-foreground">
              {user?.subscription?.status === "active" ? "Active" : "Inactive"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.apiKeys?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              of {
                user?.subscription?.tier === "enterprise" ? 50 :
                user?.subscription?.tier === "pro" ? 10 :
                user?.subscription?.tier === "basic" ? 3 : 1
              } keys allowed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(usageStats.operationCounts).length > 0 ? (
              <>
                <div className="text-2xl font-bold">
                  {formatOperation(
                    Object.entries(usageStats.operationCounts)
                      .sort((a, b) => b[1] - a[1])[0]?.[0] || "None"
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatPercentage(
                    Object.entries(usageStats.operationCounts)
                      .sort((a, b) => b[1] - a[1])[0]?.[1] || 0,
                    usageStats.totalOperations
                  )} of total usage
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">None</div>
                <p className="text-xs text-muted-foreground">
                  No operations yet
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Usage by Operation</CardTitle>
          <CardDescription>
            Your API usage breakdown for the current month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}