import { Metadata } from "next";
import MergePDFClient from "./merge-pdf-client";
import { LanguageLink } from "@/components/language-link";
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
    title: t("mergePdf.title"),
    description: t("mergePdf.description"),
    openGraph: {
      title: t("mergePdf.title"),
      description: t("mergePdf.description"),
      url: `/${lang}/merge`,
      siteName: "ScanPro",
      locale: lang === "id" ? "id_ID" : lang === "es" ? "es_ES" : "en_US",
    },
    alternates: {
      canonical: `/${lang}/merge`,
      languages: {
        "en-US": "/en/merge",
        "id-ID": "/id/merge",
        "es-ES": "/es/merge",
      },
    },
  };
}

// Server Component
export default async function MergePDFPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as Language) ? paramLang as Language : "en";
  const t = (key: string) => getTranslation(lang, key);

  return <MergePDFClient />;
}