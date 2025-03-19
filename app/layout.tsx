// app/layout.tsx (updated)
import "./globals.css";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";


export const metadata: Metadata = {
  title: {
    default: "ScanPro - All-in-One PDF Converter, Editor & Tools | Free Online",
    template: "%s | ScanPro PDF Tools"
  },
  description: "Powerful free online PDF tools: Convert to/from Word, Excel, PPG; Compress, Merge, Split, Edit, Add Watermark, OCR text extraction, Sign & Protect PDFs. No installation required. 100% secure.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://scanpro.cc"),
  keywords: [
    "PDF converter", "PDF to Word", "Word to PDF", "PDF to Excel", "Excel to PDF",
    "PDF to JPG", "JPG to PDF", "PDF editor", "edit PDF online", "free PDF editor",
    "compress PDF", "reduce PDF size", "PDF compression tool", "merge PDF files",
    "combine PDF documents", "split PDF", "extract PDF pages", "rotate PDF pages",
    "add watermark to PDF", "PDF signing tool", "electronic signature PDF",
    "OCR PDF", "text extraction PDF", "PDF tools", "PDF utilities", "online PDF editor",
    "free PDF converter", "no-installation PDF editor", "secure PDF tools",
    "PDF password protection", "unlock PDF", "PDF processing", "document conversion"
  ],
  authors: [{ name: "ScanPro Team" }],
  creator: "ScanPro",
  publisher: "ScanPro",
  category: "PDF Tools",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://scanpro.cc",
    title: "ScanPro - All-in-One PDF Converter, Editor & Tools Suite",
    description: "Free online PDF tools with no installation: Convert PDF to Word/Excel/JPG, compress, merge, split, edit, watermark, OCR, sign & protect your PDF files securely.",
    siteName: "ScanPro PDF Tools",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ScanPro - Comprehensive PDF Tools Suite"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ScanPro - Complete PDF Management Tools | Free Online",
    description: "Instantly convert, edit, compress, merge, split, watermark, sign & protect PDF files online. No installation needed, 100% secure, free PDF utilities.",
    images: ["/og-image.png"],
    creator: "@scanprotools"
  },
  applicationName: "ScanPro PDF Tools",
  manifest: '/manifest.json',
  alternates: {
    canonical: "https://scanpro.cc",
    languages: {
      'en-US': 'https://scanpro.cc',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <div className="flex-1 mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
    {children}
  </div>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}