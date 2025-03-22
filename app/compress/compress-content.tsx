"use client";

import { Button } from "@/components/ui/button";
import { ArrowDownIcon, FileIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import { MultiPdfCompressor } from "@/components/pdf-compressor"; // Import the updated PDF compressor component
import { useLanguageStore } from "@/src/store/store";

export default function CompressPageContent() {
  const { t } = useLanguageStore();

  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <div className="mb-4 p-3 rounded-full bg-green-100 dark:bg-green-900/30">
          <ArrowDownIcon className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t('compressPdf.title')}
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
          {t('compressPdf.description')}
        </p>
      </div>

      {/* Main Tool Card */}
      <div className="mb-8">
        <MultiPdfCompressor />
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('compressPdf.howTo.title')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">{t('compressPdf.howTo.step1.title')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('compressPdf.howTo.step1.description')}
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">{t('compressPdf.howTo.step2.title')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('compressPdf.howTo.step2.description')}
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">{t('compressPdf.howTo.step3.title')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('compressPdf.howTo.step3.description')}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('compressPdf.faq.title')}</h2>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              {t('compressPdf.faq.q1.question')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('compressPdf.faq.q1.answer')}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              {t('compressPdf.faq.q2.question')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('compressPdf.faq.q2.answer')}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              {t('compressPdf.faq.q3.question')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('compressPdf.faq.q3.answer')}
            </p>
          </div>
        </div>
      </div>

      {/* Related Tools Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">{t('compressPdf.relatedTools')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/merge" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
                <FileIcon className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-sm font-medium">{t('popular.mergePdf')}</span>
            </div>
          </Link>
          <Link href="/convert/pdf-to-docx" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
                <FileIcon className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-sm font-medium">{t('popular.pdfToWord')}</span>
            </div>
          </Link>
          <Link href="/ocr" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-2">
                <FileIcon className="h-5 w-5 text-purple-500" />
              </div>
              <span className="text-sm font-medium">{t('popular.ocr')}</span>
            </div>
          </Link>
          <Link href="/watermark" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-2">
                <FileIcon className="h-5 w-5 text-amber-500" />
              </div>
              <span className="text-sm font-medium">{t('watermark.title')}</span>
            </div>
          </Link>
        </div>
        <div className="text-center mt-6">
          <Link href="/tools">
            <Button variant="outline">{t('popular.viewAll')}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}