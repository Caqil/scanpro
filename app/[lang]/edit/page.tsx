// app/[lang]/edit-pdf/page.tsx
import { Metadata } from "next";
import { PdfTextEditor } from "@/components/pdf-text-editor";
import { EditPdfHeader, EditPdfFeatures, EditPdfFaq } from "./edit-content";

export const metadata: Metadata = {
  title: "Edit PDF Text | ScanPro",
  description: "Advanced PDF text editing with OCR detection for precise text replacement and editing",
};

export default function EditPdfPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <EditPdfHeader />
      
      {/* Main PDF Editor */}
      <div className="my-8">
        <PdfTextEditor />
      </div>
      
      {/* Features Section */}
      <EditPdfFeatures />
      
      {/* FAQ Section */}
      <EditPdfFaq />
    </div>
  );
}