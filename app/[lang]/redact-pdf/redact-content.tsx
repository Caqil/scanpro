"use client";

import { 
  EyeOff, 
  FileX, 
  Shield, 
  FileText, 
  Info, 
  Check, 
  AlertTriangle,
  Key,
  Lock,
  UserX,
  FileSearch,
  Eraser
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageLink } from "@/components/language-link";
import { useLanguageStore } from "@/src/store/store";

export function RedactHeaderSection() {
  const { t } = useLanguageStore();
  
  return (
    <div className="mx-auto flex flex-col items-center text-center mb-8">
      <div className="mb-4 p-3 rounded-full bg-red-100 dark:bg-red-900/30">
        <EyeOff className="h-8 w-8 text-red-500" />
      </div>
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
        {t('redactPdf.title') || "Redact PDF Files"}
      </h1>
      <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
        {t('redactPdf.description') || "Permanently remove sensitive information from PDF documents while maintaining document integrity"}
      </p>
    </div>
  );
}

export function HowToRedactSection() {
  const { t } = useLanguageStore();
  
  const steps = [
    {
      title: t('redactPdf.howTo.step1.title') || "Upload Your PDF",
      description: t('redactPdf.howTo.step1.description') || "Select the PDF document containing sensitive information you want to redact"
    },
    {
      title: t('redactPdf.howTo.step2.title') || "Select Redaction Areas",
      description: t('redactPdf.howTo.step2.description') || "Mark the text, images, or areas you want to permanently remove or hide"
    },
    {
      title: t('redactPdf.howTo.step3.title') || "Download Redacted PDF",
      description: t('redactPdf.howTo.step3.description') || "Process your document and download the redacted PDF with sensitive content permanently removed"
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('redactPdf.howTo.title') || "How to Redact a PDF Document"}</h2>
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

export function WhyRedactSection() {
  const { t } = useLanguageStore();
  
  const reasons = [
    {
      icon: <UserX className="h-5 w-5 text-red-500" />,
      title: t('redactPdf.why.personalInfo.title') || "Protect Personal Information",
      description: t('redactPdf.why.personalInfo.description') || "Permanently remove names, addresses, phone numbers, and other personally identifiable information (PII)"
    },
    {
      icon: <Lock className="h-5 w-5 text-red-500" />,
      title: t('redactPdf.why.compliance.title') || "Regulatory Compliance",
      description: t('redactPdf.why.compliance.description') || "Meet GDPR, HIPAA, and other compliance requirements for document sharing and records management"
    },
    {
      icon: <Key className="h-5 w-5 text-red-500" />,
      title: t('redactPdf.why.security.title') || "Enhanced Security",
      description: t('redactPdf.why.security.description') || "Remove sensitive metadata, hidden content, and security vulnerabilities before distributing documents"
    },
    {
      icon: <FileSearch className="h-5 w-5 text-red-500" />,
      title: t('redactPdf.why.confidentiality.title') || "Maintain Confidentiality",
      description: t('redactPdf.why.confidentiality.description') || "Share documents publicly while keeping proprietary or classified information confidential"
    }
  ];

  return (
    <div className="mb-12 p-6 bg-muted/30 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('redactPdf.why.title') || "Why Redact PDF Documents"}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {reasons.map((reason, index) => (
          <div key={index} className="flex gap-4">
            <div className="bg-red-100 dark:bg-red-900/30 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
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

export function RedactFaqSection() {
  const { t } = useLanguageStore();
  
  const faqs = [
    {
      question: t('redactPdf.faq.permanent.question') || "Is PDF redaction permanent?",
      answer: t('redactPdf.faq.permanent.answer') || "Yes, our PDF redaction tool permanently removes the selected information. Unlike simply adding a black box over text which can be removed, proper redaction completely eliminates the underlying content and metadata, making recovery impossible."
    },
    {
      question: t('redactPdf.faq.searchable.question') || "Will my document remain searchable after redaction?",
      answer: t('redactPdf.faq.searchable.answer') || "Yes, our tool preserves the searchable text in the non-redacted portions of your document. The redacted areas will be permanently removed from the document's text layer, while the remaining content maintains its searchability and structure."
    },
    {
      question: t('redactPdf.faq.secure.question') || "How secure is the redaction process?",
      answer: t('redactPdf.faq.secure.answer') || "Our redaction process follows industry-standard secure redaction practices. We completely remove the selected content including underlying text, vector data, and associated metadata. Additionally, we process your documents securely on our servers and automatically delete them after processing."
    },
    {
      question: t('redactPdf.faq.metadata.question') || "Does redaction also remove document metadata?",
      answer: t('redactPdf.faq.metadata.answer') || "By default, our redaction tool removes sensitive metadata like author names, creation dates, and software information. For Pro users, we offer advanced metadata cleansing options that allow you to selectively keep or remove specific metadata fields."
    },
    {
      question: t('redactPdf.faq.patterns.question') || "Can I automatically redact specific patterns like credit card numbers?",
      answer: t('redactPdf.faq.patterns.answer') || "Yes, our Pro version offers pattern-based redaction that can automatically identify and redact sensitive information like credit card numbers, social security numbers, email addresses, and phone numbers throughout your document."
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('redactPdf.faq.title') || "Frequently Asked Questions"}</h2>
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
  
  const dosList = t('redactPdf.bestPractices.dosList') || [
    "Review the document thoroughly before and after redaction",
    "Use the preview feature to verify all sensitive content is properly marked",
    "Redact both text and any related images or graphics",
    "Save original documents in a secure location before redaction",
    "Use pattern recognition for consistent redaction of formatted data"
  ];
  
  const dontsList = t('redactPdf.bestPractices.dontsList') || [
    "Don't confuse highlighting or drawing boxes with proper redaction",
    "Don't rely on visual inspection alone - use text search to find sensitive terms",
    "Don't forget to check headers, footers, and watermarks",
    "Don't neglect to remove document metadata and hidden layers",
    "Don't distribute the document before verifying the redaction was successful"
  ];

  return (
    <div className="mb-12 bg-muted/30 p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('redactPdf.bestPractices.title') || "Best Practices for PDF Redaction"}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-3 text-primary">{t('redactPdf.bestPractices.dos') || "Do's"}</h3>
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
          <h3 className="text-lg font-medium mb-3 text-destructive">{t('redactPdf.bestPractices.donts') || "Don'ts"}</h3>
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
      href: "/protect-pdf", 
      icon: <Shield className="h-5 w-5 text-blue-500" />,
      name: t('redactPdf.relatedTools.protect') || "Protect PDF",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    { 
      href: "/watermark-pdf", 
      icon: <Eraser className="h-5 w-5 text-green-500" />,
      name: t('redactPdf.relatedTools.watermark') || "Watermark PDF",
      bg: "bg-green-100 dark:bg-green-900/30"
    },
    { 
      href: "/pdf-to-word", 
      icon: <FileText className="h-5 w-5 text-purple-500" />,
      name: t('redactPdf.relatedTools.convert') || "PDF to Word",
      bg: "bg-purple-100 dark:bg-purple-900/30"
    },
    { 
      href: "/ocr-pdf", 
      icon: <FileSearch className="h-5 w-5 text-orange-500" />,
      name: t('redactPdf.relatedTools.ocr') || "OCR PDF",
      bg: "bg-orange-100 dark:bg-orange-900/30"
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">{t('redactPdf.relatedTools.title') || "Related Tools"}</h2>
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
          <Button variant="outline">{t('redactPdf.relatedTools.viewAll') || "View All Tools"}</Button>
        </LanguageLink>
      </div>
    </div>
  );
}