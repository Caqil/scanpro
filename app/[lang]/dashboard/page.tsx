// app/[lang]/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsageStats } from "@/components/dashboard/usage-stats";
import { ApiKeyManager } from "@/components/dashboard/api-key-manager";
import { SubscriptionInfo } from "@/components/dashboard/subscription-info";
import { UserProfile } from "@/components/user-profile";

// Define the UsageStats type based on your Prisma schema
type UsageStats = {
  id: string;
  userId: string;
  operation: string;
  count: number;
  date: Date;
};

export default async function DashboardPage({
  params,
  searchParams
}: {
  params: { lang: string };
  searchParams?: { tab?: string };
}) {
  // Fix: await the getServerSession call
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    // Make sure to use the language prefix in redirect
    const langPrefix = params.lang || 'en';
    redirect(`/${langPrefix}/login?callbackUrl=/${langPrefix}/dashboard`);
  }

  // Get user data with subscription info
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      apiKeys: true,
    },
  });

  if (!user) {
    const langPrefix = params.lang || 'en';
    redirect(`/${langPrefix}/login`);
  }

  // Get usage statistics
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const usageStats = await prisma.usageStats.findMany({
    where: {
      userId: user.id,
      date: { gte: firstDayOfMonth },
    },
  });

  // Calculate total operations
  const totalOperations = usageStats.reduce(
    (sum: number, stat: UsageStats) => sum + stat.count, 
    0
  );

  // Get usage by operation type
  const operationCounts = usageStats.reduce(
    (acc: Record<string, number>, stat: UsageStats) => {
      acc[stat.operation] = (acc[stat.operation] || 0) + stat.count;
      return acc;
    },
    {} as Record<string, number>
  );
  
  // Get the tab from search params or use default
  const activeTab = searchParams?.tab || "overview";

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <Tabs defaultValue={activeTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <UsageStats 
            user={user} 
            usageStats={{
              totalOperations,
              operationCounts,
            }} 
          />
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