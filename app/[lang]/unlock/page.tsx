import { Metadata } from "next";
import { PdfUnlocker } from "@/components/pdf-unlocker";
import { useLanguageStore } from "@/src/store/store";
import { FAQSection, HowToUnlockSection, RelatedToolsSection, UnlockHeaderSection } from "./unlock-content";

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
    title: t("unlockPdf.title"),
    description: t("unlockPdf.description"),
    openGraph: {
      title: t("unlockPdf.title"),
      description: t("unlockPdf.description"),
      url: `/${lang}/unlock`,
      siteName: "ScanPro",
      locale: lang === "id" ? "id_ID" : lang === "es" ? "es_ES" : "en_US",
    },
    alternates: {
      canonical: `/${lang}/unlock`,
      languages: {
        "en-US": "/en/unlock",
        "id-ID": "/id/unlock",
        "es-ES": "/es/unlock",
      },
    },
  };
}


export default function UnlockPDFPage() {

  return (
    <div className="container max-w-5xl py-12 mx-auto">
     <UnlockHeaderSection/>

      {/* Main Tool Card */}
      <div className="mb-12">
        <PdfUnlocker />
      </div>

      {/* How It Works */}
      <HowToUnlockSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Related Tools Section */}
      <RelatedToolsSection />
    </div>
  );
}