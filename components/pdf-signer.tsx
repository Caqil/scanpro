"use client";

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
} from "lucide-react";

import { SignatureCanvas } from "./signature-canvas";

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

  const renderElements = () => {
    return elements
      .filter((element) => element.page === currentPage)
      .map((element) => {
        const elementStyles: React.CSSProperties = {
          position: 'absolute',
          left: `${element.position.x}px`,
          top: `${element.position.y}px`,
          width: `${element.size.width}px`,
          height: `${element.size.height}px`,
          transform: `rotate(${element.rotation}deg)`,
          cursor: 'pointer',
          border: selectedElement === element.id ? '2px dashed #3b82f6' : '1px solid',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          touchAction: 'none',
          zIndex: selectedElement === element.id ? 999 : 1,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '4px',
        };

        const resizeHandleStyles: React.CSSProperties = {
          position: 'absolute',
          bottom: '-5px',
          right: '-5px',
          width: '10px',
          height: '10px',
          backgroundColor: '#3b82f6',
          borderRadius: '50%',
          cursor: 'se-resize',
          touchAction: 'none',
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
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${element.data})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  pointerEvents: 'none',
                }}
              />
            ) : element.type === "stamp" && element.data.startsWith("data:image/") ? (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${element.data})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  pointerEvents: 'none',
                }}
              />
            ) : element.type === "stamp" ? (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(element.data)}")`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  pointerEvents: 'none',
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
                    setElements(elements.filter((el) => el.id !== element.id));
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
      });
  };

  const renderPageThumbnails = () => {
    return (
      <div className="w-20 p-2 overflow-y-auto">
        {pages.map((page, index) => (
          <div
            key={index}
            className={`mb-2 cursor-pointer border-2 ${
              currentPage === index ? 'border-primary' : 'border-transparent'
            }`}
            onClick={() => handlePageChange(index)}
          >
            <Document file={file}>
              <Page
                pageNumber={index + 1}
                width={60}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
            <div className="text-center text-sm">{index + 1}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar: Page Thumbnails */}
      {file && !processing && !signedPdfUrl && pages.length > 0 && (
        <div className="hidden md:block">{renderPageThumbnails()}</div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* File Upload Section */}
        {!file && (
          <Card className="m-4">
            <CardContent className="p-6">
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
        )}

        {/* Processing Section */}
        {file && processing && !signedPdfUrl && (
          <div className="text-center py-8">
            <LoaderIcon className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t("signPdf.processing")}</h3>
            <p className="text-muted-foreground mb-4">{t("signPdf.messages.processing")}</p>
            <Progress value={progress} className="max-w-md mx-auto" />
          </div>
        )}

        {/* PDF Viewer and Signing Area */}
        {file && !processing && !signedPdfUrl && pages.length > 0 && (
          <div className="flex-1 flex">
            {/* PDF Viewer */}
            <div className="flex-1 p-4 overflow-auto">
              <div className="bg-muted p-1 rounded-md mb-2 flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
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
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pages.length - 1}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>

              <div
                className="relative rounded-md border shadow-sm"
                style={{
                  width: '100%',
                  height: '100%', // Full height
                  overflow: 'auto', // Allow scrolling if needed
                  touchAction: isDragging ? 'none' : 'auto',
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
                  <Page
                    pageNumber={currentPage + 1}
                    width={pages[currentPage]?.width}
                    height={pages[currentPage]?.height}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    scale={window.innerWidth < 768 ? 0.9 : 1}
                    className="w-full h-auto"
                  />
                  <div style={{ position: 'absolute', top: 0, left: 0 }}>
                    {renderElements()}
                  </div>
                </Document>
              </div>
            </div>

            {/* Right Sidebar: Signing Options */}
            <div className="w-80 p-4 border-l">
              <Tabs defaultValue="type" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger
                    value="type"
                    className={activeTab === "type" ? "border-2 border-destructive" : ""}
                  >
                    Type
                  </TabsTrigger>
                  <TabsTrigger
                    value="draw"
                    className={activeTab === "draw" ? "border-2 border-destructive" : ""}
                  >
                    Draw
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="type">
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold mb-2">Required Fields</h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full flex justify-between items-center"
                        onClick={() => handleAddField("signature")}
                      >
                        <span className="flex items-center">
                          <PenIcon className="h-4 w-4 mr-2" />
                          Signature
                        </span>
                        <span className="text-muted-foreground">cscac</span>
                      </Button>
                    </div>

                    <h3 className="text-sm font-semibold mt-4 mb-2">Optional Fields</h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full flex justify-between items-center"
                        onClick={() => handleAddField("initials")}
                      >
                        <span className="flex items-center">
                          <PenIcon className="h-4 w-4 mr-2" />
                          Initials
                        </span>
                        <span className="text-muted-foreground">C</span>
                      </Button>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="name-input">Name</Label>
                          <Input
                            id="name-input"
                            value={nameValue}
                            onChange={(e) => setNameValue(e.target.value)}
                            placeholder="Enter name"
                            className="flex-1"
                          />
                        </div>
                        <Button
                          variant="outline"
                          className="w-full flex items-center"
                          onClick={() => handleAddField("name")}
                        >
                          <UserIcon className="h-4 w-4 mr-2" />
                          Add Name
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full flex items-center"
                        onClick={() => handleAddField("date")}
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Date
                      </Button>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="text-input">Text</Label>
                          <Input
                            id="text-input"
                            value={textValue}
                            onChange={(e) => setTextValue(e.target.value)}
                            placeholder="Enter text"
                            className="flex-1"
                          />
                        </div>
                        <Button
                          variant="outline"
                          className="w-full flex items-center"
                          onClick={() => handleAddField("text")}
                        >
                          <TypeIcon className="h-4 w-4 mr-2" />
                          Add Text
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label>Stamp</Label>
                          <select
                            value={stampType}
                            onChange={(e) => setStampType(e.target.value)}
                            className="flex-1 p-2 border rounded-md"
                          >
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label>Custom Stamp</Label>
                          <input
                            type="file"
                            accept="image/*"
                            ref={stampInputRef}
                            onChange={handleStampUpload}
                            className="flex-1 text-sm"
                          />
                        </div>
                        <Button
                          variant="outline"
                          className="w-full flex items-center"
                          onClick={() => handleAddField("stamp")}
                        >
                          <StampIcon className="h-4 w-4 mr-2" />
                          Add Stamp
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="draw">
                  <div className="mt-4">
                    <div className="border rounded-md p-2 mb-3">
                      <SignatureCanvas
                        ref={signatureCanvasRef}
                        penColor="currentColor"
                        canvasProps={{
                          className: "signature-canvas w-full h-32",
                        }}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => signatureCanvasRef.current?.clear()}
                        >
                          Clear
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={handleSignatureDraw}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                className="w-full mt-4 bg-destructive hover:bg-destructive/90 text-white"
                onClick={handleSavePdf}
              >
                Sign <span className="ml-2">+</span>
              </Button>
            </div>
          </div>
        )}

        {/* Signed PDF Section */}
        {signedPdfUrl && (
          <div className="text-center py-8">
            <div className="mb-6 p-3 rounded-full bg-muted mx-auto w-16 h-16 flex items-center justify-center">
              <CheckIcon className="h-8 w-8 text-primary" />
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
      </div>
    </div>
  );
}