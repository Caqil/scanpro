// app/sign/page.tsx
import { Button } from "@/components/ui/button";
import { PencilIcon, FileIcon, InfoIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { PdfSigner } from "@/components/pdf-signer";

export const metadata: Metadata = {
  title: "Sign PDF Documents | ScanPro - PDF Tools",
  description: "Add your digital signature to PDF files quickly and securely, without the need for third-party tools.",
};

export default function SignPDFPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <div className="mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <PencilIcon className="h-8 w-8 text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Sign PDF Documents
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
          Add your digital signature to PDF files quickly and securely
        </p>
      </div>

      {/* Main Tool Card */}
      <div className="mb-12">
        <PdfSigner />
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">How to Sign PDF Files</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Upload</h3>
            <p className="text-sm text-muted-foreground">
              Upload the PDF file you want to digitally sign.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Create Signature</h3>
            <p className="text-sm text-muted-foreground">
              Draw your signature or type your name and set your preferences.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Download</h3>
            <p className="text-sm text-muted-foreground">
              Download your signed PDF document ready for distribution.
            </p>
          </div>
        </div>
      </div>

      {/* Digital Signatures Section */}
      <div className="mb-12 p-6 bg-muted/30 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">About Digital Signatures</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
              <PencilIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">Visual Signatures</h3>
              <p className="text-sm text-muted-foreground">
                Our tool creates visual signatures that look like traditional pen-and-paper signatures. These are perfect for everyday documents that need a personal sign-off.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">Document Integrity</h3>
              <p className="text-sm text-muted-foreground">
                While our signatures are not legally binding cryptographic signatures, they include metadata like the signer's name, date, and reason for signing to establish document integrity.
              </p>
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
              Are these signatures legally binding?
            </h3>
            <p className="text-sm text-muted-foreground">
              Our tool creates visual signatures that include the signer's name and timestamp. While these may be accepted for many everyday purposes, they are not cryptographically secured digital signatures. For legally binding contracts or documents with strict requirements, check with your legal advisor.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Can I sign multiple pages at once?
            </h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can choose to sign all pages or specific pages of your document. This is useful for multi-page agreements where a signature is required on each page.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Is my signature stored on your servers?
            </h3>
            <p className="text-sm text-muted-foreground">
              No, your signature is only used during the signing process and is not permanently stored on our servers. Once the document is signed and downloaded, all uploaded files and signatures are automatically deleted within 24 hours.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Can I use this for multiple signers?
            </h3>
            <p className="text-sm text-muted-foreground">
              This tool is designed for one signer at a time. For documents requiring multiple signatures, each signer should add their signature separately, or consider our premium services which include workflow management for multiple signers.
            </p>
          </div>
        </div>
      </div>

      {/* Related Tools Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Related PDF Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/protect" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <span className="text-sm font-medium">Protect PDF</span>
            </div>
          </Link>
          <Link href="/unlock" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <span className="text-sm font-medium">Unlock PDF</span>
            </div>
          </Link>
          <Link href="/watermark" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                </svg>
              </div>
              <span className="text-sm font-medium">Watermark PDF</span>
            </div>
          </Link>
          <Link href="/edit" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-2">
                <PencilIcon className="h-5 w-5 text-purple-500" />
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