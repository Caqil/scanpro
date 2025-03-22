import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientConversionContent } from "./client-conversion-content";

// Import translation files for server components
import enTranslations from "@/src/lib/i18n/locales/en";
import idTranslations from "@/src/lib/i18n/locales/id";

// Define supported languages
const SUPPORTED_LANGUAGES = ["en", "id", "es"];
type Language = typeof SUPPORTED_LANGUAGES[number];

// Helper function to get translation based on language
function getTranslation(lang: string, key: string): string {
  let translations = enTranslations;
  
  if (lang === "id") {
    translations = idTranslations;
  }
  
  const keys = key.split('.');
  const result = keys.reduce((obj, k) => 
    (obj && obj[k] !== undefined) ? obj[k] : undefined, 
    translations as any
  );
  
  return result !== undefined ? result : key;
}

// Define conversion types mapping for metadata generation
const conversionTitles: Record<string, { titleKey: string, descKey: string }> = {
  "pdf-to-docx": { titleKey: "convert.title.pdfToWord", descKey: "convert.description.pdfToWord" },
  "pdf-to-xlsx": { titleKey: "convert.title.pdfToExcel", descKey: "convert.description.pdfToExcel" },
  "pdf-to-pptx": { titleKey: "convert.title.pdfToPowerPoint", descKey: "convert.description.pdfToPowerPoint" },
  "pdf-to-jpg": { titleKey: "convert.title.pdfToJpg", descKey: "convert.description.pdfToJpg" },
  "pdf-to-png": { titleKey: "convert.title.pdfToPng", descKey: "convert.description.pdfToPng" },
  "pdf-to-html": { titleKey: "convert.title.pdfToHtml", descKey: "convert.description.pdfToHtml" },
  "docx-to-pdf": { titleKey: "convert.title.wordToPdf", descKey: "convert.description.wordToPdf" },
  "xlsx-to-pdf": { titleKey: "convert.title.excelToPdf", descKey: "convert.description.excelToPdf" },
  "pptx-to-pdf": { titleKey: "convert.title.powerPointToPdf", descKey: "convert.description.powerPointToPdf" },
  "jpg-to-pdf": { titleKey: "convert.title.jpgToPdf", descKey: "convert.description.jpgToPdf" },
  "png-to-pdf": { titleKey: "convert.title.pngToPdf", descKey: "convert.description.pngToPdf" },
  "html-to-pdf": { titleKey: "convert.title.htmlToPdf", descKey: "convert.description.htmlToPdf" },
};

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string, conversion: string }> 
}): Promise<Metadata> {
  const { lang: paramLang, conversion } = await params;
  
  if (!SUPPORTED_LANGUAGES.includes(paramLang)) {
    notFound();
  }
  
  const lang = paramLang;
  const t = (key: string) => getTranslation(lang, key);
  
  const conversionInfo = conversionTitles[conversion] || { 
    titleKey: "convert.title.generic", 
    descKey: "convert.description.generic" 
  };
  
  return {
    title: t(conversionInfo.titleKey) + " | " + t("metadata.template").replace("%s", ""),
    description: t(conversionInfo.descKey),
  };
}

export default async function ConversionPage({ 
  params 
}: { 
  params: Promise<{ lang: string, conversion: string }> 
}) {
  const { lang: paramLang } = await params;
  
  const supportedLanguages = ["en", "id", "es"];
  if (!supportedLanguages.includes(paramLang)) {
    notFound();
  }
  
  return <ClientConversionContent />;
}