"use client"
import { FileText, FileIcon, InfoIcon, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageLink } from "@/components/language-link";
import { useLanguageStore } from "@/src/store/store";



export function OcrHeaderSection() {
    const { t } = useLanguageStore()
  return (
    <div className="mx-auto flex flex-col items-center text-center mb-8">
      <div className="mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
        <Languages className="h-8 w-8 text-blue-500" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        {t('ocr.title')}
      </h1>
      <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
        {t('ocr.description')}
      </p>
    </div>
  );
}

export function HowToOcrSection() {
    const { t } = useLanguageStore()
  const steps = [
    {
      title: t('ocr.howTo.step1.title'),
      description: t('ocr.howTo.step1.description')
    },
    {
      title: t('ocr.howTo.step2.title'),
      description: t('ocr.howTo.step2.description')
    },
    {
      title: t('ocr.howTo.step3.title'),
      description: t('ocr.howTo.step3.description')
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('ocr.howTo.title')}</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">{index + 1}</span>
            </div>
            <h3 className="text-lg font-medium mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WhatIsOcrSection() {
    const { t } = useLanguageStore()
  const extractionList = [
    t('ocr.whatIsOcr.extractionList.scannedPdfs'),
    t('ocr.whatIsOcr.extractionList.imageOnlyPdfs'),
    t('ocr.whatIsOcr.extractionList.embeddedImages'),
    t('ocr.whatIsOcr.extractionList.textCopyingIssues')
  ];

  return (
    <div className="mb-12 p-6 bg-muted/30 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('ocr.whatIsOcr.title')}</h2>
      <div className="space-y-4">
        <p>
          <strong>{t('ocr.whatIsOcr.title')}</strong> {t('ocr.whatIsOcr.description')}
        </p>
        <p>{t('ocr.whatIsOcr.explanation')}</p>
        <ul className="list-disc pl-6 space-y-1">
          {extractionList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function WhenToUseOcrSection() {
    const { t } = useLanguageStore()
  const idealForList = [
    t('ocr.whenToUse.idealForList.scannedDocuments'),
    t('ocr.whenToUse.idealForList.oldDocuments'),
    t('ocr.whenToUse.idealForList.textSelectionIssues'),
    t('ocr.whenToUse.idealForList.textInImages'),
    t('ocr.whenToUse.idealForList.searchableArchives')
  ];

  const notNecessaryForList = [
    t('ocr.whenToUse.notNecessaryForList.digitalPdfs'),
    t('ocr.whenToUse.notNecessaryForList.createdDigitally'),
    t('ocr.whenToUse.notNecessaryForList.copyPasteAvailable'),
    t('ocr.whenToUse.notNecessaryForList.formatPreservation')
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('ocr.whenToUse.title')}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-medium mb-3 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-500" />
            {t('ocr.whenToUse.idealFor')}
          </h3>
          <ul className="space-y-2">
            {idealForList.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-medium mb-3 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-red-500" />
            {t('ocr.whenToUse.notNecessaryFor')}
          </h3>
          <ul className="space-y-2">
            {notNecessaryForList.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function OcrLimitationsSection() {

     const { t } = useLanguageStore()
  const factorsList = [
    t('ocr.limitations.factorsList.documentQuality'),
    t('ocr.limitations.factorsList.complexLayouts'),
    t('ocr.limitations.factorsList.handwrittenText'),
    t('ocr.limitations.factorsList.specialCharacters'),
    t('ocr.limitations.factorsList.multipleLanguages')
  ];

  const tipsList = [
    t('ocr.limitations.tipsList.highQualityScans'),
    t('ocr.limitations.tipsList.correctLanguage'),
    t('ocr.limitations.tipsList.enhanceScannedImages'),
    t('ocr.limitations.tipsList.smallerPageRanges'),
    t('ocr.limitations.tipsList.reviewText')
  ];

  return (
    <div className="mb-12 border rounded-lg p-6">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <InfoIcon className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">{t('ocr.limitations.title')}</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {t('ocr.limitations.description')}
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-2">{t('ocr.limitations.factorsAffecting')}</p>
              <ul className="space-y-1 list-disc pl-5">
                {factorsList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">{t('ocr.limitations.tipsForBest')}</p>
              <ul className="space-y-1 list-disc pl-5">
                {tipsList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RelatedToolsSection() {
const { t } = useLanguageStore()
  const tools = [
    { 
      href: "/convert?output=docx", 
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      name: "PDF to Word",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    { 
      href: "/convert?input=jpg", 
      icon: <FileIcon className="h-5 w-5 text-green-500" />,
      name: "JPG to PDF",
      bg: "bg-green-100 dark:bg-green-900/30"
    },
    { 
      href: "/ocr", 
      icon: <FileIcon className="h-5 w-5 text-purple-500" />,
      name: "Extract PDF",
      bg: "bg-purple-100 dark:bg-purple-900/30"
    },
    { 
      href: "/compress", 
      icon: <FileIcon className="h-5 w-5 text-red-500" />,
      name: "Compress PDF",
      bg: "bg-red-100 dark:bg-red-900/30"
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">{t('ocr.relatedTools')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <LanguageLink 
            key={tool.href} 
            href={tool.href} 
            className="border rounded-lg p-4 text-center hover:border-primary transition-colors"
          >
            <div className="flex flex-col items-center">
              <div className={`p-2 rounded-full ${tool.bg} mb-2`}>
                {tool.icon}
              </div>
              <span className="text-sm font-medium">{tool.name}</span>
            </div>
          </LanguageLink>
        ))}
      </div>
      <div className="text-center mt-6">
        <LanguageLink href="/tools">
          <Button variant="outline">{t('popular.viewAll')}</Button>
        </LanguageLink>
      </div>
    </div>
  );
}