'use client'
import { PdfMerger } from "@/components/pdf-merger"; 
import { useLanguageStore } from "@/src/store/store";

export default function ClientMergePDFContent() {
  const { t } = useLanguageStore();
  
  return (
    <div>
      <PdfMerger />
    </div>
  );
}