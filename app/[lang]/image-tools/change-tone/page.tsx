// app/[lang]/image-tools/change-tone/page.tsx
import { Metadata } from "next";
import { ChangeToneTool } from "./change-tone-tool";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";
  
  return {
    title: "Change PNG Color Tone | Image Tools",
    description: "Apply color tones and tints to your PNG images for artistic effects",
    openGraph: {
      title: "Change PNG Color Tone | Image Tools",
      description: "Apply color tones and tints to your PNG images for artistic effects",
      url: `/${lang}/image-tools/change-tone`,
      siteName: "ScanPro",
    },
    alternates: {
      canonical: `/${lang}/image-tools/change-tone`,
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
          
          return [langCode, `/${code}/image-tools/change-tone`];
        })
      ),
    }
  };
}

export default function ChangeTonePage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <ChangeToneTool />
    </div>
  );
}