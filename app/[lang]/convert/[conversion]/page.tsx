import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientConversionContent } from "./client-conversion-content";
import { SUPPORTED_LANGUAGES, getTranslation } from '@/src/lib/i18n/config';

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
    openGraph: {
      title:  t(conversionInfo.titleKey) + " | " + t("metadata.template").replace("%s", ""),
      description: t(conversionInfo.descKey),
      url: `/${lang}/convert/${conversion}`,
      siteName: "ScanPro",
      locale: lang === "id" ? "id_ID" : lang === "es" ? "es_ES" : "en_US",
    },
    alternates: {
      canonical: `/${lang}/convert/${conversion}`,
      languages: Object.fromEntries(
        SUPPORTED_LANGUAGES.map(code => {
          const langCode = code === 'en' ? 'en-US' : 
                          code === 'id' ? 'id-ID' : 
                          code === 'es' ? 'es-ES' :
                          code === 'fr' ? 'fr-FR' :
                          code === 'zh' ? 'zh-CN' :
                          code === 'ar' ? 'ar-SA' :
                          code === 'hi' ? 'hi-IN' :
                          code === 'ru' ? 'ru-RU' :
                          code === 'pt' ? 'pt-BR' :
                          code === 'de' ? 'de-DE' :
                          code === 'ja' ? 'ja-JP' :
                          code === 'ko' ? 'ko-KR' :
                          code === 'it' ? 'it-IT' :
                          code === 'tr' ? 'tr-TR' : `${code}`;
          return [langCode, `/${code}/convert/${conversion}`];
        })
      ),
    },
  };
}

export default async function ConversionPage({ 
  params 
}: { 
  params: Promise<{ lang: string, conversion: string }> 
}) {
  const { lang: paramLang } = await params;
  
  if (!SUPPORTED_LANGUAGES.includes(paramLang)) {
    notFound();
  }
  
  return <ClientConversionContent />;
}