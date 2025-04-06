"use client";
import React, { memo } from "react";
import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useLanguageStore } from "@/src/store/store";
import {
  PenIcon,
  TypeIcon,
  StampIcon,
  UploadIcon,
  Trash2Icon,
  XIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LoaderIcon,
  DownloadIcon,
  UserIcon,
  CalendarIcon,
  RotateCcwIcon,
  TextIcon,
} from "lucide-react";
import { SignatureCanvas } from "./sign/signature-canvas";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export type ElementType = "signature" | "text" | "stamp" | "initials" | "name" | "date";
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

/**
 * PDF Signer Component
 * A clean, modern interface for signing PDF documents with signatures, text, stamps, and dates.
 * Features drag-and-drop functionality, page navigation, and real-time element manipulation.
 */
export function PdfSigner({ initialTool = "signature" }: Props) {
  const { t } = useLanguageStore();

  const [file, setFile] = useState<File | null>(null);
  const [activeTool, setActiveTool] = useState<ElementType>(initialTool as ElementType);
  const [activeTab, setActiveTab] = useState<string>("type");
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
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>("");
  const [textValue, setTextValue] = useState<string>("");
  const [nameValue, setNameValue] = useState<string>("");
  const [fontSize, setFontSize] = useState<number>(16);
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [stampType, setStampType] = useState<string>("approved");
  const [customStamp, setCustomStamp] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [penColor, setPenColor] = useState<string>("#000000");
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileReader = useRef<FileReader | null>(null);
  const signatureCanvasRef = useRef<any>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);

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

  const handleStampUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const uploadedFile = files[0];
    if (!uploadedFile.type.startsWith("image/")) {
      toast.error(t("ui.error"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        setCustomStamp(e.target.result as string);
      }
    };
    reader.readAsDataURL(uploadedFile);
  };

  const generateStampSvg = (type: string): string => {
    let text = "";
    let fillColor = "";
    
    switch (type) {
      case "approved":
        text = "APPROVED";
        fillColor = "#4caf50"; // Green for approved
        break;
      case "rejected":
        text = "REJECTED";
        fillColor = "#f44336"; // Red for rejected
        break;
      case "draft":
        text = "DRAFT";
        fillColor = "#2196f3"; // Blue for draft
        break;
      case "final":
        text = "FINAL";
        fillColor = "#ff9800"; // Orange for final
        break;
      case "confidential":
        text = "CONFIDENTIAL";
        fillColor = "#9c27b0"; // Purple for confidential
        break;
      default:
        text = "APPROVED";
        fillColor = "#4caf50";
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50">
        <rect x="0" y="0" width="150" height="50" fill="none" stroke="${fillColor}" stroke-width="2" />
        <text x="75" y="30" font-family="Arial" font-size="16" font-weight="bold" fill="${fillColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
      </svg>
    `;
  };

  const handleAddField = (type: ElementType) => {
    if (!canvasRef.current || pages.length === 0 || currentPage >= pages.length) return;

    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const centerX = (canvasBounds.width - 200) / 2;
    const centerY = (canvasBounds.height - 50) / 2;

    let data = "";
    let size: Size = { width: 200, height: 50 };

    switch (type) {
      case "signature":
        data = signatureDataUrl || "Signature Placeholder";
        break;
      case "initials":
        data = "Initials Placeholder";
        size = { width: 100, height: 50 };
        break;
      case "name":
        data = nameValue || "Name Placeholder";
        break;
      case "date":
        data = new Date().toLocaleDateString();
        break;
      case "text":
        data = textValue || "Text Placeholder";
        break;
      case "stamp":
        data = customStamp || generateStampSvg(stampType);
        size = { width: 150, height: 50 };
        break;
    }

    const newElement: SignatureElement = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: centerX, y: centerY },
      size,
      data,
      rotation: 0,
      scale: 1,
      fontSize: fontSize,
      fontFamily: fontFamily,
      page: currentPage,
    };

    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
    setTextValue("");
  };

  const handleElementClick = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    element: SignatureElement
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedElement(selectedElement === element.id ? null : element.id);
  };
  const handleElementMoveStart = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    element: SignatureElement
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.target instanceof HTMLElement && event.target.closest('.signature-element')) {
      setIsDragging(true);
      setDraggedElement(element);
      if ("touches" in event) {
        document.body.style.overflow = 'hidden';
      }
      
      // Capture the PDF scale ratio for accurate positioning
      if (canvasRef.current && pages[currentPage]) {
        const pdfElement = canvasRef.current.querySelector('.react-pdf__Page');
        if (pdfElement) {
          const pdfWidth = pdfElement.clientWidth;
          const pdfScale = pdfWidth / pages[currentPage].originalWidth;
          
          // Store the scale as a data attribute for later use
          canvasRef.current.dataset.pdfScale = pdfScale.toString();
        }
      }
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!canvasRef.current || (!isDragging && !isResizing)) return;
  
    event.preventDefault();
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const scrollLeft = canvasRef.current.scrollLeft;
    const scrollTop = canvasRef.current.scrollTop;
    
    // Get the PDF scale from data attribute
    const pdfScale = parseFloat(canvasRef.current.dataset.pdfScale || "1");
  
    let clientX: number, clientY: number;
    if ("touches" in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
  
    // Get the PDF element for better position calculations
    const pdfElement = canvasRef.current.querySelector('.react-pdf__Page');
    if (!pdfElement) return;
    
    const pdfBounds = pdfElement.getBoundingClientRect();
    
    // Calculate position relative to the PDF, not the canvas
    const x = clientX - pdfBounds.left;
    const y = clientY - pdfBounds.top;
  
    if (isDragging && draggedElement) {
      // Apply PDF scale for accurate positioning
      const scaledWidth = draggedElement.size.width * pdfScale;
      const scaledHeight = draggedElement.size.height * pdfScale;
      
      const newX = x - scaledWidth / 2;
      const newY = y - scaledHeight / 2;
  
      // Constrain to PDF bounds
      const constrainedX = Math.max(0, Math.min(newX, pdfBounds.width - scaledWidth));
      const constrainedY = Math.max(0, Math.min(newY, pdfBounds.height - scaledHeight));
  
      // Convert back to document coordinates by dividing by scale
      setElements((prevElements) =>
        prevElements.map((el) =>
          el.id === draggedElement.id 
            ? { 
                ...el, 
                position: { 
                  x: constrainedX / pdfScale, 
                  y: constrainedY / pdfScale 
                } 
              } 
            : el
        )
      );
    } else if (isResizing && selectedElement) {
      const element = elements.find((el) => el.id === selectedElement);
      if (element) {
        // Apply scale to resizing as well
        const newWidth = Math.max(50, (x - (pdfBounds.left - canvasBounds.left + element.position.x * pdfScale)) / pdfScale);
        const newHeight = Math.max(25, (y - (pdfBounds.top - canvasBounds.top + element.position.y * pdfScale)) / pdfScale);
        
        setElements((prevElements) =>
          prevElements.map((el) =>
            el.id === selectedElement 
              ? { ...el, size: { width: newWidth, height: newHeight } } 
              : el
          )
        );
      }
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setDraggedElement(null);
    document.body.style.overflow = "";
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  const SignatureElementComponent = memo(
    ({
      element,
      selectedElement,
      handleElementClick,
      handleElementMoveStart,
      handleResizeStart,
      setElements,
      setSelectedElement,
    }: {
      element: SignatureElement;
      selectedElement: string | null;
      handleElementClick: (
        event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
        element: SignatureElement
      ) => void;
      handleElementMoveStart: (
        event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
        element: SignatureElement
      ) => void;
      handleResizeStart: (
        event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
        element: SignatureElement
      ) => void;
      setElements: React.Dispatch<React.SetStateAction<SignatureElement[]>>;
      setSelectedElement: React.Dispatch<React.SetStateAction<string | null>>;
    }) => {
      const pdfScale = canvasRef.current?.dataset.pdfScale 
      ? parseFloat(canvasRef.current.dataset.pdfScale) 
      : 1;
      const elementStyles: React.CSSProperties = {
        position: "absolute",
        left: `${element.position.x * pdfScale}px`,
        top: `${element.position.y * pdfScale}px`,
        width: `${element.size.width * pdfScale}px`,
        height: `${element.size.height * pdfScale}px`,
        transform: `rotate(${element.rotation}deg)`,
        cursor: "move",
        border: selectedElement === element.id ? "2px dashed #3b82f6" : "1px solid transparent",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        touchAction: "none",
        zIndex: selectedElement === element.id ? 999 : 1,
        backgroundColor: selectedElement === element.id ? "rgba(255, 255, 255, 0.8)" : "transparent",
        padding: "4px",
        transition: "border 0.2s ease, background-color 0.2s ease",
      };
  
      const resizeHandleStyles: React.CSSProperties = {
        position: "absolute",
        bottom: "-6px",
        right: "-6px",
        width: "12px",
        height: "12px",
        backgroundColor: "#3b82f6",
        borderRadius: "50%",
        cursor: "se-resize",
        touchAction: "none",
        border: "2px solid white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      };
  
      return (
        <div
          key={element.id}
          style={elementStyles}
          className="signature-element"
          onClick={(e) => handleElementClick(e, element)}
          onMouseDown={(e) => handleElementMoveStart(e, element)}
          onTouchStart={(e) => handleElementMoveStart(e, element)}
        >
          {element.type === "signature" && element.data !== "Signature Placeholder" ? (
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
          ) : element.type === "stamp" && element.data.startsWith("data:image/") ? (
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
          ) : element.type === "stamp" && element.data.startsWith("<svg") ? (
            <div
              dangerouslySetInnerHTML={{ __html: element.data }}
              style={{
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            />
          ) : (
            <span className="text-muted-foreground font-medium">{element.data}</span>
          )}
          {selectedElement === element.id && (
            <>
              <button
                className="absolute -top-3 -right-3 bg-destructive rounded-full p-1 shadow-md hover:bg-destructive/90 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setElements((prev) => prev.filter((el) => el.id !== element.id));
                  setSelectedElement(null);
                }}
                title="Remove element"
              >
                <XIcon className="h-3 w-3 text-white" />
              </button>
              <div
                style={resizeHandleStyles}
                onMouseDown={(e) => handleResizeStart(e, element)}
                onTouchStart={(e) => handleResizeStart(e, element)}
                title="Resize"
              />
            </>
          )}
        </div>
      );
    }
  );
  
  const renderElements = () => {
    return elements
      .filter((element) => element.page === currentPage)
      .map((element) => (
        <SignatureElementComponent
          key={element.id}
          element={element}
          selectedElement={selectedElement}
          handleElementClick={handleElementClick}
          handleElementMoveStart={handleElementMoveStart}
          handleResizeStart={handleResizeStart}
          setElements={setElements}
          setSelectedElement={setSelectedElement}
        />
      ));
  };

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

  return (
    <div className="bg-muted/30 rounded-lg p-1 md:p-4 w-full">
      <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] bg-background rounded-lg overflow-hidden border shadow-sm">
        {/* Header */}
        <div className="bg-muted/20 border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold flex items-center gap-2">
              <PenIcon className="h-5 w-5 text-primary" />
              <span>PDF Signer</span>
            </div>
          </div>
          
          {file && !processing && !signedPdfUrl && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setFile(null);
                  setElements([]);
                  setSignedPdfUrl("");
                  setPages([]);
                }}
              >
                <Trash2Icon className="h-4 w-4 mr-2" />
                Clear
              </Button>
              
              <Button 
                size="sm"
                onClick={handleSavePdf}
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                Sign Document
              </Button>
            </div>
          )}
        </div>

        {/* File Upload Section */}
        {!file && (
          <div className="flex-1 flex items-center justify-center p-6">
            <Card className="w-full max-w-2xl">
              <CardContent className="p-8">
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/20"
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
                        toast.error(t("ui.error"));
                        return;
                      }
                      setFile(uploadedFile);
                      setElements([]);
                      setSignedPdfUrl("");
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
                  <h3 className="text-2xl font-semibold mb-3">{t("signPdf.uploadTitle")}</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t("signPdf.uploadDesc")}</p>
                  <Button 
                    size="lg"
                    className="px-8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {t("ui.browse")}
                  </Button>
                  <p className="mt-6 text-sm text-muted-foreground">{t("ui.filesSecurity")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Processing Section */}
        {file && processing && !signedPdfUrl && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="bg-background rounded-lg p-8 shadow-sm border w-96 text-center">
              <LoaderIcon className="h-16 w-16 animate-spin text-primary mb-6 mx-auto" />
              <h3 className="text-xl font-semibold mb-3">{t("signPdf.processing")}</h3>
              <p className="text-muted-foreground mb-6">{t("signPdf.messages.processing")}</p>
              <Progress value={progress} className="w-full h-2" />
            </div>
          </div>
        )}

        {/* PDF Viewer and Signing Area */}
        {file && !processing && !signedPdfUrl && pages.length > 0 && (
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
    onMouseMove={handleCanvasMouseMove}
    onMouseUp={handleCanvasMouseUp}
    onMouseLeave={handleCanvasMouseUp}
    onTouchMove={handleCanvasMouseMove}
    onTouchEnd={handleCanvasMouseUp}
    onTouchCancel={handleCanvasMouseUp}
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
                    canvasRef.current ? canvasRef.current.clientWidth - 80 : 800
                  )
                : undefined
            }
            height={
              pages[currentPage]
                ? Math.min(
                    pages[currentPage].height * (
                      Math.min(
                        Math.max(pages[currentPage].width, 400),
                        canvasRef.current ? canvasRef.current.clientWidth - 80 : 800
                      ) / pages[currentPage].width
                    ),
                    canvasRef.current ? canvasRef.current.clientHeight - 60 : 1000
                  )
                : undefined
            }
          />
          <div className="absolute inset-0">{renderElements()}</div>
        </Document>
      </div>
    </div>
  </div>
</div>

              {/* Mobile Pagination Controls */}
              <div className="md:hidden flex justify-center items-center py-3 bg-background border-t">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
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
                    onClick={() => handlePageChange(Math.min(pages.length - 1, currentPage + 1))}
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
        onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
      >
        <ChevronLeftIcon className="h-4 w-4 mr-1" />
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(Math.min(pages.length - 1, currentPage + 1))}
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

{/* Right Sidebar: Signature Tools */}
<div className="w-72 bg-muted/10 border-l overflow-y-auto flex flex-col">
  <div className="p-4 border-b">
    <h3 className="font-medium mb-3">Add to Document</h3>
    <div className="grid grid-cols-4 gap-2">
      <Button
        variant={activeTool === "signature" ? "default" : "outline"}
        size="sm"
        className="flex flex-col h-20 gap-1 py-2"
        onClick={() => setActiveTool("signature")}
      >
        <PenIcon className="h-5 w-5" />
        <span className="text-xs">Signature</span>
      </Button>
      <Button
        variant={activeTool === "text" ? "default" : "outline"}
        size="sm"
        className="flex flex-col h-20 gap-1 py-2"
        onClick={() => setActiveTool("text")}
      >
        <TextIcon className="h-5 w-5" />
        <span className="text-xs">Text</span>
      </Button>
      <Button
        variant={activeTool === "name" ? "default" : "outline"}
        size="sm"
        className="flex flex-col h-20 gap-1 py-2"
        onClick={() => setActiveTool("name")}
      >
        <UserIcon className="h-5 w-5" />
        <span className="text-xs">Name</span>
      </Button>
      <Button
        variant={activeTool === "date" ? "default" : "outline"}
        size="sm"
        className="flex flex-col h-20 gap-1 py-2"
        onClick={() => setActiveTool("date")}
      >
        <CalendarIcon className="h-5 w-5" />
        <span className="text-xs">Date</span>
      </Button>
      <Button
        variant={activeTool === "stamp" ? "default" : "outline"}
        size="sm"
        className="flex flex-col h-20 gap-1 py-2"
        onClick={() => setActiveTool("stamp")}
      >
        <StampIcon className="h-5 w-5" />
        <span className="text-xs">Stamp</span>
      </Button>
    </div>
  </div>

  <div className="flex-1 p-4 overflow-y-auto">
    {activeTool === "signature" && (
      <div className="space-y-4">
        <h3 className="font-medium">Create Signature</h3>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="draw" className="flex-1">Draw</TabsTrigger>
            <TabsTrigger value="type" className="flex-1">Type</TabsTrigger>
            <TabsTrigger value="upload" className="flex-1">Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="draw" className="mt-4">
            <div className="bg-background rounded border overflow-hidden">
              <SignatureCanvas
                ref={signatureCanvasRef}
                penColor={penColor}
                backgroundColor={backgroundColor}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="penColor" className="text-xs">Pen color</Label>
                <Input
                  id="penColor"
                  type="color"
                  value={penColor}
                  onChange={(e) => setPenColor(e.target.value)}
                  className="h-8 w-full"
                />
              </div>
              <div>
                <Label htmlFor="bgColor" className="text-xs">Background</Label>
                <Input
                  id="bgColor"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-8 w-full"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  if (signatureCanvasRef.current) {
                    signatureCanvasRef.current.clear();
                  }
                }}
              >
                Clear
              </Button>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={handleSignatureDraw}
              >
                Add Signature
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="type" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="typedName">Type your name</Label>
              <Input
                id="typedName"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                placeholder="Your Name"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font</Label>
                <select
                  id="fontFamily"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fontSize">Size</Label>
                <Input
                  id="fontSize"
                  type="number"
                  min="8"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                />
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                handleAddField("name");
              }}
              disabled={!nameValue}
            >
              Add Signature
            </Button>
          </TabsContent>
          <TabsContent value="upload" className="mt-4 space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                id="signatureUpload"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;
                  
                  const file = files[0];
                  const reader = new FileReader();
                  
                  reader.onload = (e) => {
                    if (e.target && e.target.result) {
                      setSignatureDataUrl(e.target.result as string);
                    }
                  };
                  
                  reader.readAsDataURL(file);
                }}
              />
              <label htmlFor="signatureUpload" className="cursor-pointer">
                <UploadIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">Click to upload a signature image</p>
                <Button variant="outline" size="sm" type="button">
                  Browse Files
                </Button>
              </label>
            </div>
            {signatureDataUrl && signatureDataUrl.startsWith('data:image') && (
              <>
                <div className="bg-background rounded border p-4 flex items-center justify-center">
                  <img 
                    src={signatureDataUrl} 
                    alt="Your signature" 
                    className="max-h-20 max-w-full object-contain"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    handleAddField("signature");
                  }}
                >
                  Add Signature
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    )}

    {activeTool === "text" && (
      <div className="space-y-4">
        <h3 className="font-medium">Add Text</h3>
        <div className="space-y-2">
          <Label htmlFor="textContent">Text Content</Label>
          <Input
            id="textContent"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder="Enter text"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="textFontFamily">Font</Label>
            <select
              id="textFontFamily"
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="textFontSize">Size</Label>
            <Input
              id="textFontSize"
              type="number"
              min="8"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
            />
          </div>
        </div>
        <Button
          className="w-full"
          onClick={() => handleAddField("text")}
          disabled={!textValue}
        >
          Add Text
        </Button>
      </div>
    )}

    {activeTool === "stamp" && (
      <div className="space-y-4">
        <h3 className="font-medium">Add Stamp</h3>
        <div className="space-y-2">
          <Label>Select Stamp Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {["approved", "rejected", "draft", "final", "confidential"].map((type) => (
              <Button
                key={type}
                variant={stampType === type ? "default" : "outline"}
                size="sm"
                className="justify-start capitalize"
                onClick={() => setStampType(type)}
              >
                <StampIcon className="h-4 w-4 mr-2" />
                {type}
              </Button>
            ))}
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>Upload Custom Stamp</Label>
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <input
              type="file"
              id="stampUpload"
              ref={stampInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleStampUpload}
            />
            <label htmlFor="stampUpload" className="cursor-pointer">
              <Button variant="outline" size="sm" type="button" onClick={() => stampInputRef.current?.click()}>
                Browse Files
              </Button>
            </label>
          </div>
        </div>
        <Button
          className="w-full"
          onClick={() => handleAddField("stamp")}
        >
          Add Stamp
        </Button>
      </div>
    )}

    {activeTool === "date" && (
      <div className="space-y-4">
        <h3 className="font-medium">Add Date</h3>
        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-sm text-muted-foreground mb-2">
            Adds today's date to the document in the selected format
          </p>
          <div className="text-lg font-medium">
            {new Date().toLocaleDateString()}
          </div>
        </div>
        <Button
          className="w-full"
          onClick={() => handleAddField("date")}
        >
          Add Date
        </Button>
      </div>
    )}

    {activeTool === "name" && (
      <div className="space-y-4">
        <h3 className="font-medium">Add Name</h3>
        <div className="space-y-2">
          <Label htmlFor="nameField">Your Name</Label>
          <Input
            id="nameField"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="nameFontFamily">Font</Label>
            <select
              id="nameFontFamily"
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nameFontSize">Size</Label>
            <Input
              id="nameFontSize"
              type="number"
              min="8"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
            />
          </div>
        </div>
        <Button
          className="w-full"
          onClick={() => handleAddField("name")}
          disabled={!nameValue}
        >
          Add Name
        </Button>
      </div>
    )}
  </div>
</div>
</div>
)}

{/* Success Section */}
{file && !processing && signedPdfUrl && (
  <div className="flex-1 flex items-center justify-center p-6">
    <Card className="w-full max-w-md">
      <CardContent className="p-8 text-center">
        <div className="mb-6 p-4 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 mx-auto w-20 h-20 flex items-center justify-center">
          <CheckIcon className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-semibold mb-3">{t("signPdf.messages.signed")}</h3>
        <p className="text-muted-foreground mb-6">{t("signPdf.messages.downloadReady")}</p>
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => {
              setFile(null);
              setElements([]);
              setSignedPdfUrl("");
              setPages([]);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
          >
            <RotateCcwIcon className="h-4 w-4 mr-2" />
            Start Over
          </Button>
          <Button
            onClick={() => {
              if (signedPdfUrl) {
                window.open(signedPdfUrl, "_blank");
              }
            }}
          >
            <DownloadIcon className="h-4 w-4 mr-2" />
            Download Signed PDF
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