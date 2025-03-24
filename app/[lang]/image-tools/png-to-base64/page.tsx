// app/[lang]/image-tools/png-to-base64/page.tsx
import { Metadata } from "next";
import { PngToBase64Tool } from "./png-to-base64-tool";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";
  
  return {
    title: "Convert PNG to Base64 | Image Tools",
    description: "Convert PNG images to Base64 encoded strings for embedding in websites and applications",
    openGraph: {
      title: "Convert PNG to Base64 | Image Tools",
      description: "Convert PNG images to Base64 encoded strings for embedding in websites and applications",
      url: `/${lang}/image-tools/png-to-base64`,
      siteName: "ScanPro",
    },
    alternates: {
      canonical: `/${lang}/image-tools/png-to-base64`,
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
          
          return [langCode, `/${code}/image-tools/png-to-base64`];
        })
      ),
    }
  };
}

export default function PngToBase64Page() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <PngToBase64Tool />
    </div>
  );
}