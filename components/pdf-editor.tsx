"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  AlertCircle, 
  Check, 
  Download, 
  Loader2, 
  Pencil, 
  Trash2, 
  Upload, 
  RefreshCw, 
  Search,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Plus,
  Edit3,
  Save
} from "lucide-react";
import { useLanguageStore } from "@/src/store/store";
import { toast } from "sonner";

export function PdfTextEditor() {
  const { t } = useLanguageStore();
  
  // File state
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [replacements, setReplacements] = useState<{oldText: string, newText: string}[]>([]);
  
  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState("browse");
  const [showTextFinder, setShowTextFinder] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedText, setSelectedText] = useState<any | null>(null);
  
  // Result state
  const [result, setResult] = useState<{
    success: boolean;
    fileUrl?: string;
    message?: string;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
        toast.error("Invalid file type", {
          description: "Please select a PDF file"
        });
        return;
      }
      
      if (selectedFile.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error("File too large", {
          description: "Maximum file size is 100MB"
        });
        return;
      }
      
      setFile(selectedFile);
      setResult(null);
      
      // Upload and process the file
      uploadAndProcessFile(selectedFile);
    }
  };
  
  // Upload and process file for text extraction
  const uploadAndProcessFile = async (file: File) => {
    try {
      setIsUploading(true);
      setProgress(10);
      
      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload file and get session ID
      const response = await fetch('/api/pdf/process', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process PDF');
      }
      
      const data = await response.json();
      setProgress(40);
      
      // Store session ID and page info
      setSessionId(data.sessionId);
      setCurrentPage(0);
      setTotalPages(data.pageCount);
      
      // Now extract text
      await extractText(data.sessionId);
      
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast.error("Failed to process PDF", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsUploading(false);
      setProgress(100);
    }
  };
  
  // Extract text from processed PDF
  const extractText = async (sessionId: string) => {
    try {
      setIsProcessing(true);
      setProgress(50);
      
      // Call OCR API to extract text
      const response = await fetch(`/api/pdf/ocr?sessionId=${sessionId}&language=eng`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract text');
      }
      
      const data = await response.json();
      setProgress(80);
      
      // Store extracted text
      if (data.pages && Array.isArray(data.pages)) {
        setExtractedText(data.pages);
      }
      
      setProgress(100);
      setActiveTab("edit");
      
      toast.success("Text extraction complete", {
        description: "You can now edit or replace text in the document"
      });
      
    } catch (error) {
      console.error('Error extracting text:', error);
      toast.error("Failed to extract text", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };
  
  // Add a new replacement
  const addReplacement = () => {
    setReplacements([...replacements, { oldText: "", newText: "" }]);
  };
  
  // Update a replacement
  const updateReplacement = (index: number, field: 'oldText' | 'newText', value: string) => {
    const updatedReplacements = [...replacements];
    updatedReplacements[index][field] = value;
    setReplacements(updatedReplacements);
  };
  
  // Remove a replacement
  const removeReplacement = (index: number) => {
    const updatedReplacements = [...replacements];
    updatedReplacements.splice(index, 1);
    setReplacements(updatedReplacements);
  };
  
  // Use selected text for replacement
  const useSelectedTextForReplacement = () => {
    if (selectedText && selectedText.text) {
      setReplacements([...replacements, { oldText: selectedText.text, newText: "" }]);
      setSelectedText(null);
    }
  };
  
  // Apply text replacements
  const applyReplacements = async () => {
    if (!sessionId || replacements.length === 0) {
      toast.error("Missing information", {
        description: "Please ensure you have a PDF uploaded and at least one replacement defined"
      });
      return;
    }
    
    // Validate replacements
    const validReplacements = replacements.filter(r => r.oldText.trim() !== "" && r.newText.trim() !== "");
    if (validReplacements.length === 0) {
      toast.error("Invalid replacements", {
        description: "Please ensure all replacements have both original and new text"
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      setProgress(10);
      
      // Format replacements as needed by API
      const replacementMap: Record<string, string> = {};
      validReplacements.forEach(r => {
        replacementMap[r.oldText] = r.newText;
      });
      
      // Call API to apply replacements
      const response = await fetch('/api/pdf/replace-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          replacements: replacementMap
        }),
      });
      
      setProgress(50);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to apply text replacements');
      }
      
      const data = await response.json();
      setProgress(100);
      
      // Set result data
      setResult({
        success: true,
        fileUrl: data.fileUrl,
        message: data.message || "Text replacements applied successfully"
      });
      
      toast.success("Text replacements complete", {
        description: "Your modified PDF is ready to download"
      });
      
    } catch (error) {
      console.error('Error applying replacements:', error);
      toast.error("Failed to apply replacements", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };
  
  // Get current page text elements
  const getCurrentPageTextElements = () => {
    if (!extractedText || extractedText.length === 0 || currentPage >= extractedText.length) {
      return [];
    }
    
    return extractedText[currentPage]?.extractedText || [];
  };
  
  // Filter text elements based on search
  const getFilteredTextElements = () => {
    const elements = getCurrentPageTextElements();
    
    if (!searchText) {
      return elements;
    }
    
    return elements.filter(element => 
      element.text.toLowerCase().includes(searchText.toLowerCase())
    );
  };
  
  // Page navigation
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Zoom controls
  const zoomIn = () => {
    setZoom(Math.min(2, zoom + 0.1));
  };
  
  const zoomOut = () => {
    setZoom(Math.max(0.5, zoom - 0.1));
  };
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const droppedFile = droppedFiles[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.name.toLowerCase().endsWith('.pdf')) {
        setFile(droppedFile);
        uploadAndProcessFile(droppedFile);
      } else {
        toast.error("Invalid file type", {
          description: "Please select a PDF file"
        });
      }
    }
  };
  
  // Render upload area
  const renderUploadArea = () => (
    <div 
      className="border-2 border-dashed rounded-lg p-8 text-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Edit3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">Upload PDF to Edit Text</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Drag and drop your PDF file here, or click to browse
      </p>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      <Button 
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Select PDF File
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground mt-4">
        Maximum file size: 100MB
      </p>
    </div>
  );
  
  // Render page preview
  const renderPagePreview = () => {
    if (!sessionId) return null;
    
    return (
      <div className="border rounded-lg overflow-hidden h-[500px] flex items-center justify-center bg-muted/20">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Processing page...</p>
          </div>
        ) : (
          <div 
            className="relative w-full h-full overflow-auto"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
          >
            <img 
              src={`/processed/${sessionId}-page-${currentPage}.png`}
              alt={`Page ${currentPage + 1}`}
              className="max-w-full block"
            />
            
            {/* Highlight extracted text elements */}
            {activeTab === "edit" && getFilteredTextElements().map((element, index) => (
              <div 
                key={index}
                className={`absolute border border-transparent hover:border-blue-500 cursor-pointer ${selectedText && selectedText.id === `text-${index}` ? 'border-blue-500 bg-blue-100/30' : ''}`}
                style={{
                  left: `${element.x}px`,
                  top: `${element.y}px`,
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                }}
                onClick={() => setSelectedText({
                  id: `text-${index}`,
                  text: element.text,
                  ...element
                })}
              ></div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Render page navigation controls
  const renderPageControls = () => (
    <div className="flex justify-between items-center mt-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevPage}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <div className="flex items-center px-3 py-1 border rounded-md text-sm">
          Page {currentPage + 1} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={zoomOut}
          disabled={zoom <= 0.5}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <div className="flex items-center px-3 py-1 border rounded-md text-sm">
          {Math.round(zoom * 100)}%
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={zoomIn}
          disabled={zoom >= 2}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
  
  // Render text finder
  const renderTextFinder = () => (
    <div className="flex items-center gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for text..."
          className="pl-8"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSearchText("")}
        disabled={!searchText}
      >
        Clear
      </Button>
    </div>
  );
  
  // Render text replacement editor
  const renderReplacementEditor = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Text Replacements</h3>
        <Button 
          size="sm" 
          onClick={addReplacement}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Replacement
        </Button>
      </div>
      
      {selectedText && (
        <Card className="bg-muted/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-sm mb-1">Selected Text</h4>
                <p className="text-sm border bg-background rounded-md p-2">
                  {selectedText.text}
                </p>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={useSelectedTextForReplacement}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Use for Replacement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {replacements.length === 0 ? (
        <div className="text-center py-6 bg-muted/20 rounded-lg">
          <Pencil className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            No replacements defined yet. Add one to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {replacements.map((replacement, index) => (
            <Card key={index} className="relative">
              <Button
                variant="ghost"
                size="icon" 
                className="absolute right-2 top-2 h-6 w-6 text-destructive hover:text-destructive/90"
                onClick={() => removeReplacement(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <CardContent className="p-4 pt-3 grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor={`old-text-${index}`} className="text-xs">Original Text</Label>
                  <Textarea
                    id={`old-text-${index}`}
                    value={replacement.oldText}
                    onChange={(e) => updateReplacement(index, 'oldText', e.target.value)}
                    placeholder="Text to find..."
                    rows={3}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`new-text-${index}`} className="text-xs">New Text</Label>
                  <Textarea
                    id={`new-text-${index}`}
                    value={replacement.newText}
                    onChange={(e) => updateReplacement(index, 'newText', e.target.value)}
                    placeholder="Text to replace with..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="pt-4">
        <Button 
          className="w-full"
          onClick={applyReplacements}
          disabled={isProcessing || replacements.length === 0}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Apply Text Replacements
            </>
          )}
        </Button>
      </div>
    </div>
  );
  
  // Render editor interface
  const renderEditor = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium">{file?.name}</h3>
          <p className="text-sm text-muted-foreground">
            {formatFileSize(file?.size || 0)} • {totalPages} pages
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setFile(null);
            setSessionId(null);
            setExtractedText([]);
            setReplacements([]);
            setResult(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        >
          Change File
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="browse">
            <Search className="h-4 w-4 mr-2" />
            Browse Text
          </TabsTrigger>
          <TabsTrigger value="edit">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Text
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-4">
          {renderTextFinder()}
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {renderPagePreview()}
              {renderPageControls()}
            </div>
            
            <Card className="h-[556px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Extracted Text</CardTitle>
                <CardDescription>
                  Page {currentPage + 1} of {totalPages}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 overflow-auto h-[460px]">
                <div className="space-y-2">
                  {getFilteredTextElements().length > 0 ? (
                    getFilteredTextElements().map((element, index) => (
                      <div 
                        key={index} 
                        className={`p-2 border rounded-md cursor-pointer text-sm hover:bg-muted/50 transition-colors ${selectedText && selectedText.id === `text-${index}` ? 'bg-blue-100/30 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : ''}`}
                        onClick={() => setSelectedText({
                          id: `text-${index}`,
                          text: element.text,
                          ...element
                        })}
                      >
                        {element.text}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        {searchText ? "No matching text found" : "No text detected on this page"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="edit" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {renderPagePreview()}
              {renderPageControls()}
            </div>
            
            <div className="space-y-4">
              {renderReplacementEditor()}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
  
  // Render processing state
  const renderProcessingState = () => (
    <div className="space-y-4 py-6">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Processing Your PDF</h3>
        <p className="text-sm text-muted-foreground">
          Please wait while we extract and process the text content...
        </p>
      </div>
      
      <div className="space-y-1">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-right text-muted-foreground">{progress}%</p>
      </div>
    </div>
  );
  
  // Render result state
  const renderResult = () => {
    if (!result) return null;
    
    return (
      <div className="space-y-6">
        {result.success ? (
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-600 dark:text-green-400">
              {result.message || "Text replacement complete"}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {result.message || "Failed to apply text replacements"}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Replacements Applied</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Original Text</TableHead>
                      <TableHead>New Text</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {replacements.map((replacement, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{replacement.oldText}</TableCell>
                        <TableCell className="font-mono text-sm">{replacement.newText}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Download Your Edited PDF</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">
                  Your PDF has been successfully edited. You can download it now.
                </p>
                
                {result.fileUrl && (
                  <Button asChild className="w-full">
                    <a href={result.fileUrl} download={file?.name.replace(".pdf", "_edited.pdf")}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Edited PDF
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setFile(null);
                setSessionId(null);
                setExtractedText([]);
                setReplacements([]);
                setResult(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Edit Another PDF
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  // Main render logic
  if (isUploading || isProcessing) {
    return renderProcessingState();
  } else if (result) {
    return renderResult();
  } else if (file && sessionId) {
    return renderEditor();
  } else {
    return renderUploadArea();
  }
}