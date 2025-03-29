import { Metadata } from "next";
import { PricingCards } from "@/components/pricing-cards";
import { Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LanguageLink } from "@/components/language-link";
import { SUPPORTED_LANGUAGES, getTranslation } from '@/src/lib/i18n/config';

type Language = typeof SUPPORTED_LANGUAGES[number];

// Helper function to get translation based on language
function getTranslationForMetadata(lang: string, key: string): string {
  // Fallback for when translations are not available yet
  const fallbacks: Record<string, string> = {
    "pricing.title": "Pricing Plans | ScanPro",
    "pricing.description": "Choose the perfect plan for your PDF management needs. From free conversion to enterprise solutions.",
    "pricing.pageTitle": "Simple, Transparent Pricing",
    "pricing.pageSubtitle": "Choose the plan that's right for you and your workflow"
  };
  
  const translated = getTranslation(lang, key);
  return translated !== key ? translated : fallbacks[key] || key;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as Language) ? paramLang as Language : "en";
  const t = (key: string) => getTranslationForMetadata(lang, key);
  
  const stopWordsByLanguage: Record<string, string[]> = {
    en: ["the", "a", "an", "and", "or", "to", "in", "with", "for", "is", "on", "at"],
    id: ["dan", "di", "ke", "dari", "untuk", "yang", "dengan", "atau", "pada"],
    es: ["el", "la", "los", "las", "y", "o", "en", "con", "para", "de", "a"],
    fr: ["le", "la", "les", "et", "ou", "à", "en", "avec", "pour", "de"],
    zh: ["的", "了", "在", "是", "我", "他", "这", "那", "和", "你"],
    ar: ["في", "من", "إلى", "على", "و", "هذا", "تلك", "مع", "أو"],
    hi: ["और", "के", "में", "से", "है", "को", "का", "कि", "पर"],
    ru: ["и", "в", "на", "с", "к", "от", "для", "по", "или"],
    pt: ["e", "ou", "em", "com", "para", "de", "a", "o", "as"],
    de: ["und", "in", "mit", "für", "zu", "auf", "an", "oder"],
    ja: ["の", "に", "を", "は", "が", "と", "で", "です"],
    ko: ["은", "는", "이", "가", "을", "를", "에", "와"],
    it: ["e", "o", "in", "con", "per", "di", "a", "il", "la"],
    tr: ["ve", "ile", "de", "da", "için", "bu", "şu", "veya"]
  };
  
  // Keyword extraction function with language-specific stop words
  const extractKeywords = (text: string, language: string): string[] => {
    const stopWords = stopWordsByLanguage[language] || stopWordsByLanguage["en"];
    
    const words = text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/);
    
    const filteredWords = words
      .filter(word => !stopWords.includes(word) && word.length > 2)
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
  
    return Object.keys(filteredWords)
      .sort((a, b) => filteredWords[b] - filteredWords[a])
      .slice(0, 5);
  };

  const title = t("pricing.title");
  const description = t("pricing.description");
  const keywords = extractKeywords(`${title} ${description}`, lang);

  return {
    title: title,
    description: description,
    keywords: keywords,
    openGraph: {
      title: title,
      description: description,
      url: `/${lang}/pricing`,
      siteName: "ScanPro",
      locale: {
        'en': 'en_US',
        'id': 'id_ID',
        'es': 'es_ES',
        'fr': 'fr_FR',
        'zh': 'zh_CN',
        'ar': 'ar_SA',
        'hi': 'hi_IN',
        'ru': 'ru_RU',
        'pt': 'pt_BR',
        'de': 'de_DE',
        'ja': 'ja_JP',
        'ko': 'ko_KR',
        'it': 'it_IT',
        'tr': 'tr_TR'
      }[lang] || 'en_US',
    },
    alternates: {
      canonical: `/${lang}/pricing`,
      languages: Object.fromEntries(
        SUPPORTED_LANGUAGES.map(code => {
          const langCode = {
            'en': 'en-US',
            'id': 'id-ID',
            'es': 'es-ES',
            'fr': 'fr-FR',
            'zh': 'zh-CN',
            'ar': 'ar-SA',
            'hi': 'hi-IN',
            'ru': 'ru-RU',
            'pt': 'pt-BR',
            'de': 'de-DE',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
            'it': 'it-IT',
            'tr': 'tr-TR'
          }[code] || `${code}`;
          
          return [langCode, `/${code}/pricing`];
        })
      ),
    }
  };
}

