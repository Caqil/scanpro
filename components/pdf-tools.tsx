// components/pdf-tools.tsx
"use client";

import { PdfToolCard } from "@/components/pdf-tool-card";
import {
  FileIcon,
  FileTextIcon,
  ImageIcon,
  TableIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  PencilIcon,
  LayoutIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  RotateCcwIcon,
  ShieldIcon,
  Edit2Icon,
  LockIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
        href: "/convert?output=docx"
      },
      {
        id: "pdf-to-powerpoint",
        name: "PDF to PowerPoint",
        description: "Turn your PDF files into easy to edit PPT and PPTX slideshows.",
        icon: <FileTextIcon className="h-6 w-6 text-orange-500" />,
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        href: "/convert?output=pptx"
      },
      {
        id: "pdf-to-excel",
        name: "PDF to Excel",
        description: "Pull data straight from PDFs into Excel spreadsheets in a few short seconds.",
        icon: <TableIcon className="h-6 w-6 text-green-500" />,
        iconBg: "bg-green-100 dark:bg-green-900/30",
        href: "/convert?output=xlsx"
      },
      {
        id: "pdf-to-jpg",
        name: "PDF to JPG",
        description: "Convert each PDF page into a JPG or extract all images contained in a PDF.",
        icon: <ImageIcon className="h-6 w-6 text-yellow-500" />,
        iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
        href: "/convert?output=jpg"
      },
      {
        id: "pdf-to-html",
        name: "PDF to HTML",
        description: "Convert webpages in HTML to PDF. Copy and paste the URL of the page.",
        icon: <LayoutIcon className="h-6 w-6 text-amber-500" />,
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        href: "/convert?output=html"
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
        href: "/convert?input=docx"
      },
      {
        id: "powerpoint-to-pdf",
        name: "PowerPoint to PDF",
        description: "Make PPT and PPTX slideshows easy to view by converting them to PDF.",
        icon: <FileTextIcon className="h-6 w-6 text-orange-500" />,
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        href: "/convert?input=pptx"
      },
      {
        id: "excel-to-pdf",
        name: "Excel to PDF",
        description: "Make EXCEL spreadsheets easy to read by converting them to PDF.",
        icon: <TableIcon className="h-6 w-6 text-green-500" />,
        iconBg: "bg-green-100 dark:bg-green-900/30",
        href: "/convert?input=xlsx"
      },
      {
        id: "jpg-to-pdf",
        name: "JPG to PDF",
        description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.",
        icon: <ImageIcon className="h-6 w-6 text-yellow-500" />,
        iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
        href: "/convert?input=jpg"
      },
      {
        id: "html-to-pdf",
        name: "HTML to PDF",
        description: "Convert webpages to PDF. Copy and paste the URL to convert it to PDF.",
        icon: <LayoutIcon className="h-6 w-6 text-amber-500" />,
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        href: "/convert?input=html"
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
        id: "split-pdf",
        name: "Split PDF",
        description: "Separate one page or a whole set for easy conversion into independent PDF files.",
        icon: <ArrowLeftIcon className="h-6 w-6 text-red-500" />,
        iconBg: "bg-red-100 dark:bg-red-900/30",
        href: "/split"
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
        id: "edit-pdf",
        name: "Edit PDF",
        description: "Add text, images, shapes or freehand annotations to a PDF document.",
        new: true,
        icon: <PencilIcon className="h-6 w-6 text-purple-500" />,
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        href: "/edit"
      },
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
        id: "sign-pdf",
        name: "Sign PDF",
        description: "Sign yourself or request electronic signatures from others.",
        icon: <PencilIcon className="h-6 w-6 text-blue-500" />,
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        href: "/sign"
      },
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