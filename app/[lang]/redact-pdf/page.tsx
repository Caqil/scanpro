import { Metadata } from "next";
import { PdfRedactor } from "@/components/pdf-redactor";
import {
  RedactHeaderSection,
  HowToRedactSection,
  RedactFaqSection,
  WhyRedactSection,
  BestPracticesSection,
  RelatedToolsSection
} from "./redact-content";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';
import { generatePageSeoMetadata } from "@/lib/seo/schemas";
import { SEO } from "@/components/SEO";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";

  // Use the SEO metadata generator
  return generatePageSeoMetadata(lang as any, { 
    translationPrefix: 'redactPdf', 
    canonicalPath: 'redact-pdf' 
  }); 
}

export default function RedactPDFPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <RedactHeaderSection />

      {/* Main Tool Card */}
      <div className="mb-12">
        <PdfRedactor />
      </div>

      {/* How It Works */}
      <HowToRedactSection />

      {/* Benefits Section */}
      <WhyRedactSection />

      {/* FAQ Section */}
      <RedactFaqSection />

      {/* Best Practices Section */}
      <BestPracticesSection />

      {/* Related Tools Section */}
      <RelatedToolsSection />
    </div>
  );
}