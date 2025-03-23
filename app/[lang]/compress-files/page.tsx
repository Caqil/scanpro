// app/[lang]/compress-files/page.tsx
import { Metadata } from "next";
import UniversalFileCompressor from "@/components/universal-file-compressor";
import { CompressionHeaderSection, HowToCompressSection, CompressionFaqSection } from "./compression-content";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';
import enTranslations from '@/src/lib/i18n/locales/en';

// Helper function to get translation based on language
function getTranslation(lang: string, key: string): string {
  const translations = enTranslations; // We'll use English for now, expand as needed
  
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
    const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";
    
    // Import translations based on language
    let translations;
    switch (lang) {
      case "id":
        translations = (await import('@/src/lib/i18n/locales/id')).default;
        break;
      case "es":
        translations = (await import('@/src/lib/i18n/locales/es')).default;
        break;
      case "fr":
        translations = (await import('@/src/lib/i18n/locales/fr')).default;
        break;
      case "zh":
        translations = (await import('@/src/lib/i18n/locales/zh')).default;
        break;
      case "ar":
        translations = (await import('@/src/lib/i18n/locales/ar')).default;
        break;
      case "hi":
        translations = (await import('@/src/lib/i18n/locales/hi')).default;
        break;
      case "ru":
        translations = (await import('@/src/lib/i18n/locales/ru')).default;
        break;
      case "pt":
        translations = (await import('@/src/lib/i18n/locales/pt')).default;
        break;
      case "de":
        translations = (await import('@/src/lib/i18n/locales/de')).default;
        break;
      case "ja":
        translations = (await import('@/src/lib/i18n/locales/ja')).default;
        break;
      case "ko":
        translations = (await import('@/src/lib/i18n/locales/ko')).default;
        break;
      case "it":
        translations = (await import('@/src/lib/i18n/locales/it')).default;
        break;
      case "tr":
        translations = (await import('@/src/lib/i18n/locales/tr')).default;
        break;
      default:
        translations = (await import('@/src/lib/i18n/locales/en')).default;
    }
    
    // Helper function to get translation based on key
    const t = (key: string): string => {
      const keys = key.split('.');
      const result = keys.reduce((obj, k) => 
        (obj && obj[k] !== undefined) ? obj[k] : undefined, 
        translations as any
      );
      
      return result !== undefined ? result : key;
    };
  
    return {
      title: t("universalCompressor.title") || "Compress PDF, Images & Office Documents | Universal File Compressor",
      description: t("universalCompressor.description") || "Compress PDF, images (JPG, PNG), Word documents, PowerPoint presentations, and Excel spreadsheets with our universal file compressor. Maintain quality while reducing file size.",
      openGraph: {
        title: t("universalCompressor.title") || "Universal File Compressor - Compress Any Document",
        description: t("universalCompressor.description") || "Compress PDF, images, and Office documents while maintaining quality with our fast, secure, and free online compressor.",
        url: `/${lang}/compress-files`,
        siteName: "ScanPro",
        locale: lang === "id" ? "id_ID" : lang === "es" ? "es_ES" : "en_US",
      },
      alternates: {
        canonical: `/${lang}/compress-file`,
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
            
            return [langCode, `/${code}/compress-file`];
          })
        ),
      }
    };
  }

export default function CompressFilesPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <CompressionHeaderSection />

      {/* Main Compressor Tool */}
      <div className="mb-12">
        <UniversalFileCompressor />
      </div>

      {/* How It Works */}
      <HowToCompressSection />

      {/* FAQ Section */}
      <CompressionFaqSection />
    </div>
  );
}