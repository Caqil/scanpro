"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Stamp, 
  FileText, 
  Image, 
  RefreshCcw, 
  Eye, 
  Info 
} from "lucide-react";
import { useLanguageStore } from "@/src/store/store";
import { WatermarkTool } from "@/components/watermark-tool";

export function WatermarkClient() {
  const { t } = useLanguageStore();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("text");
  
  // Handle URL parameters for direct access to specific watermark type
  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "text" || type === "image") {
      setActiveTab(type);
    }
  }, [searchParams]);

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stamp className="h-5 w-5 text-primary" />
          {t('watermarkPdf.title') || "Add Watermark to PDF"}
        </CardTitle>
        <CardDescription>
          {t('watermarkPdf.description') || "Add custom text or image watermarks to your PDF documents"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('watermarkPdf.textWatermark') || "Text Watermark"}
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              {t('watermarkPdf.imageWatermark') || "Image Watermark"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text">
            <WatermarkTool type="text" />
          </TabsContent>
          
          <TabsContent value="image">
            <WatermarkTool type="image" />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>
            {t('watermarkPdf.privacyNote') || "Your files are processed securely. All uploads are automatically deleted after processing."}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}