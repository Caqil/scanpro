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
      const elementStyles: React.CSSProperties = {
        position: "absolute",
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        width: `${element.size.width}px`,
        height: `${element.size.height}px`,
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
                                  pages[currentPage].width,
                                  window.innerWidth - 500 // Adjusted for sidebar widths
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

              {/* Desktop