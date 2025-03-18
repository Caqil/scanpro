// app/protect/page.tsx
import { Button } from "@/components/ui/button";
import { LockIcon, FileIcon, InfoIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { PdfPasswordProtector } from "@/components/pdf-password-protector";

export const metadata: Metadata = {
  title: "Protect PDF Files | ScanPro - PDF Tools",
  description: "Secure your PDF documents with password protection and set permissions to control what others can do with your files.",
};

export default function ProtectPDFPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <div className="mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <LockIcon className="h-8 w-8 text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Password Protect PDF
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
          Secure your PDF documents with password protection and custom access permissions
        </p>
      </div>

      {/* Main Tool Card */}
      <div className="mb-12">
        <PdfPasswordProtector />
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">How to Protect Your PDF</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Upload</h3>
            <p className="text-sm text-muted-foreground">
              Upload the PDF file you want to protect with a password.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Set Security Options</h3>
            <p className="text-sm text-muted-foreground">
              Create a password and customize permissions for printing, copying, and editing.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Download</h3>
            <p className="text-sm text-muted-foreground">
              Download your password-protected PDF file ready for secure sharing.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-12 p-6 bg-muted/30 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Protect Your PDFs?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
              <LockIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">Confidentiality</h3>
              <p className="text-sm text-muted-foreground">
                Ensure that only authorized individuals with the password can open and view your sensitive documents.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">Controlled Access</h3>
              <p className="text-sm text-muted-foreground">
                Set specific permissions to determine what recipients can do with your document, like printing or editing.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">Authorized Distribution</h3>
              <p className="text-sm text-muted-foreground">
                Control who can access your document when sharing contracts, research, or intellectual property.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">Document Expiration</h3>
              <p className="text-sm text-muted-foreground">
                Password protection adds an extra layer of security for time-sensitive documents that shouldn't be accessible indefinitely.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Explained Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Understanding PDF Security</h2>
        <div className="border rounded-lg p-6 bg-card">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                User Password vs. Owner Password
              </h3>
              <p className="text-sm text-muted-foreground">
                <strong>User Password:</strong> Required to open the document. Anyone without this password cannot view the content.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Owner Password:</strong> Controls permissions. With our tool, we set both passwords to be the same for simplicity.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                </svg>
                Encryption Levels
              </h3>
              <p className="text-sm text-muted-foreground">
                <strong>128-bit AES:</strong> Provides good security and is compatible with Acrobat Reader 7 and later versions.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>256-bit AES:</strong> Offers stronger security but requires Acrobat Reader X (10) or later versions.
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
                <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7H2Z"></path>
                <path d="M6 8v6"></path>
                <path d="M18 8v6"></path>
                <path d="M12 8v8"></path>
              </svg>
              Permission Controls
            </h3>
            <div className="grid md:grid-cols-3 gap-4 mt-3">
              <div className="border rounded-md p-3">
                <div className="font-medium mb-1">Printing</div>
                <p className="text-xs text-muted-foreground">Controls whether the document can be printed and at what quality level.</p>
              </div>
              <div className="border rounded-md p-3">
                <div className="font-medium mb-1">Content Copying</div>
                <p className="text-xs text-muted-foreground">Controls whether text and images can be selected and copied to the clipboard.</p>
              </div>
              <div className="border rounded-md p-3">
                <div className="font-medium mb-1">Editing</div>
                <p className="text-xs text-muted-foreground">Controls document modifications, including annotations, form filling, and content changes.</p>
              </div>
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
              What's the difference between the encryption levels?
            </h3>
            <p className="text-sm text-muted-foreground">
              We offer 128-bit and 256-bit AES encryption. 128-bit is compatible with older PDF readers (Acrobat 7 and later), 
              while 256-bit provides stronger security but requires newer readers (Acrobat X and later).
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Can I remove the password protection later?
            </h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can use our Unlock PDF tool to remove password protection from your PDF files, but you'll need to know 
              the current password to do so.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              How secure is the password protection?
            </h3>
            <p className="text-sm text-muted-foreground">
              Our tool uses industry-standard AES encryption. The security depends on the strength of your password and the encryption 
              level you choose. We recommend using strong, unique passwords with a mix of characters.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Will password protection affect the PDF content or quality?
            </h3>
            <p className="text-sm text-muted-foreground">
              No, password protection only adds security to your document and doesn't alter the content, layout, or quality of 
              your PDF in any way.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Can I protect multiple PDFs at once?
            </h3>
            <p className="text-sm text-muted-foreground">
              Currently, our tool processes one PDF at a time. For batch processing of multiple files, consider our API or 
              premium solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Best Practices Section */}
      <div className="mb-12 bg-muted/30 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Password Protection Best Practices</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-lg font-medium mb-3 text-primary">Do's</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-0.5">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Use strong, unique passwords with a mix of letters, numbers, and special characters
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-0.5">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Store passwords securely in a password manager
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-0.5">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Share passwords through secure channels separate from the PDF
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-0.5">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Use 256-bit encryption for highly sensitive documents
              </li>
            </ul>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-lg font-medium mb-3 text-destructive">Don'ts</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-2 mt-0.5">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                Use simple, easy-to-guess passwords like "password123" or "1234"
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-2 mt-0.5">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                Send the password in the same email as the PDF
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-2 mt-0.5">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                Use the same password for all your protected PDFs
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-2 mt-0.5">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                Rely solely on password protection for extremely sensitive information
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Tools Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Related PDF Security Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          <Link href="/sign" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
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
          <Link href="/redact" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                  <line x1="9" x2="15" y1="15" y2="9"></line>
                </svg>
              </div>
              <span className="text-sm font-medium">Redact PDF</span>
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