// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/file-uploader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PdfToolCard } from "@/components/pdf-tool-card";
import { FeatureCard } from "@/components/feature-card";
import { 
  FileIcon, 
  FileTextIcon, 
  ImageIcon, 
  TableIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowDownIcon,
  PencilIcon,
  LightbulbIcon,
  FileCheck2,
} from "lucide-react";

// Popular tools to showcase
const popularTools = [
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Easily convert your PDF files into easy to edit DOC and DOCX documents.",
    icon: <FileTextIcon className="h-6 w-6 text-blue-500" />,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    href: "/convert/pdf-to-docx"  // Updated URL
  },
  {
    id: "pdf-to-excel",
    name: "PDF to Excel",
    description: "Pull data straight from PDFs into Excel spreadsheets in a few short seconds.",
    icon: <TableIcon className="h-6 w-6 text-green-500" />,
    iconBg: "bg-green-100 dark:bg-green-900/30",
    href: "/convert/pdf-to-xlsx"  // Updated URL
  },
  {
    id: "merge-pdf",
    name: "Merge PDF",
    description: "Combine PDFs in the order you want with the easiest PDF merger available.",
    icon: <ArrowRightIcon className="h-6 w-6 text-red-500" />,
    iconBg: "bg-red-100 dark:bg-red-900/30",
    href: "/merge"
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce file size while optimizing for maximal PDF quality.",
    icon: <ArrowDownIcon className="h-6 w-6 text-green-500" />,
    iconBg: "bg-green-100 dark:bg-green-900/30",
    href: "/compress"
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    description: "Separate one page or a whole set for easy conversion into independent PDF files.",
    icon: <ArrowLeftIcon className="h-6 w-6 text-red-500" />,
    iconBg: "bg-red-100 dark:bg-red-900/30",
    href: "/split"
  },
  {
    id: "edit-pdf",
    name: "Edit PDF",
    description: "Add text, images, shapes or freehand annotations to a PDF document.",
    icon: <PencilIcon className="h-6 w-6 text-purple-500" />,
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    href: "/edit",
    isNew: true
  },
  { 
    id: "ocr",
    name: "OCR", 
    href: "/ocr", 
    icon: <FileCheck2 className="h-5 w-5 text-blue-500" />,
    description: "Extract text from scanned documents",
    iconBg: "bg-green-100 dark:bg-yellow-900/30",
    isNew: true
  }
];

export default function Home() {
  return (
    <div>
      {/* Hero section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Badge variant="outline" className="w-fit">
                  <LightbulbIcon className="mr-1 h-3 w-3" />
                  Fast & Reliable
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Convert PDFs to Any Format
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Our powerful PDF converter uses LibreOffice technology to transform your PDF files into various formats with perfect formatting. Free, fast, and secure.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="#converter" className="inline-flex">
                  <Button size="lg">Convert Now</Button>
                </Link>
                <Link href="/tools" className="inline-flex">
                  <Button size="lg" variant="outline">View All Tools</Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto flex flex-col justify-center">
              <div className="rounded-lg border bg-card p-2">
                <div className="grid gap-2">
                  <div className="grid grid-cols-5 gap-2">
                    {["PDF", "DOCX", "XLSX", "JPG", "HTML"].map((format) => (
                      <div 
                        key={format}
                        className="flex aspect-square items-center justify-center rounded-md border bg-background p-2 text-sm font-medium"
                      >
                        {format}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center rounded-md border bg-background p-2">
                    <ArrowsAnimation />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Popular PDF Tools</h2>
            <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Quickly convert, compress, edit and more with our most popular tools
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool) => (
              <PdfToolCard
                key={tool.id}
                id={tool.id}
                name={tool.name}
                description={tool.description}
                icon={tool.icon}
                iconBg={tool.iconBg}
                href={tool.href}
                isNew={tool.isNew}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <Link href="/tools">
              <Button variant="outline" size="lg">
                View All PDF Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Converter section */}
      <section id="converter" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Start Converting</h2>
            <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Upload your PDF and select the format you want to convert to
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-1">
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload & Convert</TabsTrigger>
                    <TabsTrigger value="api">API Integration</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="mt-6">
                    <FileUploader />
                  </TabsContent>
                  <TabsContent value="api" className="mt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Integrate with our API</h3>
                      <p className="text-muted-foreground">
                        Use our REST API to convert PDFs programmatically in your application
                      </p>
                      <div className="rounded-md bg-muted p-4">
                        <pre className="text-sm text-left overflow-auto">
                          <code>
{`curl -X POST \\
  -F "pdf=@document.pdf" \\
  -F "format=docx" \\
  https://scanpro.cc/api/convert`}
                          </code>
                        </pre>
                      </div>
                      <div className="flex justify-end">
                        <Link href="/api-docs">
                          <Button variant="outline">View API Docs</Button>
                        </Link>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
            <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to convert and manage your PDF files
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            <FeatureCard 
              icon={<FileTextIcon className="h-10 w-10" />}
              title="Document Formats"
              description="Convert to DOCX, DOC, RTF, ODT and more with perfect formatting and layout preservation"
            />
            <FeatureCard 
              icon={<TableIcon className="h-10 w-10" />}
              title="Spreadsheets"
              description="Transform PDFs to XLSX, CSV and other spreadsheet formats with proper cell structures"
            />
            <FeatureCard 
              icon={<ImageIcon className="h-10 w-10" />}
              title="Images"
              description="Extract high-quality JPG and PNG images from your PDF files with resolution control"
            />
            <FeatureCard 
              icon={<FileIcon className="h-10 w-10" />}
              title="Web Formats"
              description="Convert to HTML and other web-friendly formats for online publishing"
            />
            <FeatureCard 
              icon={<FileIcon className="h-10 w-10" />}
              title="OCR Technology"
              description="Extract text from scanned documents with advanced Optical Character Recognition"
            />
            <FeatureCard 
              icon={<LightbulbIcon className="h-10 w-10" />}
              title="Batch Processing"
              description="Convert multiple PDFs at once to save time with our efficient batch processing"
            />
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Convert?</h2>
            <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Transform your PDFs into any format you need, completely free.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="#converter">
                <Button size="lg">Start Converting</Button>
              </Link>
              <Link href="/tools">
                <Button size="lg" variant="outline">Explore All Tools</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ArrowsAnimation() {
  return (
    <div className="flex items-center space-x-2">
      <div className="animate-bounce delay-100">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="m17 8-4-4-4 4" />
          <path d="M3 12h18" />
          <path d="m17 16-4 4-4-4" />
        </svg>
      </div>
      <div className="animate-bounce delay-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="m17 8-4-4-4 4" />
          <path d="M3 12h18" />
          <path d="m17 16-4 4-4-4" />
        </svg>
      </div>
      <div className="animate-bounce delay-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="m17 8-4-4-4 4" />
          <path d="M3 12h18" />
          <path d="m17 16-4 4-4-4" />
        </svg>
      </div>
    </div>
  );
}