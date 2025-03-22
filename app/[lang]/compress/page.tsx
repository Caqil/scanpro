// app/compress/page.tsx
import CompressPageContent from "@/app/compress/compress-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress PDF Files | ScanPro - PDF Tools",
  description: "Reduce PDF file size while maintaining quality with our free compression tool.",
};

export default function CompressPDFPage() {
  return <CompressPageContent />;
}