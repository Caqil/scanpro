"use client";

import { useState, useEffect } from "react";
import { FileUploader } from "@/components/file-uploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Image, Table, File } from "lucide-react";
import { useLanguageStore } from "@/src/store/store";
import { LanguageLink } from "@/components/language-link";

// Define conversion type interface
interface ConversionType {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  inputFormat: string;
  outputFormat: string;
}

export default function ConvertPageContent({
  inputParam,
  outputParam
}: {
  inputParam?: string;
  outputParam?: string;
}) {
  const { t } = useLanguageStore();
  const [conversionType, setConversionType] = useState<string>("pdf-to-docx");
  const [inputFormat, setInputFormat] = useState<string>("pdf");
  const [outputFormat, setOutputFormat] = useState<string>("docx");
  const [conversionDetails, setConversionDetails] = useState<ConversionType | null>(null);

  // Debug logging
  useEffect(() => {
    const info = {
      urlParams: { input: inputParam, output: outputParam },
      currentState: { 
        conversionType, 
        inputFormat, 
        outputFormat,
        conversionDetails: conversionDetails ? {
          title: conversionDetails.title,
          inputFormat: conversionDetails.inputFormat,
          outputFormat: conversionDetails.outputFormat
        } : null
      }
    };
    
    console.log("Debug Info:", info);
  }, [inputParam, outputParam, conversionType, inputFormat, outputFormat, conversionDetails]);

  useEffect(() => {
    let selectedKey = "pdf-to-docx"; // Default
    let selectedInput = "pdf";
    let selectedOutput = "docx";
    
    console.log(`Processing URL params: input=${inputParam}, output=${outputParam}`);
    
    // Try to find a matching conversion type based on URL parameters
    if (inputParam && outputParam) {
      // Both parameters are provided
      selectedKey = `${inputParam}-to-${outputParam}`;
      selectedInput = inputParam;
      selectedOutput = outputParam;
      console.log(`Both params provided: key=${selectedKey}`);
    } 
    else if (inputParam && !outputParam) {
      // Only input is provided - assume conversion to PDF
      selectedKey = `${inputParam}-to-pdf`;
      selectedInput = inputParam;
      selectedOutput = "pdf";
      console.log(`Only input provided: key=${selectedKey}`);
    } 
    else if (!inputParam && outputParam) {
      // Only output is provided - assume conversion from PDF
      selectedKey = `pdf-to-${outputParam}`;
      selectedInput = "pdf";
      selectedOutput = outputParam;
      console.log(`Only output provided: key=${selectedKey}`);
    }
    
    console.log(`Determined conversion: key=${selectedKey}, input=${selectedInput}, output=${selectedOutput}`);
    
    // Update all states
    setConversionType(selectedKey);
    setInputFormat(selectedInput);
    setOutputFormat(selectedOutput);
    
    // Define conversion types with translations
    const conversionTypes: Record<string, ConversionType> = {
      "pdf-to-docx": {
        title: t('convert.title.pdfToWord'),
        description: t('convert.description.pdfToWord'),
        icon: <FileText className="h-8 w-8 text-blue-500" />,
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        inputFormat: "pdf",
        outputFormat: "docx"
      },
      "pdf-to-xlsx": {
        title: t('convert.title.pdfToExcel'),
        description: t('convert.description.pdfToExcel'),
        icon: <Table className="h-8 w-8 text-green-500" />,
        iconBg: "bg-green-100 dark:bg-green-900/30",
        inputFormat: "pdf",
        outputFormat: "xlsx"
      },
      "pdf-to-pptx": {
        title: t('convert.title.pdfToPowerPoint'),
        description: t('convert.description.pdfToPowerPoint'),
        icon: <FileText className="h-8 w-8 text-orange-500" />,
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        inputFormat: "pdf",
        outputFormat: "pptx"
      },
      "pdf-to-jpg": {
        title: t('convert.title.pdfToJpg'),
        description: t('convert.description.pdfToJpg'),
        icon: <Image className="h-8 w-8 text-yellow-500" />,
        iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
        inputFormat: "pdf",
        outputFormat: "jpg"
      },
      "pdf-to-png": {
        title: t('convert.title.pdfToPng'),
        description: t('convert.description.pdfToPng'),
        icon: <Image className="h-8 w-8 text-yellow-500" />,
        iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
        inputFormat: "pdf",
        outputFormat: "png"
      },
      "pdf-to-html": {
        title: t('convert.title.pdfToHtml'),
        description: t('convert.description.pdfToHtml'),
        icon: <FileText className="h-8 w-8 text-purple-500" />,
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        inputFormat: "pdf",
        outputFormat: "html"
      },
      "docx-to-pdf": {
        title: t('convert.title.wordToPdf'),
        description: t('convert.description.wordToPdf'),
        icon: <FileText className="h-8 w-8 text-blue-500" />,
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        inputFormat: "docx",
        outputFormat: "pdf"
      },
      "xlsx-to-pdf": {
        title: t('convert.title.excelToPdf'),
        description: t('convert.description.excelToPdf'),
        icon: <Table className="h-8 w-8 text-green-500" />,
        iconBg: "bg-green-100 dark:bg-green-900/30",
        inputFormat: "xlsx",
        outputFormat: "pdf"
      },
      "pptx-to-pdf": {
        title: t('convert.title.powerPointToPdf'),
        description: t('convert.description.powerPointToPdf'),
        icon: <FileText className="h-8 w-8 text-orange-500" />,
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        inputFormat: "pptx",
        outputFormat: "pdf"
      },
      "jpg-to-pdf": {
        title: t('convert.title.jpgToPdf'),
        description: t('convert.description.jpgToPdf'),
        icon: <Image className="h-8 w-8 text-yellow-500" />,
        iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
        inputFormat: "jpg",
        outputFormat: "pdf"
      },
      "png-to-pdf": {
        title: t('convert.title.pngToPdf'),
        description: t('convert.description.pngToPdf'),
        icon: <Image className="h-8 w-8 text-yellow-500" />,
        iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
        inputFormat: "png",
        outputFormat: "pdf"
      },
      "html-to-pdf": {
        title: t('convert.title.htmlToPdf'),
        description: t('convert.description.htmlToPdf'),
        icon: <FileText className="h-8 w-8 text-purple-500" />,
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        inputFormat: "html",
        outputFormat: "pdf"
      },
      // Add legacy mappings
      "pdf-to-word": {
        title: t('convert.title.pdfToWord'),
        description: t('convert.description.pdfToWord'),
        icon: <FileText className="h-8 w-8 text-blue-500" />,
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        inputFormat: "pdf",
        outputFormat: "docx"
      },
      "pdf-to-excel": {
        title: t('convert.title.pdfToExcel'),
        description: t('convert.description.pdfToExcel'),
        icon: <Table className="h-8 w-8 text-green-500" />,
        iconBg: "bg-green-100 dark:bg-green-900/30",
        inputFormat: "pdf",
        outputFormat: "xlsx"
      },
      "pdf-to-powerpoint": {
        title: t('convert.title.pdfToPowerPoint'),
        description: t('convert.description.pdfToPowerPoint'),
        icon: <FileText className="h-8 w-8 text-orange-500" />,
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        inputFormat: "pdf",
        outputFormat: "pptx"
      },
      "word-to-pdf": {
        title: t('convert.title.wordToPdf'),
        description: t('convert.description.wordToPdf'),
        icon: <FileText className="h-8 w-8 text-blue-500" />,
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        inputFormat: "docx",
        outputFormat: "pdf"
      },
      "excel-to-pdf": {
        title: t('convert.title.excelToPdf'),
        description: t('convert.description.excelToPdf'),
        icon: <Table className="h-8 w-8 text-green-500" />,
        iconBg: "bg-green-100 dark:bg-green-900/30",
        inputFormat: "xlsx",
        outputFormat: "pdf"
      },
      "powerpoint-to-pdf": {
        title: t('convert.title.powerPointToPdf'),
        description: t('convert.description.powerPointToPdf'),
        icon: <FileText className="h-8 w-8 text-orange-500" />,
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        inputFormat: "pptx",
        outputFormat: "pdf"
      },
    };
    
    // Find matching conversion details
    if (conversionTypes[selectedKey]) {
      setConversionDetails(conversionTypes[selectedKey]);
      console.log(`Found matching conversion type for ${selectedKey}`);
    } else {
      console.warn(`Unknown conversion type: ${selectedKey}, using default`);
      setConversionDetails(conversionTypes["pdf-to-docx"]);
    }
    
  }, [t, inputParam, outputParam]); // Add t to dependencies to update when language changes

  // Related conversions based on current conversion type
  const getRelatedConversions = () => {
    if (!conversionDetails) return [];

    const isFromPdf = inputFormat === "pdf";
    
    // Get 4 related conversions
    if (isFromPdf) {
      // Show other from-PDF conversions
      return [
        {
          id: "pdf-to-word",
          name: t('convert.title.pdfToWord'),
          href: "/convert?output=docx",
          icon: <FileText className="h-5 w-5 text-blue-500" />,
          description: t('convert.description.pdfToWord'),
          iconBg: "bg-blue-100 dark:bg-blue-900/30"
        },
        {
          id: "pdf-to-excel",
          name: t('convert.title.pdfToExcel'),
          href: "/convert?output=xlsx",
          icon: <Table className="h-5 w-5 text-green-500" />,
          description: t('convert.description.pdfToExcel'),
          iconBg: "bg-green-100 dark:bg-green-900/30"
        },
        {
          id: "pdf-to-powerpoint",
          name: t('convert.title.pdfToPowerPoint'),
          href: "/convert?output=pptx",
          icon: <FileText className="h-5 w-5 text-orange-500" />,
          description: t('convert.description.pdfToPowerPoint'),
          iconBg: "bg-orange-100 dark:bg-orange-900/30"
        },
        {
          id: "pdf-to-jpg",
          name: t('convert.title.pdfToJpg'),
          href: "/convert?output=jpg",
          icon: <Image className="h-5 w-5 text-yellow-500" />,
          description: t('convert.description.pdfToJpg'),
          iconBg: "bg-yellow-100 dark:bg-yellow-900/30"
        }
      ];
    } else {
      // If converting to PDF, show other to-PDF conversions
      return [
        {
          id: "word-to-pdf",
          name: t('convert.title.wordToPdf'),
          href: "/convert?input=docx",
          icon: <FileText className="h-5 w-5 text-blue-500" />,
          description: t('convert.description.wordToPdf'),
          iconBg: "bg-blue-100 dark:bg-blue-900/30"
        },
        {
          id: "excel-to-pdf",
          name: t('convert.title.excelToPdf'),
          href: "/convert?input=xlsx",
          icon: <Table className="h-5 w-5 text-green-500" />,
          description: t('convert.description.excelToPdf'),
          iconBg: "bg-green-100 dark:bg-green-900/30"
        },
        {
          id: "powerpoint-to-pdf",
          name: t('convert.title.powerPointToPdf'),
          href: "/convert?input=pptx",
          icon: <FileText className="h-5 w-5 text-orange-500" />,
          description: t('convert.description.powerPointToPdf'),
          iconBg: "bg-orange-100 dark:bg-orange-900/30"
        },
        {
          id: "jpg-to-pdf",
          name: t('convert.title.jpgToPdf'),
          href: "/convert?input=jpg",
          icon: <Image className="h-5 w-5 text-yellow-500" />,
          description: t('convert.description.jpgToPdf'),
          iconBg: "bg-yellow-100 dark:bg-yellow-900/30"
        }
      ];
    }
  };

  // Get related conversions
  const relatedConversions = getRelatedConversions();

  // Placeholder if conversion details aren't loaded yet
  if (!conversionDetails) {
    return <div className="container max-w-5xl py-12 mx-auto">{t('ui.loading')}</div>;
  }

  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <div className={`mb-4 p-3 rounded-full ${conversionDetails.iconBg}`}>
          {conversionDetails.icon}
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {conversionDetails.title}
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
          {conversionDetails.description}
        </p>
      </div>

      {/* Conversion Tool */}
      <Card className="mb-8 border shadow-sm">
        <CardHeader>
          <CardTitle>{t('ui.upload')}</CardTitle>
          <CardDescription>
            {inputFormat === "pdf" 
              ? t('fileUploader.dropHereaDesc').replace('PDF', outputFormat.toUpperCase())
              : t('fileUploader.dropHereaDesc').replace('PDF', inputFormat.toUpperCase())}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploader 
            initialInputFormat={inputFormat}
            initialOutputFormat={outputFormat}
            key={`${inputFormat}-to-${outputFormat}`} // Force re-render when formats change
          />
        </CardContent>
      </Card>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {t('convert.howTo.title')
            .replace('{from}', inputFormat.toUpperCase())
            .replace('{to}', outputFormat.toUpperCase())}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">{t('convert.howTo.step1.title')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('convert.howTo.step1.description').replace('{from}', inputFormat.toUpperCase())}
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">{t('convert.howTo.step2.title')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('convert.howTo.step2.description')}
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">{t('convert.howTo.step3.title')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('convert.howTo.step3.description').replace('{to}', outputFormat.toUpperCase())}
            </p>
          </div>
        </div>
      </div>

      {/* More Tools Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">{t('convert.moreTools')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedConversions.map((conversion) => (
            <LanguageLink 
              key={conversion.id}
              href={conversion.href} 
              className="border rounded-lg p-4 text-center hover:border-primary transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className={`p-2 rounded-full ${conversion.iconBg} mb-2`}>
                  {conversion.icon}
                </div>
                <span className="text-sm font-medium">{conversion.name}</span>
              </div>
            </LanguageLink>
          ))}
        </div>
        <div className="text-center mt-6">
          <LanguageLink href="/tools"><Button variant="outline" size="lg">
                         {t('popular.viewAll')}
                       </Button></LanguageLink>
        </div>
      </div>
    </div>
  );
}