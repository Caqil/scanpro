// app/[lang]/migrate/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguageStore } from "@/src/store/store";

interface MigrationPlan {
  tier: string;
  billingCycle: 'monthly' | 'yearly';
  price: number;
  features: string[];
}

export default function MigrationPage() {
  const { t } = useLanguageStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Read parameters from URL
  const userId = searchParams.get('userId');
  const currentTier = searchParams.get('tier');
  
  // State for component
  const [loading, setLoading] = useState(false);
  const [migrationPlans, setMigrationPlans] = useState<MigrationPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  // Fetch available plans on component mount
  useEffect(() => {
    // Initialize plans based on current tier
    const plans: MigrationPlan[] = [];
    
    // Basic plan
    plans.push({
      tier: 'basic',
      billingCycle: 'monthly',
      price: 9.99,
      features: [
        '1,000 operations per month',
        '100 requests per hour',
        '3 API keys',
        'All PDF operations',
        'Basic OCR',
        '50MB file size limit',
        'Email support'
      ]
    });
    
    // Pro plan
    plans.push({
      tier: 'pro',
      billingCycle: 'monthly',
      price: 29.99,
      features: [
        '10,000 operations per month',
        '1,000 requests per hour',
        '10 API keys',
        'Advanced OCR',
        'Custom watermarks',
        '100MB file size limit',
        'Priority support'
      ]
    });
    
    // Enterprise plan
    plans.push({
      tier: 'enterprise',
      billingCycle: 'monthly',
      price: 99.99,
      features: [
        '100,000+ operations per month',
        '5,000+ requests per hour',
        '50+ API keys',
        'Dedicated support',
        'Custom integration help',
        'White-label options',
        '500MB file size limit'
      ]
    });
    
    setMigrationPlans(plans);
    
    // Select the current tier by default
    if (currentTier && ['basic', 'pro', 'enterprise'].includes(currentTier)) {
      setSelectedPlan(currentTier);
    } else {
      setSelectedPlan('basic');
    }
  }, [currentTier]);
  
  // Update displayed price when billing cycle changes
  const getPrice = (tier: string) => {
    const plan = migrationPlans.find(p => p.tier === tier);
    if (!plan) return 0;
    
    const basePrice = plan.price;
    return billingCycle === 'yearly' ? Math.round(basePrice * 12 * 0.8 * 100) / 100 : basePrice;
  };
  
  // Handle continuing to PayPal
  const handleContinue = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan to continue");
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the subscription upgrade API
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tier: selectedPlan,
          billingCycle
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to process migration');
      }
      
      const data = await response.json();
      
      // If successful, redirect to PayPal checkout
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Migration error:', error);
      toast.error('There was an error processing your migration');
    } finally {
      setLoading(false);
    }
  };
  
  // Render an error if no user ID is provided
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Invalid Migration Link</CardTitle>
            <CardDescription>This migration link is invalid or expired.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push('/en')} className="w-full">
              Return to Homepage
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-3xl py-12 mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Migrate Your Subscription</h1>
        <p className="text-muted-foreground">
          We're upgrading our payment system to serve you better. 
          Please select a plan below to continue your subscription.
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Your Plan</CardTitle>
          <CardDescription>
            Choose the plan that best fits your needs. Your current tier is {" "}
            <span className="font-medium capitalize">{currentTier || "unknown"}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Billing Cycle Selector */}
          <div className="mb-6">
            <RadioGroup 
              value={billingCycle} 
              onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Monthly Billing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yearly" id="yearly" />
                <Label htmlFor="yearly">
                  Yearly Billing
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded dark:bg-green-900/30 dark:text-green-400">
                    Save 20%
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Plan Options */}
          <RadioGroup 
            value={selectedPlan} 
            onValueChange={setSelectedPlan}
            className="space-y-4"
          >
            {migrationPlans.map((plan) => (
              <div 
                key={plan.tier} 
                className={`border rounded-lg p-4 transition-all ${
                  selectedPlan === plan.tier ? 'border-primary ring-1 ring-primary' : ''
                }`}
              >
                <div className="flex items-start">
                  <RadioGroupItem value={plan.tier} id={`plan-${plan.tier}`} className="mt-1" />
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <Label htmlFor={`plan-${plan.tier}`} className="font-medium capitalize text-lg">
                        {plan.tier} Plan
                      </Label>
                      <div className="text-right">
                        <p className="text-xl font-bold">${getPrice(plan.tier)}</p>
                        <p className="text-sm text-muted-foreground">
                          per {billingCycle === 'monthly' ? 'month' : 'year'}
                        </p>
                      </div>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push('/en/dashboard')}>
            Cancel
          </Button>
          <Button onClick={handleContinue} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Continue to PayPal'
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="bg-muted/50 rounded-lg p-4 border text-sm">
        <h3 className="font-medium mb-2">What happens next?</h3>
        <p className="mb-2">
          After selecting your plan, you'll be redirected to PayPal to set up your new subscription.
          Once completed, your ScanPro account will be immediately updated, and your existing 
          subscription will be canceled automatically.
        </p>
        <p>
          If you have any questions or need assistance with the migration process, 
          please contact our support team at support@scanpro.cc.
        </p>
      </div>
    </div>
  );
}