// components/api-usage-stats.tsx
"use client";

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoaderCircle } from 'lucide-react';

interface ApiUsageData {
  totalRequests: number;
  usageByDay: { date: string; count: number }[];
  usageByEndpoint: { endpoint: string; count: number }[];
}

interface ApiUsageStatisticsProps {
  userId: string;
}

export function ApiUsageStatistics({ userId }: ApiUsageStatisticsProps) {
  const [usageData, setUsageData] = useState<ApiUsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchUsageData(parseInt(timeRange));
  }, [timeRange, userId]);

  const fetchUsageData = async (days: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/api-usage?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch API usage data');
      
      const data = await response.json();
      setUsageData(data);
    } catch (error) {
      console.error('Error fetching API usage data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Prepare chart data with zero values for days with no usage
  const prepareChartData = () => {
    if (!usageData) return [];

    const days = parseInt(timeRange);
    const result = [];
    const usageMap = new Map(usageData.usageByDay.map(item => [item.date, item.count]));

    // Generate dates for the last 'days' days
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const formattedDate = formatDate(dateStr);
      
      result.push({
        date: formattedDate,
        requests: usageMap.get(dateStr) || 0,
      });
    }

    return result;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>API Usage</CardTitle>
            <CardDescription>View your API usage statistics</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : usageData ? (
          <Tabs defaultValue="requests">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="requests">Requests Over Time</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requests" className="space-y-4">
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareChartData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value) => [`${value} requests`, 'Requests']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Bar
                      dataKey="requests"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Total Requests: <span className="font-medium text-foreground">{usageData.totalRequests.toLocaleString()}</span>
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="endpoints">
              <div className="space-y-4 mt-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-2 p-3 text-sm font-medium">
                    <div>Endpoint</div>
                    <div className="text-right">Requests</div>
                  </div>
                  <div className="divide-y">
                    {usageData.usageByEndpoint.map((item, index) => (
                      <div key={index} className="grid grid-cols-2 p-3 text-sm">
                        <div className="font-mono truncate" title={item.endpoint}>
                          {item.endpoint}
                        </div>
                        <div className="text-right">{item.count.toLocaleString()}</div>
                      </div>
                    ))}
                    {usageData.usageByEndpoint.length === 0 && (
                      <div className="p-3 text-sm text-center text-muted-foreground">
                        No endpoint data available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No API usage data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}