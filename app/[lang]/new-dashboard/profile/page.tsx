// app/[lang]/new-dashboard/profile/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { UserProfile } from "@/components/user-profile";

export default async function ProfilePage() {
  // Get the user session
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/en/login?callbackUrl=/new-dashboard/profile");
  }

  // Get user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
          <UserProfile user={user} />
        </div>
      </div>
    </>
  );
}