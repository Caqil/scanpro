import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SiteLogo } from "@/components/site-logo";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { EnhancedResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password | ScanPro",
  description: "Reset your password and regain access to your ScanPro account.",
};

export default async function ResetPasswordPage() {
  // Check if user is already logged in
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    redirect("/en/dashboard");
  }

  // Get token from URL
  const headersList = headers();
  const url = (await headersList).get("x-url") || "";
  const searchParams = new URL('localhost:3001').searchParams;
  const tokenParam = searchParams.get("token");
  const token = tokenParam || undefined;

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Left side - Branding and info (for medium and larger screens) */}
      <div className="hidden md:flex flex-col w-1/2 bg-gradient-to-br from-primary/80 to-primary text-primary-foreground p-8 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <SiteLogo size={36} />
            <span className="font-bold text-3xl">ScanPro</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-6">Create New Password</h1>
          <p className="text-xl mb-4">Almost there! Just set a new secure password for your account.</p>
          <p className="text-lg opacity-90">We recommend using a strong password that you don't use for other websites.</p>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <p className="text-lg">Need help? Contact our support team at <strong>support@scanpro.cc</strong></p>
          </div>
          
          <p className="text-sm opacity-80">© 2025 ScanPro. All rights reserved.</p>
        </div>
      </div>
      
      {/* Right side - Reset password form */}
      <div className="flex flex-col w-full md:w-1/2 p-6 sm:p-10 justify-center items-center">
        <div className="md:hidden flex items-center gap-2 mb-10">
          <SiteLogo size={30} />
          <span className="font-bold text-2xl">ScanPro</span>
        </div>
        
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-center">Reset your password</h2>
            <p className="text-muted-foreground text-center mt-2">
              Enter a new password for your account
            </p>
          </div>
          
          <EnhancedResetPasswordForm token={token} />
          
          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Back to login
            </Link>
          </p>
        </div>
        
        <div className="md:hidden text-center mt-10 text-sm text-muted-foreground">
          © 2025 ScanPro. All rights reserved.
        </div>
      </div>
    </div>
  );
}