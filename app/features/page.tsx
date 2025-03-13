import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileTextIcon,
  ImageIcon,
  TableIcon,
  IdCardIcon,
  CodeIcon,
  LockClosedIcon,
  EyeOpenIcon,
  ReaderIcon,
  UpdateIcon,
  DownloadIcon,
  MixerHorizontalIcon,
  LayersIcon,
} from "@radix-ui/react-icons";

export const metadata = {
  title: "Features | PDF Converter Pro",
  description: "Explore the full range of features offered by our PDF converter",
};

export default function FeaturesPage() {
  return (
    <div className="container max-w-6xl py-12 md:py-16 lg:py-24">
      <div className="mx-auto flex flex-col items-center text-center mb-12 md:mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Advanced Features
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[800px]">
          Our PDF converter leverages LibreOffice technology to provide high-quality conversions
          with perfect formatting and layout preservation.
        </p>
      </div>

      {/* Feature Categories */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<FileTextIcon className="h-10 w-10" />}
          title="Document Formats"
          description="Convert PDFs to a variety of document formats with perfect formatting"
          features={[
            "DOCX - Modern Word documents",
            "DOC - Legacy Word documents",
            "RTF - Rich Text Format",
            "ODT - OpenDocument Text",
            "TXT - Plain text extraction"
          ]}
        />

        <FeatureCard
          icon={<TableIcon className="h-10 w-10" />}
          title="Spreadsheets & Data"
          description="Transform PDFs containing tables into editable spreadsheets"
          features={[
            "XLSX - Excel spreadsheets",
            "CSV - Comma-separated values",
            "Table structure preservation",
            "Cell formatting retention",
            "Multi-sheet support"
          ]}
        />

        <FeatureCard
          icon={<ImageIcon className="h-10 w-10" />}
          title="Image Conversion"
          description="Extract high-quality images from your PDF documents"
          features={[
            "JPG - Compressed images",
            "PNG - Lossless image quality",
            "Resolution control",
            "Quality settings",
            "First page or all pages conversion"
          ]}
        />

        <FeatureCard
          icon={<CodeIcon className="h-10 w-10" />}
          title="Web Formats"
          description="Convert PDFs to web-friendly formats for online publishing"
          features={[
            "HTML - Web pages",
            "CSS styling preservation",
            "Mobile-friendly output",
            "Embedded images",
            "Semantic structure where possible"
          ]}
        />

        <FeatureCard
          icon={<IdCardIcon className="h-10 w-10" />}
          title="OCR Technology"
          description="Optical Character Recognition for scanned documents"
          features={[
            "Text extraction from images",
            "Support for multiple languages",
            "Maintains original formatting",
            "High accuracy recognition",
            "Searchable output documents"
          ]}
        />

        <FeatureCard
          icon={<LayersIcon className="h-10 w-10" />}
          title="Presentations"
          description="Convert PDF presentations back to editable formats"
          features={[
            "PPTX - PowerPoint presentations",
            "Slide layout preservation",
            "Graphics and charts conversion",
            "Animation support where possible",
            "Speaker notes extraction"
          ]}
        />

        <FeatureCard
          icon={<LockClosedIcon className="h-10 w-10" />}
          title="Security Features"
          description="Handle protected PDFs and ensure your data remains secure"
          features={[
            "Password-protected PDF support",
            "Secure file handling",
            "Automatic file cleanup",
            "No data retention",
            "Private conversion process"
          ]}
        />

        <FeatureCard
          icon={<MixerHorizontalIcon className="h-10 w-10" />}
          title="Advanced Settings"
          description="Fine-tune your conversions with advanced options"
          features={[
            "Quality control for images",
            "OCR language selection",
            "Output formatting options",
            "Custom conversion parameters",
            "Batch processing settings"
          ]}
        />

        <FeatureCard
          icon={<ReaderIcon className="h-10 w-10" />}
          title="Cloud API"
          description="Integrate PDF conversion capabilities into your applications"
          features={[
            "RESTful API access",
            "Simple integration",
            "High-volume processing",
            "Custom webhooks",
            "Comprehensive documentation"
          ]}
        />
      </div>

      {/* Comparison Table */}
      <div className="mt-20 mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">How We Compare</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="p-3 text-left font-medium">Feature</th>
                <th className="p-3 text-center font-medium">PDF Converter Pro</th>
                <th className="p-3 text-center font-medium">Basic Converters</th>
                <th className="p-3 text-center font-medium">Premium Solutions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <ComparisonRow 
                feature="Format Support" 
                ours="15+ formats" 
                basic="3-5 formats" 
                premium="10+ formats"
              />
              <ComparisonRow 
                feature="OCR Technology" 
                ours="Included" 
                basic="Not available" 
                premium="Premium feature"
              />
              <ComparisonRow 
                feature="Conversion Quality" 
                ours="High (LibreOffice based)" 
                basic="Basic" 
                premium="High"
              />
              <ComparisonRow 
                feature="Batch Processing" 
                ours="Yes" 
                basic="Limited" 
                premium="Yes"
              />
              <ComparisonRow 
                feature="API Access" 
                ours="Included" 
                basic="Not available" 
                premium="Additional cost"
              />
              <ComparisonRow 
                feature="Price" 
                ours="Free & Premium options" 
                basic="Free with limitations" 
                premium="Expensive subscriptions"
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to start converting?</h3>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Try our PDF converter today and experience the power of high-quality, accurate PDF conversions.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/#converter">
            <Button size="lg">Start Converting</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg">View Pricing</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  features 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  features: string[] 
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="p-2 w-fit rounded-lg bg-primary/10 mb-3">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <div className="mr-2 mt-1 text-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ComparisonRow({ 
  feature, 
  ours, 
  basic, 
  premium 
}: { 
  feature: string; 
  ours: string; 
  basic: string; 
  premium: string 
}) {
  return (
    <tr className="border-b">
      <td className="p-3 font-medium">{feature}</td>
      <td className="p-3 text-center bg-primary/5">{ours}</td>
      <td className="p-3 text-center">{basic}</td>
      <td className="p-3 text-center">{premium}</td>
    </tr>
  );
}