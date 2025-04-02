import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  WatermarkHeaderSection,
  HowToWatermarkSection,
  WatermarkFaqSection,
  RelatedToolsSection
} from "./watermark-content";
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';
import { generatePageSeoMetadata } from "@/lib/seo/schemas";
import { SEO } from "@/components/SEO";
import { WatermarkTool } from "@/components/watermark-tool";


export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as any) ? paramLang : "en";

  // Use the new SEO metadata generator
  return generatePageSeoMetadata(lang as any, { 
    translationPrefix: 'watermarkPdf', 
    canonicalPath: 'watermark-pdf' 
  }); 
  
}


export default function WatermarkPDFPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <WatermarkHeaderSection />
   {/* Main Tool Section with Tabs */}
      <div className="mb-12">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="text">Text Watermark</TabsTrigger>
            <TabsTrigger value="image">Image Watermark</TabsTrigger>
          </TabsList>
          <TabsContent value="text">
            <WatermarkTool type="text" />
          </TabsContent>
          <TabsContent value="image">
            <WatermarkTool type="image" />
          </TabsContent>
        </Tabs>
      </div>
     

      {/* How It Works */}
      <HowToWatermarkSection />

      {/* FAQ Section */}
      <WatermarkFaqSection />

      {/* Related Tools Section */}
      <RelatedToolsSection />
    </div>
  );
}