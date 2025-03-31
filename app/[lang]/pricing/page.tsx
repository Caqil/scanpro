// app/[lang]/pricing/page.tsx
import { Metadata } from "next";
import { PricingContent } from "./pricing-content";
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
  let translations;
  
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
    title: t('pricing.metaTitle') || 'Pricing Plans - ScanPro',
    description: t('pricing.metaDescription') || 'Choose the right plan for your PDF needs. ScanPro offers flexible pricing options from free to enterprise, with the features you need.',
    openGraph: {
      title: t('pricing.metaTitle') || 'Pricing Plans - ScanPro',
      description: t('pricing.metaDescription') || 'Choose the right plan for your PDF needs. ScanPro offers flexible pricing options from free to enterprise, with the features you need.',
      url: `/${lang}/pricing`,
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
      canonical: `/${lang}/pricing`,
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
          
          return [langCode, `/${code}/pricing`];
        })
      ),
    }
  };
}

export default function PricingPage() {
  return (
    <div>
      <PricingContent />
    </div>
  );
}