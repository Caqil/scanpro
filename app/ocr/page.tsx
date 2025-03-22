// app/ocr/page.tsx
import { Button } from "@/components/ui/button";
import { FileText, FileIcon, InfoIcon, Languages } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { PdfOcrExtractor } from "@/components/pdf-ocr-extractor";

export const metadata: Metadata = {
  title: "OCR Extract Text from PDF | ScanPro - PDF Tools",
  description: "Use OCR (Optical Character Recognition) to extract text from scanned PDFs or image-based PDFs.",
};

export default function OcrPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <div className="mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <Languages className="h-8 w-8 text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          OCR Text Extraction
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
          Extract text from scanned PDFs and images using powerful Optical Character Recognition technology
        </p>
      </div>

      {/* Main Tool Card */}
      <div className="mb-12">
        <PdfOcrExtractor />
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">How OCR Text Extraction Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Upload</h3>
            <p className="text-sm text-muted-foreground">
              Upload your scanned PDF document or image-based PDF file.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Configure OCR</h3>
            <p className="text-sm text-muted-foreground">
              Select language, page range, and advanced options for best results.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Get Text</h3>
            <p className="text-sm text-muted-foreground">
              Copy the extracted text or download it as a text file for further use.
            </p>
          </div>
        </div>
      </div>

      {/* What is OCR Section */}
      <div className="mb-12 p-6 bg-muted/30 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">What is OCR?</h2>
        <div className="space-y-4">
          <p>
            <strong>Optical Character Recognition (OCR)</strong> is a technology that converts different types of documents, such as scanned paper documents, PDF files, or images captured by a digital camera, into editable and searchable data.
          </p>
          <p>
            OCR analyzes the structure of the document image, identifies characters and text elements, and then converts them into a machine-readable format. This allows you to extract text from:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Scanned PDFs where the text exists as an image</li>
            <li>Image-only PDFs with no underlying text layer</li>
            <li>PDFs containing embedded images with text</li>
            <li>Documents where copying text directly doesn't work</li>
          </ul>
        </div>
      </div>

      {/* When to Use OCR */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">When to Use OCR Text Extraction</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-medium mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              Ideal for:
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Scanned documents saved as PDFs</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Old documents without digital text layers</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>PDFs where text selection/copying doesn't work</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Images containing text that needs to be extracted</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Creating searchable archives from scanned documents</span>
              </li>
            </ul>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-medium mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-red-500" />
              Not necessary for:
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Native digital PDFs where text can already be selected</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>PDFs created directly from digital documents</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Documents where you can already copy and paste text</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span>Files that need format preservation (use our PDF to DOCX conversion instead)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* OCR Limitations Section */}
      <div className="mb-12 border rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <InfoIcon className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">OCR Limitations & Tips</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              While our OCR technology is powerful, there are some limitations to be aware of:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium mb-2">Factors affecting OCR accuracy:</p>
                <ul className="space-y-1 list-disc pl-5">
                  <li>Document quality (resolution, contrast)</li>
                  <li>Complex layouts and formatting</li>
                  <li>Handwritten text (limited recognition)</li>
                  <li>Special characters and symbols</li>
                  <li>Multiple languages in one document</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Tips for best results:</p>
                <ul className="space-y-1 list-disc pl-5">
                  <li>Use high-quality scans (300 DPI or higher)</li>
                  <li>Select the correct language for your document</li>
                  <li>Enable "Enhance scanned images" for better accuracy</li>
                  <li>Process smaller page ranges for large documents</li>
                  <li>Review and correct the extracted text afterward</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              How accurate is the OCR text extraction?
            </h3>
            <p className="text-sm text-muted-foreground">
              Our OCR technology typically achieves 90-99% accuracy for clearly printed text in well-scanned documents. Accuracy may decrease with poor quality scans, unusual fonts, or complex layouts. For best results, use high-resolution scans with good contrast.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Which languages are supported?
            </h3>
            <p className="text-sm text-muted-foreground">
              We support over 100 languages including English, French, German, Spanish, Italian, Portuguese, Chinese, Japanese, Korean, Russian, Arabic, Hindi and many more. For languages with special characters, make sure to select the proper language for best recognition.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Why isn't my text being recognized correctly?
            </h3>
            <p className="text-sm text-muted-foreground">
              Several factors can affect OCR accuracy: document quality, resolution, contrast, complex layouts, handwriting, unusual fonts, or selecting the wrong language. Try enhancing the scan quality, choosing the correct language, and selecting the "Enhance scanned images" option for better results.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Is there a limit to how many pages I can process?
            </h3>
            <p className="text-sm text-muted-foreground">
              For free users, there's a limit of 50 pages per PDF. Premium users can process PDFs with up to 500 pages. For very large documents, we recommend processing them in smaller sections by using the "Specific Pages" option.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Is my data secure during OCR processing?
            </h3>
            <p className="text-sm text-muted-foreground">
              Yes, your security is our priority. All uploaded files are processed on secure servers and automatically deleted after processing. We don't store your documents or extracted text beyond the necessary processing time, and all data transfers are encrypted.
            </p>
          </div>
        </div>
      </div>
      
      {/* More Tools Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Related PDF Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/convert?output=docx" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-sm font-medium">PDF to Word</span>
            </div>
          </Link>
          <Link href="/convert?input=jpg" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
                <FileIcon className="h-5 w-5 text-green-500" />
              </div>
              <span className="text-sm font-medium">JPG to PDF</span>
            </div>
          </Link>
          <Link href="/ocr" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-2">
                <FileIcon className="h-5 w-5 text-purple-500" />
              </div>
              <span className="text-sm font-medium">Extract PDF</span>
            </div>
          </Link>
          <Link href="/compress" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
                <FileIcon className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-sm font-medium">Compress PDF</span>
            </div>
          </Link>
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