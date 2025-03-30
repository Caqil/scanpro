// app/[lang]/ocr/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import { OcrContent } from "./ocr-content";
import { SUPPORTED_LANGUAGES, getTranslation } from '@/src/lib/i18n/config';

type Language = typeof SUPPORTED_LANGUAGES[number];

// Helper function to get translation based on language
function getTranslationForMetadata(lang: string, key: string): string {
  // Fallback for when translations are not available yet
  const fallbacks: Record<string, string> = {
    "ocr.title": "OCR - Extract Text from PDF | ScanPro",
    "ocr.description": "Extract text from scanned PDF documents with our advanced OCR tool. Convert images to editable text."
  };
  
  const translated = getTranslation(lang, key);
  return translated !== key ? translated : fallbacks[key] || key;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as Language) ? paramLang as Language : "en";
  const t = (key: string) => getTranslationForMetadata(lang, key);

  return {
    title: t("ocr.title"),
    description: t("ocr.description"),
    openGraph: {
      title: t("ocr.title"),
      description: t("ocr.description"),
      url: `/${lang}/ocr`,
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
      canonical: `/${lang}/ocr`,
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
          
          return [langCode, `/${code}/ocr`];
        })
      ),
    }
  };
}

export default function OcrPage() {
  return (
    <Suspense fallback={<div className="container max-w-5xl py-12 mx-auto">Loading OCR tool...</div>}>
      <OcrContent />
    </Suspense>
  );
}