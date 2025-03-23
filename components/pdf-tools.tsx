// components/pdf-tools.tsx
"use client";

import { PdfToolCard } from "@/components/pdf-tool-card";
import { useLanguageStore } from "@/src/lib/i18n";
import {
  FileTextIcon,
  ImageIcon,
  TableIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PencilIcon,
  LayoutIcon,
  ArrowDownIcon,
  RotateCcwIcon,
  ShieldIcon,
  Edit2Icon,
  LockIcon,
  FileCheck2,
} from "lucide-react";

// Define the tool categories and items
const pdfTools = [
  {
    id: "convert",
    label: "Convert from PDF",
    tools: [
      {
        id: "pdf-to-word",
        name: "PDF to Word",
        description: "Easily convert your PDF files into easy to edit DOC and DOCX documents.",
        icon: <FileTextIcon className="h-6 w-6 text-blue-500" />,
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        href: "/convert/pdf-to-docx"  // Updated URL
      },
      {
        id: "pdf-to-powerpoint",
        name: "PDF to PowerPoint",
        description: "Turn your PDF files into easy to edit PPT and PPTX slideshows.",
        icon: <FileTextIcon className="h-6 w-6 text-orange-500" />,
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        href: "/convert/pdf-to-pptx"  // Updated URL
      },
      {
        id: "pdf-to-excel",
        name: "PDF to Excel",
        description: "Pull data straight from PDFs into Excel spreadsheets in a few short seconds.",
        icon: <TableIcon className="h-6 w-6 text-green-500" />,
        iconBg: "bg-green-100 dark:bg-green-900/30",
        href: "/convert/pdf-to-xlsx"  // Updated URL
      },
      {
        id: "pdf-to-jpg",
        name: "PDF to JPG",
        description: "Convert each PDF page into a JPG or extract all images contained in a PDF.",
        icon: <ImageIcon className="h-6 w-6 text-yellow-500" />,
        iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
        href: "/convert/pdf-to-jpg"  // Updated URL
      },
      {
        id: "pdf-to-png",
        name: "PDF to PNG",
        description: "Convert each PDF page into a PNG or extract all images contained in a PDF.",
        icon: <ImageIcon className="h-6 w-6 text-yellow-500" />,
        iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
        href: "/convert/pdf-to-png"  // Updated URL
      },
      {
        id: "pdf-to-html",
        name: "PDF to HTML",
        description: "Convert webpages in HTML to PDF. Copy and paste the URL of the page.",
        icon: <LayoutIcon className="h-6 w-6 text-amber-500" />,
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        href: "/convert/pdf-to-html"  // Updated URL
      },
    ]
  },
  {
    id: "convert-to",
    label: "Convert to PDF",
    tools: [
      {
        id: "word-to-pdf",
        name: "Word to PDF",
        description: "Make DOC and DOCX files easy to read by converting them to PDF.",
        icon: <FileTextIcon className="h-6 w-6 text-blue-500" />,
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        href: "/convert/docx-to-pdf"  // Updated URL
      },
      {
        id: "powerpoint-to-pdf",
        name: "PowerPoint to PDF",
        description: "Make PPT and PPTX slideshows easy to view by converting them to PDF.",
        icon: <FileTextIcon className="h-6 w-6 text-orange-500" />,
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        href: "/convert/pptx-to-pdf"  // Updated URL
      },
      {
        id: "excel-to-pdf",
        name: "Excel to PDF",
        description: "Make EXCEL spreadsheets easy to read by converting them to PDF.",
        icon: <TableIcon className="h-6 w-6 text-green-500" />,
        iconBg: "bg-green-100 dark:bg-green-900/30",
        href: "/convert/xlsx-to-pdf"  // Updated URL
      },
      {
        id: "jpg-to-pdf",
        name: "JPG to PDF",
        description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.",
        icon: <ImageIcon className="h-6 w-6 text-yellow-500" />,
        iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
        href: "/convert/jpg-to-pdf"  // Updated URL
      },
      {
        id: "png-to-pdf",
        name: "PNG to PDF",
        description: "Convert PNG images to PDF in seconds. Easily adjust orientation and margins.",
        icon: <ImageIcon className="h-6 w-6 text-yellow-500" />,
        iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
        href: "/convert/png-to-pdf"  // Updated URL
      },
      {
        id: "html-to-pdf",
        name: "HTML to PDF",
        description: "Convert webpages to PDF. Copy and paste the URL to convert it to PDF.",
        icon: <LayoutIcon className="h-6 w-6 text-amber-500" />,
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        href: "/convert/html-to-pdf"  // Updated URL
      },
    ]
  },
  {
    id: "modify",
    label: "Basic Tools",
    tools: [
      {
        id: "merge-pdf",
        name: "Merge PDF",
        description: "Combine PDFs in the order you want with the easiest PDF merger available.",
        icon: <ArrowRightIcon className="h-6 w-6 text-red-500" />,
        iconBg: "bg-red-100 dark:bg-red-900/30",
        href: "/merge"
      },
      {
        id: "compress-pdf",
        name: "Compress PDF",
        description: "Reduce file size while optimizing for maximal PDF quality.",
        icon: <ArrowDownIcon className="h-6 w-6 text-green-500" />,
        iconBg: "bg-green-100 dark:bg-green-900/30",
        href: "/compress"
      },
      { 
        id: "ocr",
        name: "OCR", 
        href: "/ocr", 
        icon: <FileCheck2 className="h-5 w-5 text-blue-500" />,
        description: "Extract text from scanned documents",
        iconBg: "bg-green-100 dark:bg-yellow-900/30",
        new: true
      }
    ]
  },
  {
    id: "organize",
    label: "Organize PDF",
    tools: [
      {
        id: "rotate-pdf",
        name: "Rotate PDF",
        description: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!",
        icon: <RotateCcwIcon className="h-6 w-6 text-purple-500" />,
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        href: "/rotate"
      },
      {
        id: "watermark",
        name: "Watermark",
        description: "Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.",
        icon: <Edit2Icon className="h-6 w-6 text-purple-500" />,
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        href: "/watermark"
      },
    ]
  },
  {
    id: "security",
    label: "PDF Security",
    tools: [
      {
        id: "unlock-pdf",
        name: "Unlock PDF",
        description: "Remove PDF password security, giving you the freedom to use your PDFs as you want.",
        icon: <LockIcon className="h-6 w-6 text-blue-500" />,
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        href: "/unlock"
      },
      {
        id: "protect-pdf",
        name: "Protect PDF",
        description: "Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.",
        icon: <ShieldIcon className="h-6 w-6 text-blue-500" />,
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        href: "/protect"
      },
    ]
  }
];

export function PdfTools() {
  
  return (
    <div className="container max-w-6xl py-8 mx-auto">
      <div className="space-y-8">
        {pdfTools.map((category) => (
          <div key={category.id} className="space-y-4">
            <h2 className="text-xl font-bold">{category.label}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.tools.map((tool) => (
                <PdfToolCard
                  key={tool.id}
                  id={tool.id}
                  name={tool.name}
                  description={tool.description}
                  icon={tool.icon}
                  iconBg={tool.iconBg}
                  href={tool.href}
                  isNew={tool.new}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}