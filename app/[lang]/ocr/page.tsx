import { Metadata } from "next";
import { PdfOcrExtractor } from "@/components/pdf-ocr-extractor";
import {
  OcrHeaderSection,
  HowToOcrSection,
  WhatIsOcrSection,
  WhenToUseOcrSection,
  OcrLimitationsSection,
  RelatedToolsSection
} from "./ocr-content";

import enTranslations from "@/src/lib/i18n/locales/en";
import idTranslations from "@/src/lib/i18n/locales/id";
import esTranslations from "@/src/lib/i18n/locales/es";

// Define supported languages
const SUPPORTED_LANGUAGES = ["en", "id", "es"];
type Language = typeof SUPPORTED_LANGUAGES[number];

// Helper function to get translation based on language
function getTranslation(lang: string, key: string): string {
  let translations = enTranslations;
  
  if (lang === "id") {
    translations = idTranslations;
  }
  else if (lang === "es") {
    translations = esTranslations;
  }
  
  const keys = key.split('.');
  const result = keys.reduce((obj, k) => 
    (obj && obj[k] !== undefined) ? obj[k] : undefined, 
    translations as any
  );
  
  return result !== undefined ? result : key;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as Language) ? paramLang as Language : "en";
  const t = (key: string) => getTranslation(lang, key);

  return {
    title: t("ocr.title"),
    description: t("ocr.description"),
    openGraph: {
      title: t("ocr.title"),
      description: t("ocr.description"),
      url: `/${lang}/ocr`,
      siteName: "ScanPro",
      locale: lang === "id" ? "id_ID" : lang === "es" ? "es_ES" : "en_US",
    },
    alternates: {
      canonical: `/${lang}/ocr`,
      languages: {
        "en-US": "/en/ocr",
        "id-ID": "/id/ocr",
        "es-ES": "/es/ocr",
      },
    },
  };
}

export default function OcrPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <OcrHeaderSection />

      {/* Main Tool Card */}
      <div className="mb-12">
        <PdfOcrExtractor />
      </div>

      {/* How It Works */}
      <HowToOcrSection />

      {/* What is OCR Section */}
      <WhatIsOcrSection  />

      {/* When to Use OCR */}
      <WhenToUseOcrSection />

      {/* OCR Limitations */}
      <OcrLimitationsSection />

      {/* Related Tools Section */}
      <RelatedToolsSection />
    </div>
  );
}