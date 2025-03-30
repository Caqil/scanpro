"use client";

import { Pencil, FileText, InfoIcon, FileIcon, ImageIcon, Type, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageLink } from "@/components/language-link";
import { useLanguageStore } from "@/src/store/store";

export function EditHeaderSection() {
  const { t } = useLanguageStore();
  
  return (
    <div className="mx-auto flex flex-col items-center text-center mb-8">
      <div className="mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
        <Pencil className="h-8 w-8 text-blue-500" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        {t('editPdf.title') || "Edit PDF Online"}
      </h1>
      <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
        {t('editPdf.description') || "Add text, shapes, images and drawings to your PDF files with our easy-to-use online editor."}
      </p>
    </div>
  );
}

export function HowToEditSection() {
  const { t } = useLanguageStore();
  
  const steps = [
    {
      title: t('editPdf.howTo.step1.title') || "Upload PDF",
      description: t('editPdf.howTo.step1.description') || "Select the PDF file you want to edit. Files are processed securely."
    },
    {
      title: t('editPdf.howTo.step2.title') || "Edit Content",
      description: t('editPdf.howTo.step2.description') || "Add text, draw shapes, insert images or annotate your PDF with our intuitive editor."
    },
    {
      title: t('editPdf.howTo.step3.title') || "Download",
      description: t('editPdf.howTo.step3.description') || "Save your edited document and download the new PDF file. It's that simple!"
    }
  ];
  
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('editPdf.howTo.title') || "How to Edit a PDF"}</h2>
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

export function EditFAQSection() {
  const { t } = useLanguageStore();
  
  const faqItems = [
    {
      question: t('editPdf.faq.q1.question') || "Can I edit text in a PDF document?",
      answer: t('editPdf.faq.q1.answer') || "Yes, you can add new text to your PDF document. However, editing existing text directly is limited as PDFs are not designed to be easily editable. Our tool allows you to add new text blocks anywhere on the document."
    },
    {
      question: t('editPdf.faq.q2.question') || "Is it safe to edit my PDFs online?",
      answer: t('editPdf.faq.q2.answer') || "Yes, we take your privacy and security seriously. All uploaded files are processed securely, and no content is stored permanently on our servers. Files are automatically deleted after processing."
    },
    {
      question: t('editPdf.faq.q3.question') || "What types of edits can I make to a PDF?",
      answer: t('editPdf.faq.q3.answer') || "You can add text, draw freehand annotations, insert shapes (rectangles, circles, lines), and more. You can change the font, color, and size of text, and customize the appearance of your drawings and shapes."
    },
    {
      question: t('editPdf.faq.q4.question') || "Will my original PDF be changed?",
      answer: t('editPdf.faq.q4.answer') || "No, your original PDF will remain unchanged. We create a new, edited version that you can download, keeping your original document intact."
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('editPdf.faq.title') || "Frequently Asked Questions"}</h2>
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
      href: "/merge-pdf", 
      icon: <FileText className="h-5 w-5 text-red-500" />,
      name: t('popular.mergePdf') || "Merge PDF",
      bg: "bg-red-100 dark:bg-red-900/30"
    },
    { 
      href: "/split-pdf", 
      icon: <FileText className="h-5 w-5 text-green-500" />,
      name: t('popular.splitPdf') || "Split PDF",
      bg: "bg-green-100 dark:bg-green-900/30"
    },
    { 
      href: "/protect-pdf", 
      icon: <FileIcon className="h-5 w-5 text-blue-500" />,
      name: t('popular.protectPdf') || "Protect PDF",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    { 
      href: "/convert/pdf-to-docx", 
      icon: <FileIcon className="h-5 w-5 text-purple-500" />,
      name: t('popular.pdfToWord') || "PDF to Word",
      bg: "bg-purple-100 dark:bg-purple-900/30"
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">{t('editPdf.relatedTools') || "Related Tools"}</h2>
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