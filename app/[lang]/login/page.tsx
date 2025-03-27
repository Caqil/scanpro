// app/[lang]/login/page.tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/site-logo";

export const metadata: Metadata = {
  title: "Login | ScanPro",
  description: "Sign in to access your ScanPro account and API services"
};

export default async function LoginPage() {
  // Check if user is already logged in
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="container max-w-md py-12 mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <SiteLogo size={48} />
          </div>
          <CardTitle>Sign in to ScanPro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <LoginButton 
              provider="google" 
              logo="/icons/google-logo.svg" 
              text="Sign in with Google" 
            />
            <LoginButton 
              provider="github" 
              logo="/icons/github-logo.svg" 
              text="Sign in with GitHub" 
            />
          </div>
          
          <div className="text-center text-xs text-muted-foreground">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
