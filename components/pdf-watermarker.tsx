"use client";

import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useLanguageStore } from "@/src/store/store";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import {
  PanelBottomIcon,
  Stamp,
  TypeIcon,
  UploadIcon,
  XIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LoaderIcon,
  DownloadIcon,
  RefreshCwIcon,
  FileTextIcon,
  InfoIcon,
  RotateCwIcon,
  PlusIcon,
  ImageIcon,
} from "lucide-react";

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Type definitions
export type WatermarkType = "text" | "image";
export type WatermarkPosition = "center" | "tile" | "custom";

interface WatermarkOptions {
  text?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  opacity?: number;
  rotation?: number;
  position?: WatermarkPosition;
  image?: string | null;
  scale?: number;
  pages?: string;
  customPages?: string;
}

interface PdfPage {
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

interface Props {
  initialType?: WatermarkType;
}

/**
 * PDF Watermarker Component
 * A modern interface for adding watermarks to PDF documents with text or image options.
 */
export function PdfWatermarker({ initialType = "text" }: Props) {
  const { t } = useLanguageStore();
  
  // Responsive state
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  
  // File and processing state
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PdfPage[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [watermarkedPdfUrl, setWatermarkedPdfUrl] = useState<string>("");
  
  // Watermark options
  const [watermarkType, setWatermarkType] = useState<WatermarkType>(initialType);
  const [watermarkOptions, setWatermarkOptions] = useState<WatermarkOptions>({
    text: "CONFIDENTIAL",
    textColor: "#FF0000",
    fontSize: 48,
    fontFamily: "Arial",
    opacity: 30,
    rotation: 45,
    position: "center",
    image: null,
    scale: 50,
    pages: "all",
    customPages: "",
  });
  
  // UI state
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [previewX, setPreviewX] = useState<number>(50);
  const [previewY, setPreviewY] = useState<number>(50);
  const [isDraggingPreview, setIsDraggingPreview] = useState<boolean>(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ distance: number | null }>({ distance: null });

  // Check for mobile view on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Handle PDF file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const uploadedFile = files[0];
    if (uploadedFile.type !== "application/pdf") {
      toast.error(t("ui.error") || "Invalid file type. Please upload a PDF.");
      return;
    }

    setFile(uploadedFile);
    setWatermarkedPdfUrl("");
    setCurrentPage(0);
    processPdf(uploadedFile);
  };

  // Process the PDF to get page information
  const processPdf = async (pdfFile: File) => {
    setProcessing(true);
    setProgress(0);

    try {
      const fileUrl = URL.createObjectURL(pdfFile);
      const pdf = await pdfjs.getDocument(fileUrl).promise;
      const numPages = pdf.numPages;
      const newPages: PdfPage[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });

        // Store the original dimensions for proper scaling
        newPages.push({
          width: viewport.width,
          height: viewport.height,
          originalWidth: viewport.width,
          originalHeight: viewport.height,
        });

        setProgress(Math.floor((i / numPages) * 100));
      }

      setPages(newPages);
      setProgress(100);
      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      console.error("Error processing PDF:", error);
      toast.error(t("watermarkPdf.messages.error") || "Error processing PDF");
    } finally {
      setProcessing(false);
    }
  };

  // Handle image upload for watermarks
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const uploadedFile = files[0];
    if (!uploadedFile.type.startsWith("image/")) {
      toast.error(t("ui.error") || "Invalid file type. Please upload an image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        setWatermarkOptions({
          ...watermarkOptions,
          image: e.target.result as string
        });
      }
    };
    reader.readAsDataURL(uploadedFile);
  };

  // Touch events for zooming
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current.distance = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && touchStartRef.current.distance !== null) {
      const currentDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      const initialDistance = touchStartRef.current.distance;
      const scaleDiff = (currentDistance - initialDistance) / 200;
      
      setScale(prevScale => Math.min(Math.max(prevScale + scaleDiff, 0.5), 3));
      touchStartRef.current.distance = currentDistance;
    }
  };
  
  const handleTouchEnd = () => {
    touchStartRef.current.distance = null;
  };

  // Drag events for custom positioning
  const handlePreviewDragStart = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (watermarkOptions.position !== "custom") return;
    
    setIsDraggingPreview(true);
    event.preventDefault();
  };

  const handlePreviewDragMove = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingPreview || watermarkOptions.position !== "custom") return;
    
    let clientX: number, clientY: number;
    
    if ("touches" in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    
    if (!canvasRef.current) return;
    
    const pdfElement = canvasRef.current.querySelector(".react-pdf__Page");
    if (!pdfElement) return;
    
    const pdfRect = pdfElement.getBoundingClientRect();
    
    // Calculate position relative to PDF dimensions in percentage (clamped between 0-100)
    const newX = Math.max(0, Math.min(100, ((clientX - pdfRect.left) / pdfRect.width) * 100));
    const newY = Math.max(0, Math.min(100, ((clientY - pdfRect.top) / pdfRect.height) * 100));
    
    setPreviewX(newX);
    setPreviewY(newY);
  };

  const handlePreviewDragEnd = () => {
    setIsDraggingPreview(false);
  };

  // Apply the watermark to the PDF
  const applyWatermark = async () => {
    if (!file || pages.length === 0) {
      toast.error(t("watermarkPdf.messages.noFile") || "Please upload a PDF file first");
      return;
    }

    setProcessing(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("watermarkType", watermarkType);
      
      // Common options
      formData.append("position", watermarkOptions.position || "center");
      formData.append("pages", watermarkOptions.pages || "all");
      formData.append("customPages", watermarkOptions.customPages || "");
      formData.append("opacity", String(watermarkOptions.opacity));
      formData.append("rotation", String(watermarkOptions.rotation));
      
      // Text-specific options
      if (watermarkType === "text") {
        formData.append("text", watermarkOptions.text || "WATERMARK");
        formData.append("textColor", watermarkOptions.textColor || "#FF0000");
        formData.append("fontSize", String(watermarkOptions.fontSize || 48));
        formData.append("fontFamily", watermarkOptions.fontFamily || "Arial");
      } 
      // Image-specific options
      else if (watermarkType === "image" && watermarkOptions.image) {
        try {
          // Convert the data URL to a blob and then to a File
          const response = await fetch(watermarkOptions.image);
          const blob = await response.blob();
          const imageFile = new File([blob], "watermark.png", { type: blob.type });
          formData.append("watermarkImage", imageFile);
          formData.append("scale", String(watermarkOptions.scale || 50));
        } catch (error) {
          console.error("Error processing image:", error);
          throw new Error("Failed to process watermark image");
        }
      } else {
        throw new Error("No watermark content provided");
      }
      
      // If using custom position, add coordinates
      if (watermarkOptions.position === "custom") {
        formData.append("customX", String(previewX));
        formData.append("customY", String(previewY));
      }

      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

      const response = await fetch("/api/pdf/watermark", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to watermark PDF");
      }

      const result = await response.json();

      if (result.success) {
        setWatermarkedPdfUrl(result.fileUrl);
        setProgress(100);
        toast.success(t("watermarkPdf.messages.success") || "PDF watermarked successfully!");
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error watermarking PDF:", error);
      toast.error((error instanceof Error ? error.message : "Error watermarking PDF") || 
                  t("watermarkPdf.messages.error") || "Error watermarking PDF");
      setProgress(0);
    } finally {
      setProcessing(false);
    }
  };

  // Page navigation
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Render watermark preview
  const renderPreview = () => {
    if (!pages[currentPage]) return null;
    
    if (watermarkType === "text" && watermarkOptions.text) {
      return (
        <div
          ref={previewRef}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 select-none ${
            watermarkOptions.position === "custom" ? "cursor-move" : ""
          }`}
          style={{
            left: `${previewX}%`,
            top: `${previewY}%`,
            transform: `translate(-50%, -50%) rotate(${watermarkOptions.rotation}deg)`,
            color: watermarkOptions.textColor,
            fontFamily: watermarkOptions.fontFamily,
            fontSize: `${watermarkOptions.fontSize}px`,
            opacity: watermarkOptions.opacity / 100,
            whiteSpace: "nowrap",
            pointerEvents: watermarkOptions.position === "custom" ? "auto" : "none",
            userSelect: "none",
            textAlign: "center",
            fontWeight: "normal",
          }}
          onMouseDown={watermarkOptions.position === "custom" ? handlePreviewDragStart : undefined}
          onTouchStart={watermarkOptions.position === "custom" ? handlePreviewDragStart : undefined}
        >
          {watermarkOptions.text}
        </div>
      );
    } else if (watermarkType === "image" && watermarkOptions.image) {
      // Calculate size based on scale
      const scale = watermarkOptions.scale || 50;
      return (
        <div
          ref={previewRef}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 select-none ${
            watermarkOptions.position === "custom" ? "cursor-move" : ""
          }`}
          style={{
            left: `${previewX}%`,
            top: `${previewY}%`,
            transform: `translate(-50%, -50%) rotate(${watermarkOptions.rotation}deg)`,
            opacity: watermarkOptions.opacity / 100,
            width: `${scale}%`,
            maxWidth: "90%",
            pointerEvents: watermarkOptions.position === "custom" ? "auto" : "none",
            userSelect: "none",
          }}
          onMouseDown={watermarkOptions.position === "custom" ? handlePreviewDragStart : undefined}
          onTouchStart={watermarkOptions.position === "custom" ? handlePreviewDragStart : undefined}
        >
          <img 
            src={watermarkOptions.image} 
            alt="Watermark" 
            style={{ width: "100%", height: "auto" }}
            draggable={false}
          />
        </div>
      );
    }
    return null;
  };

  // Render page thumbnails for navigation
  const renderPageThumbnails = () => {
    return (
      <div className="space-y-3 p-2">
        {pages.map((_, index) => (
          <div
            key={index}
            className={`cursor-pointer transition-all duration-200 rounded-md overflow-hidden ${
              currentPage === index
                ? "border-2 border-primary shadow-md"
                : "border border-muted hover:border-muted-foreground/50"
            }`}
            onClick={() => setCurrentPage(index)}
          >
            <Document file={file}>
              <Page
                pageNumber={index + 1}
                width={70}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
            <div className="text-center text-xs py-1 font-medium bg-muted/50">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Mobile tool trigger
  const mobileToolTrigger = (
    <div className="md:hidden fixed bottom-20 right-5 z-20">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button 
            className="h-14 w-14 rounded-full shadow-lg bg-primary text-white hover:bg-primary/90"
            size="icon"
          >
            <PanelBottomIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[70vh] pt-6">
          <div className="max-h-full overflow-y-auto">
            {/* Watermark Type Selection */}
            <div className="p-5 border-b">
              <h3 className="font-semibold text-base mb-3">Watermark Type</h3>
              <Tabs value={watermarkType} onValueChange={(v) => setWatermarkType(v as WatermarkType)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <TypeIcon className="h-4 w-4" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="image" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Image
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Watermark Options */}
            <div className="p-5">
              {watermarkType === "text" ? (
                <>
                  {/* Text Watermark Options */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="watermarkText">Watermark Text</Label>
                      <Input
                        id="watermarkText"
                        value={watermarkOptions.text}
                        onChange={(e) => setWatermarkOptions({...watermarkOptions, text: e.target.value})}
                        placeholder="Enter watermark text"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="textColor">Text Color</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="textColor"
                            type="color"
                            value={watermarkOptions.textColor}
                            onChange={(e) => setWatermarkOptions({...watermarkOptions, textColor: e.target.value})}
                            className="w-12 h-8 p-0"
                          />
                          <span className="text-sm">{watermarkOptions.textColor}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fontSize">Font Size</Label>
                        <Input
                          id="fontSize"
                          type="number"
                          min="10"
                          max="100"
                          value={watermarkOptions.fontSize}
                          onChange={(e) => setWatermarkOptions({...watermarkOptions, fontSize: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fontFamily">Font Family</Label>
                      <select
                        id="fontFamily"
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={watermarkOptions.fontFamily}
                        onChange={(e) => setWatermarkOptions({...watermarkOptions, fontFamily: e.target.value})}
                      >
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier">Courier</option>
                        <option value="Verdana">Verdana</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Image Watermark Options */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="watermarkImage">Watermark Image</Label>
                      <div className="border-2 border-dashed rounded-md p-5 text-center transition-colors hover:bg-muted/20">
                        <input
                          type="file"
                          id="watermarkImage"
                          ref={imageInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <label
                          htmlFor="watermarkImage"
                          className="cursor-pointer"
                        >
                          <UploadIcon className="h-7 w-7 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground mb-3">
                            Upload image (PNG or JPG)
                          </p>
                          <Button variant="outline" size="sm" type="button">
                            <UploadIcon className="h-3.5 w-3.5 mr-1.5" />
                            Browse Files
                          </Button>
                        </label>
                      </div>
                      {watermarkOptions.image && (
                        <div className="mt-2 p-2 border rounded-md">
                          <img
                            src={watermarkOptions.image}
                            alt="Watermark Preview"
                            className="max-h-20 w-auto mx-auto"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imageScale">Image Scale (%)</Label>
                      <div className="pt-2 px-2">
                        <Slider
                          id="imageScale"
                          min={10}
                          max={100}
                          step={1}
                          value={[watermarkOptions.scale || 50]}
                          onValueChange={(value) => setWatermarkOptions({...watermarkOptions, scale: value[0]})}
                        />
                      </div>
                      <div className="text-center text-sm mt-1">{watermarkOptions.scale}%</div>
                    </div>
                  </div>
                </>
              )}

              {/* Common Options */}
              <div className="space-y-4 mt-6">
                <Separator className="my-4" />
                <h3 className="font-medium text-sm mb-2">Common Options</h3>

                <div className="space-y-2">
                  <Label htmlFor="opacity">Opacity (%)</Label>
                  <div className="pt-2 px-2">
                    <Slider
                      id="opacity"
                      min={5}
                      max={100}
                      step={5}
                      value={[watermarkOptions.opacity || 30]}
                      onValueChange={(value) => setWatermarkOptions({...watermarkOptions, opacity: value[0]})}
                    />
                  </div>
                  <div className="text-center text-sm mt-1">{watermarkOptions.opacity}%</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rotation">Rotation (degrees)</Label>
                  <div className="pt-2 px-2">
                    <Slider
                      id="rotation"
                      min={0}
                      max={360}
                      step={5}
                      value={[watermarkOptions.rotation || 45]}
                      onValueChange={(value) => setWatermarkOptions({...watermarkOptions, rotation: value[0]})}
                    />
                  </div>
                  <div className="text-center text-sm mt-1">{watermarkOptions.rotation}°</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Watermark Position</Label>
                  <select
                    id="position"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={watermarkOptions.position}
                    onChange={(e) => setWatermarkOptions({...watermarkOptions, position: e.target.value as WatermarkPosition})}
                  >
                    <option value="center">Center</option>
                    <option value="tile">Tile (Repeated)</option>
                    <option value="custom">Custom Position (Drag to position)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pages">Watermark Pages</Label>
                  <select
                    id="pages"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={watermarkOptions.pages}
                    onChange={(e) => setWatermarkOptions({...watermarkOptions, pages: e.target.value})}
                  >
                    <option value="all">All Pages</option>
                    <option value="even">Even Pages Only</option>
                    <option value="odd">Odd Pages Only</option>
                    <option value="custom">Custom Page Range</option>
                  </select>
                </div>

                {watermarkOptions.pages === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="customPages">Custom Page Range</Label>
                    <Input
                      id="customPages"
                      placeholder="e.g., 1,3,5-7"
                      value={watermarkOptions.customPages}
                      onChange={(e) => setWatermarkOptions({...watermarkOptions, customPages: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use commas and hyphens. Example: 1,3,5-10
                    </p>
                  </div>
                )}
              </div>

              <SheetClose asChild>
                <Button 
                  className="w-full mt-6" 
                  onClick={applyWatermark}
                  disabled={
                    (watermarkType === "text" && !watermarkOptions.text) || 
                    (watermarkType === "image" && !watermarkOptions.image) ||
                    !file
                  }
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Apply Watermark
                </Button>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <div className="bg-muted/30 rounded-lg p-1 md:p-4 w-full">
      <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] bg-background rounded-lg overflow-hidden border shadow-sm">
        {/* Header */}
        <div className="bg-muted/20 border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold flex items-center gap-2">
              <Stamp className="h-5 w-5 text-primary" />
              <span>PDF Watermarker</span>
            </div>
          </div>

          {file && !processing && !watermarkedPdfUrl && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setWatermarkedPdfUrl("");
                  setPages([]);
                }}
              >
                <XIcon className="h-4 w-4 mr-2" />
                Clear
              </Button>

              <Button size="sm" onClick={applyWatermark}>
                <CheckIcon className="h-4 w-4 mr-2" />
                Add Watermark
              </Button>
            </div>
          )}
        </div>

       {/* File Upload Section */}
       {!file && (
          <div className="flex-1 flex items-center justify-center p-6">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/20"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOver(false);
                const files = e.dataTransfer.files;
                if (files && files.length > 0) {
                  const uploadedFile = files[0];
                  if (uploadedFile.type !== "application/pdf") {
                    toast.error(t("ui.error") || "Invalid file type. Please upload a PDF.");
                    return;
                  }
                  setFile(uploadedFile);
                  setWatermarkedPdfUrl("");
                  setCurrentPage(0);
                  processPdf(uploadedFile);
                }
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf"
                onChange={handleFileUpload}
              />
              <div className="mb-6 p-4 rounded-full bg-primary/10 mx-auto w-20 h-20 flex items-center justify-center">
                <UploadIcon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">
                {t("watermarkPdf.uploadTitle") || "Upload Your PDF"}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {t("watermarkPdf.uploadDesc") || "Drag and drop your PDF file here, or click the button below to browse your files."}
              </p>
              <Button
                size="lg"
                className="px-8"
                onClick={() => fileInputRef.current?.click()}
              >
                {t("ui.browse") || "Browse Files"}
              </Button>
              <p className="mt-6 text-sm text-muted-foreground">
                {t("ui.filesSecurity") || "Your files are securely processed and automatically deleted after processing."}
              </p>
            </div>
          </div>
        )}

        {/* Processing Section */}
        {file && processing && !watermarkedPdfUrl && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="bg-background rounded-lg p-8 shadow-sm border w-96 text-center">
              <LoaderIcon className="h-16 w-16 animate-spin text-primary mb-6 mx-auto" />
              <h3 className="text-xl font-semibold mb-3">
                {t("watermarkPdf.processing") || "Processing..."}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("watermarkPdf.messages.processing") || "Please wait while we add the watermark to your PDF."}
              </p>
              <Progress value={progress} className="w-full h-2" />
            </div>
          </div>
        )}

        {/* PDF Viewer and Watermarking Area */}
        {file && !processing && !watermarkedPdfUrl && pages.length > 0 && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar: Page Thumbnails */}
            <div className="w-24 bg-muted/10 border-r overflow-y-auto hidden md:block">
              {renderPageThumbnails()}
            </div>

            {/* Main PDF Viewer */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 relative">
                <div
                  ref={canvasRef}
                  className="absolute inset-0 bg-muted/5 overflow-auto"
                  onMouseMove={(e) => {
                    if (isDraggingPreview) {
                      handlePreviewDragMove(e);
                    }
                  }}
                  onMouseUp={handlePreviewDragEnd}
                  onMouseLeave={handlePreviewDragEnd}
                  onTouchMove={(e) => {
                    if (isDraggingPreview) {
                      handlePreviewDragMove(e);
                    }
                    handleTouchMove(e);
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={() => {
                    handlePreviewDragEnd();
                    handleTouchEnd();
                  }}
                  onTouchCancel={() => {
                    handlePreviewDragEnd();
                    handleTouchEnd();
                  }}
                >
                  <div className="min-h-full flex items-center justify-center p-4">
                    <div className="relative shadow-lg">
                      <Document file={file}>
                        <Page
                          pageNumber={currentPage + 1}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          width={
                            pages[currentPage]
                              ? Math.min(
                                  Math.max(pages[currentPage].width, 400),
                                  canvasRef.current
                                    ? Math.min(canvasRef.current.clientWidth - 40, isMobileView ? 600 : 800)
                                    : 800
                                ) * scale
                              : undefined
                          }
                          height={
                            pages[currentPage]
                              ? Math.min(
                                  pages[currentPage].height *
                                    (Math.min(
                                      Math.max(pages[currentPage].width, 400),
                                      canvasRef.current
                                        ? Math.min(canvasRef.current.clientWidth - 40, isMobileView ? 600 : 800)
                                        : 800
                                    ) /
                                      pages[currentPage].width),
                                  canvasRef.current
                                    ? canvasRef.current.clientHeight - 60
                                    : 1000
                                ) * scale
                              : undefined
                          }
                        />
                        <div className="absolute inset-0 pointer-events-none">
                          {renderPreview()}
                        </div>
                      </Document>
                    </div>
                  </div>
                  {/* Add the mobile tool trigger here */}
                  {mobileToolTrigger}
                </div>
              </div>

              {/* Mobile Pagination Controls */}
              <div className="md:hidden flex justify-center items-center py-3 bg-background border-t">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(Math.max(0, currentPage - 1))
                    }
                    disabled={currentPage === 0}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    {currentPage + 1} / {pages.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(
                        Math.min(pages.length - 1, currentPage + 1)
                      )
                    }
                    disabled={currentPage === pages.length - 1}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Desktop Pagination Controls */}
              <div className="hidden md:flex justify-between items-center py-3 px-4 bg-background border-t">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(Math.max(0, currentPage - 1))
                    }
                    disabled={currentPage === 0}
                  >
                    <ChevronLeftIcon className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(
                        Math.min(pages.length - 1, currentPage + 1)
                      )
                    }
                    disabled={currentPage === pages.length - 1}
                  >
                    Next
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <span className="text-sm font-medium">
                  Page {currentPage + 1} of {pages.length}
                </span>
              </div>
            </div>

            {/* Right Sidebar: Watermarking Tools */}
            <div className="w-80 bg-white dark:bg-slate-900 border-l overflow-hidden hidden md:flex md:flex-col h-full shadow-sm">
              {/* Watermark Type Selection */}
              <div className="p-5 border-b">
                <h3 className="font-semibold text-base mb-3">Watermark Type</h3>
                <Tabs value={watermarkType} onValueChange={(v) => setWatermarkType(v as WatermarkType)} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text" className="flex items-center gap-2">
                      <TypeIcon className="h-4 w-4" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="image" className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Image
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Tool Content Area with inset shadow */}
              <div className="flex-1 overflow-y-auto bg-muted/5 relative">
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_5px_8px_-6px_rgba(0,0,0,0.1)]"></div>
                <div className="p-5 relative z-10">
                  {watermarkType === "text" ? (
                    <>
                      {/* Text Watermark Options */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="watermarkText">Watermark Text</Label>
                          <Input
                            id="watermarkText"
                            value={watermarkOptions.text}
                            onChange={(e) => setWatermarkOptions({...watermarkOptions, text: e.target.value})}
                            placeholder="Enter watermark text"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="textColor">Text Color</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="textColor"
                                type="color"
                                value={watermarkOptions.textColor}
                                onChange={(e) => setWatermarkOptions({...watermarkOptions, textColor: e.target.value})}
                                className="w-12 h-8 p-0"
                              />
                              <span className="text-sm">{watermarkOptions.textColor}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fontSize">Font Size</Label>
                            <Input
                              id="fontSize"
                              type="number"
                              min="10"
                              max="100"
                              value={watermarkOptions.fontSize}
                              onChange={(e) => setWatermarkOptions({...watermarkOptions, fontSize: parseInt(e.target.value)})}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="fontFamily">Font Family</Label>
                          <select
                            id="fontFamily"
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={watermarkOptions.fontFamily}
                            onChange={(e) => setWatermarkOptions({...watermarkOptions, fontFamily: e.target.value})}
                          >
                            <option value="Arial">Arial</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Courier">Courier</option>
                            <option value="Verdana">Verdana</option>
                          </select>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Image Watermark Options */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="watermarkImage">Watermark Image</Label>
                          <div className="border-2 border-dashed rounded-md p-5 text-center transition-colors hover:bg-muted/20">
                            <input
                              type="file"
                              id="watermarkImage"
                              ref={imageInputRef}
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                            <label
                              htmlFor="watermarkImage"
                              className="cursor-pointer"
                            >
                              <UploadIcon className="h-7 w-7 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground mb-3">
                                Upload image (PNG or JPG)
                              </p>
                              <Button variant="outline" size="sm" type="button">
                                <UploadIcon className="h-3.5 w-3.5 mr-1.5" />
                                Browse Files
                              </Button>
                            </label>
                          </div>
                          {watermarkOptions.image && (
                            <div className="mt-2 p-2 border rounded-md">
                              <img
                                src={watermarkOptions.image}
                                alt="Watermark Preview"
                                className="max-h-20 w-auto mx-auto"
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="imageScale">Image Scale (%)</Label>
                          <div className="pt-2 px-2">
                            <Slider
                              id="imageScale"
                              min={10}
                              max={100}
                              step={1}
                              value={[watermarkOptions.scale ?? 50]}
                              onValueChange={(value) => setWatermarkOptions({...watermarkOptions, scale: value[0]})}
                            />
                          </div>
                          <div className="text-center text-sm mt-1">{watermarkOptions.scale ?? 50}%</div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Common Options */}
                  <div className="space-y-4 mt-6">
                    <Separator className="my-4" />
                    <h3 className="font-medium text-sm mb-2">Common Options</h3>

                    <div className="space-y-2">
                      <Label htmlFor="opacity">Opacity (%)</Label>
                      <div className="pt-2 px-2">
                        <Slider
                          id="opacity"
                          min={5}
                          max={100}
                          step={5}
                          value={[watermarkOptions.opacity ?? 30]}
                          onValueChange={(value) => setWatermarkOptions({...watermarkOptions, opacity: value[0]})}
                        />
                      </div>
                                                <div className="text-center text-sm mt-1">{watermarkOptions.opacity ?? 30}%</div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rotation">Rotation (degrees)</Label>
                      <div className="pt-2 px-2">
                        <Slider
                          id="rotation"
                          min={0}
                          max={360}
                          step={5}
                          value={[watermarkOptions.rotation ?? 45]}
                          onValueChange={(value) => setWatermarkOptions({...watermarkOptions, rotation: value[0]})}
                        />
                      </div>
                                                <div className="text-center text-sm mt-1">{watermarkOptions.rotation ?? 45}°</div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position">Watermark Position</Label>
                      <select
                        id="position"
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={watermarkOptions.position}
                        onChange={(e) => setWatermarkOptions({...watermarkOptions, position: e.target.value as WatermarkPosition})}
                      >
                        <option value="center">Center</option>
                        <option value="tile">Tile (Repeated)</option>
                        <option value="custom">Custom Position (Drag to position)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pages">Watermark Pages</Label>
                      <select
                        id="pages"
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={watermarkOptions.pages}
                        onChange={(e) => setWatermarkOptions({...watermarkOptions, pages: e.target.value})}
                      >
                        <option value="all">All Pages</option>
                        <option value="even">Even Pages Only</option>
                        <option value="odd">Odd Pages Only</option>
                        <option value="custom">Custom Page Range</option>
                      </select>
                    </div>

                    {watermarkOptions.pages === "custom" && (
                      <div className="space-y-2">
                        <Label htmlFor="customPages">Custom Page Range</Label>
                        <Input
                          id="customPages"
                          placeholder="e.g., 1,3,5-7"
                          value={watermarkOptions.customPages}
                          onChange={(e) => setWatermarkOptions({...watermarkOptions, customPages: e.target.value})}
                        />
                        <p className="text-xs text-muted-foreground">
                          Use commas and hyphens. Example: 1,3,5-10
                        </p>
                      </div>
                    )}

                    <Button 
                      className="w-full mt-6" 
                      onClick={applyWatermark}
                      disabled={
                        (watermarkType === "text" && !watermarkOptions.text) || 
                        (watermarkType === "image" && !watermarkOptions.image) ||
                        !file
                      }
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Apply Watermark
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer with help info */}
              <div className="px-5 py-3 bg-muted/10 border-t">
                <div className="flex items-center text-xs text-muted-foreground">
                  <InfoIcon className="h-3.5 w-3.5 mr-1.5" />
                  <span>
                    {watermarkOptions.position === "custom"
                      ? "Drag the watermark to position it on the document"
                      : "Change position type to 'Custom' to drag and position your watermark"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Section */}
        {file && !processing && watermarkedPdfUrl && (
          <div className="flex-1 flex items-center justify-center p-6">
            <Card className="w-full max-w-md">
              <CardContent className="p-8 text-center">
                <div className="mb-6 p-4 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 mx-auto w-20 h-20 flex items-center justify-center">
                  <CheckIcon className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  {t("watermarkPdf.messages.success") || "PDF Watermarked Successfully!"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {t("watermarkPdf.messages.downloadReady") || "Your watermarked PDF is ready to download."}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFile(null);
                      setWatermarkedPdfUrl("");
                      setPages([]);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                      if (imageInputRef.current) {
                        imageInputRef.current.value = "";
                      }
                      setWatermarkOptions({
                        ...watermarkOptions,
                        image: null,
                      });
                    }}
                  >
                    <RefreshCwIcon className="h-4 w-4 mr-2" />
                    Start Over
                  </Button>
                  <Button
                    onClick={() => {
                      if (watermarkedPdfUrl) {
                        window.open(watermarkedPdfUrl, "_blank");
                      }
                    }}
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}