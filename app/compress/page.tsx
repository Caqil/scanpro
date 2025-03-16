// app/compress/page.tsx
import { PdfCompressor } from "@/components/pdf-compressor";
import { cn } from "@/lib/utils";
import { DownloadIcon, FileIcon, MailIcon } from "lucide-react";
import { Metadata } from "next";

// Metadata for the page
export const metadata: Metadata = {
  title: "PDF Compressor | PDF Converter Pro",
  description: "Compress PDF files to reduce file size while maintaining quality",
};

export default function CompressPage() {
  return (
    <main className="container max-w-6xl px-4 py-12 md:py-16 lg:py-24">
      {/* Header Section */}
      <header className="mx-auto max-w-3xl text-center mb-12 md:mb-16 space-y-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4 animate-in fade-in">
          <FileIcon className="w-4 h-4" />
          <span>PDF Tools</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-in slide-in-from-top-4">
          PDF Compressor
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed animate-in slide-in-from-bottom-2">
          Reduce PDF file sizes effortlessly while preserving document quality
        </p>
      </header>

      {/* Main Content */}
      <div className="grid gap-16">
        {/* Compression Tool Card */}
        <section className="mx-auto w-full max-w-4xl">
          <div className="bg-card rounded-xl shadow-lg p-6 border border-border/50">
            <PdfCompressor />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-gradient-to-b from-muted/20 to-muted/5 rounded-xl">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Compress Your PDFs?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Optimize your documents for easier sharing, storage, and faster handling
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
            <FeatureCard
              icon={<DownloadIcon className="h-6 w-6 text-primary" />}
              title="Lightning-Fast Uploads"
              description="Share compressed PDFs quickly with faster upload speeds"
            />
            <FeatureCard
              icon={<MailIcon className="h-6 w-6 text-primary" />}
              title="Email Friendly"
              description="Fit within email size limits without compromising quality"
            />
            <FeatureCard
              icon={<FileIcon className="h-6 w-6 text-primary" />}
              title="Storage Efficient"
              description="Maximize space on your devices and cloud storage"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-8">
          <div className="inline-block bg-card rounded-lg p-6 shadow-sm border border-border/20">
            <p className="text-muted-foreground mb-4">
              Ready to optimize your PDFs?
            </p>
            <button
              className={cn(
                "bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium",
                "hover:bg-primary/90 transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary/50"
              )}
            >
              Start Compressing Now
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

// Feature Card Component with TypeScript
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative p-6 bg-card rounded-lg shadow-sm border border-border/20",
        "hover:shadow-md transition-all duration-300"
      )}
    >
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
      <div className="relative flex flex-col items-center text-center">
        <div
          className={cn(
            "h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4",
            "transform group-hover:scale-110 transition-transform duration-200"
          )}
        >
          {icon}
        </div>
        <h3
          className={cn(
            "text-xl font-semibold mb-2 text-foreground",
            "group-hover:text-primary transition-colors duration-200"
          )}
        >
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}