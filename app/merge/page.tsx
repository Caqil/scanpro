// app/merge/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon, FileIcon, InfoIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Merge PDF Files | ScanPro - PDF Tools",
  description: "Combine multiple PDF files into a single document with our easy-to-use PDF merger tool.",
};

export default function MergePDFPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <div className="mb-4 p-3 rounded-full bg-red-100 dark:bg-red-900/30">
          <ArrowRightIcon className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Merge PDF Files
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
          Combine multiple PDF files into a single document quickly and easily
        </p>
      </div>

      {/* Main Tool Card */}
      <Card className="mb-8 border shadow-sm">
        <CardHeader>
          <CardTitle>Upload PDFs to Merge</CardTitle>
          <CardDescription>
            Select multiple PDF files to combine them into a single document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer hover:border-muted-foreground/50">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <FileIcon className="h-6 w-6 text-red-500" />
              </div>
              <div className="text-lg font-medium">
                Drag & drop PDF files here
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                Drop your PDF files here or click to browse. You can select multiple files at once.
              </p>
              <Button type="button" variant="secondary" size="sm" className="mt-2">
                Select Files
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">PDF Files</h3>
            <div className="space-y-2 min-h-20 border rounded-md p-4 bg-muted/30">
              <p className="text-sm text-muted-foreground text-center">
                No files selected yet
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <Button type="button" disabled>
                Merge PDFs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">How to Merge PDF Files</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Select Files</h3>
            <p className="text-sm text-muted-foreground">
              Upload the PDF files you want to combine. You can select multiple files at once.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Arrange Order</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop to rearrange the files in the order you want them to appear in the final PDF.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Download</h3>
            <p className="text-sm text-muted-foreground">
              Click the Merge PDFs button and download your combined PDF file.
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
              Is there a limit to how many PDFs I can merge?
            </h3>
            <p className="text-sm text-muted-foreground">
              You can merge up to 20 PDF files at once with our free tool. For larger batches, consider our premium plan.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Will my PDF files remain private?
            </h3>
            <p className="text-sm text-muted-foreground">
              Yes, your privacy is our priority. All uploaded files are automatically deleted from our servers after processing.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Can I merge password-protected PDFs?
            </h3>
            <p className="text-sm text-muted-foreground">
              For password-protected PDFs, you will need to unlock them first using our Unlock PD; tool, and then merge them.
            </p>
          </div>
        </div>
      </div>

      {/* More Tools Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Explore More PDF Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/split" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
                <ArrowRightIcon className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-sm font-medium">Split PDF</span>
            </div>
          </Link>
          <Link href="/compress" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
                <ArrowRightIcon className="h-5 w-5 text-green-500" />
              </div>
              <span className="text-sm font-medium">Compress PDF</span>
            </div>
          </Link>
          <Link href="/convert?output=docx" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
                <FileIcon className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-sm font-medium">PDF to Word</span>
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