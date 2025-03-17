// app/convert/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FileUploader } from "@/components/file-uploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileIcon, FileTextIcon, ImageIcon, TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Define conversion types and their details
const conversionTypes = {
  // From PDF to other formats
  "pdf-to-word": {
    title: "PDF to Word",
    description: "Convert PDF to editable Word documents",
    icon: <FileTextIcon className="h-8 w-8 text-blue-500" />,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    inputFormat: "pdf",
    outputFormat: "docx",
  },
  "pdf-to-excel": {
    title: "PDF to Excel",
    description: "Convert PDF tables to Excel spreadsheets",
    icon: <TableIcon className="h-8 w-8 text-green-500" />,
    iconBg: "bg-green-100 dark:bg-green-900/30",
    inputFormat: "pdf",
    outputFormat: "xlsx",
  },
  "pdf-to-powerpoint": {
    title: "PDF to PowerPoint",
    description: "Convert PDF to PowerPoint presentations",
    icon: <FileTextIcon className="h-8 w-8 text-orange-500" />,
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    inputFormat: "pdf",
    outputFormat: "pptx",
  },
  "pdf-to-jpg": {
    title: "PDF to JPG",
    description: "Convert PDF pages to JPG images",
    icon: <ImageIcon className="h-8 w-8 text-yellow-500" />,
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    inputFormat: "pdf",
    outputFormat: "jpg",
  },
  "pdf-to-html": {
    title: "PDF to HTML",
    description: "Convert PDF to HTML web pages",
    icon: <FileIcon className="h-8 w-8 text-purple-500" />,
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    inputFormat: "pdf",
    outputFormat: "html",
  },
  
  // From other formats to PDF
  "word-to-pdf": {
    title: "Word to PDF",
    description: "Convert Word documents to PDF",
    icon: <FileTextIcon className="h-8 w-8 text-blue-500" />,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    inputFormat: "docx",
    outputFormat: "pdf",
  },
  "excel-to-pdf": {
    title: "Excel to PDF",
    description: "Convert Excel spreadsheets to PDF",
    icon: <TableIcon className="h-8 w-8 text-green-500" />,
    iconBg: "bg-green-100 dark:bg-green-900/30",
    inputFormat: "xlsx",
    outputFormat: "pdf",
  },
  "powerpoint-to-pdf": {
    title: "PowerPoint to PDF",
    description: "Convert PowerPoint presentations to PDF",
    icon: <FileTextIcon className="h-8 w-8 text-orange-500" />,
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    inputFormat: "pptx",
    outputFormat: "pdf",
  },
  "jpg-to-pdf": {
    title: "JPG to PDF",
    description: "Convert JPG images to PDF",
    icon: <ImageIcon className="h-8 w-8 text-yellow-500" />,
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    inputFormat: "jpg",
    outputFormat: "pdf",
  },
  "html-to-pdf": {
    title: "HTML to PDF",
    description: "Convert HTML web pages to PDF",
    icon: <FileIcon className="h-8 w-8 text-purple-500" />,
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    inputFormat: "html",
    outputFormat: "pdf",
  },
};

export default function ConvertPage() {
  const searchParams = useSearchParams();
  const inputParam = searchParams.get("input") || "";
  const outputParam = searchParams.get("output") || "";
  
  const [conversionType, setConversionType] = useState("pdf-to-word"); // Default conversion
  const [conversionDetails, setConversionDetails] = useState(conversionTypes["pdf-to-word"]);

  useEffect(() => {
    let type = "pdf-to-word"; // Default type
    
    if (inputParam && outputParam) {
      if (inputParam === "pdf") {
        type = `pdf-to-${outputParam}`;
      } else if (outputParam === "pdf") {
        type = `${inputParam}-to-pdf`;
      }
    } else if (inputParam && !outputParam) {
      type = `${inputParam}-to-pdf`;
    } else if (!inputParam && outputParam) {
      type = `pdf-to-${outputParam}`;
    }
    
    // Only update if it's a valid conversion type
    if (conversionTypes[type as keyof typeof conversionTypes]) {
      setConversionType(type);
      setConversionDetails(conversionTypes[type as keyof typeof conversionTypes]);
    }
  }, [inputParam, outputParam]);

  // Related conversions based on current conversion type
  const getRelatedConversions = () => {
    const isFromPdf = conversionDetails.inputFormat === "pdf";
    
    // Get 4 related conversions
    if (isFromPdf) {
      return Object.entries(conversionTypes)
        .filter(([key]) => key.startsWith("pdf-to-") && key !== conversionType)
        .slice(0, 4)
        .map(([key, value]) => ({ id: key, ...value }));
    } else {
      // If converting to PDF, show other to-PDF conversions
      return Object.entries(conversionTypes)
        .filter(([key]) => key.endsWith("-to-pdf") && key !== conversionType)
        .slice(0, 4)
        .map(([key, value]) => ({ id: key, ...value }));
    }
  };

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
          <CardTitle>Upload File to Convert</CardTitle>
          <CardDescription>
            {conversionDetails.inputFormat === "pdf" 
              ? `Select a PDF file to convert to ${conversionDetails.outputFormat.toUpperCase()}`
              : `Select a ${conversionDetails.inputFormat.toUpperCase()} file to convert to PDF`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploader />
        </CardContent>
      </Card>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">
          How to Convert {conversionDetails.inputFormat.toUpperCase()} to {conversionDetails.outputFormat.toUpperCase()}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Upload</h3>
            <p className="text-sm text-muted-foreground">
              {conversionDetails.inputFormat === "pdf" 
                ? "Upload the PDF file you want to convert"
                : `Upload the ${conversionDetails.inputFormat.toUpperCase()} file you want to convert to PDF`}
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Convert</h3>
            <p className="text-sm text-muted-foreground">
              Click the Convert button and our system will process your file
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Download</h3>
            <p className="text-sm text-muted-foreground">
              {conversionDetails.inputFormat === "pdf" 
                ? `Download your converted ${conversionDetails.outputFormat.toUpperCase()} file`
                : "Download your converted PDF file"}
            </p>
          </div>
        </div>
      </div>

      {/* More Conversions Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">More Conversion Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {getRelatedConversions().map((conversion) => (
            <Link 
              key={conversion.id}
              href={`/convert?${conversion.inputFormat === "pdf" ? `output=${conversion.outputFormat}` : `input=${conversion.inputFormat}`}`} 
              className="border rounded-lg p-4 text-center hover:border-primary transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className={`p-2 rounded-full ${conversion.iconBg} mb-2`}>
                  {conversion.icon}
                </div>
                <span className="text-sm font-medium">{conversion.title}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/tools">
            <Button variant="outline">View All PDF Tools</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
