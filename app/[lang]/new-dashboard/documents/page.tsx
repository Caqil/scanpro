// app/[lang]/new-dashboard/documents/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { UserDocuments } from "@/components/dashboard/user-documents";

export default async function DocumentsPage() {
  // Get the user session
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/en/login?callbackUrl=/new-dashboard/documents");
  }

  // Get user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/en/login");
  }

  // In a real implementation, you would fetch the user's document history
  // For now, we'll use dummy data in the client component

  // Check if user is admin
  const isAdmin = user.role === "admin";

  return (
    <>
      <DashboardSidebar role={isAdmin ? "admin" : "user"} />
      <div className="flex-1 overflow-auto">
        <div className="container py-6">
          <h1 className="text-3xl font-bold mb-6">Documents</h1>
          <UserDocuments userId={user.id} />
        </div>
      </div>
    </>
  );
}