// app/edit/page.tsx
import { PdfEditor } from "@/components/pdf-editor";
import { Button } from "@/components/ui/button";
import { PencilIcon, FileIcon, InfoIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edit PDF Documents | ScanPro - PDF Tools",
  description: "Add text, shapes, images, and annotations to your PDF documents easily with our online PDF editor.",
};

export default function EditPDFPage() {
  return (
    <div className="container max-w-6xl py-12 mx-auto">
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <div className="mb-4 p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
          <PencilIcon className="h-8 w-8 text-purple-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Edit PDF Documents
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
          Add text, shapes, and annotations to your PDF documents with our easy-to-use editor
        </p>
      </div>

      {/* Main Tool Card */}
      <div className="mb-12">
        <PdfEditor />
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">How to Edit PDF Files</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Upload</h3>
            <p className="text-sm text-muted-foreground">
              Upload the PDF file you want to edit. We support files up to 100MB.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Edit</h3>
            <p className="text-sm text-muted-foreground">
              Use our suite of tools to add text, shapes, images, annotations, and more.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Save</h3>
            <p className="text-sm text-muted-foreground">
              Download your edited PDF file, ready to share or use.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-12 py-8 px-6 bg-muted/20 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Editing Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <PencilIcon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Text and Typography</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Add text with customizable fonts, sizes, and colors. Perfect for filling forms, annotations, or adding captions.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                </svg>
              </div>
              <h3 className="font-semibold">Shapes and Lines</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Draw rectangles, circles, lines, and arrows to highlight important information or create diagrams.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M9 12h6m-6 4h6m-6-8h6" />
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                </svg>
              </div>
              <h3 className="font-semibold">Annotations</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Add comments, highlights, and annotations to mark up documents for review or collaboration.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <circle cx="10" cy="13" r="2" />
                  <path d="m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22" />
                </svg>
              </div>
              <h3 className="font-semibold">Freehand Drawing</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Use the drawing tool to sketch, underline, or create custom markups with your mouse or touchpad.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                  <path d="M18 14h-8" />
                  <path d="M15 18h-5" />
                  <path d="M10 6h8v4h-8V6Z" />
                </svg>
              </div>
              <h3 className="font-semibold">Stamps</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Add pre-defined stamps like "Approved," "Confidential," or create custom stamps for quick annotations.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <line x1="9" x2="15" y1="15" y2="9" />
                </svg>
              </div>
              <h3 className="font-semibold">Multi-Page Support</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Navigate and edit all pages in your PDF document with easy page controls and thumbnail previews.
            </p>
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
              What types of edits can I make to my PDF?
            </h3>
            <p className="text-sm text-muted-foreground">
              You can add text with custom fonts and styling, insert shapes and lines, highlight text, add annotations, 
              use freehand drawing tools, apply stamps, and more. Our editor gives you the essential tools to modify 
              your PDF without needing expensive desktop software.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Can I edit the existing text in my PDF document?
            </h3>
            <p className="text-sm text-muted-foreground">
              Our current editor allows you to add new text on top of existing content, but direct editing of the original PDF text is limited. 
              For substantial text edits, we recommend converting your PDF to Word using our PDF to Word converter tool, 
              making your changes, and then converting back to PDF.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Is my PDF secure when I upload it for editing?
            </h3>
            <p className="text-sm text-muted-foreground">
              Yes, we take security seriously. Your PDF is processed securely on our servers, and files are automatically deleted 
              after 24 hours. We do not store or access the content of your documents beyond what's needed for processing. 
              All data transmission is encrypted using HTTPS.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Can I use this editor on mobile devices?
            </h3>
            <p className="text-sm text-muted-foreground">
              Yes, our PDF editor is designed to work on both desktop and mobile devices. The interface adapts to your screen size, 
              though complex editing tasks may be easier on larger screens with a mouse or trackpad.
            </p>
          </div>
        </div>
      </div>

      {/* Related Tools Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Related PDF Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/watermark" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <span className="text-sm font-medium">Watermark PDF</span>
            </div>
          </Link>
          
          <Link href="/sign" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
                <PencilIcon className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-sm font-medium">Sign PDF</span>
            </div>
          </Link>
          
          <Link href="/ocr" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4" />
                  <path d="M9 21H5a2 2 0 0 1-2-2v-4" />
                  <path d="M19 3h-4a2 2 0 0 0-2 2v4" />
                  <path d="M19 21h-4a2 2 0 0 1-2-2v-4" />
                </svg>
              </div>
              <span className="text-sm font-medium">OCR</span>
            </div>
          </Link>
          
          <Link href="/compress" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                  <path d="M22 12H2m20 0-4 4m4-4-4-4M2 20V4" />
                </svg>
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