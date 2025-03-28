"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LanguageLink } from "@/components/language-link";
import { signOut } from "next-auth/react";
import { SiteLogo } from "@/components/site-logo";
import {
  LayoutDashboard,
  BarChart3,
  Key,
  User,
  Settings,
  Users,
  FileText,
  DownloadCloud,
  LogOut,
  Server,
  HelpCircle,
  Shield,
} from "lucide-react";

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
};

// Navigation item component
function NavItem({ icon, label, href, active, onClick }: NavItemProps) {
  return (
    <LanguageLink
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
        active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </LanguageLink>
  );
}

export function DashboardSidebar({ role = "user" }: { role?: "admin" | "user" }) {
  const pathname = usePathname();
  const router = useRouter();

  // User menu items
  const userMenuItems = [
    {
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: "Overview",
      href: "/dashboard",
    },
    {
      icon: <Key className="h-4 w-4" />,
      label: "API Keys",
      href: "/dashboard/api-keys",
    },
    {
      icon: <BarChart3 className="h-4 w-4" />,
      label: "Usage Stats",
      href: "/dashboard/usage",
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: "Documents",
      href: "/dashboard/documents",
    },
    {
      icon: <User className="h-4 w-4" />,
      label: "Profile",
      href: "/dashboard/profile",
    },
  ];

  // Admin menu items (includes user items plus admin-specific ones)
  const adminMenuItems = [
    ...userMenuItems,
    {
      icon: <Users className="h-4 w-4" />,
      label: "User Management",
      href: "/dashboard/users",
    },
    {
      icon: <Server className="h-4 w-4" />,
      label: "System Status",
      href: "/dashboard/system",
    },
    {
      icon: <Shield className="h-4 w-4" />,
      label: "Security",
      href: "/dashboard/security",
    },
  ];

  // Select the appropriate menu items based on role
  const menuItems = role === "admin" ? adminMenuItems : userMenuItems;

  // Handle sign out
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/en");
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      {/* Logo and header */}
      <div className="flex h-14 items-center border-b px-4">
        <LanguageLink href="/" className="flex items-center gap-2">
          <SiteLogo size={24} />
          <span className="font-bold text-xl">ScanPro</span>
        </LanguageLink>
      </div>

      {/* Navigation items */}
      <div className="flex-1 overflow-auto py-4 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href}
            />
          ))}
        </div>

        {/* Support and documentation section */}
        <div className="mt-6 space-y-1">
          <p className="px-3 text-xs font-medium text-muted-foreground">Support</p>
          <NavItem
            icon={<HelpCircle className="h-4 w-4" />}
            label="Documentation"
            href="/docs"
          />
          <NavItem
            icon={<DownloadCloud className="h-4 w-4" />}
            label="Downloads"
            href="/downloads"
          />
        </div>
      </div>

      {/* User actions at the bottom */}
      <div className="mt-auto border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}