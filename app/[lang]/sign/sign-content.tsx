// app/[lang]/sign/sign-content.tsx
'use client'

import { PdfSignatureTool } from "@/components/pdf-signature-tool";
import { PenTool, FileIcon, InfoIcon, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageLink } from "@/components/language-link";
import { useLanguageStore } from "@/src/store/store";

export function SignPdfHeaderSection() {
  const { t } = useLanguageStore();
  
  return (
    <div className="mx-auto flex flex-col items-center text-center mb-8">
      <div className="mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
        <PenTool className="h-8 w-8 text-blue-500" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        {t('signPdf.title') || "Sign PDF Documents"}
      </h1>
      <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
        {t('signPdf.description') || "Add your signature to PDF documents quickly, easily, and securely"}
      </p>
    </div>
  );
}

export function HowToSignSection() {
  const { t } = useLanguageStore();
  
  const steps = [
    {
      title: t('signPdf.howTo.step1.title') || "Upload PDF",
      description: t('signPdf.howTo.step1.description') || "Upload the PDF document you want to sign"
    },
    {
      title: t('signPdf.howTo.step2.title') || "Create Signature",
      description: t('signPdf.howTo.step2.description') || "Draw your signature or type it with various font options"
    },
    {
      title: t('signPdf.howTo.step3.title') || "Position & Sign",
      description: t('signPdf.howTo.step3.description') || "Drag to position your signature exactly where needed and apply it"
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('signPdf.howTo.title') || "How to Sign PDF Documents"}</h2>
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

export function SignatureBenefitsSection() {
  const { t } = useLanguageStore();
  
  const benefits = [
    {
      icon: <FileIcon className="h-5 w-5 text-green-500" />,
      title: t('signPdf.benefits.legalValidity.title') || "Legal Validity",
      description: t('signPdf.benefits.legalValidity.description') || "Your signatures are legally valid for most documents and forms"
    },
    {
      icon: <LockIcon className="h-5 w-5 text-blue-500" />,
      title: t('signPdf.benefits.secureProcessing.title') || "Secure Processing",
      description: t('signPdf.benefits.secureProcessing.description') || "All your documents and signatures are processed securely and deleted afterward"
    },
    {
      icon: <FileIcon className="h-5 w-5 text-purple-500" />,
      title: t('signPdf.benefits.multipleDocumentTypes.title') || "Multiple Document Types",
      description: t('signPdf.benefits.multipleDocumentTypes.description') || "Sign contracts, agreements, forms, and other PDF documents"
    }
  ];

  return (
    <div className="mb-12 bg-muted/30 p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('signPdf.benefits.title') || "Why Sign PDFs Online?"}</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex gap-4">
            <div className="bg-background rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
              {benefit.icon}
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SignFaqSection() {
  const { t } = useLanguageStore();
  
  const faqItems = [
    {
      question: t('signPdf.faq.legalBinding.question') || "Is my signature legally binding?",
      answer: t('signPdf.faq.legalBinding.answer') || "In most jurisdictions, electronic signatures are legally valid and binding, similar to handwritten signatures. Our tool creates standard electronic signatures that comply with regulations like eIDAS in the EU and ESIGN Act in the US."
    },
    {
      question: t('signPdf.faq.security.question') || "Are my documents and signatures secure?",
      answer: t('signPdf.faq.security.answer') || "Yes, all uploaded documents are processed securely. Your PDFs and signature data are automatically deleted from our servers after processing and are never shared with third parties."
    },
    {
      question: t('signPdf.faq.multiplePages.question') || "Can I sign multiple pages in one document?",
      answer: t('signPdf.faq.multiplePages.answer') || "Currently, you can add one signature per session. To add multiple signatures, you'll need to download the signed PDF and upload it again to add another signature."
    },
    {
      question: t('signPdf.faq.signatureTypes.question') || "What types of signatures can I create?",
      answer: t('signPdf.faq.signatureTypes.answer') || "You can create two types of signatures: drawn signatures using your mouse or touchscreen, and typed signatures where you type your name and select from various font styles."
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('signPdf.faq.title') || "Frequently Asked Questions"}</h2>
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
      href: "/protect", 
      icon: <LockIcon className="h-5 w-5 text-blue-500" />,
      name: "Protect PDF",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    { 
      href: "/unlock", 
      icon: <LockIcon className="h-5 w-5 text-green-500" />,
      name: "Unlock PDF",
      bg: "bg-green-100 dark:bg-green-900/30"
    },
    { 
      href: "/watermark", 
      icon: <FileIcon className="h-5 w-5 text-purple-500" />,
      name: "Add Watermark",
      bg: "bg-purple-100 dark:bg-purple-900/30"
    },
    { 
      href: "/edit", 
      icon: <PenTool className="h-5 w-5 text-orange-500" />,
      name: "Edit PDF",
      bg: "bg-orange-100 dark:bg-orange-900/30"
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">{t('signPdf.relatedTools') || "Related Tools"}</h2>
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
          <Button variant="outline">{t('popular.viewAll') || "View All Tools"}</Button>
        </LanguageLink>
      </div>
    </div>
  );
}
