// app/[lang]/image-tools/change-colors/page.tsx
import { Metadata } from "next";
import { ChangeColorsTool } from "./change-colors-tool";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";
  
  return {
    title: "Change Colors in PNG | Image Tools",
    description: "Easily replace specific colors in PNG images with new colors",
    openGraph: {
      title: "Change Colors in PNG | Image Tools",
      description: "Easily replace specific colors in PNG images with new colors",
      url: `/${lang}/image-tools/change-colors`,
      siteName: "ScanPro",
    },
    alternates: {
      canonical: `/${lang}/image-tools/change-colors`,
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
          
          return [langCode, `/${code}/image-tools/change-colors`];
        })
      ),
    }
  };
}

export default function ChangeColorsPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <ChangeColorsTool />
    </div>
  );
}