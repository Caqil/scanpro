'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, XIcon } from "lucide-react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from "@/src/store/store";
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Pricing tiers with full details
const pricingTiers = [
  {
    name: "Free",
    slug: "free",
    price: "$0",
    description: "For individuals with basic PDF needs",
    features: [
      "100 operations per month",
      "10 requests per hour",
      "1 API key",
      "Basic PDF conversion",
      "Basic PDF compression"
    ],
    limitations: [
      "No watermarking",
      "Limited OCR capabilities",
      "No priority support",
      "No custom branding",
      "No batch processing"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Basic",
    slug: "basic",
    price: "$9.99",
    description: "For professionals who need more capacity",
    features: [
      "1,000 operations per month",
      "100 requests per hour",
      "3 API keys",
      "All PDF operations",
      "Full OCR capabilities",
      "Advanced compression",
      "Secure PDF encryption"
    ],
    limitations: [
      "No priority support",
      "Limited batch processing",
      "No white-labeling"
    ],
    cta: "Upgrade to Basic",
    popular: true
  },
  {
    name: "Pro",
    slug: "pro",
    price: "$29.99",
    description: "For teams and power users",
    features: [
      "10,000 operations per month",
      "1,000 requests per hour",
      "10 API keys",
      "Advanced OCR with language support",
      "Priority support",
      "Custom watermarks",
      "Batch processing",
      "Advanced PDF editing"
    ],
    limitations: [],
    cta: "Upgrade to Pro",
    popular: false
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    price: "$99.99",
    description: "For businesses with high-volume needs",
    features: [
      "100,000 operations per month",
      "5,000 requests per hour",
      "50 API keys",
      "Dedicated support",
      "Custom integration help",
      "White-label options",
      "SLA guarantees",
      "Advanced security features",
      "Custom workflow automation"
    ],
    limitations: [],
    cta: "Upgrade to Enterprise",
    popular: false
  }
];

const faqs = [
  {
    question: "How are operations counted?",
    answer: "An operation is defined as a single PDF conversion, compression, merging, splitting, or other modification. For example, converting a PDF to Word is one operation, and merging two PDFs is also one operation."
  },
  {
    question: "Can I upgrade or downgrade at any time?",
    answer: "Yes, you can upgrade your plan at any time and get immediate access to the higher tier features. You can also downgrade, which will take effect at the end of your current billing cycle."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 14-day money-back guarantee if you're not satisfied with your subscription. Please contact our support team to process a refund."
  },
  {
    question: "How does the API request limit work?",
    answer: "Each tier has a limit on the number of API requests you can make per hour. If you exceed this limit, requests will be temporarily throttled until the next hour."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards through PayPal. For Enterprise customers, we can also arrange alternative payment methods including wire transfers and invoicing."
  },
  {
    question: "Is my payment information secure?",
    answer: "Yes, we use PayPal as our payment processor. We never store your full credit card details on our servers."
  }
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useLanguageStore();
  const [loading, setLoading] = useState<string | null>(null);
  
  // Handle subscription upgrade
  const handleUpgrade = async (tier: string) => {
    if (!session) {
      // Redirect to login if not authenticated
      router.push(`/login?callbackUrl=/pricing`);
      return;
    }
    
    setLoading(tier);
    
    try {
      if (tier === 'free') {
        toast.success('Your account is already on the free plan');
        setLoading(null);
        return;
      }
      
      // Call subscription API
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
      toast.error(error instanceof Error ? error.message : "Failed to upgrade subscription");
      setLoading(null);
    }
  };
  
  return (
    <div className="container max-w-6xl py-16 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          {t('pricing.title') || "Choose the Right Plan for You"}
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('pricing.subtitle') || "Get the PDF tools you need, whether you're a casual user or a business with high-volume needs."}
        </p>
      </div>
      
      {/* Pricing Tiers */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
        {pricingTiers.map((tier) => (
          <Card key={tier.slug} className={`relative ${tier.popular ? 'border-primary shadow-md' : ''}`}>
            {tier.popular && (
              <Badge className="absolute -top-2 right-4" variant="default">
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-2">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-muted-foreground"> / month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
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
              <Button 
                className="w-full" 
                variant={tier.popular ? "default" : "outline"}
                onClick={() => handleUpgrade(tier.slug)}
                disabled={loading === tier.slug}
              >
                {loading === tier.slug ? "Processing..." : tier.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Feature Comparison Table (for larger screens) */}
      <div className="hidden lg:block mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Feature Comparison</h2>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Feature</th>
                {pricingTiers.map((tier) => (
                  <th key={tier.slug} className="px-6 py-3 text-center text-sm font-medium">
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-6 py-4 font-medium">Monthly Operations</td>
                <td className="px-6 py-4 text-center">100</td>
                <td className="px-6 py-4 text-center">1,000</td>
                <td className="px-6 py-4 text-center">10,000</td>
                <td className="px-6 py-4 text-center">100,000</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">API Keys</td>
                <td className="px-6 py-4 text-center">1</td>
                <td className="px-6 py-4 text-center">3</td>
                <td className="px-6 py-4 text-center">10</td>
                <td className="px-6 py-4 text-center">50</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">Advanced OCR</td>
                <td className="px-6 py-4 text-center"><XIcon className="h-4 w-4 text-red-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckIcon className="h-4 w-4 text-green-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckIcon className="h-4 w-4 text-green-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckIcon className="h-4 w-4 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">Watermarking</td>
                <td className="px-6 py-4 text-center"><XIcon className="h-4 w-4 text-red-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckIcon className="h-4 w-4 text-green-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckIcon className="h-4 w-4 text-green-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckIcon className="h-4 w-4 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">Priority Support</td>
                <td className="px-6 py-4 text-center"><XIcon className="h-4 w-4 text-red-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><XIcon className="h-4 w-4 text-red-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckIcon className="h-4 w-4 text-green-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckIcon className="h-4 w-4 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">White-Labeling</td>
                <td className="px-6 py-4 text-center"><XIcon className="h-4 w-4 text-red-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><XIcon className="h-4 w-4 text-red-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><XIcon className="h-4 w-4 text-red-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckIcon className="h-4 w-4 text-green-500 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* FAQs */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      
      {/* CTA */}
      <div className="text-center">
        <div className="bg-muted p-8 rounded-lg max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">
            {t('pricing.ctaTitle') || "Ready to get started?"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('pricing.ctaSubtitle') || "Choose the plan that's right for you and start processing your PDFs today."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => session ? router.push('/dashboard') : router.push('/register')}
            >
              {session ? 'Go to Dashboard' : 'Create Free Account'}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => router.push('/contact')}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}