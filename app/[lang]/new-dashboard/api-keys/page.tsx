// app/[lang]/new-dashboard/api-keys/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ApiKeyManager } from "@/components/dashboard/api-key-manager";

export default async function ApiKeysPage() {
  // Get the user session
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/en/login?callbackUrl=/new-dashboard/api-keys");
  }

  // Get user with API keys
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      apiKeys: true,
    },
  });

  if (!user) {
    redirect("/en/login");
  }

  // Check if user is admin
  const isAdmin = user.role === "admin";

  return (
    <>
      <DashboardSidebar role={isAdmin ? "admin" : "user"} />
      <div className="flex-1 overflow-auto">
        <div className="container py-6">
          <h1 className="text-3xl font-bold mb-6">API Keys</h1>
          <ApiKeyManager user={user} />
        </div>
      </div>
    </>
  );
}