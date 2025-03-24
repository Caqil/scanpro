// app/[lang]/image-tools/compress/page.tsx
import { Metadata } from "next";
import { CompressPngTool } from "./compress-tool";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";
  
  return {
    title: "Compress PNG Images | Image Tools",
    description: "Reduce PNG file sizes while maintaining quality for faster website loading and efficient storage",
    openGraph: {
      title: "Compress PNG Images | Image Tools",
      description: "Reduce PNG file sizes while maintaining quality for faster website loading and efficient storage",
      url: `/${lang}/image-tools/compress`,
      siteName: "ScanPro",
    },
    alternates: {
      canonical: `/${lang}/image-tools/compress`,
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
          
          return [langCode, `/${code}/image-tools/compress`];
        })
      ),
    }
  };
}

export default function CompressPngPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <CompressPngTool />
    </div>
  );
}