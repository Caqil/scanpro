// app/[lang]/merge/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, FileIcon, InfoIcon } from "lucide-react";
import ClientMergePDFContent from "./client-merge-content";
import { Button } from "@/components/ui/button";
import { LanguageLink } from "@/components/language-link";
import enTranslations from "@/src/lib/i18n/locales/en";
import idTranslations from "@/src/lib/i18n/locales/id";
import { useLanguageStore } from "@/src/store/store";
// Define supported languages
const SUPPORTED_LANGUAGES = ["en", "id", "es"];
type Language = typeof SUPPORTED_LANGUAGES[number];

// Helper function to get translation based on language
function getTranslation(lang: string, key: string): string {
  let translations = enTranslations;
  
  if (lang === "id") {
    translations = idTranslations;
  }
  
  const keys = key.split('.');
  const result = keys.reduce((obj, k) => 
    (obj && obj[k] !== undefined) ? obj[k] : undefined, 
    translations as any
  );
  
  return result !== undefined ? result : key;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as Language) ? paramLang as Language : "en";
  const t = (key: string) => getTranslation(lang, key);

  return {
    title: t("metadata.title"), 
    description: t("metadata.description"),
    openGraph: {
      title: t("mergePdf.title"),
      description: t("mergePdf.description"),
      url: `/${lang}/merge`,
      siteName: "ScanPro",
      locale: lang === "id" ? "id_ID" : lang === "es" ? "es_ES" : "en_US",
    },
    alternates: {
      canonical: `/${lang}/merge`,
      languages: {
        "en-US": "/en/merge",
        "id-ID": "/id/merge",
        "es-ES": "/es/merge",
      },
    },
  };
}
export default async function MergePDFPage() {
   const { t } = useLanguageStore()
  
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <div className="mb-4 p-3 rounded-full bg-red-100 dark:bg-red-900/30">
          <ArrowRightIcon className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t("mergePdf.title")}
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
          {t("mergePdf.description")}
        </p>
      </div>

      {/* Main Tool Card */}
      <div className="mb-8">
        <ClientMergePDFContent />
      </div>

      {/* How It Works section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">{t("mergePdf.howTo.title")}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">{t("mergePdf.howTo.step1.title")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("mergePdf.howTo.step1.description")}
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">{t("mergePdf.howTo.step2.title")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("mergePdf.howTo.step2.description")}
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">{t("mergePdf.howTo.step3.title")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("mergePdf.howTo.step3.description")}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">{t("mergePdf.faq.title")}</h2>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              {t("mergePdf.faq.q1.question")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("mergePdf.faq.q1.answer")}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              {t("mergePdf.faq.q2.question")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("mergePdf.faq.q2.answer")}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              {t("mergePdf.faq.q3.question")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("mergePdf.faq.q3.answer")}
            </p>
          </div>
        </div>
      </div>

      {/* More Tools Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">{t("mergePdf.relatedTools")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <LanguageLink href="/split" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
                <ArrowRightIcon className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-sm font-medium">Split PDF</span>
            </div>
          </LanguageLink>
          <LanguageLink href="/compress" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
                <ArrowRightIcon className="h-5 w-5 text-green-500" />
              </div>
              <span className="text-sm font-medium">Compress PDF</span>
            </div>
          </LanguageLink>
          <LanguageLink href="/convert/pdf-to-docx" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
                <FileIcon className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-sm font-medium">PDF to Word</span>
            </div>
          </LanguageLink>
          <LanguageLink href="/ocr" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-2">
                <FileIcon className="h-5 w-5 text-purple-500" />
              </div>
              <span className="text-sm font-medium">Extract PDF</span>
            </div>
          </LanguageLink>
        </div>
        <div className="text-center mt-6">
          <LanguageLink href="/tools">
            <Button variant="outline">{t("mergePdf.viewAllTools")}</Button>
          </LanguageLink>
        </div>
      </div>
    </div>
  );
}