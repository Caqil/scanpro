import { Metadata } from "next";
import { PdfSplitter } from "@/components/pdf-splitter";
import {
  SplitHeaderSection,
  HowToSplitSection,
  SplitPdfFaqSection,
  SplitUseCasesSection,
  RelatedToolsSection
} from "./split-content";
import { SplitPdfClient } from "./split-pdf-client";
import { Suspense } from "react";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';
import { generatePageSeoMetadata } from "@/lib/seo/schemas";
import { SEO } from "@/components/SEO";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";

  // Use the new SEO metadata generator
  return generatePageSeoMetadata(lang as any, { 
    translationPrefix: 'splitPdf', 
    canonicalPath: 'split-pdf' 
  }); 
  
}

export default function SplitPDFPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <SplitHeaderSection />

      {/* Main Tool Card */}
      <div className="mb-12">
      <Suspense fallback={<div>Loading...</div>}>
        <SplitPdfClient />
      </Suspense>
      </div>

      {/* How It Works */}
      <HowToSplitSection />

      {/* Use Cases Section */}
      <SplitUseCasesSection />

      {/* FAQ Section */}
      <SplitPdfFaqSection />

      {/* Related Tools Section */}
      <RelatedToolsSection />
    </div>
  );
}