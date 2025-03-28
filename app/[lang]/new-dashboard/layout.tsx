// app/[lang]/new-dashboard/layout.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | ScanPro",
  description: "Manage your account, view usage statistics, and access your API keys.",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/en/login?callbackUrl=/new-dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">{children}</div>
    </div>
  );
}