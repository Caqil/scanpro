// app/[lang]/not-found/page.tsx
import { Metadata } from "next";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';
import { generatePageSeoMetadata } from "@/lib/seo/schemas";
import NotFoundPage from "../not-found";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";

  return generatePageSeoMetadata(lang as any, { 
    translationPrefix: 'notFound', 
    canonicalPath: 'not-found' 
  }); 
}

export default NotFoundPage;