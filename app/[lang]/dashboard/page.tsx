// app/[lang]/dashboard/page.tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ApiKeyDashboard } from "@/components/api-key-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@/components/user-profile";

export const metadata: Metadata = {
  title: "User Dashboard | ScanPro",
  description: "Manage your ScanPro account, API keys, and usage"
};

export default async function DashboardPage() {
  // Verify user is authenticated
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <div className="space-y-8">
        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <UserProfile user={session.user} />
          </CardContent>
        </Card>

        {/* API Management */}
        <ApiKeyDashboard />
      </div>
    </div>
  );
}