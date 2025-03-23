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
  const t = (key: string) => getTranslation(lang, key);

  return {
    title: "Compress PDF, Images & Office Documents | Universal File Compressor",
    description: "Compress PDF, images (JPG, PNG), Word documents, PowerPoint presentations, and Excel spreadsheets with our universal file compressor. Maintain quality while reducing file size.",
    openGraph: {
      title: "Universal File Compressor - Compress Any Document",
      description: "Compress PDF, images, and Office documents while maintaining quality with our fast, secure, and free online compressor.",
      url: `/${lang}/compress-files`,
      siteName: "ScanPro",
      locale: lang === "id" ? "id_ID" : lang === "es" ? "es_ES" : "en_US",
    },
    alternates: {
      canonical: `/${lang}/compress-files`,
      languages: {
        "en-US": "/en/compress-files",
        "id-ID": "/id/compress-files",
        "es-ES": "/es/compress-files",
      },
    },
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