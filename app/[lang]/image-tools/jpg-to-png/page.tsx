// app/[lang]/image-tools/jpg-to-png/page.tsx
import { Metadata } from "next";
import { JpgToPngTool } from "./jpg-to-png-tool";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";
  
  return {
    title: "Convert JPG to PNG | Image Tools",
    description: "Quickly convert a JPEG image to a PNG image with transparency support",
    openGraph: {
      title: "Convert JPG to PNG | Image Tools",
      description: "Quickly convert a JPEG image to a PNG image with transparency support",
      url: `/${lang}/image-tools/jpg-to-png`,
      siteName: "ScanPro",
    },
    alternates: {
      canonical: `/${lang}/image-tools/jpg-to-png`,
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
          
          return [langCode, `/${code}/image-tools/jpg-to-png`];
        })
      ),
    }
  };
}

export default function JpgToPngPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <JpgToPngTool />
    </div>
  );
}