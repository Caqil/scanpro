"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, XIcon, InfoIcon } from "lucide-react";
import { useLanguageStore } from "@/src/store/store";
import { LanguageLink } from "@/components/language-link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PlanFeature {
  name: string;
  free: boolean;
  basic: boolean;
  pro: boolean;
  enterprise: boolean;
  tooltip?: string;
}

export function PricingContent() {
  const { t } = useLanguageStore();
  const router = useRouter();
  const { data: session } = useSession();
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Monthly and annual pricing
  const pricing = {
    monthly: {
      basic: 9.99,
      pro: 29.99,
      enterprise: 99.99
    },
    annual: {
      basic: 7.99,
      pro: 24.99,
      enterprise: 79.99
    }
  };

  // Calculate savings
  const getAnnualSavings = (plan: 'basic' | 'pro' | 'enterprise') => {
    const monthlyCost = pricing.monthly[plan] * 12;
    const annualCost = pricing.annual[plan] * 12;
    const savings = monthlyCost - annualCost;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { savings, percentage };
  };

  // Plan features table
  const planFeatures: PlanFeature[] = [
    { 
      name: t('pricing.features.operations') || "Monthly operations", 
      free: true, 
      basic: true, 
      pro: true, 
      enterprise: true, 
      tooltip: "Number of PDF operations you can perform per month" 
    },
    { 
      name: t('pricing.features.amount.free') || "100 operations", 
      free: true, 
      basic: false, 
      pro: false, 
      enterprise: false 
    },
    { 
      name: t('pricing.features.amount.basic') || "1,000 operations", 
      free: false, 
      basic: true, 
      pro: false, 
      enterprise: false 
    },
    { 
      name: t('pricing.features.amount.pro') || "10,000 operations", 
      free: false, 
      basic: false, 
      pro: true, 
      enterprise: false 
    },
    { 
      name: t('pricing.features.amount.enterprise') || "100,000 operations", 
      free: false, 
      basic: false, 
      pro: false, 
      enterprise: true 
    },
    { 
      name: t('pricing.features.apiAccess') || "API Access", 
      free: true, 
      basic: true, 
      pro: true, 
      enterprise: true,
      tooltip: "Programmatic access to our PDF tools via API" 
    },
    { 
      name: t('pricing.features.apiKeys.free') || "1 API key", 
      free: true, 
      basic: false, 
      pro: false, 
      enterprise: false 
    },
    { 
      name: t('pricing.features.apiKeys.basic') || "3 API keys", 
      free: false, 
      basic: true, 
      pro: false, 
      enterprise: false 
    },
    { 
      name: t('pricing.features.apiKeys.pro') || "10 API keys", 
      free: false, 
      basic: false, 
      pro: true, 
      enterprise: false 
    },
    { 
      name: t('pricing.features.apiKeys.enterprise') || "50 API keys", 
      free: false, 
      basic: false, 
      pro: false, 
      enterprise: true 
    },
    { 
      name: t('pricing.features.rateLimits') || "Rate limit", 
      free: true, 
      basic: true, 
      pro: true, 
      enterprise: true,
      tooltip: "Number of requests per hour through the API" 
    },
    { 
      name: t('pricing.features.rateLimit.free') || "10 requests/hour", 
      free: true, 
      basic: false, 
      pro: false, 
      enterprise: false 
    },
    { 
      name: t('pricing.features.rateLimit.basic') || "100 requests/hour", 
      free: false, 
      basic: true, 
      pro: false, 
      enterprise: false 
    },
    { 
      name: t('pricing.features.rateLimit.pro') || "1,000 requests/hour", 
      free: false, 
      basic: false, 
      pro: true, 
      enterprise: false 
    },
    { 
      name: t('pricing.features.rateLimit.enterprise') || "5,000 requests/hour", 
      free: false, 
      basic: false, 
      pro: false, 
      enterprise: true 
    },
    { 
      name: t('pricing.features.fileSizes') || "Max file size", 
      free: true, 
      basic: true, 
      pro: true, 
      enterprise: true 
    },
    { 
      name: t('pricing.features.fileSize.free') || "25 MB", 
      free: true, 
      basic: false, 
      pro: false, 
      enterprise: false 
    },
    { 
      name: t('pricing.features.fileSize.basic') || "50 MB", 
      free: false, 
      basic: true, 
      pro: false, 
      enterprise: false 
    },
    { 
      name: t('pricing.features.fileSize.pro') || "100 MB", 
      free: false, 
      basic: false, 
      pro: true, 
      enterprise: false 
    },
    { 
      name: t('pricing.features.fileSize.enterprise') || "200 MB", 
      free: false, 
      basic: false, 
      pro: false, 
      enterprise: true 
    },
    { 
      name: t('pricing.features.ocr') || "OCR (Text recognition)", 
      free: false, 
      basic: true, 
      pro: true, 
      enterprise: true,
      tooltip: "Extract text from images and scanned PDFs" 
    },
    { 
      name: t('pricing.features.watermarking') || "Watermarking", 
      free: false, 
      basic: true, 
      pro: true, 
      enterprise: true 
    },
    { 
      name: t('pricing.features.advancedProtection') || "Advanced PDF protection", 
      free: false, 
      basic: false, 
      pro: true, 
      enterprise: true 
    },
    { 
      name: t('pricing.features.bulkProcessing') || "Bulk processing", 
      free: false, 
      basic: false, 
      pro: true, 
      enterprise: true 
    },
    { 
      name: t('pricing.features.supports') || "Support", 
      free: true, 
      basic: true, 
      pro: true, 
      enterprise: true 
    },
    { 
      name: t('pricing.features.support.free') || "Email support", 
      free: true, 
      basic: true, 
      pro: false, 
      enterprise: false 
    },
    { 
      name: t('pricing.features.support.priority') || "Priority support", 
      free: false, 
      basic: false, 
      pro: true, 
      enterprise: false 
    },
    { 
      name: t('pricing.features.support.dedicated') || "Dedicated support", 
      free: false, 
      basic: false, 
      pro: false, 
      enterprise: true 
    },
    { 
      name: t('pricing.features.whiteLabel') || "White-label options", 
      free: false, 
      basic: false, 
      pro: false, 
      enterprise: true 
    },
    { 
      name: t('pricing.features.serviceLevel') || "Service Level Agreement", 
      free: false, 
      basic: false, 
      pro: false, 
      enterprise: true 
    }
  ];

  // Handle subscription purchase
  const handleSubscribe = async (plan: string) => {
    if (plan === 'free') {
      if (!session) {
        setShowLoginDialog(true);
        return;
      }
      
      router.push('/dashboard');
      return;
    }
    
    setSelectedPlan(plan);
    
    if (!session) {
      setShowLoginDialog(true);
      return;
    }
    
    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: plan,
          interval: isAnnual ? 'annual' : 'monthly'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }
      
      const data = await response.json();
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.success(data.message || 'Subscription updated successfully');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to process subscription. Please try again later.');
    }
  };

  return (
    <div className="py-16 px-4 md:px-6">
      {/* Header Section */}
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t('pricing.title') || "Simple, transparent pricing"}
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          {t('pricing.subtitle') || "Choose the plan that's right for you. All plans include our core PDF tools."}
        </p>
        
        {/* Billing Toggle */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <Label htmlFor="billing-toggle" className={isAnnual ? "text-muted-foreground" : "font-medium"}>
            {t('pricing.monthly') || "Monthly"}
          </Label>
          <Switch
            id="billing-toggle"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
          />
          <Label htmlFor="billing-toggle" className={!isAnnual ? "text-muted-foreground" : "font-medium"}>
            {t('pricing.yearly') || "Yearly"}
          </Label>
          {isAnnual && (
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              {t('pricing.saveUp') || "Save up to 20%"}
            </Badge>
          )}
        </div>
      </div>

      {/* Pricing Cards Section - Mobile View */}
      <div className="md:hidden mx-auto max-w-md space-y-6 mb-12">
        <Tabs defaultValue="free" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="free">Free</TabsTrigger>
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="pro">Pro</TabsTrigger>
            <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
          </TabsList>
          
          {/* Free Plan Tab */}
          <TabsContent value="free">
            <Card className="border-2 border-muted">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>For occasional PDF needs</CardDescription>
                <div className="mt-4 text-4xl font-bold">$0</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>100 operations per month</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>1 API key</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>10 requests/hour rate limit</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>25MB max file size</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>Email support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={session ? "outline" : "default"} 
                  className="w-full"
                  onClick={() => handleSubscribe('free')}
                >
                  {session ? "Current Plan" : "Get Started"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Basic Plan Tab */}
          <TabsContent value="basic">
            <Card className="border-2 border-primary relative">
              <div className="absolute top-0 right-6 transform -translate-y-1/2">
                <Badge className="px-3 py-1">Popular</Badge>
              </div>
              
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>For individuals and small teams</CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold">
                    ${isAnnual ? pricing.annual.basic : pricing.monthly.basic}
                    <span className="text-base font-normal text-muted-foreground ml-1">
                      /{isAnnual ? 'mo, billed annually' : 'month'}
                    </span>
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Save ${getAnnualSavings('basic').savings.toFixed(2)} per year ({getAnnualSavings('basic').percentage}%)
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>1,000 operations per month</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>3 API keys</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>100 requests/hour rate limit</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>50MB max file size</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>Basic OCR</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>Watermarking</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleSubscribe('basic')}
                >
                  {t('pricing.subscribe') || "Subscribe"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Pro Plan Tab */}
          <TabsContent value="pro">
            <Card className="border-2 border-muted">
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For professionals and businesses</CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold">
                    ${isAnnual ? pricing.annual.pro : pricing.monthly.pro}
                    <span className="text-base font-normal text-muted-foreground ml-1">
                      /{isAnnual ? 'mo, billed annually' : 'month'}
                    </span>
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Save ${getAnnualSavings('pro').savings.toFixed(2)} per year ({getAnnualSavings('pro').percentage}%)
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>10,000 operations per month</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>10 API keys</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>1,000 requests/hour rate limit</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>100MB max file size</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>Advanced OCR</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleSubscribe('pro')}
                >
                  {t('pricing.subscribe') || "Subscribe"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Enterprise Plan Tab */}
          <TabsContent value="enterprise">
            <Card className="border-2 border-muted">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For large organizations</CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold">
                    ${isAnnual ? pricing.annual.enterprise : pricing.monthly.enterprise}
                    <span className="text-base font-normal text-muted-foreground ml-1">
                      /{isAnnual ? 'mo, billed annually' : 'month'}
                    </span>
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Save ${getAnnualSavings('enterprise').savings.toFixed(2)} per year ({getAnnualSavings('enterprise').percentage}%)
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>100,000 operations per month</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>50 API keys</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>5,000 requests/hour rate limit</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>200MB max file size</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>Dedicated support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span>White-label options</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleSubscribe('enterprise')}
                >
                  {t('pricing.subscribe') || "Subscribe"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Pricing Cards Section - Desktop View */}
      <div className="hidden md:block mx-auto max-w-7xl mb-16">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Free Plan */}
          <Card className="border-2 border-muted">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>For occasional PDF needs</CardDescription>
              <div className="mt-4 text-4xl font-bold">$0</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>100 operations per month</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>1 API key</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>10 requests/hour rate limit</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>Basic PDF operations</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>25MB max file size</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>Email support</span>
                </li>
                <li className="flex items-center">
                  <XIcon className="mr-2 h-4 w-4 text-gray-300 dark:text-gray-600" />
                  <span className="text-muted-foreground">OCR functionality</span>
                </li>
                <li className="flex items-center">
                  <XIcon className="mr-2 h-4 w-4 text-gray-300 dark:text-gray-600" />
                  <span className="text-muted-foreground">Watermarking</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={session ? "outline" : "default"} 
                className="w-full"
                onClick={() => handleSubscribe('free')}
              >
                {session ? "Current Plan" : "Get Started"}
              </Button>
            </CardFooter>
          </Card>

          {/* Basic Plan */}
          <Card className="border-2 border-primary relative">
            <div className="absolute top-0 right-6 transform -translate-y-1/2">
              <Badge className="px-3 py-1">Popular</Badge>
            </div>
            
            <CardHeader>
              <CardTitle>Basic</CardTitle>
              <CardDescription>For individuals and small teams</CardDescription>
              <div className="mt-4">
                <div className="text-4xl font-bold">
                  ${isAnnual ? pricing.annual.basic : pricing.monthly.basic}
                  <span className="text-base font-normal text-muted-foreground ml-1">
                    /{isAnnual ? 'mo, billed annually' : 'month'}
                  </span>
                </div>
                {isAnnual && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    campaignSave ${getAnnualSavings('basic').savings.toFixed(2)} per year ({getAnnualSavings('basic').percentage}%)
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>1,000 operations per month</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>3 API keys</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>100 requests/hour rate limit</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>All PDF operations</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>50MB max file size</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>Basic OCR</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>Watermarking</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>Email support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => handleSubscribe('basic')}
              >
                {t('pricing.subscribe') || "Subscribe"}
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-muted">
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>For professionals and businesses</CardDescription>
              <div className="mt-4">
                <div className="text-4xl font-bold">
                  ${isAnnual ? pricing.annual.pro : pricing.monthly.pro}
                  <span className="text-base font-normal text-muted-foreground ml-1">
                    /{isAnnual ? 'mo, billed annually' : 'month'}
                  </span>
                </div>
                {isAnnual && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Save ${getAnnualSavings('pro').savings.toFixed(2)} per year ({getAnnualSavings('pro').percentage}%)
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>10,000 operations per month</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>10 API keys</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>1,000 requests/hour rate limit</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>100MB max file size</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>Advanced OCR</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>Watermarking</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>Advanced PDF protection</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>Bulk processing</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>Priority support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => handleSubscribe('pro')}
              >
                {t('pricing.subscribe') || "Subscribe"}
              </Button>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-2 border-muted">
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>For large organizations</CardDescription>
              <div className="mt-4">
                <div className="text-4xl font-bold">
                  ${isAnnual ? pricing.annual.enterprise : pricing.monthly.enterprise}
                  <span className="text-base font-normal text-muted-foreground ml-1">
                    /{isAnnual ? 'mo, billed annually' : 'month'}
                  </span>
                </div>
                {isAnnual && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Save ${getAnnualSavings('enterprise').savings.toFixed(2)} per year ({getAnnualSavings('enterprise').percentage}%)
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>100,000 operations per month</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>50 API keys</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>5,000 requests/hour rate limit</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>200MB max file size</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>Advanced OCR</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>Watermarking</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>Advanced PDF protection</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>Bulk processing</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>White-label options</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span>Service Level Agreement</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => handleSubscribe('enterprise')}
              >
                {t('pricing.subscribe') || "Subscribe"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Login Dialog */}
      {showLoginDialog && (
        <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign in required</AlertDialogTitle>
              <AlertDialogDescription>
                Please sign in to subscribe to a plan or access your dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <LanguageLink href="/auth/signin">Sign In</LanguageLink>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}