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
  const stopWordsByLanguage: Record<string, string[]> = {
    en: ["the", "a", "an", "and", "or", "to", "in", "with", "for", "is", "on", "at"],
    id: ["dan", "di", "ke", "dari", "untuk", "yang", "dengan", "atau", "pada"],
    es: ["el", "la", "los", "las", "y", "o", "en", "con", "para", "de", "a"],
    fr: ["le", "la", "les", "et", "ou", "à", "en", "avec", "pour", "de"],
    zh: ["的", "了", "在", "是", "我", "他", "这", "那", "和", "你"], // Simplified Chinese
    ar: ["في", "من", "إلى", "على", "و", "هذا", "تلك", "مع", "أو"], // Arabic
    hi: ["और", "के", "में", "से", "है", "को", "का", "कि", "पर"], // Hindi
    ru: ["и", "в", "на", "с", "к", "от", "для", "по", "или"], // Russian
    pt: ["e", "ou", "em", "com", "para", "de", "a", "o", "as"], // Portuguese
    de: ["und", "in", "mit", "für", "zu", "auf", "an", "oder"], // German
    ja: ["の", "に", "を", "は", "が", "と", "で", "です"], // Japanese (hiragana)
    ko: ["은", "는", "이", "가", "을", "를", "에", "와"], // Korean
    it: ["e", "o", "in", "con", "per", "di", "a", "il", "la"], // Italian
    tr: ["ve", "ile", "de", "da", "için", "bu", "şu", "veya"] // Turkish
  };
  
  
  
  // Keyword extraction function with language-specific stop words
  const extractKeywords = (text: string, language: string): string[] => {
    // Select stop words based on language, default to English if not found
    const stopWords = stopWordsByLanguage[language] || stopWordsByLanguage["en"];
    
    // Convert to lowercase (for Latin-based languages) and remove punctuation
    const words = text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/);
    
    // Filter out stop words and short words, then count frequency
    const filteredWords = words
      .filter(word => !stopWords.includes(word) && word.length > 2)
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
  
    // Sort by frequency and take top 5
    return Object.keys(filteredWords)
      .sort((a, b) => filteredWords[b] - filteredWords[a])
      .slice(0, 5);
  };
  const keywords = extractKeywords(`${ t(conversionInfo.titleKey) + " | " + t("metadata.template").replace("%s", "")} ${conversionInfo.descKey}`, lang);
  return {
    title: t(conversionInfo.titleKey) + " | " + t("metadata.template").replace("%s", ""),
    description: t(conversionInfo.descKey),
    keywords:keywords,
    openGraph: {
      title:  t(conversionInfo.titleKey) + " | " + t("metadata.template").replace("%s", ""),
      description: t(conversionInfo.descKey),
      url: `/${lang}/convert/${conversion}`,
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