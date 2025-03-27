// app/[lang]/api-docs/page.tsx
import { Suspense } from 'react';
import { ApiDocumentationContent } from './api-docs-content';

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
import { Metadata } from 'next';

type Language = typeof SUPPORTED_LANGUAGES[number];

// Helper function to get translation based on language
function getTranslation(lang: string, key: string): string {
  let translations;
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
    title: t("apiKeys.title"),
    description: t("apiKeys.description"),
    openGraph: {
      title: t("apiKeys.title"),
      description: t("apiKeys.description"),
      url: `/${lang}/api-docs`,
      siteName: "ScanPro",
      locale: lang === "id" ? "id_ID" : lang === "es" ? "es_ES" : "en_US",
    },
    alternates: {
      canonical: `/${lang}/api-docs`,
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
          
          return [langCode, `/${code}/api-docs`];
        })
      ),
    }
  };
}

export default function ApiDocumentationPage() {
  return (
    <Suspense fallback={<ApiDocsLoading />}>
      <ApiDocumentationContent />
    </Suspense>
  );
}

function ApiDocsLoading() {
  return (
    <div className="container max-w-5xl py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
        <div className="h-4 bg-muted rounded w-full mt-8"></div>
        <div className="grid grid-cols-5 gap-2 mt-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded"></div>
          ))}
        </div>
        <div className="h-60 bg-muted rounded w-full mt-6"></div>
      </div>
    </div>
  );
}