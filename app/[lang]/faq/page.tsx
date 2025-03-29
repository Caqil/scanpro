// app/[lang]/faq/page.tsx
import { Metadata } from "next";
import { FAQContent } from "./faq-content";
import { SUPPORTED_LANGUAGES, getTranslation } from '@/src/lib/i18n/config';

type Language = typeof SUPPORTED_LANGUAGES[number];

// Helper function to get translation based on language
function getTranslationForMetadata(lang: string, key: string): string {
  // Fallback for when translations are not available yet
  const fallbacks: Record<string, string> = {
    "faq.title": "Frequently Asked Questions | ScanPro",
    "faq.description": "Find answers to the most common questions about ScanPro's PDF tools and services."
  };
  
  const translated = getTranslation(lang, key);
  return translated !== key ? translated : fallbacks[key] || key;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as Language) ? paramLang as Language : "en";
  const t = (key: string) => getTranslationForMetadata(lang, key);
  
  const stopWordsByLanguage: Record<string, string[]> = {
    en: ["the", "a", "an", "and", "or", "to", "in", "with", "for", "is", "on", "at"],
    id: ["dan", "di", "ke", "dari", "untuk", "yang", "dengan", "atau", "pada"],
    es: ["el", "la", "los", "las", "y", "o", "en", "con", "para", "de", "a"],
    fr: ["le", "la", "les", "et", "ou", "à", "en", "avec", "pour", "de"],
    zh: ["的", "了", "在", "是", "我", "他", "这", "那", "和", "你"],
    ar: ["في", "من", "إلى", "على", "و", "هذا", "تلك", "مع", "أو"],
    hi: ["और", "के", "में", "से", "है", "को", "का", "कि", "पर"],
    ru: ["и", "в", "на", "с", "к", "от", "для", "по", "или"],
    pt: ["e", "ou", "em", "com", "para", "de", "a", "o", "as"],
    de: ["und", "in", "mit", "für", "zu", "auf", "an", "oder"],
    ja: ["の", "に", "を", "は", "が", "と", "で", "です"],
    ko: ["은", "는", "이", "가", "을", "를", "에", "와"],
    it: ["e", "o", "in", "con", "per", "di", "a", "il", "la"],
    tr: ["ve", "ile", "de", "da", "için", "bu", "şu", "veya"]
  };
  
  // Keyword extraction function with language-specific stop words
  const extractKeywords = (text: string, language: string): string[] => {
    const stopWords = stopWordsByLanguage[language] || stopWordsByLanguage["en"];
    
    const words = text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/);
    
    const filteredWords = words
      .filter(word => !stopWords.includes(word) && word.length > 2)
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
  
    return Object.keys(filteredWords)
      .sort((a, b) => filteredWords[b] - filteredWords[a])
      .slice(0, 5);
  };

  const title = t("faq.title");
  const description = t("faq.description");
  const keywords = extractKeywords(`${title} ${description}`, lang);

  return {
    title: title,
    description: description,
    keywords: keywords,
    openGraph: {
      title: title,
      description: description,
      url: `/${lang}/faq`,
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
      canonical: `/${lang}/faq`,
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
          
          return [langCode, `/${code}/faq`];
        })
      ),
    }
  };
}

export default function FAQPage() {
  return <FAQContent />;
}