// app/[lang]/login/page.tsx
import { Suspense } from "react";
import { SiteLogo } from "@/components/site-logo";
import Link from "next/link";
import { LoginFormWithParams } from "@/components/auth/login-form-with-params";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | ScanPro",
  description: "Sign in to your ScanPro account to access your dashboard.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Left side - Branding and info (for medium and larger screens) */}
      <div className="hidden md:flex flex-col w-1/2 bg-gradient-to-br from-primary/80 to-primary text-primary-foreground p-8 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <SiteLogo size={36} />
            <span className="font-bold text-3xl">ScanPro</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-6">Welcome Back</h1>
          <p className="text-xl mb-4">Log in to your account to access your dashboard and documents.</p>
          <p className="text-lg opacity-90">Securely manage your PDF operations with our professional tools.</p>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <p className="text-lg">Need help? Contact our support team at <strong>support@scanpro.cc</strong></p>
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
              Enter your credentials to access your dashboard
            </p>
          </div>
          
          <Suspense fallback={<div>Loading login form...</div>}>
            <LoginFormWithParams />
          </Suspense>
          
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