// components/dashboard/dashboard-tabs.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionInfo } from "@/components/dashboard/subscription-info";
import { ApiKeyManager } from "@/components/dashboard/api-key-manager";
import { UsageStats } from "@/components/dashboard/usage-stats";

export function DashboardTabs({ user, usageStats }) {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        <TabsTrigger value="subscription">Subscription</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="py-4">
        <UsageStats user={user} usageStats={usageStats} />
      </TabsContent>
      
      <TabsContent value="api-keys" className="py-4">
        <ApiKeyManager user={user} />
      </TabsContent>
      
      <TabsContent value="subscription" className="py-4">
        <SubscriptionInfo user={user} />
      </TabsContent>
    </Tabs>
  );
}