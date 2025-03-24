// app/[lang]/image-tools/page.tsx
import { Metadata } from "next";
import { ImageToolsHeaderSection, HowToUseImageTools } from "./image-tools-content";
import { ImageToolsList } from "@/components/image-tools-list";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";
  
  return {
    title: "Image Processing Tools | ScanPro",
    description: "Free online image tools to convert, compress, edit and transform your images",
    openGraph: {
      title: "Image Processing Tools | ScanPro",
      description: "Free online image tools to convert, compress, edit and transform your images",
      url: `/${lang}/image-tools`,
      siteName: "ScanPro",
      locale: lang === "id" ? "id_ID" : lang === "es" ? "es_ES" : "en_US",
    },
    alternates: {
      canonical: `/${lang}/image-tools`,
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
          
          return [langCode, `/${code}/image-tools`];
        })
      ),
    }
  };
}

export default function ImageToolsPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <ImageToolsHeaderSection />
      <div className="mb-12">
        <ImageToolsList />
      </div>
      <HowToUseImageTools />
    </div>
  );
}