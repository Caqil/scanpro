import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/file-uploader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  CheckIcon, 
  FileTextIcon, 
  ImageIcon, 
  TableIcon,
  IdCardIcon, 
  CodeIcon,
  LightningBoltIcon
} from "@radix-ui/react-icons";

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
                  <LightningBoltIcon className="mr-1 h-3 w-3" />
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
                <Link href="/features" className="inline-flex">
                  <Button size="lg" variant="outline">Learn More</Button>
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

      {/* Converter section */}
      <section id="converter" className="w-full py-12 md:py-24 lg:py-32">
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
  https://pdfconverter.pro/api/convert`}
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
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
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
              icon={<CodeIcon className="h-10 w-10" />}
              title="Web Formats"
              description="Convert to HTML and other web-friendly formats for online publishing"
            />
            <FeatureCard 
              icon={<IdCardIcon className="h-10 w-10" />}
              title="OCR Technology"
              description="Extract text from scanned documents with advanced Optical Character Recognition"
            />
            <FeatureCard 
              icon={<LightningBoltIcon className="h-10 w-10" />}
              title="Batch Processing"
              description="Convert multiple PDFs at once to save time with our efficient batch processing"
            />
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
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
              <Link href="/pricing">
                <Button size="lg" variant="outline">View Plans</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full border p-3 group-hover:border-primary group-hover:text-primary transition-colors">
          {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
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