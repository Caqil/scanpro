// app/[lang]/subscription/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageLink } from "@/components/language-link";
import { CheckCircle, Loader2 } from "lucide-react";
import { useLanguageStore } from "@/src/store/store";

export default function SubscriptionSuccessPage() {
  const { t } = useLanguageStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [subscriptionTier, setSubscriptionTier] = useState<string>("");
  
  useEffect(() => {
    // Verify the subscription status with our backend
    const verifySubscription = async () => {
      if (!sessionId) {
        setStatus("error");
        return;
      }
      
      try {
        // Call our API to verify the subscription
        const response = await fetch(`/api/subscription/verify?session_id=${sessionId}`);
        const data = await response.json();
        
        if (data.success && data.subscription) {
          setStatus("success");
          setSubscriptionTier(data.subscription.tier);
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Error verifying subscription:", error);
        setStatus("error");
      }
    };
    
    verifySubscription();
    
    // Redirect to dashboard after a delay if successful
    const timer = setTimeout(() => {
      if (status === "success") {
        router.push("/dashboard");
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [sessionId, status, router]);
  
  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          {status === "loading" && (
            <>
              <CardTitle className="text-center">Processing your subscription</CardTitle>
              <CardDescription className="text-center">
                Please wait while we process your subscription...
              </CardDescription>
            </>
          )}
          
          {status === "success" && (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-center">Subscription Successful!</CardTitle>
              <CardDescription className="text-center">
                Thank you for subscribing to the {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)} plan.
              </CardDescription>
            </>
          )}
          
          {status === "error" && (
            <>
              <CardTitle className="text-center">Something went wrong</CardTitle>
              <CardDescription className="text-center">
                We couldn't verify your subscription. Please contact support.
              </CardDescription>
            </>
          )}
        </CardHeader>
        
        <CardContent>
          {status === "loading" && (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          {status === "success" && (
            <p className="text-center text-sm">
              You will be redirected to your dashboard shortly. If you're not redirected automatically, please click the button below.
            </p>
          )}
          
          {status === "error" && (
            <p className="text-center text-sm text-destructive">
              There was an issue processing your subscription. Your payment may or may not have been processed. Please check your email for confirmation and contact our support team if you need assistance.
            </p>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          {status === "loading" && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </Button>
          )}
          
          {status === "success" && (
            <LanguageLink href="/dashboard">
              <Button>Go to Dashboard</Button>
            </LanguageLink>
          )}
          
          {status === "error" && (
            <div className="flex gap-4">
              <LanguageLink href="/contact">
                <Button variant="outline">Contact Support</Button>
              </LanguageLink>
              <LanguageLink href="/dashboard">
                <Button>Go to Dashboard</Button>
              </LanguageLink>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}