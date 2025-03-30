// app/[lang]/subscription/cancel/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageLink } from "@/components/language-link";
import { XCircle } from "lucide-react";
import { useLanguageStore } from "@/src/store/store";

export default function SubscriptionCancelPage() {
  const { t } = useLanguageStore();
  const router = useRouter();
  
  // Redirect to dashboard after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-orange-500" />
          </div>
          <CardTitle className="text-center">Subscription Canceled</CardTitle>
          <CardDescription className="text-center">
            Your subscription process was canceled.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <p className="text-center text-sm">
            You will be redirected to your dashboard shortly. If you're not redirected automatically, please click the button below.
          </p>
        </CardContent>
        
        <CardFooter className="flex justify-center gap-4">
          <LanguageLink href="/pricing">
            <Button variant="outline">View Plans</Button>
          </LanguageLink>
          <LanguageLink href="/dashboard">
            <Button>Go to Dashboard</Button>
          </LanguageLink>
        </CardFooter>
      </Card>
    </div>
  );
}