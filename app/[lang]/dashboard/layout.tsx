// app/[lang]/dashboard/layout.tsx
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { UserProfile } from "@/components/user-profile";
import { ApiKeyManager } from "@/components/dashboard/api-key-manager";
import { UsageStats } from "@/components/dashboard/usage-stats";
import { SubscriptionInfo } from "@/components/dashboard/subscription-info";
import { useSearchParams } from "next/navigation";

interface DashboardLayoutProps {
  user: any;
  usageStats: {
    totalOperations: number;
    operationCounts: Record<string, number>;
  };
  children?: React.ReactNode;
}

export function DashboardLayout({ user, usageStats, children }: DashboardLayoutProps) {
  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-6">
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
    </div>
  );
}

export default DashboardLayout;