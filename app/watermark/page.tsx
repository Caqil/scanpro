import { Button } from "@/components/ui/button";
import { Edit2Icon, FileIcon, InfoIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { PdfWatermarker } from "@/components/pdf-watermarker";

export const metadata: Metadata = {
  title: "Add Watermark to PDF | ScanPro - PDF Tools",
  description: "Add text watermarks to your PDF files to protect your documents and indicate ownership or status.",
};

export default function WatermarkPDFPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <div className="mb-4 p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
          <Edit2Icon className="h-8 w-8 text-purple-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Add Watermark to PDF
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
          Protect your documents by adding custom text watermarks
        </p>
      </div>

      {/* Main Tool Card */}
      <div className="mb-8">
        <PdfWatermarker />
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">How to Add a Watermark</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Upload</h3>
            <p className="text-sm text-muted-foreground">
              Upload the PDF file you want to add a watermark to. You can preview how it will look before applying.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Customize</h3>
            <p className="text-sm text-muted-foreground">
              Set the text, position, size, color, and opacity of your watermark to match your needs.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Download</h3>
            <p className="text-sm text-muted-foreground">
              Process and download your watermarked PDF file ready for distribution.
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
              What kind of watermarks can I add?
            </h3>
            <p className="text-sm text-muted-foreground">
              Our tool supports text watermarks with customizable content, position, size, color, opacity, and rotation. You can add watermarks like "CONFIDENTIAL," "DRAFT," or your company name.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Can I watermark only specific pages in my PDF?
            </h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can choose to watermark all pages or specify which pages should have the watermark by entering their page numbers.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Are the watermarks permanent?
            </h3>
            <p className="text-sm text-muted-foreground">
              Yes, the watermarks are permanently embedded in the PDF document. However, they can be placed with varying opacity to balance visibility and legibility of the content.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Will watermarking affect the file quality?
            </h3>
            <p className="text-sm text-muted-foreground">
              No, our watermarking tool only adds the specified text without affecting the original document quality or file size significantly.
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
                <FileIcon className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-sm font-medium">Merge PDF</span>
            </div>
          </Link>
          <Link href="/split" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
                <FileIcon className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-sm font-medium">Split PDF</span>
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
          <Link href="/compress" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
                <FileIcon className="h-5 w-5 text-green-500" />
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