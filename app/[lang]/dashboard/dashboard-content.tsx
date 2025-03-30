"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "@/components/user-profile";
import { ApiKeyManager } from "@/components/dashboard/api-key-manager";
import { UsageStats } from "@/components/dashboard/usage-stats";
import { SubscriptionInfo } from "@/components/dashboard/subscription-info";
import { useSearchParams } from "next/navigation";

interface DashboardContentProps {
  user: any;
  usageStats: {
    totalOperations: number;
    operationCounts: Record<string, number>;
  };
}

export function DashboardContent({ 
  user, 
  usageStats
}: DashboardContentProps) {
  return (
    <Tabs 
      defaultValue="overview" 
      className="space-y-6"
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        <TabsTrigger value="subscription">Subscription</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        <UsageStats user={user} usageStats={usageStats} />
      </TabsContent>
      
      <TabsContent value="api-keys" className="space-y-6">
        <ApiKeyManager user={user} />
      </TabsContent>
      
      <TabsContent value="subscription" className="space-y-6">
        <SubscriptionInfo user={user} />
      </TabsContent>
      
      <TabsContent value="profile" className="space-y-6">
        <UserProfile user={user} />
      </TabsContent>
    </Tabs>
  );
}