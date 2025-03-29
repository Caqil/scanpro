// components/pdf-tools.tsx
"use client";

import { PdfToolCard } from "@/components/pdf-tool-card";
import { useLanguageStore } from "@/src/store/store";
import {
  FileTextIcon,
  ImageIcon,
  TableIcon,
  ArrowRightIcon,
  LayoutIcon,
  ArrowDownIcon,
  RotateCcwIcon,
  ShieldIcon,
  Edit2Icon,
  LockIcon,
  FileCheck2,
  FileBadge2Icon,
  ReplaceAllIcon,
} from "lucide-react";

export function PdfTools() {
  const { t } = useLanguageStore();
  
  // Define the tool categories and items with localized text
  const pdfTools = [
    {
      id: "convert",
      label: t('pdfTools.categories.convertFromPdf'),
      tools: [
        {
          id: "pdf-to-word",
          name: t('popular.pdfToWord'),
          description: t('toolDescriptions.pdfToWord'),
          icon: <FileTextIcon className="h-6 w-6 text-blue-500" />,
          iconBg: "bg-blue-100 dark:bg-blue-900/30",
          href: "/convert/pdf-to-docx"  // Updated URL
        },
        {
          id: "pdf-to-powerpoint",
          name: t('popular.pdfToPowerPoint'),
          description: t('toolDescriptions.pdfToPowerpoint'),
          icon: <FileTextIcon className="h-6 w-6 text-orange-500" />,
          iconBg: "bg-orange-100 dark:bg-orange-900/30",
          href: "/convert/pdf-to-pptx"  // Updated URL
        },
        {
          id: "pdf-to-excel",
          name: t('popular.pdfToExcel'),
          description: t('toolDescriptions.pdfToExcel'),
          icon: <TableIcon className="h-6 w-6 text-green-500" />,
          iconBg: "bg-green-100 dark:bg-green-900/30",
          href: "/convert/pdf-to-xlsx"  // Updated URL
        },
        {
          id: "pdf-to-jpg",
          name: t('popular.pdfToJpg'),
          description: t('toolDescriptions.pdfToJpg'),
          icon: <ImageIcon className="h-6 w-6 text-yellow-500" />,
          iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
          href: "/convert/pdf-to-jpg"  // Updated URL
        },
        {
          id: "pdf-to-png",
          name: t('popular.pdfToPng'),
          description: t('toolDescriptions.pdfToPng'),
          icon: <ImageIcon className="h-6 w-6 text-yellow-500" />,
          iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
          href: "/convert/pdf-to-png"  // Updated URL
        },
        {
          id: "pdf-to-html",
          name: t('popular.pdfToPng'),
          description: t('toolDescriptions.pdfToHtml'),
          icon: <LayoutIcon className="h-6 w-6 text-amber-500" />,
          iconBg: "bg-amber-100 dark:bg-amber-900/30",
          href: "/convert/pdf-to-html"  // Updated URL
        },
      ]
    },
    {
      id: "convert-to",
      label: t('pdfTools.categories.convertToPdf'),
      tools: [
        {
          id: "word-to-pdf",
          name: t('popular.wordToPdf'),
          description: t('toolDescriptions.wordToPdf'),
          icon: <FileTextIcon className="h-6 w-6 text-blue-500" />,
          iconBg: "bg-blue-100 dark:bg-blue-900/30",
          href: "/convert/docx-to-pdf"  // Updated URL
        },
        {
          id: "powerpoint-to-pdf",
          name: t('popular.powerPointToPdf'),
          description: t('toolDescriptions.powerpointToPdf'),
          icon: <FileTextIcon className="h-6 w-6 text-orange-500" />,
          iconBg: "bg-orange-100 dark:bg-orange-900/30",
          href: "/convert/pptx-to-pdf"  // Updated URL
        },
        {
          id: "excel-to-pdf",
          name: t('popular.excelToPdf'),
          description: t('toolDescriptions.excelToPdf'),
          icon: <TableIcon className="h-6 w-6 text-green-500" />,
          iconBg: "bg-green-100 dark:bg-green-900/30",
          href: "/convert/xlsx-to-pdf"  // Updated URL
        },
        {
          id: "jpg-to-pdf",
          name: t('popular.jpgToPdf'),
          description: t('toolDescriptions.jpgToPdf'),
          icon: <ImageIcon className="h-6 w-6 text-yellow-500" />,
          iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
          href: "/convert/jpg-to-pdf"  // Updated URL
        },
        {
          id: "png-to-pdf",
          name: t('popular.pngToPdf'),
          description: t('toolDescriptions.pngToPdf'),
          icon: <ImageIcon className="h-6 w-6 text-yellow-500" />,
          iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
          href: "/convert/png-to-pdf"  // Updated URL
        },
        {
          id: "html-to-pdf",
          name: t('popular.htmlToPdf'),
          description: t('toolDescriptions.htmlToPdf'),
          icon: <LayoutIcon className="h-6 w-6 text-amber-500" />,
          iconBg: "bg-amber-100 dark:bg-amber-900/30",
          href: "/convert/html-to-pdf"  // Updated URL
        },
      ]
    },
    {
      id: "modify",
      label: t('pdfTools.categories.basicTools'),
      tools: [
        {
          id: "merge-pdf",
          name:  t('popular.mergePdf'),
          description: t('toolDescriptions.mergePdf'),
          icon: <ArrowRightIcon className="h-6 w-6 text-red-500" />,
          iconBg: "bg-red-100 dark:bg-red-900/30",
          href: "/merge"
        },
        {
          id: "compress-pdf",
          name: t('popular.compressPdf'),
          description: t('toolDescriptions.compressPdf'),
          icon: <ArrowDownIcon className="h-6 w-6 text-green-500" />,
          iconBg: "bg-green-100 dark:bg-green-900/30",
          href: "/compress"
        },
         {
          id: "repair",
          name: t("pdfTools.tools.repairPdf.name") || "Repair PDF",
          description: t("pdfTools.tools.repairPdf.description") || "Fix corrupted PDF files and recover content",
          href: "/repair",
          icon: <ReplaceAllIcon className="h-8 w-8" />,
          iconBg: "bg-blue-100 dark:bg-blue-900/30",
          isNew: true
        },
        {
          id: "compress-file",
          name: t('compressPdf.compressAll'),
          description: t('compressPdf.compressAll'),
          icon: <FileBadge2Icon className="h-6 w-6 text-green-500" />,
          iconBg: "bg-green-100 dark:bg-green-900/30",
          href: "/compress-files",
          isNew: true
        },
        {
          id: "split-pdf",
          name: t('popular.splitPdf'),
          description: t('toolDescriptions.compressPdf'),
          icon: <ArrowDownIcon className="h-6 w-6 text-green-500" />,
          iconBg: "bg-green-100 dark:bg-green-900/30",
          href: "/split",
          isNew: true
        },
        { 
          id: "ocr",
          name: t('ocr.title'), 
          href: "/ocr", 
          icon: <FileCheck2 className="h-5 w-5 text-blue-500" />,
          description: t('toolDescriptions.ocr'),
          iconBg: "bg-green-100 dark:bg-yellow-900/30",
          isNew: true
        }
      ]
    },
    {
      id: "organize",
      label: t('pdfTools.categories.organizePdf'),
      tools: [
        {
          id: "rotate-pdf",
          name: t('popular.rotatePdf'),
          description: t('toolDescriptions.rotatePdf'),
          icon: <RotateCcwIcon className="h-6 w-6 text-purple-500" />,
          iconBg: "bg-purple-100 dark:bg-purple-900/30",
          href: "/rotate"
        },
        {
          id: "watermark",
          name: t('popular.watermark'),
          description: t('toolDescriptions.watermark'),
          icon: <Edit2Icon className="h-6 w-6 text-purple-500" />,
          iconBg: "bg-purple-100 dark:bg-purple-900/30",
          href: "/watermark"
        },
      ]
    },
    {
      id: "security",
      label: t('pdfTools.categories.pdfSecurity'),
      tools: [
        {
          id: "unlock-pdf",
          name: "Unlock PDF",
          description: t('toolDescriptions.unlockPdf'),
          icon: <LockIcon className="h-6 w-6 text-blue-500" />,
          iconBg: "bg-blue-100 dark:bg-blue-900/30",
          href: "/unlock"
        },
        {
          id: "protect-pdf",
          name: "Protect PDF",
          description: t('toolDescriptions.protectPdf'),
          icon: <ShieldIcon className="h-6 w-6 text-blue-500" />,
          iconBg: "bg-blue-100 dark:bg-blue-900/30",
          href: "/protect"
        },
      ]
    }
  ];

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
                  isNew={tool.isNew}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}