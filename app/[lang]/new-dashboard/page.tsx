// app/[lang]/new-dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { UserDashboardOverview } from "@/components/dashboard/user-dashboard-overview";
import { AdminDashboardOverview } from "@/components/dashboard/admin-dashboard-overview";

export default async function DashboardPage() {
  // Get the user session
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/en/login?callbackUrl=/new-dashboard");
  }

  // Get user with role information
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
    },
  });

  if (!user) {
    redirect("/en/login");
  }

  // Get usage statistics for the current month
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
  const totalOperations = usageStats.reduce((sum, stat) => sum + stat.count, 0);

  // Group by operation type
  const operationCounts = usageStats.reduce(
    (acc, stat) => {
      acc[stat.operation] = (acc[stat.operation] || 0) + stat.count;
      return acc;
    },
    {} as Record<string, number>
  );

  // Check if user is admin
  const isAdmin = user.role === "admin";

  return (
    <>
      <DashboardSidebar role={isAdmin ? "admin" : "user"} />
      <div className="flex-1 overflow-auto">
        <div className="container py-6">
          <h1 className="text-3xl font-bold mb-6">
            Welcome, {user.name || "User"}
          </h1>
          
          {isAdmin ? (
            <AdminDashboardOverview user={user} usageStats={{ totalOperations, operationCounts }} />
          ) : (
            <UserDashboardOverview user={user} usageStats={{ totalOperations, operationCounts }} />
          )}
        </div>
      </div>
    </>
  );
}