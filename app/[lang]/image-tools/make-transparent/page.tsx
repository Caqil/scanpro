// app/[lang]/image-tools/make-transparent/page.tsx
import { Metadata } from "next";
import { MakeTransparentTool } from "./make-transparent-tool";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";
  
  return {
    title: "Make a PNG Transparent | Image Tools",
    description: "Quickly replace any color in a PNG file with transparency",
    openGraph: {
      title: "Make a PNG Transparent | Image Tools",
      description: "Quickly replace any color in a PNG file with transparency",
      url: `/${lang}/image-tools/make-transparent`,
      siteName: "ScanPro",
    },
    alternates: {
      canonical: `/${lang}/image-tools/make-transparent`,
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
          
          return [langCode, `/${code}/image-tools/make-transparent`];
        })
      ),
    }
  };
}

export default function MakeTransparentPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <MakeTransparentTool />
    </div>
  );
}