// app/[lang]/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { ApiUsageStatistics } from "@/components/api-usage-stats";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container max-w-5xl py-12">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {session.user?.name || "User"}
      </h1>

      <div className="grid gap-6">
        {/* API Usage Statistics */}
        {session.user?.id && (
          <ApiUsageStatistics userId={session.user.id} />
        )}

        {/* Additional dashboard sections can be added here */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Example quick actions or summary cards */}
          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <div>
                <a 
                  href="/dashboard/api-keys" 
                  className="text-primary hover:underline"
                >
                  Manage API Keys
                </a>
              </div>
              <div>
                <a 
                  href="/dashboard/account" 
                  className="text-primary hover:underline"
                >
                  Account Settings
                </a>
              </div>
            </div>
          </div>

          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
            <div className="space-y-2">
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                {session.user?.email}
              </p>
              <p>
                <span className="text-muted-foreground">Joined:</span>{" "}
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}