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
import { Alert, AlertDescription } from "@/components/ui/alert";
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
} from "lucide-react";
import { SignatureCanvas } from "./sign/signature-canvas";
import { Separator } from "./ui/separator";


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
    switch (type) {
      case "approved":
        text = "APPROVED";
        break;
      case "rejected":
        text = "REJECTED";
        break;
      default:
        text = "APPROVED";
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50">
        <rect x="0" y="0" width="150" height="50" fill="none" stroke="currentColor" stroke-width="2" />
        <text x="75" y="25" font-family="Arial" font-size="16" fill="currentColor" text-anchor="middle" dominant-baseline="middle">${text}</text>
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
        cursor: "pointer",
        border: selectedElement === element.id ? "2px dashed #3b82f6" : "1px solid",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        touchAction: "none",
        zIndex: selectedElement === element.id ? 999 : 1,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: "4px",
      };
  
      const resizeHandleStyles: React.CSSProperties = {
        position: "absolute",
        bottom: "-5px",
        right: "-5px",
        width: "10px",
        height: "10px",
        backgroundColor: "#3b82f6",
        borderRadius: "50%",
        cursor: "se-resize",
        touchAction: "none",
      };
  
      return (
        <div
          key={element.id}
          style={elementStyles}
          className="signature-element border-muted"
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
          ) : (
            <span className="text-muted-foreground">{element.data}</span>
          )}
          {selectedElement === element.id && (
            <>
              <button
                className="absolute -top-3 -right-3 bg-destructive rounded-full p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setElements((prev) => prev.filter((el) => el.id !== element.id));
                  setSelectedElement(null);
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
      <div className="space-y-2">
        {pages.map((_, index) => (
          <div
            key={index}
            className={`cursor-pointer ${currentPage === index ? "border-2 border-blue-500" : "border border-gray-200"}`}
            onClick={() => setCurrentPage(index)}
          >
            <Document file={file}>
              <Page
                pageNumber={index + 1}
                width={60}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
            <div className="text-center text-sm">Page {index + 1}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar: Page Thumbnails */}
      {file && !processing && !signedPdfUrl && pages.length > 0 && (
        <div className="w-24 bg-muted/50 border-r p-2 overflow-y-auto space-y-2">
          {renderPageThumbnails()}
        </div>
      )}
  
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-background border-b px-4 py-3 flex items-center justify-between">
          {file && !processing && !signedPdfUrl && (
            <div className="flex items-center space-x-2">
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
            </div>
          )}
        </div>
  
        {/* File Upload Section */}
        {!file && (
          <div className="flex-1 flex items-center justify-center p-6">
            <Card className="w-full max-w-full">
              <CardContent className="p-6">
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragOver ? "border-primary bg-primary/10" : "border-muted-foreground/25"
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
                  <div className="mb-4 p-3 rounded-full bg-muted mx-auto w-16 h-16 flex items-center justify-center">
                    <UploadIcon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t("signPdf.uploadTitle")}</h3>
                  <p className="text-muted-foreground mb-6">{t("signPdf.uploadDesc")}</p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    {t("ui.browse")}
                  </Button>
                  <p className="mt-4 text-sm text-muted-foreground">{t("ui.filesSecurity")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
  
        {/* Processing Section */}
        {file && processing && !signedPdfUrl && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <LoaderIcon className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t("signPdf.processing")}</h3>
            <p className="text-muted-foreground mb-4">{t("signPdf.messages.processing")}</p>
            <Progress value={progress} className="w-64" />
          </div>
        )}
  
        {/* PDF Viewer and Signing Area */}
        {file && !processing && !signedPdfUrl && pages.length > 0 && (
          <div className="flex-1 flex">
            <div className="flex-1 p-4">
  <div
    className="relative rounded-lg shadow-sm bg-white"
    style={{
      width: "100%",
      height: "calc(100vh - 120px)", // Adjust based on your layout
      overflow: "hidden", // Prevent scrolling
      touchAction: isDragging ? "none" : "auto",
      border: "2px solid #000000", // Visible black border
      padding: "10px", // Internal padding to create space between border and PDF
      boxSizing: "border-box", // Ensure padding doesn’t increase outer size
    }}
    onMouseMove={handleCanvasMouseMove}
    onMouseUp={handleCanvasMouseUp}
    onMouseLeave={handleCanvasMouseUp}
    onTouchMove={handleCanvasMouseMove}
    onTouchEnd={handleCanvasMouseUp}
    onTouchCancel={handleCanvasMouseUp}
    ref={canvasRef}
  >
    <Document file={file}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f0f0", // Light gray background to distinguish PDF area
        }}
      >
        <Page
          pageNumber={currentPage + 1}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          width={
            pages[currentPage]
              ? Math.min(
                  pages[currentPage].width,
                  (canvasRef.current?.clientWidth || window.innerWidth - 40) - 20 // Account for padding
                )
              : undefined
          }
          scale={
            window.innerWidth < 768
              ? 0.9
              : Math.min(
                  ((canvasRef.current?.clientWidth || window.innerWidth - 40) - 20) /
                    (pages[currentPage]?.width || 1),
                  ((canvasRef.current?.clientHeight || window.innerHeight - 120) - 20) /
                    (pages[currentPage]?.height || 1)
                )
          }
          className="w-auto h-auto shadow-md" // Slight shadow for PDF page
        />
      </div>
      <div style={{ position: "absolute", top: "10px", left: "10px", width: "calc(100% - 20px)", height: "calc(100% - 20px)" }}>
        {renderElements()}
      </div>
    </Document>
  </div>

  {/* Pagination Controls */}
  {pages.length > 1 && (
    <div className="flex justify-center items-center mt-4 space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      <span>
        Page {currentPage + 1} of {pages.length}
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
  )}
</div>
  
            {/* Right Sidebar: Signing Options */}
            <div className="w-96 p-4 border-l bg-background">
              <Tabs defaultValue="type" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 w-full mb-4">
                  <TabsTrigger
                    value="type"
                    className={activeTab === "type" ? "border-2 border-primary" : ""}
                  >
                    Type
                  </TabsTrigger>
                  <TabsTrigger
                    value="draw"
                    className={activeTab === "draw" ? "border-2 border-primary" : ""}
                  >
                    Draw
                  </TabsTrigger>
                </TabsList>
  
                <TabsContent value="type" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Optional Fields</Label>
                      <Separator />
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          className="flex items-center justify-center"
                          onClick={() => handleAddField("date")}
                        >
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Date
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center justify-center"
                          onClick={() => handleAddField("stamp")}
                        >
                          <StampIcon className="h-4 w-4 mr-2" />
                          Stamp
                        </Button>
                      </div>
                    </div>
  
                    <div className="space-y-2">
                      <Label htmlFor="text-input">Text</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="text-input"
                          value={textValue}
                          onChange={(e) => setTextValue(e.target.value)}
                          placeholder="Enter text"
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          onClick={() => handleAddField("text")}
                        >
                          <TypeIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
  
                    <div className="space-y-2">
                      <Label>Stamp Type</Label>
                      <select
                        value={stampType}
                        onChange={(e) => setStampType(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
  
                    <div className="space-y-2">
                      <Label>Custom Stamp</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          accept="image/*"
                          ref={stampInputRef}
                          onChange={handleStampUpload}
                          className="flex-1 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
  
                <TabsContent value="draw" className="space-y-4">
  <div className="border rounded-lg p-3">
    <SignatureCanvas
      ref={signatureCanvasRef}
      penColor={penColor} // Pass dynamic pen color
      backgroundColor={backgroundColor} // Pass dynamic background color
      canvasProps={{
        className: "signature-canvas w-full h-40",
      }}
    />
  </div>
  {/* Color Selection Controls */}
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="pen-color">Pen Color</Label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          id="pen-color"
          value={penColor}
          onChange={(e) => setPenColor(e.target.value)}
          className="w-10 h-10 p-0 border-none rounded cursor-pointer"
        />
        <Input
          value={penColor}
          onChange={(e) => setPenColor(e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="bg-color">Background Color</Label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          id="bg-color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          className="w-10 h-10 p-0 border-none rounded cursor-pointer"
        />
        <Input
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          placeholder="#ffffff"
          className="flex-1"
        />
      </div>
    </div>
  </div>
  <div className="flex space-x-2">
    <Button
      variant="outline"
      className="flex-1"
      onClick={() => signatureCanvasRef.current?.clear()}
    >
      <RotateCcwIcon className="h-4 w-4 mr-2" />
      Clear
    </Button>
    <Button className="flex-1" onClick={handleSignatureDraw}>
      <CheckIcon className="h-4 w-4 mr-2" />
      Apply
    </Button>
  </div>
</TabsContent>
              </Tabs>
  
              <Separator className="my-4" />
  
              <Button
                className="w-full"
                size="lg"
                onClick={handleSavePdf}
              >
                Sign Document
                <CheckIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
  
        {/* Signed PDF Section */}
        {signedPdfUrl && (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="mb-6 p-3 rounded-full bg-muted mx-auto w-16 h-16 flex items-center justify-center">
              <CheckIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("signPdf.messages.signed")}</h3>
            <p className="text-muted-foreground mb-6">{t("signPdf.messages.downloadReady")}</p>
            <div className="flex space-x-3">
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
      </div>
    </div>
  );
}