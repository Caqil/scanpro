import { Metadata } from "next";
import { Suspense } from "react";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';
import { generatePageSeoMetadata } from "@/lib/seo/schemas";
import { SEO } from "@/components/SEO";
import FeaturesContent from "./features-content";
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";

  // Use the new SEO metadata generator
  return generatePageSeoMetadata(lang as any, { 
    translationPrefix: 'features', 
    canonicalPath: 'features' 
  }); 
  
}
export default function FeaturesPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    }>
      <FeaturesContent />
    </Suspense>
  );
}