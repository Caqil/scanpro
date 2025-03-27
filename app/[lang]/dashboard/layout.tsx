// app/[lang]/dashboard/layout.tsx
import React from "react";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { LanguageLink } from "@/components/language-link";
import { 
  LayoutDashboard, 
  KeyRound, 
  Settings, 
  LogOut, 
  ShieldCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const DASHBOARD_MENU = [
  {
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
    label: "Dashboard"
  },
  {
    href: "/dashboard/api-keys",
    icon: <KeyRound className="h-4 w-4 mr-2" />,
    label: "API Keys"
  },
  {
    href: "/dashboard/account",
    icon: <Settings className="h-4 w-4 mr-2" />,
    label: "Account Settings"
  },
  {
    href: "/dashboard/security",
    icon: <ShieldCheck className="h-4 w-4 mr-2" />,
    label: "Security"
  }
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block w-64 border-r bg-muted/30 p-4">
        <div className="space-y-4">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-xl">Dashboard</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-2">
            {DASHBOARD_MENU.map((item) => (
              <LanguageLink
                key={item.href}
                href={item.href}
                className="flex items-center p-2 rounded-md hover:bg-muted"
              >
                {item.icon}
                {item.label}
              </LanguageLink>
            ))}
          </div>

         
        </div>
      </div>

      {/* Mobile Header - Placeholder */}
      <div className="md:hidden w-full">
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <form 
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <Button 
              type="submit" 
              variant="ghost" 
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </form>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 mt-16 md:mt-0">
        {children}
      </main>
    </div>
  );
}