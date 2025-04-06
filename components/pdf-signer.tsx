"use client";

import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useLanguageStore } from "@/src/store/store";
import {
  PenIcon,
  TypeIcon,
  StampIcon,
  PencilIcon,
  ImageIcon,
  UploadIcon,
  Trash2Icon,
  XIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LoaderIcon,
  DownloadIcon,
} from "lucide-react";

import { SignatureCanvas } from "./signature-canvas";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export type ElementType = "signature" | "text" | "stamp" | "image";
export type Position = { x: number; y: number };
export type Size = { width: number; height: number };

export interface SignatureElement {
  id: string;
  type: ElementType;
  position: Position;
  size: Size;
  data: string;
  rotation: number;
  scale: number;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  page: number;
}

interface PdfPage {
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

interface Props {
  initialTool?: string;
}

export function PdfSigner({ initialTool = "signature" }: Props) {
  const { t } = useLanguageStore();

  const [file, setFile] = useState<File | null>(null);
  const [activeTool, setActiveTool] = useState<ElementType>(initialTool as ElementType);
  const [activeTab, setActiveTab] = useState<string>("draw");
  const [pages, setPages] = useState<PdfPage[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [elements, setElements] = useState<SignatureElement[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [signedPdfUrl, setSignedPdfUrl] = useState<string>("");
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<SignatureElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [signatureSize, setSignatureSize] = useState<Size>({ width: 200, height: 100 });
  const [color, setColor] = useState<string>("#000000");
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>("");
  const [textValue, setTextValue] = useState<string>("");
  const [fontSize, setFontSize] = useState<number>(16);
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [stampType, setStampType] = useState<string>("approved");
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileReader = useRef<FileReader | null>(null);
  const signatureCanvasRef = useRef<any>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fileReader.current = new FileReader();
    return () => {
      fileReader.current = null;
    };
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const uploadedFile = files[0];
    if (uploadedFile.type !== "application/pdf") {
      toast.error(t("ui.error"));
      return;
    }

    setFile(uploadedFile);
    setElements([]);
    setSignedPdfUrl("");
    setCurrentPage(0);

    processPdf(uploadedFile);
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;

    const uploadedFile = files[0];
    if (uploadedFile.type !== "application/pdf") {
      toast.error(t("ui.error"));
      return;
    }

    setFile(uploadedFile);
    setElements([]);
    setSignedPdfUrl("");
    setCurrentPage(0);

    processPdf(uploadedFile);
  };

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
        newPages.push({
          width: viewport.width,
          height: viewport.height,
          originalWidth: viewport.width,
          originalHeight: viewport.height,
        });
      }

      setPages(newPages);
      setProgress(100);
      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      console.error("Error processing PDF:", error);
      toast.error(t("signPdf.messages.error"));
    } finally {
      setProcessing(false);
    }
  };

  const handleSignatureDraw = () => {
    if (!signatureCanvasRef.current) return;

    const signatureData = signatureCanvasRef.current.toDataURL("image/png");
    setSignatureDataUrl(signatureData);

    if (canvasRef.current && pages.length > 0 && currentPage < pages.length) {
      const canvasBounds = canvasRef.current.getBoundingClientRect();
      const centerX = (canvasBounds.width - signatureSize.width) / 2;
      const centerY = (canvasBounds.height - signatureSize.height) / 2;

      const newElement: SignatureElement = {
        id: `signature-${Date.now()}`,
        type: "signature",
        position: { x: centerX, y: centerY },
        size: { ...signatureSize },
        data: signatureData,
        rotation: 0,
        scale: 1,
        page: currentPage,
      };

      setElements([...elements, newElement]);
      setSelectedElement(newElement.id);
    }
  };

  const handleAddText = () => {
    if (!textValue.trim() || !canvasRef.current || pages.length === 0 || currentPage >= pages.length) return;

    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const centerX = (canvasBounds.width - 200) / 2;
    const centerY = (canvasBounds.height - 30) / 2;

    const newElement: SignatureElement = {
      id: `text-${Date.now()}`,
      type: "text",
      position: { x: centerX, y: centerY },
      size: { width: 200, height: 30 },
      data: textValue,
      rotation: 0,
      scale: 1,
      color: color,
      fontSize: fontSize,
      fontFamily: fontFamily,
      page: currentPage,
    };

    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
    setTextValue("");
  };

  const handleAddStamp = () => {
    if (!canvasRef.current || pages.length === 0 || currentPage >= pages.length) return;

    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const centerX = (canvasBounds.width - 150) / 2;
    const centerY = (canvasBounds.height - 150) / 2;

    const stampData = generateStampSvg(stampType, color);

    const newElement: SignatureElement = {
      id: `stamp-${Date.now()}`,
      type: "stamp",
      position: { x: centerX, y: centerY },
      size: { width: 150, height: 150 },
      data: stampData,
      rotation: 0,
      scale: 1,
      color: color,
      page: currentPage,
    };

    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const generateStampSvg = (type: string, color: string): string => {
    let text = "";
    switch (type) {
      case "approved":
        text = t("signPdf.stamps.approved");
        break;
      case "rejected":
        text = t("signPdf.stamps.rejected");
        break;
      case "draft":
        text = t("signPdf.stamps.draft");
        break;
      case "final":
        text = t("signPdf.stamps.final");
        break;
      case "confidential":
        text = t("signPdf.stamps.confidential");
        break;
      default:
        text = t("signPdf.stamps.approved");
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r="70" fill="none" stroke="${color}" stroke-width="5" />
        <text x="75" y="75" font-family="Arial" font-size="24" fill="${color}" text-anchor="middle" dominant-baseline="middle">${text}</text>
        <line x1="20" y1="75" x2="130" y2="75" stroke="${color}" stroke-width="2" />
      </svg>
    `;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !canvasRef.current || pages.length === 0 || currentPage >= pages.length) return;

    const uploadedFile = files[0];
    if (!uploadedFile.type.startsWith("image/")) {
      toast.error(t("ui.error"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        const canvasBounds = canvasRef.current!.getBoundingClientRect();
        const centerX = (canvasBounds.width - 200) / 2;
        const centerY = (canvasBounds.height - 200) / 2;

        const newElement: SignatureElement = {
          id: `image-${Date.now()}`,
          type: "image",
          position: { x: centerX, y: centerY },
          size: { width: 200, height: 200 },
          data: e.target.result as string,
          rotation: 0,
          scale: 1,
          page: currentPage,
        };

        setElements([...elements, newElement]);
        setSelectedElement(newElement.id);
      }
    };

    reader.readAsDataURL(uploadedFile);
  };

  const handleElementSelect = (id: string) => {
    setSelectedElement(id === selectedElement ? null : id);
  };

  const handleElementDelete = (id: string) => {
    setElements(elements.filter((element) => element.id !== id));
    setSelectedElement(null);
  };

  const handleElementMoveStart = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    element: SignatureElement
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
    setDraggedElement(element);
    setSelectedElement(element.id);
  
    // Prevent PDF scrolling on touch devices
    if ("touches" in event) {
      document.body.style.overflow = "hidden"; // Disable body scroll
    }
  };
  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!canvasRef.current || (!isDragging && !isResizing)) return;
  
    event.preventDefault();
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const scrollLeft = canvasRef.current.scrollLeft;
    const scrollTop = canvasRef.current.scrollTop;
  
    let clientX: number, clientY: number;
    if ("touches" in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
  
    const x = clientX - canvasBounds.left + scrollLeft;
    const y = clientY - canvasBounds.top + scrollTop;
  
    if (isDragging && draggedElement) {
      const newX = x - draggedElement.size.width / 2;
      const newY = y - draggedElement.size.height / 2;
  
      const constrainedX = Math.max(0, Math.min(newX, canvasBounds.width - draggedElement.size.width));
      const constrainedY = Math.max(0, Math.min(newY, canvasBounds.height - draggedElement.size.height));
  
      setElements((prevElements) =>
        prevElements.map((el) =>
          el.id === draggedElement.id ? { ...el, position: { x: constrainedX, y: constrainedY } } : el
        )
      );
    } else if (isResizing && selectedElement) {
      const element = elements.find((el) => el.id === selectedElement);
      if (element) {
        const newWidth = Math.max(50, x - element.position.x);
        const newHeight = Math.max(25, y - element.position.y);
        setElements((prevElements) =>
          prevElements.map((el) =>
            el.id === selectedElement ? { ...el, size: { width: newWidth, height: newHeight } } : el
          )
        );
      }
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setDraggedElement(null);
    document.body.style.overflow = ""; // Re-enable body scroll
  };

  const handleResizeStart = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    element: SignatureElement
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setIsResizing(true);
    setSelectedElement(element.id);
  };

  const handlePageChange = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSavePdf = async () => {
    if (!file || pages.length === 0) return;

    setProcessing(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("elements", JSON.stringify(elements));
      formData.append("pages", JSON.stringify(pages));
      formData.append("performOcr", "true");
      formData.append("ocrLanguage", "eng");

      const response = await fetch("/api/pdf/sign", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save PDF");
      }

      const result = await response.json();

      if (result.success) {
        let pdfUrl = result.fileUrl;
        let pdfName = result.originalName || "signed-document.pdf";

        if (result.ocrComplete) {
          pdfUrl = result.searchablePdfUrl;
          pdfName = result.searchablePdfFilename || "searchable-document.pdf";
        } else if (!result.ocrComplete && result.ocrError) {
          console.warn("OCR requested but failed:", result.ocrError);
          toast.error(t("signPdf.messages.ocrFailed"));
        }

        setSignedPdfUrl(pdfUrl);
        setProgress(100);
        toast.success(t("signPdf.messages.signed"));

        return { url: pdfUrl, name: pdfName };
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error saving PDF:", error);
      toast.error(t("signPdf.messages.error"));
    } finally {
      setProcessing(false);
    }
  };

  const handleClearAll = () => {
    setElements([]);
    setSelectedElement(null);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  const renderElements = () => {
    return elements
      .filter((element) => element.page === currentPage)
      .map((element) => {
        const elementStyles = {
          position: "absolute" as const,
          left: `${element.position.x}px`,
          top: `${element.position.y}px`,
          width: `${element.size.width}px`,
          height: `${element.size.height}px`,
          transform: `rotate(${element.rotation}deg)`,
          cursor: isDragging && draggedElement?.id === element.id ? "grabbing" : "grab",
          border: selectedElement === element.id ? "2px dashed #3b82f6" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none" as const,
          touchAction: "none" as const, // Prevent default touch behavior
          zIndex: selectedElement === element.id ? 999 : 1,
        };
  
        const resizeHandleStyles = {
          position: "absolute" as const,
          bottom: "-5px",
          right: "-5px",
          width: "10px",
          height: "10px",
          backgroundColor: "#3b82f6",
          borderRadius: "50%",
          cursor: "se-resize",
          touchAction: "none" as const, // Prevent default touch behavior
        };
  
        // Rest of the switch statement remains the same, just apply elementStyles
        switch (element.type) {
          case "signature":
            return (
              <div
                key={element.id}
                style={elementStyles}
                onClick={() => handleElementSelect(element.id)}
                onMouseDown={(e) => handleElementMoveStart(e, element)}
                onTouchStart={(e) => handleElementMoveStart(e, element)}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${element.data})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    pointerEvents: "none",
                  }}
                />
                {selectedElement === element.id && (
                  <>
                    <button
                      className="absolute -top-3 -right-3 bg-red-500 rounded-full p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleElementDelete(element.id);
                      }}
                    >
                      <XIcon className="h-3 w-3 text-white" />
                    </button>
                    <div
                      style={resizeHandleStyles}
                      onMouseDown={(e) => handleResizeStart(e, element)}
                      onTouchStart={(e) => handleResizeStart(e, element)}
                    />
                  </>
                )}
              </div>
            );
          // Other cases (text, stamp, image) remain the same, just update their styles similarly
        }
      });
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {!file && (
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center ${
              isDragOver ? "border-primary bg-primary/10" : "border-muted-foreground/25"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              setIsDragOver(false);
              handleFileDrop(e);
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf"
              onChange={handleFileUpload}
            />
            <div className="mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mx-auto w-16 h-16 flex items-center justify-center">
              <UploadIcon className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("signPdf.uploadTitle")}</h3>
            <p className="text-muted-foreground mb-6">{t("signPdf.uploadDesc")}</p>
            <Button onClick={handleBrowseClick}>{t("ui.browse")}</Button>
            <p className="mt-4 text-sm text-muted-foreground/75">{t("ui.filesSecurity")}</p>
          </div>
        )}

        {file && processing && !signedPdfUrl && (
          <div className="text-center py-8">
            <LoaderIcon className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t("signPdf.processing")}</h3>
            <p className="text-muted-foreground mb-4">{t("signPdf.messages.processing")}</p>
            <Progress value={progress} className="max-w-md mx-auto" />
          </div>
        )}

        {file && !processing && !signedPdfUrl && pages.length > 0 && (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 min-h-[500px]">
              <div className="bg-muted/30 p-1 rounded-md mb-2 flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange("prev")}
                  disabled={currentPage === 0}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  {t("signPdf.pages")} {currentPage + 1} / {pages.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange("next")}
                  disabled={currentPage === pages.length - 1}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>

              <div
  className="relative bg-white rounded-md border shadow-sm overflow-auto"
  style={{
    height: "100%",
    width: "100%",
    minHeight: "500px",
    touchAction: isDragging ? "none" : "auto", // Disable touch scrolling when dragging
  }}
  onMouseMove={handleCanvasMouseMove}
  onMouseUp={handleCanvasMouseUp}
  onMouseLeave={handleCanvasMouseUp}
  onTouchMove={handleCanvasMouseMove}
  onTouchEnd={handleCanvasMouseUp}
  onTouchCancel={handleCanvasMouseUp}
  ref={canvasRef}
>
  {file && (
    <Document file={file}>
      <Page
        pageNumber={currentPage + 1}
        width={pages[currentPage]?.width}
        height={pages[currentPage]?.height}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
      <div style={{ position: "absolute", top: 0, left: 0 }}>
        {renderElements()}
      </div>
    </Document>
  )}
</div>

              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={handleClearAll} className="text-sm">
                  <Trash2Icon className="h-4 w-4 mr-2" />
                  {t("signPdf.clearAll")}
                </Button>
                <Button onClick={handleSavePdf} className="text-sm">
                  <CheckIcon className="h-4 w-4 mr-2" />
                  {t("signPdf.download")}
                </Button>
              </div>
            </div>

            <div className="w-full md:w-72">
              <Tabs defaultValue="signature" onValueChange={(value) => setActiveTool(value as ElementType)}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="signature" className="text-xs">
                    <PenIcon className="h-4 w-4 mr-1" />
                    {t("signPdf.tools.signature")}
                  </TabsTrigger>
                  <TabsTrigger value="text" className="text-xs">
                    <TypeIcon className="h-4 w-4 mr-1" />
                    {t("signPdf.tools.text")}
                  </TabsTrigger>
                  <TabsTrigger value="stamp" className="text-xs">
                    <StampIcon className="h-4 w-4 mr-1" />
                    {t("signPdf.tools.stamp")}
                  </TabsTrigger>
                  <TabsTrigger value="image" className="text-xs">
                    <ImageIcon className="h-4 w-4 mr-1" />
                    {t("signPdf.tools.image")}
                  </TabsTrigger>
                </TabsList>

                <div className="mt-4 p-4 border rounded-md">
                  <TabsContent value="signature">
                    <h3 className="text-lg font-medium mb-3">{t("signPdf.signatureOptions")}</h3>
                    <Tabs defaultValue="draw" onValueChange={setActiveTab}>
                      <TabsList className="w-full">
                        <TabsTrigger value="draw" className="flex-1">
                          <PencilIcon className="h-4 w-4 mr-1" />
                          {t("signPdf.drawSignature")}
                        </TabsTrigger>
                        <TabsTrigger value="upload" className="flex-1">
                          <UploadIcon className="h-4 w-4 mr-1" />
                          {t("signPdf.uploadSignature")}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="draw" className="mt-4">
                        <div className="border rounded-md p-2 mb-3 bg-white">
                          <SignatureCanvas
                            ref={signatureCanvasRef}
                            penColor={color}
                            canvasProps={{
                              className: "signature-canvas w-full h-32",
                            }}
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Label>{t("signPdf.options.color")}</Label>
                            <input
                              type="color"
                              value={color}
                              onChange={(e) => setColor(e.target.value)}
                              className="w-8 h-8 p-0 border-0"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between">
                              <Label>Width</Label>
                              <span className="text-sm text-muted-foreground">{signatureSize.width}px</span>
                            </div>
                            <Slider
                              min={50}
                              max={400}
                              step={1}
                              value={[signatureSize.width]}
                              onValueChange={(value) => setSignatureSize((prev) => ({ ...prev, width: value[0] }))}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between">
                              <Label>Height</Label>
                              <span className="text-sm text-muted-foreground">{signatureSize.height}px</span>
                            </div>
                            <Slider
                              min={25}
                              max={200}
                              step={1}
                              value={[signatureSize.height]}
                              onValueChange={(value) => setSignatureSize((prev) => ({ ...prev, height: value[0] }))}
                              className="mt-2"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => signatureCanvasRef.current?.clear()}
                            >
                              {t("signPdf.options.clear")}
                            </Button>
                            <Button className="flex-1" onClick={handleSignatureDraw}>
                              {t("signPdf.options.apply")}
                            </Button>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="upload" className="mt-4">
                        <input
                          type="file"
                          accept="image/*"
                          ref={imageInputRef}
                          onChange={handleImageUpload}
                          className="w-full mb-3 text-sm"
                        />
                        <Alert className="mb-3">
                          <AlertDescription className="text-xs">
                            {t("signPdf.faq.formats.answer")}
                          </AlertDescription>
                        </Alert>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>

                  <TabsContent value="text">
                    <h3 className="text-lg font-medium mb-3">{t("signPdf.addText")}</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="text-input">{t("signPdf.tools.text")}</Label>
                        <Input
                          id="text-input"
                          value={textValue}
                          onChange={(e) => setTextValue(e.target.value)}
                          placeholder="Enter text here"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="font-family">{t("signPdf.options.fontFamily")}</Label>
                        <select
                          id="font-family"
                          value={fontFamily}
                          onChange={(e) => setFontFamily(e.target.value)}
                          className="w-full p-2 border rounded-md mt-1"
                        >
                          <option value="Arial">Arial</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Courier New">Courier New</option>
                          <option value="Verdana">Verdana</option>
                          <option value="Georgia">Georgia</option>
                        </select>
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <Label htmlFor="font-size">{t("signPdf.options.fontSize")}</Label>
                          <span className="text-sm text-muted-foreground">{fontSize}px</span>
                        </div>
                        <Slider
                          id="font-size"
                          min={8}
                          max={72}
                          step={1}
                          value={[fontSize]}
                          onValueChange={(value) => setFontSize(value[0])}
                          className="mt-2"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label>{t("signPdf.options.color")}</Label>
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-8 h-8 p-0 border-0"
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleAddText}
                        disabled={!textValue.trim()}
                      >
                        {t("signPdf.options.apply")}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="stamp">
                    <h3 className="text-lg font-medium mb-3">{t("signPdf.tools.stamp")}</h3>
                    <div className="space-y-3">
                      <RadioGroup
                        value={stampType}
                        onValueChange={setStampType}
                        className="grid grid-cols-2 gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="approved" id="approved" />
                          <Label htmlFor="approved">{t("signPdf.stamps.approved")}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="rejected" id="rejected" />
                          <Label htmlFor="rejected">{t("signPdf.stamps.rejected")}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="draft" id="draft" />
                          <Label htmlFor="draft">{t("signPdf.stamps.draft")}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="final" id="final" />
                          <Label htmlFor="final">{t("signPdf.stamps.final")}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="confidential" id="confidential" />
                          <Label htmlFor="confidential">{t("signPdf.stamps.confidential")}</Label>
                        </div>
                      </RadioGroup>
                      <div className="flex items-center gap-2 mt-4">
                        <Label>{t("signPdf.options.color")}</Label>
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-8 h-8 p-0 border-0"
                        />
                      </div>
                      <Button className="w-full" onClick={handleAddStamp}>
                        {t("signPdf.options.apply")}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="image">
                    <h3 className="text-lg font-medium mb-3">{t("signPdf.addImage")}</h3>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full mb-3 text-sm"
                      />
                      <Alert>
                        <AlertDescription className="text-xs">
                          For best results, use PNG images with transparent backgrounds.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        )}

        {signedPdfUrl && (
          <div className="text-center py-8">
            <div className="mb-6 p-3 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto w-16 h-16 flex items-center justify-center">
              <CheckIcon className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("signPdf.messages.signed")}</h3>
            <p className="text-muted-foreground mb-6">{t("signPdf.messages.downloadReady")}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <a href={signedPdfUrl} download>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  {t("signPdf.download")}
                </a>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setElements([]);
                  setSignedPdfUrl("");
                  setPages([]);
                }}
              >
                {t("ui.reupload")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}