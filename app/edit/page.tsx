// app/edit/page.tsx
import { Button } from "@/components/ui/button";
import { PenLine, FileIcon, InfoIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { PdfEditor } from "@/components/pdf-editor";

export const metadata: Metadata = {
  title: "Edit PDF | ScanPro - PDF Tools",
  description: "Edit your PDF files by adding text, images, shapes or freehand annotations, and sign your documents easily.",
};

export default function EditPDFPage() {
  return (
    <div className="container max-w-6xl py-12 mx-auto">
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <div className="mb-4 p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
          <PenLine className="h-8 w-8 text-purple-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Edit PDF
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
          Add text, images, annotations, signatures, and more to your PDF documents
        </p>
      </div>

      {/* Main Editor Component */}
      <div className="mb-12">
        <PdfEditor />
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">How to Edit Your PDF</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Upload</h3>
            <p className="text-sm text-muted-foreground">
              Upload the PDF file you want to edit. All edits happen in your browser.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Choose Tools</h3>
            <p className="text-sm text-muted-foreground">
              Select from various editing tools: text, drawing, shapes, highlighting, and more.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Make Changes</h3>
            <p className="text-sm text-muted-foreground">
              Edit your document page by page, add signatures, text annotations, or highlights.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">4</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Download</h3>
            <p className="text-sm text-muted-foreground">
              Save your edited PDF and download it to your computer.
            </p>
          </div>
        </div>
      </div>

      {/* Editor Features */}
      <div className="mb-12 bg-muted/30 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">PDF Editor Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <span className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <path d="m18 5-3-3H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="M8 15h8" />
                  <path d="M8 11h8" />
                  <path d="M8 7h2" />
                </svg>
              </span>
              Text Editing
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Add new text anywhere on the page</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Edit existing text within the document</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Change font size, color, and style</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <span className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m8 12 3 3 5-5" />
                </svg>
              </span>
              Drawing & Annotations
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Freehand drawing with adjustable line width</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Add shapes: lines, rectangles, and circles</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Highlight important sections with transparency</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <span className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
                  <path d="M8 12h8" />
                  <path d="M12 8v8" />
                </svg>
              </span>
              Additional Features
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Add digital signatures to documents</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Undo/redo support for all edits</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Multi-page document support</span>
              </li>
            </ul>
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
              Is my PDF secure during editing?
            </h3>
            <p className="text-sm text-muted-foreground">
              Yes, all PDF editing happens directly in your browser. Your files are not uploaded to our servers for processing, ensuring maximum privacy and security.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Can I edit scanned PDF documents?
            </h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can add annotations, text, and signatures on top of scanned PDFs. For editing the actual scanned content, use our OCR tool first to convert the scanned text to editable format.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Are there any file size limitations?
            </h3>
            <p className="text-sm text-muted-foreground">
              The PDF editor supports files up to 100MB. For larger files, consider splitting your PDF into smaller parts using our Split PDF tool first.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Can I save my work and continue editing later?
            </h3>
            <p className="text-sm text-muted-foreground">
              Currently, the editor does not support saving work in progress. We recommend completing your edits in a single session before downloading the result.
            </p>
          </div>
        </div>
      </div>

      {/* Related Tools Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Related PDF Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/merge" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                  <path d="m15 15 6 6m-6-6v6h6" />
                  <path d="M9 19.5V15" />
                  <path d="M9 4v1.5" />
                  <path d="M9 9v1.5" />
                  <path d="M9 19.5a7.5 7.5 0 0 0 7.5-7.5v-8a8 8 0 0 0-8-8 8 8 0 0 0-8 8v12a7.5 7.5 0 0 0 7.5 7.5" />
                </svg>
              </div>
              <span className="text-sm font-medium">Merge PDF</span>
            </div>
          </Link>
          <Link href="/sign" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <span className="text-sm font-medium">Sign PDF</span>
            </div>
          </Link>
          <Link href="/protect" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <span className="text-sm font-medium">Protect PDF</span>
            </div>
          </Link>
          <Link href="/ocr" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                  <path d="M10 9H8" />
                </svg>
              </div>
              <span className="text-sm font-medium">OCR</span>
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