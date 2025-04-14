import { Metadata } from "next";
import { PdfChat } from "@/components/pdf-chat";
import { Suspense } from "react";
import { SUPPORTED_LANGUAGES } from "@/src/lib/i18n/config";
import { generatePageSeoMetadata } from "@/lib/seo/schemas";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any)
    ? paramLang
    : "en";

  // Use the SEO metadata generator
  return generatePageSeoMetadata(lang as any, {
    translationPrefix: "pdfChat",
    canonicalPath: "ask-pdf",
  });
}

export default function AskPdfPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <div className="mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <MessageSquareIcon className="h-8 w-8 text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Ask Anything PDF Chat
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
          Upload a PDF document and chat with AI about its contents
        </p>
      </div>

      <div className="mb-12">
        <Suspense fallback={<div>Loading...</div>}>
          <PdfChat />
        </Suspense>
      </div>

      <div className="mb-12 bg-muted/30 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Upload Your PDF</h3>
            <p className="text-sm text-muted-foreground">
              Simply drag and drop your PDF file into the upload area or click
              to browse your files.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">
              AI Processes the Content
            </h3>
            <p className="text-sm text-muted-foreground">
              Our AI quickly analyzes the entire document to understand its
              content and structure.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Ask Questions</h3>
            <p className="text-sm text-muted-foreground">
              Ask anything about the document and get accurate answers drawing
              from the PDF content.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-12 bg-muted/30 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          What You Can Ask
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="bg-background rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
              <SummaryIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">Get Summaries</h3>
              <p className="text-sm text-muted-foreground">
                Ask for summaries of specific sections or the entire document.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-background rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
              <SearchIcon className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">Find Information</h3>
              <p className="text-sm text-muted-foreground">
                Ask where specific information appears in the document.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-background rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
              <ListIcon className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">Extract Key Points</h3>
              <p className="text-sm text-muted-foreground">
                Ask for lists of key points, dates, names, or other important
                information.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-background rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
              <ExplainIcon className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">Get Explanations</h3>
              <p className="text-sm text-muted-foreground">
                Ask for explanations of complex concepts mentioned in the
                document.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              What types of PDFs can I use?
            </h3>
            <p className="text-sm text-muted-foreground">
              You can use any PDF file that contains text content. The system
              works best with digital PDFs, but can also process scanned
              documents with readable text.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Is my PDF data secure?
            </h3>
            <p className="text-sm text-muted-foreground">
              Yes, your PDF is processed securely. We don't permanently store
              the content of your documents, and all processing is done in a
              secure environment.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Are there size limitations?
            </h3>
            <p className="text-sm text-muted-foreground">
              Yes, currently the maximum file size is 50MB. For very large
              documents, you may want to split them into smaller parts for
              better processing.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <InfoIcon className="h-4 w-4 mr-2 text-primary" />
              Will the AI understand tables and charts?
            </h3>
            <p className="text-sm text-muted-foreground">
              The AI can extract and interpret text from tables, but
              understanding complex charts or diagrams may be limited. It works
              best with textual content.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-muted-foreground">
        <h2 className="text-2xl font-bold mb-4">
          Enhance Your Document Analysis
        </h2>
        <p>
          Our "Ask Anything" feature leverages advanced AI to help you quickly
          extract insights from PDF documents. Whether you're analyzing research
          papers, legal contracts, technical manuals, or any text-heavy
          document, this tool helps you find the information you need without
          spending hours reading through pages of content.
        </p>
        <p className="mt-4">
          The AI assistant can understand the context of your questions and
          provide relevant information from the document. It can identify key
          sections, summarize content, explain complex terms, and even find
          specific details like dates, amounts, or clauses that might be buried
          deep within the text.
        </p>
        <p className="mt-4">
          This feature is particularly useful for professionals who need to
          quickly analyze documents, students researching academic papers, or
          anyone who wants to save time by getting straight to the important
          information in their PDFs.
        </p>
        <p className="mt-4">
          Try it now by uploading your PDF and asking a question!
        </p>
      </div>
    </div>
  );
}

// Icons for the page
function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function SummaryIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <line x1="8" x2="16" y1="8" y2="8" />
      <line x1="8" x2="16" y1="12" y2="12" />
      <line x1="8" x2="12" y1="16" y2="16" />
    </svg>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ListIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}

function ExplainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
