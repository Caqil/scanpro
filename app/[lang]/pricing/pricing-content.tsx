"use client";

import { Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LanguageLink } from "@/components/language-link";
import { PricingCards } from "@/components/pricing-cards";
import { useLanguageStore } from "@/src/store/store";

export function PricingContent() {
  const { t } = useLanguageStore();
  
  return (
    <div className="container max-w-6xl py-12 mx-auto px-4">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          {t('pricing.pageTitle') || "Simple, Transparent Pricing"}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('pricing.pageSubtitle') || "Choose the plan that's right for you and your workflow"}
        </p>
      </div>

      {/* Pricing Cards */}
      <PricingCards />
      
      {/* Enterprise CTA */}
      <div className="mt-16 bg-muted/30 p-8 rounded-xl border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">{t('pricing.customSolution') || "Need a custom solution?"}</h2>
            <p className="text-muted-foreground">
              {t('pricing.enterpriseDesc') || "Our enterprise plan offers custom integrations, dedicated support, and volume discounts. Contact our sales team to discuss your specific requirements."}
            </p>
          </div>
          <LanguageLink href="/contact">
            <Button size="lg" className="min-w-[200px]">
              {t('pricing.contactSales') || "Contact Sales"}
            </Button>
          </LanguageLink>
        </div>
      </div>
      
      {/* Features Table */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">{t('pricing.featureComparison') || "Feature Comparison"}</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/30">
                <th className="p-4 text-left font-medium border">{t('pricing.feature') || "Feature"}</th>
                <th className="p-4 text-center font-medium border">{t('pricing.free') || "Free"}</th>
                <th className="p-4 text-center font-medium border">{t('pricing.basic') || "Basic"}</th>
                <th className="p-4 text-center font-medium border">{t('pricing.pro') || "Pro"}</th>
                <th className="p-4 text-center font-medium border">{t('pricing.enterprise') || "Enterprise"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border">{t('pricing.monthlyOperations') || "Monthly operations"}</td>
                <td className="p-4 text-center border">100</td>
                <td className="p-4 text-center border">1,000</td>
                <td className="p-4 text-center border">10,000</td>
                <td className="p-4 text-center border">100,000+</td>
              </tr>
              <tr className="bg-muted/10">
                <td className="p-4 border">{t('pricing.hourlyRequests') || "Hourly requests"}</td>
                <td className="p-4 text-center border">10</td>
                <td className="p-4 text-center border">100</td>
                <td className="p-4 text-center border">1,000</td>
                <td className="p-4 text-center border">5,000+</td>
              </tr>
              <tr>
                <td className="p-4 border">{t('pricing.apiKeys') || "API keys"}</td>
                <td className="p-4 text-center border">1</td>
                <td className="p-4 text-center border">3</td>
                <td className="p-4 text-center border">10</td>
                <td className="p-4 text-center border">50+</td>
              </tr>
              <tr className="bg-muted/10">
                <td className="p-4 border">{t('pricing.pdfConversion') || "PDF conversion"}</td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-4 border">{t('pricing.pdfCompression') || "PDF compression"}</td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="bg-muted/10">
                <td className="p-4 border">{t('pricing.pdfMergeSplit') || "PDF merge & split"}</td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-4 border">{t('pricing.advancedOcr') || "Advanced OCR"}</td>
                <td className="p-4 text-center border">{t('pricing.limited') || "Limited"}</td>
                <td className="p-4 text-center border">{t('pricing.basic') || "Basic"}</td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="bg-muted/10">
                <td className="p-4 border">{t('pricing.customWatermarking') || "Custom watermarking"}</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-4 border">{t('pricing.fileSizeLimit') || "File size limit"}</td>
                <td className="p-4 text-center border">10 MB</td>
                <td className="p-4 text-center border">50 MB</td>
                <td className="p-4 text-center border">100 MB</td>
                <td className="p-4 text-center border">500 MB</td>
              </tr>
              <tr className="bg-muted/10">
                <td className="p-4 border">{t('pricing.prioritySupport') || "Priority support"}</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-4 border">{t('pricing.dedicatedAccount') || "Dedicated account manager"}</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="bg-muted/10">
                <td className="p-4 border">{t('pricing.customIntegrations') || "Custom integrations"}</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-4 border">{t('pricing.whiteLabel') || "White-label options"}</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">{t('pricing.faq.title') || "Frequently Asked Questions"}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">{t('pricing.faq.upgrade.question') || "How do I upgrade my plan?"}</h3>
            <p className="text-muted-foreground">
              {t('pricing.faq.upgrade.answer') || "You can upgrade at any time from your dashboard. Go to Settings, Subscription to see available options and upgrade with just a few clicks."}
            </p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">{t('pricing.faq.changePlan.question') || "Can I change plans later?"}</h3>
            <p className="text-muted-foreground">
              {t('pricing.faq.changePlan.answer') || "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle."}
            </p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">{t('pricing.faq.limits.question') || "What happens if I exceed my plan limits?"}</h3>
            <p className="text-muted-foreground">
              {t('pricing.faq.limits.answer') || "If you reach your monthly operation limit, you'll need to upgrade to a higher tier plan to continue processing documents, or wait until your limits reset at the start of the next month."}
            </p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">{t('pricing.faq.discounts.question') || "Do you offer discounts for nonprofits or educational institutions?"}</h3>
            <p className="text-muted-foreground">
              {t('pricing.faq.discounts.answer') || "Yes, we offer special pricing for educational institutions, nonprofits, and open-source projects. Contact our sales team to learn more about our discount programs."}
            </p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">{t('pricing.faq.billing.question') || "How is my subscription billed?"}</h3>
            <p className="text-muted-foreground">
              {t('pricing.faq.billing.answer') || "Subscriptions are billed monthly or annually, depending on your preference. Annual plans include a discount compared to monthly billing."}
            </p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">{t('pricing.faq.payment.question') || "What payment methods do you accept?"}</h3>
            <p className="text-muted-foreground">
              {t('pricing.faq.payment.answer') || "We accept all major credit cards including Visa, Mastercard, American Express, and Discover. For Enterprise plans, we can also arrange alternative payment methods."}
            </p>
          </div>
        </div>
      </div>
      
      {/* Satisfaction Guarantee */}
      <div className="mt-16">
        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <Info className="h-5 w-5 text-green-600 dark:text-green-400" />
          <AlertTitle>{t('pricing.guarantee.title') || "100% Satisfaction Guarantee"}</AlertTitle>
          <AlertDescription>
            {t('pricing.guarantee.description') || "We're confident you'll love ScanPro. If you're not completely satisfied with your paid plan, contact us within 14 days of purchase for a full refund."}
          </AlertDescription>
        </Alert>
      </div>
      
      {/* CTA Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('pricing.cta.title') || "Ready to streamline your document workflow?"}</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          {t('pricing.cta.subtitle') || "Join thousands of professionals who trust ScanPro for their PDF management needs."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <LanguageLink href="/register">
            <Button size="lg">
              {t('pricing.cta.getStarted') || "Get Started Now"}
            </Button>
          </LanguageLink>
          <LanguageLink href="/contact">
            <Button variant="outline" size="lg">
              {t('pricing.cta.contactSales') || "Contact Sales"}
            </Button>
          </LanguageLink>
        </div>
      </div>
    </div>
  );
}