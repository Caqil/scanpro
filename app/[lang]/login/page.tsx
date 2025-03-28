// app/[lang]/login/page.tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LanguageLink } from "@/components/language-link";
import { SiteLogo } from "@/components/site-logo";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | ScanPro",
  description: "Log in to your ScanPro account to access PDF tools and manage your API keys.",
};

export default async function LoginPage() {
  // Check if user is already logged in
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    const callbackUrl = `/en/dashboard`;
    redirect(callbackUrl);
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Left side - Branding and info */}
      <div className="hidden md:flex flex-col w-1/2 bg-gradient-to-br from-primary/80 to-primary text-primary-foreground p-8 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <SiteLogo size={36} />
            <span className="font-bold text-3xl">ScanPro</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-6">Welcome back!</h1>
          <p className="text-xl mb-4">Sign in to access all your PDF tools and documents.</p>
          <p className="text-lg opacity-90">Manage, convert, and secure your documents with our powerful tools.</p>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <p className="font-medium text-lg">"ScanPro has transformed how I handle document workflows. The interface is intuitive and the tools are powerful."</p>
            <p className="mt-2 font-medium">— Michael K., Marketing Director</p>
          </div>
          
          <p className="text-sm opacity-80">© 2025 ScanPro. All rights reserved.</p>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="flex flex-col w-full md:w-1/2 p-6 sm:p-10 justify-center items-center">
        <div className="md:hidden flex items-center gap-2 mb-10">
          <SiteLogo size={30} />
          <span className="font-bold text-2xl">ScanPro</span>
        </div>
        
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-center">Sign in to your account</h2>
            <p className="text-muted-foreground text-center mt-2">
              Enter your credentials to access your account
            </p>
          </div>
          
          <LoginForm />
          
          <p className="text-center text-sm text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        
        <div className="md:hidden text-center mt-10 text-sm text-muted-foreground">
          © 2025 ScanPro. All rights reserved.
        </div>
      </div>
    </div>
  );
}