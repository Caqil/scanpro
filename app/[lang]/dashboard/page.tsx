// app/[lang]/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }
  
  // Get user data with subscription info
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { 
      subscription: true,
      apiKeys: true
    }
  });
  
  if (!user) {
    redirect("/login");
  }
  
  // Get usage statistics
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);
  
  const usageStats = await prisma.usageStats.findMany({
    where: {
      userId: user.id,
      date: { gte: firstDayOfMonth }
    }
  });
  
  const totalOperations = usageStats.reduce((sum, stat) => sum + stat.count, 0);
  
  // Get usage by operation type
  const operationCounts = usageStats.reduce((acc, stat) => {
    acc[stat.operation] = (acc[stat.operation] || 0) + stat.count;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <DashboardTabs 
        user={user} 
        usageStats={{
          totalOperations,
          operationCounts
        }}
      />
    </div>
  );
}