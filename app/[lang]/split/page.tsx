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
  // Get translated title and description
  const title = t("splitPdf.title");
  const description = t("splitPdf.description");
  // Combine title and description for keyword extraction
  const keywords = extractKeywords(`${title} ${description}`, lang);
  return {
    title: title,
    description:description,
    keywords:keywords,
    openGraph: {
      title:title,
      description: description,
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