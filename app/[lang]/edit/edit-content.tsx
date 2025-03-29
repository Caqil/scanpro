"use client";

import { PenTool, Eye, Zap, Type, Lightbulb, Languages, FileText, Search, CheckCircle, Info, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/src/store/store";
import { LanguageLink } from "@/components/language-link";

export function EditPdfHeader() {
  const { t } = useLanguageStore();
  
  return (
    <div className="mx-auto flex flex-col items-center text-center mb-8">
      <div className="mb-4 p-3 rounded-full bg-primary/10">
        <PenTool className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Edit PDF Text
      </h1>
      <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
        Advanced text editing in PDFs with OCR detection for accurate text replacement and precise editing
      </p>
    </div>
  );
}

export function EditPdfFeatures() {
  const { t } = useLanguageStore();
  
  const features = [
    {
      icon: <Eye className="h-6 w-6 text-blue-500" />,
      title: "OCR Text Detection",
      description: "Accurately detects text in PDFs with OCR technology for precise editing and replacement"
    },
    {
      icon: <Type className="h-6 w-6 text-green-500" />,
      title: "Replace & Edit Text",
      description: "Easily replace existing text or add new text with full formatting control"
    },
    {
      icon: <Search className="h-6 w-6 text-purple-500" />,
      title: "Text Search",
      description: "Find specific text in your document with powerful search capabilities"
    },
    {
      icon: <FileText className="h-6 w-6 text-orange-500" />,
      title: "Edit Any PDF",
      description: "Works with scanned documents, forms, contracts, and any other PDF file"
    },
    {
      icon: <Languages className="h-6 w-6 text-red-500" />,
      title: "Multilingual Support",
      description: "Supports text detection and editing in multiple languages"
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Fast Processing",
      description: "Quick and efficient text detection and editing for large documents"
    }
  ];
  
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Why Use Our PDF Editor</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-card border rounded-lg p-6">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EditPdfFaq() {
  const { t } = useLanguageStore();
  
  const faqs = [
    {
      question: "How accurate is the text detection?",
      answer: "Our PDF text editor uses advanced OCR (Optical Character Recognition) technology to detect text in PDF documents with high accuracy. The quality of text detection depends on the quality of the original document. For digitally created PDFs, the accuracy is typically very high. For scanned documents, the clarity of the scan affects accuracy."
    },
    {
      question: "Can I edit text in scanned PDFs?",
      answer: "Yes, you can edit text in scanned PDFs. Our editor uses OCR technology to detect text in scanned documents, allowing you to replace or edit the detected text. For best results, ensure your scanned document is clear and has good resolution."
    },
    {
      question: "What happens if the font in my PDF is not available?",
      answer: "When editing text, the editor will attempt to match the font style as closely as possible. If the exact font is not available, a similar font will be used. The editor supports common fonts like Helvetica, Times Roman, and Courier."
    },
    {
      question: "Can I add new text to my PDF?",
      answer: "Yes, you can add new text anywhere in your PDF document. The editor allows you to specify the font, size, and color of the new text to match your document's style."
    },
    {
      question: "Is there a limit to how many edits I can make?",
      answer: "There is no limit to the number of text edits you can make in a single document. You can replace existing text, add new text, or remove text as needed."
    },
    {
      question: "Will the formatting of my PDF be preserved after editing?",
      answer: "The editor focuses on text editing while preserving the overall formatting of your document. However, complex layouts or special formatting may be affected. We recommend checking the preview before saving your changes."
    }
  ];
  
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
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

export function EditPdfHowTo() {
  const { t } = useLanguageStore();
  
  const steps = [
    {
      title: "Upload Your PDF",
      description: "Start by uploading the PDF document you want to edit. Enable OCR detection for the best text recognition."
    },
    {
      title: "Locate and Select Text",
      description: "Click on any text element in the document to select it for editing. You can also use the search function to find specific text."
    },
    {
      title: "Edit or Replace Text",
      description: "Enter your new text in the editing panel and click 'Replace' to update the document. You can also add new text or remove existing text."
    },
    {
      title: "Preview and Save",
      description: "Preview your changes before finalizing, then save your edited PDF document for download."
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">How to Edit PDF Text</h2>
      <div className="grid md:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4">
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
export function RelatedToolsSection() {
  const { t } = useLanguageStore();
  
  const tools = [
    { 
      href: "/compress", 
      icon: <FileText className="h-5 w-5 text-green-500" />,
      name: "Compress PDF",
      bg: "bg-green-100 dark:bg-green-900/30"
    },
    { 
      href: "/ocr", 
      icon: <FileCheck2 className="h-5 w-5 text-blue-500" />,
      name: "PDF OCR",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    { 
      href: "/convert/pdf-to-docx", 
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      name: "PDF to Word",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    { 
      href: "/protect", 
      icon: <FileText className="h-5 w-5 text-purple-500" />,
      name: "Protect PDF",
      bg: "bg-purple-100 dark:bg-purple-900/30"
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Related Tools</h2>
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
          <Button variant="outline">View All Tools</Button>
        </LanguageLink>
      </div>
    </div>
  );
}