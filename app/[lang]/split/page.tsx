import { Metadata } from "next";
import { PdfSplitter } from "@/components/pdf-splitter";
import {
  SplitHeaderSection,
  HowToSplitSection,
  SplitPdfFaqSection,
  SplitUseCasesSection,
  RelatedToolsSection
} from "./split-content";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';

type Language = typeof SUPPORTED_LANGUAGES[number];

// Helper function to get translation based on language
function getTranslation(lang: string, key: string): string {
  // This would use your actual translation function
  // Simplified for this example
  return key;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as Language) ? paramLang as Language : "en";
  const t = (key: string) => getTranslation(lang, key);

  return {
    title: "Split PDF | ScanPro",
    description: "Split PDF files into multiple documents or extract specific pages quickly and easily",
    openGraph: {
      title: "Split PDF | ScanPro",
      description: "Split PDF files into multiple documents or extract specific pages quickly and easily",
      url: `/${lang}/split`,
      siteName: "ScanPro",
      locale: lang === "id" ? "id_ID" : lang === "es" ? "es_ES" : "en_US",
    },
    alternates: {
      canonical: `/${lang}/split`,
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
          
          return [langCode, `/${code}/split`];
        })
      ),
    }
  };
}

export default function SplitPDFPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <SplitHeaderSection />

      {/* Main Tool Card */}
      <div className="mb-12">
        <PdfSplitter />
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