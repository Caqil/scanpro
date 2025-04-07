import { Metadata } from "next";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';
import { generatePageSeoMetadata } from "@/lib/seo/schemas";
import { RemoveWatermarkHeader } from "./remove-watermark-content";
import { RemoveWatermarkClient } from "@/components/remove-watermark";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";

  // Use the SEO metadata generator
  return generatePageSeoMetadata(lang as any, { 
    translationPrefix: 'removeWatermark', 
    canonicalPath: 'remove-watermark' 
  }); 
}

export default function RemoveWatermarkPage() {
  return (
    <div className="container max-full">
      <RemoveWatermarkHeader />
      
      {/* Main Tool Section */}
      <div className="mb-12">
        <RemoveWatermarkClient />
      </div>
      
      {/* How It Works Section */}
      <RemoveWatermarkHowTo />
      
      {/* Benefits Section */}
      <RemoveWatermarkBenefits />
      
      {/* FAQ Section */}
      <RemoveWatermarkFaq />
      
      {/* Related Tools Section */}
      <RemoveWatermarkRelatedTools />
    </div>
  );
}

// These components can be moved to remove-watermark-content.tsx in a real implementation
function RemoveWatermarkHowTo() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">How to Remove Watermarks from PDFs</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="font-bold">1</span>
          </div>
          <h3 className="text-lg font-medium mb-2">Upload Your PDF</h3>
          <p className="text-sm text-muted-foreground">Select and upload the PDF document with watermarks you want to remove</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="font-bold">2</span>
          </div>
          <h3 className="text-lg font-medium mb-2">Choose Removal Options</h3>
          <p className="text-sm text-muted-foreground">Select the type of watermark and customize the removal settings for best results</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="font-bold">3</span>
          </div>
          <h3 className="text-lg font-medium mb-2">Download Clean PDF</h3>
          <p className="text-sm text-muted-foreground">Process and download your PDF with watermarks removed or minimized</p>
        </div>
      </div>
    </div>
  );
}

function RemoveWatermarkBenefits() {
  return (
    <div className="mb-12 p-6 bg-muted/30 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Benefits of Watermark Removal</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex gap-4">
          <div className="bg-background rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
              <path d="M18 6 7 17l-5-5"></path>
              <path d="m22 10-7.5 7.5L13 16"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-1">Clean Documents</h3>
            <p className="text-sm text-muted-foreground">Get distraction-free documents for better readability and professional appearance</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-background rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-1">Improved Privacy</h3>
            <p className="text-sm text-muted-foreground">Remove distracting or private information before sharing documents</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-background rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
              <path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"></path>
              <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"></path>
              <path d="M18 22V5l-6-3-6 3v17"></path>
              <path d="M12 7v5"></path>
              <path d="M10 9h4"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-1">Archive Quality</h3>
            <p className="text-sm text-muted-foreground">Create clean copies of documents for archiving or repurposing</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-background rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
              <path d="M22 12H2"></path>
              <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
              <line x1="6" x2="6" y1="16" y2="16"></line>
              <line x1="10" x2="10" y1="16" y2="16"></line>
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-1">File Optimization</h3>
            <p className="text-sm text-muted-foreground">Removing watermarks can reduce file size and improve document quality</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RemoveWatermarkFaq() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-primary">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <path d="M12 17h.01"></path>
            </svg>
            Can all types of watermarks be removed?
          </h3>
          <p className="text-sm text-muted-foreground">Our tool works best with standard text and image watermarks. Success varies based on how the watermark was applied. Simple transparent watermarks are easier to remove than complex, integrated ones.</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-primary">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <path d="M12 17h.01"></path>
            </svg>
            Will this damage my PDF document?
          </h3>
          <p className="text-sm text-muted-foreground">Our tool is designed to preserve document content. However, the process may slightly affect formatting in some cases. We recommend keeping a backup of your original file and using the 'Preserve Form Fields' option if your document contains forms.</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-primary">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <path d="M12 17h.01"></path>
            </svg>
            Which method should I choose?
          </h3>
          <p className="text-sm text-muted-foreground">Start with the 'Standard' method for most watermarks. If results aren't satisfactory, try the 'Advanced' method which uses more intensive processing techniques but may take longer. For text watermarks, providing the exact text pattern can improve results.</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-primary">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <path d="M12 17h.01"></path>
            </svg>
            Is my PDF secure during processing?
          </h3>
          <p className="text-sm text-muted-foreground">Yes, all files are processed securely on our servers and automatically deleted after 24 hours. We don't store or access the content of your documents beyond what's needed for processing.</p>
        </div>
      </div>
    </div>
  );
}

function RemoveWatermarkRelatedTools() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Related PDF Tools</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a href="/edit-pdf" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
              </svg>
            </div>
            <span className="text-sm font-medium">Edit PDF</span>
          </div>
        </a>
        <a href="/watermark-pdf" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
              </svg>
            </div>
            <span className="text-sm font-medium">Add Watermark</span>
          </div>
        </a>
        <a href="/protect-pdf" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <span className="text-sm font-medium">Protect PDF</span>
          </div>
        </a>
        <a href="/pdf-tools" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </div>
            <span className="text-sm font-medium">All PDF Tools</span>
          </div>
        </a>
      </div>
      <div className="text-center mt-6">
        <a href="/pdf-tools">
          <button className="px-4 py-2 border rounded-md text-sm font-medium">View All Tools</button>
        </a>
      </div>
    </div>
  );
}