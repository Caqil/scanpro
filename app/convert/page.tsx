// app/convert/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, ReactNode } from "react";
import { FileUploader } from "@/components/file-uploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Image, Table, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Define conversion type interface
interface ConversionType {
  title: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  inputFormat: string;
  outputFormat: string;
}

// Define conversion types and their details
const conversionTypes: Record<string, ConversionType> = {
  // From PDF to other formats
  "pdf-to-docx": {
    title: "PDF to Word",
    description: "Convert PDF to editable Word documents",
    icon: <FileText className="h-8 w-8 text-blue-500" />,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    inputFormat: "pdf",
    outputFormat: "docx",
  },
  "pdf-to-xlsx": {
    title: "PDF to Excel",
    description: "Convert PDF tables to Excel spreadsheets",
    icon: <Table className="h-8 w-8 text-green-500" />,
    iconBg: "bg-green-100 dark:bg-green-900/30",
    inputFormat: "pdf",
    outputFormat: "xlsx",
  },
  "pdf-to-pptx": {
    title: "PDF to PowerPoint",
    description: "Convert PDF to PowerPoint presentations",
    icon: <FileText className="h-8 w-8 text-orange-500" />,
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    inputFormat: "pdf",
    outputFormat: "pptx",
  },
  "pdf-to-jpg": {
    title: "PDF to JPG",
    description: "Convert PDF pages to JPG images",
    icon: <Image className="h-8 w-8 text-yellow-500" />,
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    inputFormat: "pdf",
    outputFormat: "jpg",
  },
  "pdf-to-html": {
    title: "PDF to HTML",
    description: "Convert PDF to HTML web pages",
    icon: <File className="h-8 w-8 text-purple-500" />,
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    inputFormat: "pdf",
    outputFormat: "html",
  },
  
  // From other formats to PDF
  "docx-to-pdf": {
    title: "Word to PDF",
    description: "Convert Word documents to PDF",
    icon: <FileText className="h-8 w-8 text-blue-500" />,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    inputFormat: "docx",
    outputFormat: "pdf",
  },
  "xlsx-to-pdf": {
    title: "Excel to PDF",
    description: "Convert Excel spreadsheets to PDF",
    icon: <Table className="h-8 w-8 text-green-500" />,
    iconBg: "bg-green-100 dark:bg-green-900/30",
    inputFormat: "xlsx",
    outputFormat: "pdf",
  },
  "pptx-to-pdf": {
    title: "PowerPoint to PDF",
    description: "Convert PowerPoint presentations to PDF",
    icon: <FileText className="h-8 w-8 text-orange-500" />,
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    inputFormat: "pptx",
    outputFormat: "pdf",
  },
  "jpg-to-pdf": {
    title: "JPG to PDF",
    description: "Convert JPG images to PDF",
    icon: <Image className="h-8 w-8 text-yellow-500" />,
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    inputFormat: "jpg",
    outputFormat: "pdf",
  },
  "html-to-pdf": {
    title: "HTML to PDF",
    description: "Convert HTML web pages to PDF",
    icon: <File className="h-8 w-8 text-purple-500" />,
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    inputFormat: "html",
    outputFormat: "pdf",
  },
  // Legacy mappings
  "pdf-to-word": {
    title: "PDF to Word",
    description: "Convert PDF to editable Word documents",
    icon: <FileText className="h-8 w-8 text-blue-500" />,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    inputFormat: "pdf",
    outputFormat: "docx",
  },
  "pdf-to-excel": {
    title: "PDF to Excel",
    description: "Convert PDF tables to Excel spreadsheets",
    icon: <Table className="h-8 w-8 text-green-500" />,
    iconBg: "bg-green-100 dark:bg-green-900/30",
    inputFormat: "pdf",
    outputFormat: "xlsx",
  },
  "pdf-to-powerpoint": {
    title: "PDF to PowerPoint",
    description: "Convert PDF to PowerPoint presentations",
    icon: <FileText className="h-8 w-8 text-orange-500" />,
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    inputFormat: "pdf",
    outputFormat: "pptx",
  },
  "word-to-pdf": {
    title: "Word to PDF",
    description: "Convert Word documents to PDF",
    icon: <FileText className="h-8 w-8 text-blue-500" />,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    inputFormat: "docx",
    outputFormat: "pdf",
  },
  "excel-to-pdf": {
    title: "Excel to PDF",
    description: "Convert Excel spreadsheets to PDF",
    icon: <Table className="h-8 w-8 text-green-500" />,
    iconBg: "bg-green-100 dark:bg-green-900/30",
    inputFormat: "xlsx",
    outputFormat: "pdf",
  },
  "powerpoint-to-pdf": {
    title: "PowerPoint to PDF",
    description: "Convert PowerPoint presentations to PDF",
    icon: <FileText className="h-8 w-8 text-orange-500" />,
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    inputFormat: "pptx",
    outputFormat: "pdf",
  },
};