export default function PricingPage() {
  return (
    <div className="container max-w-6xl py-12 mx-auto px-4">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Choose the plan that's right for you and your workflow
        </p>
      </div>

      {/* Pricing Cards */}
      <PricingCards />
      
      {/* Enterprise CTA */}
      <div className="mt-16 bg-muted/30 p-8 rounded-xl border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">Need a custom solution?</h2>
            <p className="text-muted-foreground">
              Our enterprise plan offers custom integrations, dedicated support, and volume discounts. 
              Contact our sales team to discuss your specific requirements.
            </p>
          </div>
          <LanguageLink href="/contact">
            <Button size="lg" className="min-w-[200px]">
              Contact Sales
            </Button>
          </LanguageLink>
        </div>
      </div>
      
      {/* Features Table */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/30">
                <th className="p-4 text-left font-medium border">Feature</th>
                <th className="p-4 text-center font-medium border">Free</th>
                <th className="p-4 text-center font-medium border">Basic</th>
                <th className="p-4 text-center font-medium border">Pro</th>
                <th className="p-4 text-center font-medium border">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border">Monthly operations</td>
                <td className="p-4 text-center border">100</td>
                <td className="p-4 text-center border">1,000</td>
                <td className="p-4 text-center border">10,000</td>
                <td className="p-4 text-center border">100,000+</td>
              </tr>
              <tr className="bg-muted/10">
                <td className="p-4 border">Hourly requests</td>
                <td className="p-4 text-center border">10</td>
                <td className="p-4 text-center border">100</td>
                <td className="p-4 text-center border">1,000</td>
                <td className="p-4 text-center border">5,000+</td>
              </tr>
              <tr>
                <td className="p-4 border">API keys</td>
                <td className="p-4 text-center border">1</td>
                <td className="p-4 text-center border">3</td>
                <td className="p-4 text-center border">10</td>
                <td className="p-4 text-center border">50+</td>
              </tr>
              <tr className="bg-muted/10">
                <td className="p-4 border">PDF conversion</td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-4 border">PDF compression</td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="bg-muted/10">
                <td className="p-4 border">PDF merge & split</td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-4 border">Advanced OCR</td>
                <td className="p-4 text-center border">Limited</td>
                <td className="p-4 text-center border">Basic</td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="bg-muted/10">
                <td className="p-4 border">Custom watermarking</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-4 border">File size limit</td>
                <td className="p-4 text-center border">10 MB</td>
                <td className="p-4 text-center border">50 MB</td>
                <td className="p-4 text-center border">100 MB</td>
                <td className="p-4 text-center border">500 MB</td>
              </tr>
              <tr className="bg-muted/10">
                <td className="p-4 border">Priority support</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-4 border">Dedicated account manager</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr className="bg-muted/10">
                <td className="p-4 border">Custom integrations</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border">—</td>
                <td className="p-4 text-center border"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-4 border">White-label options</td>
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
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">How do I upgrade my plan?</h3>
            <p className="text-muted-foreground">
              You can upgrade at any time from your dashboard. Go to Settings, Subscription to see available options and upgrade with just a few clicks.
            </p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">Can I change plans later?</h3>
            <p className="text-muted-foreground">
              Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.
            </p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">What happens if I exceed my plan limits?</h3>
            <p className="text-muted-foreground">
              If you reach your monthly operation limit, you'll need to upgrade to a higher tier plan to continue processing documents, or wait until your limits reset at the start of the next month.
            </p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">Do you offer discounts for nonprofits or educational institutions?</h3>
            <p className="text-muted-foreground">
              Yes, we offer special pricing for educational institutions, nonprofits, and open-source projects. Contact our sales team to learn more about our discount programs.
            </p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">How is my subscription billed?</h3>
            <p className="text-muted-foreground">
              Subscriptions are billed monthly or annually, depending on your preference. Annual plans include a discount compared to monthly billing.
            </p>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">What payment methods do you accept?</h3>
            <p className="text-muted-foreground">
              We accept all major credit cards including Visa, Mastercard, American Express, and Discover. For Enterprise plans, we can also arrange alternative payment methods.
            </p>
          </div>
        </div>
      </div>
      
      {/* Satisfaction Guarantee */}
      <div className="mt-16">
        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <Info className="h-5 w-5 text-green-600 dark:text-green-400" />
          <AlertTitle>100% Satisfaction Guarantee</AlertTitle>
          <AlertDescription>
            We're confident you'll love ScanPro. If you're not completely satisfied with your paid plan, contact us within 14 days of purchase for a full refund.
          </AlertDescription>
        </Alert>
      </div>
      
      {/* CTA Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to streamline your document workflow?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands of professionals who trust ScanPro for their PDF management needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <LanguageLink href="/register">
            <Button size="lg">
              Get Started Now
            </Button>
          </LanguageLink>
          <LanguageLink href="/contact">
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </LanguageLink>
        </div>
      </div>
    </div>
  );
}