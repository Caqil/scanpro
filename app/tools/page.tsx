import { PdfTools } from "@/components/pdf-tools";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Tools | ScanPro - PDF Converter & Editor",
  description: "All the PDF tools you need in one place. Convert, edit, merge, split, compress, and more.",
};

export default function ToolsPage() {
  return (
    <main className="py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-8 md:mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            All PDF Tools
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Everything you need to work with PDFs in one place
          </p>
        </div>
        
        <PdfTools />
      </div>
    </main>
  );
}