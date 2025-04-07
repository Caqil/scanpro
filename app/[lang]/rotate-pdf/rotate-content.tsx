"use client";

import { 
  RotateCw, 
  FileText, 
  RefreshCcw, 
  Info, 
  Check, 
  AlertTriangle,
  RotateCcw,
  FileIcon,
  Smartphone,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageLink } from "@/components/language-link";
import { useLanguageStore } from "@/src/store/store";

export function RotateHeaderSection() {
  const { t } = useLanguageStore();
  
  return (
    <div className="mx-auto flex flex-col items-center text-center mb-8">
      <div className="mb-4 p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
        <RotateCw className="h-8 w-8 text-indigo-500" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        {t('rotatePdf.title') || "Rotate PDF Pages"}
      </h1>
      <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
        {t('rotatePdf.description') || "Easily rotate PDF pages to correct orientation. Rotate individual pages or the entire document."}
      </p>
    </div>
  );
}

export function HowToRotateSection() {
  const { t } = useLanguageStore();
  
  const steps = [
    {
      title: t('rotatePdf.howTo.step1.title') || "Upload Your PDF",
      description: t('rotatePdf.howTo.step1.description') || "Select the PDF file with pages that need rotation"
    },
    {
      title: t('rotatePdf.howTo.step2.title') || "Choose Rotation",
      description: t('rotatePdf.howTo.step2.description') || "Select pages and apply the desired rotation angle"
    },
    {
      title: t('rotatePdf.howTo.step3.title') || "Download PDF",
      description: t('rotatePdf.howTo.step3.description') || "Download your PDF with correctly oriented pages"
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('rotatePdf.howTo.title') || "How to Rotate PDF Pages"}</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">{index + 1}</span>
            </div>
            <h3 className="text-lg font-medium mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WhyRotateSection() {
  const { t } = useLanguageStore();
  
  const reasons = [
    {
      icon: <RotateCw className="h-5 w-5 text-indigo-500" />,
      title: t('rotatePdf.why.incorrectScans.title') || "Fix Incorrectly Scanned Documents",
      description: t('rotatePdf.why.incorrectScans.description') || "Correct the orientation of pages that were scanned upside down or sideways"
    },
    {
      icon: <Smartphone className="h-5 w-5 text-indigo-500" />,
      title: t('rotatePdf.why.mobileView.title') || "Optimize for Mobile Viewing",
      description: t('rotatePdf.why.mobileView.description') || "Adjust page orientation for better viewing on mobile devices"
    },
    {
      icon: <ArrowUpDown className="h-5 w-5 text-indigo-500" />,
      title: t('rotatePdf.why.mixedOrientation.title') || "Fix Mixed Orientation Documents",
      description: t('rotatePdf.why.mixedOrientation.description') || "Standardize orientation in documents with both portrait and landscape pages"
    },
    {
      icon: <FileText className="h-5 w-5 text-indigo-500" />,
      title: t('rotatePdf.why.presentation.title') || "Enhance Presentation",
      description: t('rotatePdf.why.presentation.description') || "Ensure all pages are properly oriented for professional presentations and printing"
    }
  ];

  return (
    <div className="mb-12 p-6 bg-muted/30 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('rotatePdf.why.title') || "Why Rotate PDF Pages"}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {reasons.map((reason, index) => (
          <div key={index} className="flex gap-4">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
              {reason.icon}
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">{reason.title}</h3>
              <p className="text-sm text-muted-foreground">
                {reason.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RotateFaqSection() {
  const { t } = useLanguageStore();
  
  const faqs = [
    {
      question: t('rotatePdf.faq.quality.question') || "Will rotating pages affect the PDF quality?",
      answer: t('rotatePdf.faq.quality.answer') || "No, rotating pages won't reduce the quality of your PDF. Our rotation tool preserves the original quality and only changes the orientation of the pages."
    },
    {
      question: t('rotatePdf.faq.selection.question') || "Can I rotate only specific pages in my PDF?",
      answer: t('rotatePdf.faq.selection.answer') || "Yes, you can select and rotate individual pages or page ranges. You can also apply different rotation angles to different pages within the same document."
    },
    {
      question: t('rotatePdf.faq.large.question') || "Can I rotate large PDF files?",
      answer: t('rotatePdf.faq.large.answer') || "Yes, our tool can handle PDF files up to 100MB. For larger files, you may want to consider splitting the PDF first, rotating the pages, and then merging them back together."
    },
    {
      question: t('rotatePdf.faq.forms.question') || "Will rotation affect fillable forms or annotations?",
      answer: t('rotatePdf.faq.forms.answer') || "No, our rotation tool preserves all interactive elements such as form fields, annotations, and hyperlinks. Everything will be rotated appropriately with the page content."
    },
    {
      question: t('rotatePdf.faq.security.question') || "Can I rotate password-protected PDFs?",
      answer: t('rotatePdf.faq.security.answer') || "Yes, if you have the password. For PDFs with owner passwords that restrict editing, you'll need to remove these restrictions first using our Unlock PDF tool."
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('rotatePdf.faq.title') || "Frequently Asked Questions"}</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <Info className="h-4 w-4 mr-2 text-primary" />
              {faq.question}
            </h3>
            <p className="text-sm text-muted-foreground">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BestPracticesSection() {
  const { t } = useLanguageStore();
  
  const dosList = t('rotatePdf.bestPractices.dosList') || [
    "Preview pages after rotation to ensure correct orientation",
    "Save backups of important documents before rotating",
    "Use bulk rotation for multiple pages with the same orientation",
    "Consider standardizing all pages to a single orientation",
    "Check text readability after rotation, especially for scanned documents"
  ];
  
  const dontsList = t('rotatePdf.bestPractices.dontsList') || [
    "Don't rotate password-protected PDFs without proper authorization",
    "Don't use rotation to fix skewed or tilted text (use deskew instead)",
    "Don't save multiple times in succession as it can accumulate quality loss",
    "Don't forget to verify all pages after bulk rotation",
    "Don't rotate unnecessarily as it adds to the file's edit history"
  ];

  return (
    <div className="mb-12 bg-muted/30 p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('rotatePdf.bestPractices.title') || "Best Practices for PDF Rotation"}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-3 text-primary">{t('rotatePdf.bestPractices.dos') || "Do's"}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {Array.isArray(dosList) && dosList.map((item, index) => (
              <li key={index} className="flex items-start">
                <Check className="text-green-500 mr-2 mt-0.5 h-4 w-4" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-3 text-destructive">{t('rotatePdf.bestPractices.donts') || "Don'ts"}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {Array.isArray(dontsList) && dontsList.map((item, index) => (
              <li key={index} className="flex items-start">
                <AlertTriangle className="text-red-500 mr-2 mt-0.5 h-4 w-4" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function RelatedToolsSection() {
  const { t } = useLanguageStore();
  
  const tools = [
    { 
      href: "/merge-pdf", 
      icon: <FileIcon className="h-5 w-5 text-red-500" />,
      name: t('rotatePdf.relatedTools.merge') || "Merge PDF",
      bg: "bg-red-100 dark:bg-red-900/30"
    },
    { 
      href: "/split-pdf", 
      icon: <FileIcon className="h-5 w-5 text-green-500" />,
      name: t('rotatePdf.relatedTools.split') || "Split PDF",
      bg: "bg-green-100 dark:bg-green-900/30"
    },
    { 
      href: "/compress-pdf", 
      icon: <FileIcon className="h-5 w-5 text-blue-500" />,
      name: t('rotatePdf.relatedTools.compress') || "Compress PDF",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    { 
      href: "/edit-pdf", 
      icon: <FileIcon className="h-5 w-5 text-purple-500" />,
      name: t('rotatePdf.relatedTools.edit') || "Edit PDF",
      bg: "bg-purple-100 dark:bg-purple-900/30"
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">{t('rotatePdf.relatedTools.title') || "Related Tools"}</h2>
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
        <LanguageLink href="/pdf-tools">
          <Button variant="outline">{t('rotatePdf.relatedTools.viewAll') || "View All Tools"}</Button>
        </LanguageLink>
      </div>
    </div>
  );
}