function ConvertPageContent() {
  const searchParams = useSearchParams();
  const inputParam = searchParams?.get("input") || "";
  const outputParam = searchParams?.get("output") || "";
  
  const [conversionType, setConversionType] = useState<string>("pdf-to-docx");
  const [inputFormat, setInputFormat] = useState<string>("pdf");
  const [outputFormat, setOutputFormat] = useState<string>("docx");
  const [conversionDetails, setConversionDetails] = useState<ConversionType>(conversionTypes["pdf-to-docx"]);

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
   // setDebugInfo(info);
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
    
    // Find matching conversion details
    if (conversionTypes[selectedKey]) {
      setConversionDetails(conversionTypes[selectedKey]);
      console.log(`Found matching conversion type for ${selectedKey}`);
    } else {
      console.warn(`Unknown conversion type: ${selectedKey}, using default`);
      setConversionDetails(conversionTypes["pdf-to-docx"]);
    }
    
  }, [inputParam, outputParam]);

  // Related conversions based on current conversion type
  const getRelatedConversions = () => {
    const isFromPdf = inputFormat === "pdf";
    
    // Get 4 related conversions
    if (isFromPdf) {
      return Object.entries(conversionTypes)
        .filter(([key, value]) => 
          value.inputFormat === "pdf" && 
          key !== conversionType &&
          !key.includes("-to-word") && // Filter out duplicates
          !key.includes("-to-excel") &&
          !key.includes("-to-powerpoint"))
        .slice(0, 4)
        .map(([key, value]) => ({ id: key, ...value }));
    } else {
      // If converting to PDF, show other to-PDF conversions
      return Object.entries(conversionTypes)
        .filter(([key, value]) => 
          value.outputFormat === "pdf" && 
          key !== conversionType &&
          !key.includes("word-to-") && // Filter out duplicates
          !key.includes("excel-to-") &&
          !key.includes("powerpoint-to-"))
        .slice(0, 4)
        .map(([key, value]) => ({ id: key, ...value }));
    }
  };

  const relatedConversions = getRelatedConversions();

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
            {inputFormat === "pdf" 
              ? `Select a PDF file to convert to ${outputFormat.toUpperCase()}`
              : `Select a ${inputFormat.toUpperCase()} file to convert to PDF`}
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
          How to Convert {inputFormat.toUpperCase()} to {outputFormat.toUpperCase()}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Upload</h3>
            <p className="text-sm text-muted-foreground">
              {inputFormat === "pdf" 
                ? "Upload the PDF file you want to convert"
                : `Upload the ${inputFormat.toUpperCase()} file you want to convert to PDF`}
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
              {inputFormat === "pdf" 
                ? `Download your converted ${outputFormat.toUpperCase()} file`
                : "Download your converted PDF file"}
            </p>
          </div>
        </div>
      </div>

      {/* More Conversions Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">More Conversion Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedConversions.map((conversion) => (
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

export default function ConvertPage() {
  return (
    <Suspense fallback={
      <div className="container py-20">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="h-16 w-16 mx-auto mb-4 border-4 border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading conversion options...</p>
          </div>
        </div>
      </div>
    }>
      <ConvertPageContent />
    </Suspense>
  );
}