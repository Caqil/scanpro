"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";
import { LanguageLink } from "@/components/language-link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function PricingCards() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { data: session } = useSession();
  const router = useRouter();
  
  // Calculate yearly pricing with 20% discount
  const getYearlyPrice = (monthlyPrice: number) => {
    const yearlyPrice = monthlyPrice * 12 * 0.8; // 20% discount
    return yearlyPrice.toFixed(2);
  };

  // Define pricing plans
  const pricingPlans = [
    {
      name: "Free",
      description: "Basic PDF tools for occasional use",
      price: 0,
      features: [
        "100 operations per month",
        "10 requests per hour",
        "1 API key",
        "Basic PDF operations",
        "10MB file size limit",
        "Community support"
      ],
      limitations: [
        "No watermarking",
        "Limited OCR",
        "No priority support"
      ],
      cta: "Get Started",
      href: "/register",
      popular: false
    },
    {
      name: "Basic",
      description: "Professional tools for regular users",
      price: 9.99,
      features: [
        "1,000 operations per month",
        "100 requests per hour",
        "3 API keys",
        "All PDF operations",
        "Basic OCR",
        "50MB file size limit",
        "Email support"
      ],
      limitations: [
        "No priority support",
        "No custom watermarks"
      ],
      cta: "Upgrade to Basic",
      href: "/register",
      popular: false
    },
    {
      name: "Pro",
      description: "Advanced features for power users",
      price: 29.99,
      features: [
        "10,000 operations per month",
        "1,000 requests per hour",
        "10 API keys",
        "Advanced OCR",
        "Custom watermarks",
        "100MB file size limit",
        "Priority support",
        "Dedicated API documentation"
      ],
      limitations: [],
      cta: "Upgrade to Pro",
      href: "/register",
      popular: true
    },
    {
      name: "Enterprise",
      description: "Custom solutions for organizations",
      price: 99.99,
      features: [
        "100,000+ operations per month",
        "5,000+ requests per hour",
        "50+ API keys",
        "Dedicated support",
        "Custom integration help",
        "White-label options",
        "500MB file size limit",
        "Dedicated account manager"
      ],
      limitations: [],
      cta: "Contact Sales",
      href: "/contact",
      popular: false
    }
  ];

  const handlePlanSelection = (plan: string, price: number) => {
    if (!session) {
      // If not logged in, redirect to register
      router.push("/register");
      return;
    }

    if (plan === "Free") {
      toast.success("You're already on the Free plan!");
      return;
    }

    if (plan === "Enterprise") {
      router.push("/contact");
      return;
    }

    // For other plans, we would normally redirect to checkout
    // This is a placeholder for that functionality
    toast.success(`Upgrading to ${plan} plan...`);
    // router.push(`/checkout?plan=${plan.toLowerCase()}&cycle=${billingCycle}`);
  };

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <span 
          className={`text-sm font-medium ${billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"}`}
        >
          Monthly billing
        </span>
        <Switch
          checked={billingCycle === "yearly"}
          onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
        />
        <span 
          className={`text-sm font-medium ${billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"}`}
        >
          Annual billing
          <Badge variant="outline" className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
            Save 20%
          </Badge>
        </span>
      </div>

      {/* Pricing cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {pricingPlans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`flex flex-col ${plan.popular ? "border-primary shadow-md relative" : ""}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-2 right-4 bg-primary">
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold">
                  ${plan.price === 0 ? '0' : 
                    billingCycle === "yearly" ? 
                      getYearlyPrice(plan.price) : 
                      plan.price.toFixed(2)
                  }
                </span>
                <span className="text-muted-foreground ml-2">
                  {plan.price === 0 ? 'forever' : `/${billingCycle === "yearly" ? 'year' : 'month'}`}
                </span>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">What's included:</h4>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.limitations.length > 0 && (
                  <div className="pt-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Limitations:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground mt-2">
                      {plan.limitations.map((limitation, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handlePlanSelection(plan.name, plan.price)}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}