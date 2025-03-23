import { Metadata } from "next";
import { PdfWatermarker } from "@/components/pdf-watermarker";
import {
  WatermarkHeaderSection,
  HowToWatermarkSection,
  WatermarkFaqSection,
  RelatedToolsSection
} from "./watermark-content";
import enTranslations from '@/src/lib/i18n/locales/en';
import idTranslations from '@/src/lib/i18n/locales/id';
import esTranslations from '@/src/lib/i18n/locales/es';
import frTranslations from '@/src/lib/i18n/locales/fr';
import zhTranslations from '@/src/lib/i18n/locales/zh';
import arTranslations from '@/src/lib/i18n/locales/ar';
import hiTranslations from '@/src/lib/i18n/locales/hi';
import ruTranslations from '@/src/lib/i18n/locales/ru';
import ptTranslations from '@/src/lib/i18n/locales/pt';
import deTranslations from '@/src/lib/i18n/locales/de';
import jaTranslations from '@/src/lib/i18n/locales/ja';
import koTranslations from '@/src/lib/i18n/locales/ko';
import itTranslations from '@/src/lib/i18n/locales/it';
import trTranslations from '@/src/lib/i18n/locales/tr';
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';

type Language = typeof SUPPORTED_LANGUAGES[number];

// Helper function to get translation based on language
function getTranslation(lang: string, key: string): string {
  let translations = enTranslations;
  
  // Check which language to use
  switch (lang) {
    case "id":
      translations = idTranslations;
      break;
    case "es":
      translations = esTranslations;
      break;
    case "fr":
      translations = frTranslations;
      break;
    case "zh":
      translations = zhTranslations;
      break;
    case "ar":
      translations = arTranslations;
      break;
    case "hi":
      translations = hiTranslations;
      break;
    case "ru":
      translations = ruTranslations;
      break;
    case "pt":
      translations = ptTranslations;
      break;
    case "de":
      translations = deTranslations;
      break;
    case "ja":
      translations = jaTranslations;
      break;
    case "ko":
      translations = koTranslations;
      break;
    case "it":
      translations = itTranslations;
      break;
    case "tr":
      translations = trTranslations;
      break;
    default:
      translations = enTranslations; // Fallback to English
  }
  
  // Navigate through nested keys
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
    title: t("watermark.title"),
    description: t("watermark.description"),
    openGraph: {
      title: t("watermark.title"),
      description: t("watermark.description"),
      url: `/${lang}/watermark`,
      siteName: "ScanPro",
      locale: lang === "id" ? "id_ID" : lang === "es" ? "es_ES" : "en_US",
    },
    alternates: {
      canonical: `/${lang}/watermark`,
      languages: {
        "en-US": "/en/watermark",
        "id-ID": "/id/watermark",
        "es-ES": "/es/watermark",
      },
    },
  };
}

export default function WatermarkPDFPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <WatermarkHeaderSection />

      {/* Main Tool Card */}
      <div className="mb-8">
        <PdfWatermarker />
      </div>

      {/* How It Works */}
      <HowToWatermarkSection />

      {/* FAQ Section */}
      <WatermarkFaqSection />

      {/* Related Tools Section */}
      <RelatedToolsSection />
    </div>
  );
}