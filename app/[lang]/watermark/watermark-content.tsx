"use client"
import { Edit2Icon, FileIcon, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageLink } from "@/components/language-link";
import { useLanguageStore } from "@/src/store/store";

export function WatermarkHeaderSection() {
  const { t } = useLanguageStore();
  
  return (
    <div className="mx-auto flex flex-col items-center text-center mb-8">
      <div className="mb-4 p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
        <Edit2Icon className="h-8 w-8 text-purple-500" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        {t('watermark.title')}
      </h1>
      <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
        {t('watermark.description')}
      </p>
    </div>
  );
}

export function HowToWatermarkSection() {
  const { t } = useLanguageStore();
  
  const steps = [
    {
      title: t('watermark.howTo.step1.title'),
      description: t('watermark.howTo.step1.description')
    },
    {
      title: t('watermark.howTo.step2.title'),
      description: t('watermark.howTo.step2.description')
    },
    {
      title: t('watermark.howTo.step3.title'),
      description: t('watermark.howTo.step3.description')
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('watermark.howTo.title')}</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">{index + 1}</span>
            </div>
            <h3 className="text-lg font-medium mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WatermarkFaqSection() {
  const { t } = useLanguageStore();
  
  const faqItems = [
    {
      question: t('watermark.faq.q1.question'),
      answer: t('watermark.faq.q1.answer')
    },
    {
      question: t('watermark.faq.q2.question'),
      answer: t('watermark.faq.q2.answer')
    },
    {
      question: t('watermark.faq.q3.question'),
      answer: t('watermark.faq.q3.answer')
    },
    {
      question: t('watermark.faq.q4.question'),
      answer: t('watermark.faq.q4.answer')
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('watermark.faq.title')}</h2>
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              {item.question}
            </h3>
            <p className="text-sm text-muted-foreground">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RelatedToolsSection() {
  const { t } = useLanguageStore();
  
  const tools = [
    { 
      href: "/merge", 
      icon: <FileIcon className="h-5 w-5 text-red-500" />,
      name: "Merge PDF",
      bg: "bg-red-100 dark:bg-red-900/30"
    },
    { 
      href: "/split", 
      icon: <FileIcon className="h-5 w-5 text-red-500" />,
      name: "Split PDF",
      bg: "bg-red-100 dark:bg-red-900/30"
    },
    { 
      href: "/convert/pdf-to-docx", 
      icon: <FileIcon className="h-5 w-5 text-blue-500" />,
      name: "PDF to Word",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    { 
      href: "/ocr", 
      icon: <FileIcon className="h-5 w-5 text-purple-500" />,
      name: "Extract PDF",
      bg: "bg-purple-100 dark:bg-purple-900/30"
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">{t('mergePdf.relatedTools')}</h2>
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