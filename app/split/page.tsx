import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, FileIcon, InfoIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { PdfSplitter } from "@/components/pdf-splitter";

export const metadata: Metadata = {
  title: "Split PDF Files | ScanPro - PDF Tools",
  description: "Split PDF files into individual pages or custom ranges with our easy-to-use PDF splitter tool.",
};

export default function SplitPDFPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <div className="mb-4 p-3 rounded-full bg-red-100 dark:bg-red-900/30">
          <ArrowLeftIcon className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Split PDF Files
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
          Extract individual pages or ranges from your PDF documents
        </p>
      </div>

      {/* Main Tool Card */}
      <div className="mb-8">
        <PdfSplitter />
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">How to Split PDF Files</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Upload</h3>
            <p className="text-sm text-muted-foreground">
              Upload the PDF file you want to split into individual pages or custom ranges.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Select Pages</h3>
            <p className="text-sm text-muted-foreground">
              Choose to extract all pages, specific pages, or custom page ranges.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Download</h3>
            <p className="text-sm text-muted-foreground">
              Download your split PDF files individually or as a ZIP archive.
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
              Can I split a large PDF into smaller chunks?
            </h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can easily split a large PDF document into smaller chunks by specifying page ranges like "1-10", "11-20", etc.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Will the quality of my PDF be affected when splitting?
            </h3>
            <p className="text-sm text-muted-foreground">
              No, our tool maintains the exact same quality as your original PDF. We don't compress or alter the content in any way.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Can I split a password-protected PDF?
            </h3>
            <p className="text-sm text-muted-foreground">
              You need to unlock your PDF first. Use our Unlock PDF tool to remove the password protection, then split the unlocked PDF.
            </p>
          </div>
        </div>
      </div>

      {/* More Tools Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Related PDF Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/merge" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
                <ArrowLeftIcon className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-sm font-medium">Merge PDF</span>
            </div>
          </Link>
          <Link href="/compress" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
                <ArrowLeftIcon className="h-5 w-5 text-green-500" />
              </div>
              <span className="text-sm font-medium">Compress PDF</span>
            </div>
          </Link>
          <Link href="/rotate" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
                <FileIcon className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-sm font-medium">Rotate PDF</span>
            </div>
          </Link>
          <Link href="/edit" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-2">
                <FileIcon className="h-5 w-5 text-purple-500" />
              </div>
              <span className="text-sm font-medium">Edit PDF</span>
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