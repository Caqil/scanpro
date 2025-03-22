
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon, FileIcon, InfoIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { PdfMerger } from "@/components/pdf-merger"; // Import the fixed PDF merger component
import { useLanguageStore } from "@/src/store/store";
import { LanguageLink } from "@/components/language-link";

export const metadata: Metadata = {
  title: "Merge PDF Files | ScanPro - PDF Tools",
  description: "Combine multiple PDF files into a single document with our easy-to-use PDF merger tool.",
};

export default function MergePDFPage() {
  const { t } = useLanguageStore();

  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <div className="mb-4 p-3 rounded-full bg-red-100 dark:bg-red-900/30">
          <ArrowRightIcon className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t('mergePdf.title') || "Merge PDF Files"}
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
          {t('mergePdf.description') || "Combine multiple PDF files into a single document quickly and easily"}
        </p>
      </div>

      {/* Main Tool Card */}
      <div className="mb-8">
        <PdfMerger />
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('mergePdf.howTo.title') || "How to Merge PDF Files"}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">{t('mergePdf.howTo.step1.title') || "Upload Files"}</h3>
            <p className="text-sm text-muted-foreground">
              {t('mergePdf.howTo.step1.description') || "Upload the PDF files you want to combine. You can select multiple files at once."}
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">{t('mergePdf.howTo.step2.title') || "Arrange Order"}</h3>
            <p className="text-sm text-muted-foreground">
              {t('mergePdf.howTo.step2.description') || "Drag and drop to rearrange the files in the order you want them to appear in the final PDF."}
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">{t('mergePdf.howTo.step3.title') || "Download"}</h3>
            <p className="text-sm text-muted-foreground">
              {t('mergePdf.howTo.step3.description') || "Click the Merge PDFs button and download your combined PDF file."}
            </p>
          </div>
          
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('mergePdf.faq.title') || "Frequently Asked Questions"}</h2>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              {t('mergePdf.faq.q1.question') || "Is there a limit to how many PDFs I can merge?"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('mergePdf.faq.q1.answer') || "You can merge up to 20 PDF files at once with our free tool. For larger batches, consider our premium plan."}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              {t('mergePdf.faq.q2.question') || "Will my PDF files remain private?"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('mergePdf.faq.q2.answer') || "Yes, your privacy is our priority. All uploaded files are automatically deleted from our servers after processing."}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              {t('mergePdf.faq.q3.question') || "Can I merge password-protected PDFs?"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('mergePdf.faq.q3.answer') || "For password-protected PDFs, you will need to unlock them first using our Unlock PDF tool, and then merge them."}
            </p>
          </div>
        </div>
      </div>

      {/* More Tools Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">{t('mergePdf.relatedTools') || "Explore More PDF Tools"}</h2>
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
           <LanguageLink href="/tools"><Button variant="outline" size="lg">
                          {t('popular.viewAll')}
                        </Button></LanguageLink>
        </div>
      </div>
    </div>
  );
}