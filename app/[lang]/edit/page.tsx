import { Metadata } from "next";
import { PdfEditor } from "@/components/pdf-editor";
import { Edit2Icon, FileIcon, InfoIcon } from "lucide-react";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';

type Language = typeof SUPPORTED_LANGUAGES[number];

// Helper function to get translation based on language
function getTranslation(lang: string, key: string): string {
  // This would use your actual translation function
  // Simplified for this example
  return key;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as Language) ? paramLang as Language : "en";
  const t = (key: string) => getTranslation(lang, key);

  return {
    title: "Edit PDF | ScanPro",
    description: "Edit PDF files online - add text, signatures, drawings, and annotations to your PDF documents.",
    openGraph: {
      title: "Edit PDF | ScanPro",
      description: "Edit PDF files online - add text, signatures, drawings, and annotations to your PDF documents.",
      url: `/${lang}/edit`,
      siteName: "ScanPro",
      locale: lang === "id" ? "id_ID" : lang === "es" ? "es_ES" : "en_US",
    },
    alternates: {
      canonical: `/${lang}/edit`,
      languages: {
        "en-US": "/en/edit",
        "id-ID": "/id/edit",
        "es-ES": "/es/edit",
      },
    },
  };
}

export default function EditPDFPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <div className="mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <Edit2Icon className="h-8 w-8 text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Edit PDF Files
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
          Add text, signatures, drawings, and annotations to your PDF documents.
        </p>
      </div>

      {/* Main editor component */}
      <div className="mb-12">
        <PdfEditor />
      </div>
      
      {/* How it works section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">How to Edit PDF Files</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Upload</h3>
            <p className="text-sm text-muted-foreground">
              Upload the PDF file you want to edit. Our editor will convert it for editing.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Edit</h3>
            <p className="text-sm text-muted-foreground">
              Use our intuitive tools to add text, drawings, shapes, or signatures to your PDF.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Download</h3>
            <p className="text-sm text-muted-foreground">
              Save your edited PDF file and download it to your device.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              What can I do with the PDF Editor?
            </h3>
            <p className="text-sm text-muted-foreground">
              You can add text, signatures, drawings, shapes, and annotations to your PDF documents. The editor allows you to customize fonts, colors, and sizes for all elements you add.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Can I edit the existing text in the PDF?
            </h3>
            <p className="text-sm text-muted-foreground">
              For PDFs with selectable text, you can add new text on top of existing content. For scanned documents, we use OCR technology to make the text editable.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Is my data secure?
            </h3>
            <p className="text-sm text-muted-foreground">
              Yes, all your documents are processed securely. Files are automatically deleted from our servers after processing for your privacy.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Are there any limitations?
            </h3>
            <p className="text-sm text-muted-foreground">
              The free version allows editing of PDF files up to 100MB in size. For larger files or advanced features like form filling, consider our premium plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}