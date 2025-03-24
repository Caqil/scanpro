// app/[lang]/image-tools/svg-to-png/page.tsx
import { Metadata } from "next";
import { SvgToPngTool } from "./svg-to-png-tool";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";
  
  return {
    title: "Convert SVG to PNG | Image Tools",
    description: "Quickly convert SVG vector graphics to PNG raster images with custom dimensions",
    openGraph: {
      title: "Convert SVG to PNG | Image Tools",
      description: "Quickly convert SVG vector graphics to PNG raster images with custom dimensions",
      url: `/${lang}/image-tools/svg-to-png`,
      siteName: "ScanPro",
    },
    alternates: {
      canonical: `/${lang}/image-tools/svg-to-png`,
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
          
          return [langCode, `/${code}/image-tools/svg-to-png`];
        })
      ),
    }
  };
}

export default function SvgToPngPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <SvgToPngTool />
    </div>
  );
}