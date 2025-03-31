// components/dashboard/subscription-info.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  CreditCardIcon, 
  CheckIcon, 
  XIcon, 
  Loader2Icon, 
  AlertCircleIcon, 
  InfoIcon 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguageStore } from "@/src/store/store";
import Script from "next/script";

interface SubscriptionInfoProps {
  user: any;
}

// Pricing tiers
const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    features: [
      "100 operations per month",
      "10 requests per hour",
      "1 API key",
      "Basic PDF operations"
    ],
    limitations: [
      "No watermarking",
      "Limited OCR",
      "No priority support"
    ]
  },
  {
    name: "Basic",
    price: "$9.99",
    features: [
      "1,000 operations per month",
      "100 requests per hour",
      "3 API keys",
      "All PDF operations",
      "Basic OCR"
    ],
    limitations: [
      "No priority support"
    ]
  },
  {
    name: "Pro",
    price: "$29.99",
    features: [
      "10,000 operations per month",
      "1,000 requests per hour",
      "10 API keys",
      "Advanced OCR",
      "Priority support",
      "Custom watermarks"
    ],
    limitations: []
  },
  {
    name: "Enterprise",
    price: "$99.99",
    features: [
      "100,000 operations per month",
      "5,000 requests per hour",
      "50 API keys",
      "Dedicated support",
      "Custom integration help",
      "White-label options"
    ],
    limitations: []
  }
];

export function SubscriptionInfo({ user }: SubscriptionInfoProps) {
  const { t } = useLanguageStore();
  const [loading, setLoading] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [paypalScriptLoaded, setPaypalScriptLoaded] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };
  
  // Handle subscription upgrade
  const handleUpgrade = async (tier: string) => {
    setLoading(true);
    setSelectedTier(tier);
    setUpgradeDialogOpen(true);
    
    try {
      // Call your subscription upgrade endpoint that integrates with PayPal
      const res = await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier })
      });
      
      const data = await res.json();
      
      if (data.success && data.checkoutUrl) {
        // Redirect to PayPal checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || "Failed to initiate upgrade");
      }
    } catch (error) {
      console.error("Error upgrading subscription:", error);
      setPaypalError(error instanceof Error ? error.message : "Failed to upgrade subscription");
      toast.error(error instanceof Error ? error.message : "Failed to upgrade subscription");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle subscription cancellation
  const handleCancel = async () => {
    if (!confirmCancel) {
      setConfirmCancel(true);
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/subscription/cancel', {
        method: 'POST'
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message || "Subscription cancelled successfully");
        // Refresh page after a short delay
        setTimeout(() => window.location.reload(), 1500);
      } else {
        throw new Error(data.error || "Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error(error instanceof Error ? error.message : "Failed to cancel subscription");
    } finally {
      setLoading(false);
      setConfirmCancel(false);
    }
  };
  
  const currentTier = user?.subscription?.tier || "free";
  
  return (
    <div className="space-y-6">
      {/* PayPal script */}
      <Script
        src="https://www.paypal.com/sdk/js?client-id=test&currency=USD"
        onLoad={() => setPaypalScriptLoaded(true)}
        onError={() => setPaypalError("Failed to load PayPal script")}
      />
      
      <h2 className="text-2xl font-bold">{t('dashboard.subscription.title') || "Subscription"}</h2>
      
      {/* Current subscription info */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            Your subscription details and usage limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold capitalize">{currentTier} Plan</h3>
              <p className="text-muted-foreground">
                {user?.subscription?.status === "active" ? "Active" : 
                 user?.subscription?.status === "canceled" ? "Canceled" : 
                 user?.subscription?.status === "past_due" ? "Past Due" : "Inactive"}
              </p>
            </div>
            <Badge variant={
              currentTier === "enterprise" ? "default" :
              currentTier === "pro" ? "default" :
              currentTier === "basic" ? "outline" :
              "secondary"
            }>
              {currentTier === "free" ? "Free" : "Paid"}
            </Badge>
          </div>
          
          {currentTier !== "free" && user?.subscription?.currentPeriodEnd && (
            <div className="mt-4 text-sm">
              <p className="text-muted-foreground">
                {user?.subscription?.status === "canceled" 
                  ? `Your subscription will end on ${formatDate(user.subscription.currentPeriodEnd)}`
                  : `Your subscription renews on ${formatDate(user.subscription.currentPeriodEnd)}`
                }
              </p>
            </div>
          )}

          {user?.subscription?.status === "past_due" && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Payment Issue</AlertTitle>
              <AlertDescription>
                There was a problem with your latest payment. Please update your payment method in PayPal.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        {currentTier !== "free" && user?.subscription?.status !== "canceled" && (
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={loading}
            >
              {loading ? (
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {confirmCancel ? "Confirm Cancellation" : "Cancel Subscription"}
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {/* Pricing tiers */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {pricingTiers.map((tier) => (
          <Card 
            key={tier.name.toLowerCase()}
            className={
              currentTier === tier.name.toLowerCase() 
                ? "border-primary ring-1 ring-primary" 
                : ""
            }
          >
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold">{tier.price}</span> / month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Features:</h4>
                <ul className="space-y-1">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckIcon className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {tier.limitations.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Limitations:</h4>
                  <ul className="space-y-1">
                    {tier.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <XIcon className="h-4 w-4 text-red-500 mt-0.5" />
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {currentTier === tier.name.toLowerCase() ? (
                <Button className="w-full" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={tier.name.toLowerCase() === "free" ? "outline" : "default"}
                  disabled={loading || (
                    // Disable if already subscribed to a higher tier
                    currentTier !== "free" && 
                    ["basic", "pro", "enterprise"].indexOf(currentTier) >= 
                    ["basic", "pro", "enterprise"].indexOf(tier.name.toLowerCase())
                  ) || (
                    // Disable if subscription is canceled
                    user?.subscription?.status === "canceled" && tier.name.toLowerCase() !== "free"
                  )}
                  onClick={() => handleUpgrade(tier.name.toLowerCase())}
                >
                  {tier.name.toLowerCase() === "free" 
                    ? "Downgrade" 
                    : currentTier === "free" 
                      ? "Upgrade" 
                      : "Change Plan"}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Upgrade Dialog */}
      <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to {selectedTier?.charAt(0).toUpperCase() + selectedTier?.slice(1)} Plan</DialogTitle>
            <DialogDescription>
              You'll be redirected to PayPal to complete your subscription.
            </DialogDescription>
          </DialogHeader>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center p-6">
              <Loader2Icon className="h-8 w-8 text-primary animate-spin mb-4" />
              <p>Preparing your subscription...</p>
            </div>
          ) : paypalError ? (
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{paypalError}</AlertDescription>
            </Alert>
          ) : (
            <div className="text-center">
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>You'll be redirected to PayPal</AlertTitle>
                <AlertDescription>
                  Please complete the payment process on PayPal to activate your subscription.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setUpgradeDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}