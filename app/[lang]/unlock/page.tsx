import { Button } from "@/components/ui/button";
import { UnlockIcon, FileIcon, InfoIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { PdfUnlocker } from "@/components/pdf-unlocker";
import { LanguageLink } from "@/components/language-link";

export const metadata: Metadata = {
  title: "Unlock PDF Files | ScanPro - PDF Tools",
  description: "Remove password protection from your PDF files to make them accessible without a password.",
};

export default function UnlockPDFPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <div className="mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <UnlockIcon className="h-8 w-8 text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Unlock PDF Files
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
          Remove password protection from your PDF documents for unrestricted access
        </p>
      </div>

      {/* Main Tool Card */}
      <div className="mb-12">
        <PdfUnlocker />
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">How to Unlock PDF Files</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Upload</h3>
            <p className="text-sm text-muted-foreground">
              Upload the password-protected PDF file you want to unlock.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Enter Password</h3>
            <p className="text-sm text-muted-foreground">
              If needed, enter the current password that protects the PDF.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Download</h3>
            <p className="text-sm text-muted-foreground">
              Download your unlocked PDF file with no password restrictions.
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
              Do I need to know the current password?
            </h3>
            <p className="text-sm text-muted-foreground">
              Yes, to unlock a PDF, you need to know the current password. Our tool cannot bypass or crack passwords; it simply removes the protection after you provide the correct password.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Is the unlocking process secure?
            </h3>
            <p className="text-sm text-muted-foreground">
              Yes, all processing happens on our secure servers. We do not store your PDFs or passwords. Files are automatically deleted after processing, and all data transfer is encrypted.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Can I unlock a PDF with owner restrictions but no open password?
            </h3>
            <p className="text-sm text-muted-foreground">
              Yes, some PDFs don't require a password to open but have restrictions on printing, editing, or copying. Our tool can remove these restrictions too. Just upload the file without entering a password.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Will unlocking affect the PDF quality or content?
            </h3>
            <p className="text-sm text-muted-foreground">
              No, our unlocking process only removes the security settings. It does not alter the content, formatting, or quality of your PDF file in any way.
            </p>
          </div>
        </div>
      </div>

      {/* Related Tools Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Related PDF Security Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <LanguageLink href="/protect" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <span className="text-sm font-medium">Protect PDF</span>
            </div>
          </LanguageLink>
          <LanguageLink href="/sign" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <path d="M20 20h-8.5c-.83 0-1.5-.67-1.5-1.5v-8c0-.83.67-1.5 1.5-1.5h8.5"></path>
                  <path d="M16 8V4c0-.5.5-1 1-1h4"></path>
                  <path d="M18 15v-7h3"></path>
                  <path d="M10 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4"></path>
                </svg>
              </div>
              <span className="text-sm font-medium">Sign PDF</span>
            </div>
          </LanguageLink>
          <LanguageLink href="/watermark" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                </svg>
              </div>
              <span className="text-sm font-medium">Watermark PDF</span>
            </div>
          </LanguageLink>
          <LanguageLink href="/compress" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                  <path d="M22 12H2m20 0-4 4m4-4-4-4M2 20V4"></path>
                </svg>
              </div>
              <span className="text-sm font-medium">Compress PDF</span>
            </div>
          </LanguageLink>
        </div>
        <div className="text-center mt-6">
          <LanguageLink href="/tools">
            <Button variant="outline">View All PDF Tools</Button>
          </LanguageLink>
        </div>
      </div>
    </div>
  );
}