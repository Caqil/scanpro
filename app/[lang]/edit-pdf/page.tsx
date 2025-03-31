// app/[lang]/edit-pdf/page.tsx
import { Metadata } from "next";
import { PDFEditorClient } from "./pdf-editor-client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Edit PDF | ScanPro",
  description: "Edit PDF files - Replace text, add images, draw, and annotate your PDF documents",
};

export default function EditPDFPage() {
  return (
    <div className="container max-w-7xl py-8">
      <div className="mx-auto flex flex-col items-center text-center mb-6">
        <div className="mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
          Edit PDF
        </h1>
        <p className="text-muted-foreground max-w-[700px]">
          Replace text, add images, draw, and annotate your PDF documents
        </p>
      </div>
      
      <div className="rounded-lg border bg-card shadow">
        <div className="p-2 h-[calc(100vh-240px)] min-h-[500px]">
          <Suspense fallback={<EditorSkeleton />}>
            <PDFEditorClient />
          </Suspense>
        </div>
      </div>
      
      <div className="mt-12 space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">How to Edit PDFs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
                <span className="font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Upload PDF</h3>
              <p className="text-sm text-muted-foreground">
                Upload your PDF document. The file will be processed for editing.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
                <span className="font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Edit Content</h3>
              <p className="text-sm text-muted-foreground">
                Replace text, add annotations, insert images, or draw on your PDF.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
                <span className="font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Save Your Changes</h3>
              <p className="text-sm text-muted-foreground">
                Save your edited PDF and download it to your device.
              </p>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"/>
                    <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/>
                    <path d="M18 22V5l-6-3-6 3v17"/>
                    <path d="M12 7v5"/>
                    <path d="M10 9h4"/>
                  </svg>
                </div>
                <h3 className="font-medium">Text Replacement</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Find and replace text throughout your document with ease.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/>
                    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>
                  </svg>
                </div>
                <h3 className="font-medium">Annotations</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Add comments, highlights, and text annotations to your PDFs.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                    <path d="M12 19c0-4.2-2.8-7-7-7"/>
                    <path d="M5 19V5c0-1.7 1.3-3 3-3h8c1.7 0 3 1.3 3 3v14c0 1.7-1.3 3-3 3H8c-1.7 0-3-1.3-3-3Z"/>
                    <path d="M9 3v5l1-1h4l1 1V3"/>
                    <path d="M9 13h6"/>
                    <path d="M9 17h6"/>
                  </svg>
                </div>
                <h3 className="font-medium">Drawing Tools</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Draw shapes, arrows, and freehand annotations on your document.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                </div>
                <h3 className="font-medium">Image Overlay</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Add images, logos, or signatures to any part of your PDF.
              </p>
            </div>
          </div>
        </section>
        
        <section className="bg-muted/30 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-background">
              <h3 className="font-medium mb-2">Will my PDF keep its formatting after editing?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, our PDF editor maintains your document's original formatting while allowing you to make precise edits to text and add new elements.
              </p>
            </div>
            
            <div className="border rounded-lg p-4 bg-background">
              <h3 className="font-medium mb-2">Can I edit all text in a PDF?</h3>
              <p className="text-sm text-muted-foreground">
                Our editor uses OCR (Optical Character Recognition) to detect text in your PDF. Most text can be edited, but some highly formatted or image-based text may be limited to overlay editing.
              </p>
            </div>
            
            <div className="border rounded-lg p-4 bg-background">
              <h3 className="font-medium mb-2">Is my document secure during editing?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, your files are processed securely. All uploads are automatically deleted after processing, and we don't store your edited documents on our servers.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function EditorSkeleton() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between mb-4">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
      <div className="flex-1 relative">
        <Skeleton className="h-full w-full rounded-md" />
      </div>
      <div className="mt-4 flex justify-between">
        <Skeleton className="h-10 w-32 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
}