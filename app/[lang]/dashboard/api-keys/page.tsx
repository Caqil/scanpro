// app/[lang]/dashboard/api-keys/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { ApiKeysPage } from "../api-keys-component";

export default async function DashboardApiKeysPage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  return <ApiKeysPage />;
}