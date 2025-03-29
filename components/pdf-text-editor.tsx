// components/pdf-text-editor.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  FileText, 
  Upload, 
  CheckCircle, 
  Save,
  Edit3, 
  Search, 
  Trash2, 
  Plus, 
  TextCursor,
  X,
  Download,
  AlertCircle,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  PenTool,
  Type,
} from "lucide-react";
import { toast } from "sonner";

// Text detection result interface
interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  pageIndex: number;
}

// Edit operation interface
interface EditOperation {
  type: 'replace' | 'add' | 'remove';
  pageIndex: number;
  text?: string;
  replacementText?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  id?: string; // For referencing OCR detected text elements
}

interface PdfTextEditorProps {
  onComplete?: (fileUrl: string) => void;
}

export function PdfTextEditor({ onComplete }: PdfTextEditorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1.0);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [editedPdfUrl, setEditedPdfUrl] = useState<string>('');
  const [selectedText, setSelectedText] = useState<TextElement | null>(null);
  const [replacementText, setReplacementText] = useState('');
  const [editOperations, setEditOperations] = useState<EditOperation[]>([]);
  const [textDetectionMode, setTextDetectionMode] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [addingText, setAddingText] = useState(false);
  const [newText, setNewText] = useState({
    text: '',
    x: 0,
    y: 0,
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#000000'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedFontFamily, setSelectedFontFamily] = useState('Helvetica');
  const [selectedFontSize, setSelectedFontSize] = useState(12);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<TextElement[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [loading, setLoading] = useState<{
    upload: boolean;
    detection: boolean;
    rendering: boolean;
    editing: boolean;
    saving: boolean;
  }>({
    upload: false,
    detection: false,
    rendering: false,
    editing: false,
    saving: false
  });

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleFileUpload(selectedFile);
    }
  };

  // Process the PDF file
  const handleFileUpload = async (selectedFile: File) => {
    if (!selectedFile || !selectedFile.name.toLowerCase().endsWith('.pdf')) {
        toast.error("Invalid file type",{
        description: "Please upload a PDF file",
      });
      return;
    }

    setLoading(prev => ({ ...prev, upload: true }));
    
    try {
      // Upload the PDF for text detection
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('detectText', textDetectionMode.toString());
      formData.append('language', 'eng'); // Default to English
      
      // First just upload for rendering (without applying edits)
      const response = await fetch('/api/pdf/edit', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload PDF');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to process PDF');
      }
      
      // Set PDF URL for rendering
      setPdfUrl(data.fileUrl);
      setTotalPages(data.pageCount || 1);
      setCurrentPage(1);
      
      // If text detection was enabled, set text elements
      if (textDetectionMode && data.textData) {
        setTextElements(data.textData || []);
      } else {
        setTextElements([]);
      }
      
      // Reset editor state
      setEditOperations([]);
      setSelectedText(null);
      setReplacementText('');
      
      toast.success("PDF uploaded successfully",{
        description: textDetectionMode ? 
          "Text elements have been detected and are ready for editing." : 
          "PDF is ready for editing.",
      });
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error("Error uploading PDF",{
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setLoading(prev => ({ ...prev, upload: false }));
    }
  };

  // Handle canvas click for text selection or adding new text
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    if (addingText) {
      // Add new text at click position
      const newOperation: EditOperation = {
        type: 'add',
        pageIndex: currentPage - 1,
        text: newText.text,
        x,
        y,
        fontSize: newText.fontSize,
        fontFamily: newText.fontFamily,
        color: newText.color
      };
      
      setEditOperations([...editOperations, newOperation]);
      setAddingText(false);
      
      toast.success( "Text added",{
        description: `New text "${newText.text}" has been added to the document.`
      });
    } else {
      // Find if user clicked on any text element
      const clickedElement = textElements.find(element => {
        if (element.pageIndex !== currentPage - 1) return false;
        
        return (
          x >= element.x && 
          x <= element.x + element.width && 
          y >= element.y && 
          y <= element.y + element.height
        );
      });
      
      if (clickedElement) {
        setSelectedText(clickedElement);
        setReplacementText(clickedElement.text);
      } else {
        setSelectedText(null);
      }
    }
  };

  // Apply text replacement
  const applyTextReplacement = () => {
    if (!selectedText || !replacementText) return;
    
    // Create a replacement operation
    const replaceOperation: EditOperation = {
      type: 'replace',
      pageIndex: selectedText.pageIndex,
      text: selectedText.text,
      replacementText,
      x: selectedText.x,
      y: selectedText.y,
      width: selectedText.width,
      height: selectedText.height,
      fontSize: selectedText.fontSize,
      fontFamily: selectedText.fontFamily,
      id: selectedText.id
    };
    
    // Add to edit operations
    setEditOperations([...editOperations, replaceOperation]);
    
    // Update the UI
    toast("Text replaced",{
      description: `"${selectedText.text}" has been replaced with "${replacementText}"`
    });
    
    // Reset selection
    setSelectedText(null);
    setReplacementText('');
  };

  // Delete selected text
  const deleteSelectedText = () => {
    if (!selectedText) return;
    
    // Create a remove operation
    const removeOperation: EditOperation = {
      type: 'remove',
      pageIndex: selectedText.pageIndex,
      text: selectedText.text,
      x: selectedText.x,
      y: selectedText.y,
      width: selectedText.width,
      height: selectedText.height,
      id: selectedText.id
    };
    
    // Add to edit operations
    setEditOperations([...editOperations, removeOperation]);
    
    // Update the UI
    toast("Text removed",{
      description: `"${selectedText.text}" has been removed from the document`
    });
    
    // Reset selection
    setSelectedText(null);
  };

  // Save edited PDF
  const saveEditedPdf = async () => {
    if (!file) return;
    
    setSaving(true);
    
    try {
      // Create form data with file and edit operations
      const formData = new FormData();
      formData.append('file', file);
      formData.append('edits', JSON.stringify(editOperations));
      
      // Send to backend
      const response = await fetch('/api/pdf/edit', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to save edited PDF');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to save edited PDF');
      }
      
      // Set edited PDF URL
      setEditedPdfUrl(data.fileUrl);
      
      // Show success message
      toast.success( "PDF saved successfully",{
        description: "Your edited PDF is ready for download",
      });
      
      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete(data.fileUrl);
      }
    } catch (error) {
      console.error('Error saving edited PDF:', error);
      toast.error( "Error saving PDF",{
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setSaving(false);
    }
  };

  // Reset the editor
  const resetEditor = () => {
    setFile(null);
    setPdfUrl('');
    setEditedPdfUrl('');
    setTextElements([]);
    setSelectedText(null);
    setReplacementText('');
    setEditOperations([]);
    setCurrentPage(1);
    setTotalPages(0);
    setZoom(1.0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Search functionality
  const searchForText = () => {
    if (!searchText) {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
      return;
    }
    
    const results = textElements.filter(
      element => element.text.toLowerCase().includes(searchText.toLowerCase())
    );
    
    setSearchResults(results);
    
    if (results.length > 0) {
      setCurrentSearchIndex(0);
      navigateToTextElement(results[0]);
    } else {
      toast("No matches found",{
        description: `Could not find any text matching "${searchText}"`,
      });
    }
  };

  // Navigate to a specific text element
  const navigateToTextElement = (element: TextElement) => {
    setCurrentPage(element.pageIndex + 1);
    setSelectedText(element);
    setReplacementText(element.text);
    
    // Scroll to element position
    if (canvasRef.current) {
      setTimeout(() => {
        canvasRef.current?.scrollTo({
          left: element.x * zoom - 100,
          top: element.y * zoom - 100,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  // Navigate between search results
  const navigateSearch = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;
    
    let newIndex = currentSearchIndex;
    
    if (direction === 'next') {
      newIndex = (newIndex + 1) % searchResults.length;
    } else {
      newIndex = (newIndex - 1 + searchResults.length) % searchResults.length;
    }
    
    setCurrentSearchIndex(newIndex);
    navigateToTextElement(searchResults[newIndex]);
  };

  // Update canvas offset when ref changes or zoom changes
  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setCanvasOffset({ x: rect.left, y: rect.top });
    }
  }, [canvasRef, zoom]);

  // Render PDF canvas with text elements and edits
  const renderPdfWithTextElements = () => {
    if (!pdfUrl) return null;
    
    // Filter text elements for current page
    const currentPageElements = textElements.filter(
      element => element.pageIndex === currentPage - 1
    );
    
    return (
      <div 
        className="relative border rounded-lg bg-white" 
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{
          minHeight: "600px",
          maxHeight: "80vh",
          overflow: "auto",
          position: "relative",
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
          transition: "transform 0.2s ease"
        }}
      >
        {/* PDF Viewer */}
        <iframe 
          src={`${pdfUrl}#page=${currentPage}`}
          className="w-full h-full"
          style={{ border: "none", minHeight: "600px" }}
        />
        
        {/* Text elements overlay */}
        {previewMode ? null : (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {currentPageElements.map(element => {
              // Check if this element has been edited
              const isEdited = editOperations.some(op => 
                op.id === element.id || 
                (op.text === element.text && 
                 op.pageIndex === element.pageIndex && 
                 op.x === element.x && 
                 op.y === element.y)
              );
              
              const isSelected = selectedText?.id === element.id;
              
              return (
                <div
                  key={element.id}
                  className={`absolute border-2 ${isSelected ? 'border-blue-500 bg-blue-100/20' : isEdited ? 'border-green-500' : 'border-transparent hover:border-gray-300'} rounded cursor-pointer pointer-events-auto`}
                  style={{
                    left: `${element.x}px`,
                    top: `${element.y}px`,
                    width: `${element.width}px`,
                    height: `${element.height}px`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedText(element);
                    setReplacementText(element.text);
                  }}
                >
                  {isEdited && (
                    <div className="absolute -top-5 -right-2 bg-green-500 text-white text-xs px-1 rounded">
                      Edited
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {/* Added text elements overlay */}
        {previewMode ? null : (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {editOperations
              .filter(op => op.type === 'add' && op.pageIndex === currentPage - 1)
              .map((op, idx) => (
                <div
                  key={`add-${idx}`}
                  className="absolute border-2 border-purple-500 bg-purple-100/20 rounded cursor-pointer pointer-events-auto"
                  style={{
                    left: `${op.x}px`,
                    top: `${op.y}px`,
                    minWidth: '50px',
                    minHeight: '20px',
                    padding: '2px'
                  }}
                >
                  <div className="text-sm" style={{
                    fontSize: `${op.fontSize}px`,
                    fontFamily: op.fontFamily || 'Arial',
                    color: op.color || '#000000'
                  }}>
                    {op.text}
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle>PDF Text Editor</CardTitle>
          <CardDescription>
            Edit and replace text in your PDF documents with advanced OCR detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg">
              <FileText className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-4">Upload a PDF to get started</h3>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={loading.upload}
              >
                {loading.upload ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload PDF
                  </>
                )}
              </Button>
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="flex items-center mb-2">
                  <Checkbox 
                    id="detectText" 
                    checked={textDetectionMode} 
                    onCheckedChange={(checked) => setTextDetectionMode(!!checked)}
                  />
                  <Label htmlFor="detectText" className="ml-2">
                    Detect text with OCR (more accurate for text replacement)
                  </Label>
                </div>
                <p>Supported file type: PDF (Max 10MB)</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => resetEditor()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New PDF
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                      disabled={zoom <= 0.5}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                      disabled={zoom >= 2}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    {previewMode ? (
                      <>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Mode
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </>
                    )}
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={saveEditedPdf}
                    disabled={saving || editOperations.length === 0}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Search bar */}
              {textElements.length > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search for text..."
                      className="pl-8"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          searchForText();
                        }
                      }}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={searchForText}
                  >
                    Search
                  </Button>
                  {searchResults.length > 0 && (
                    <>
                      <span className="text-sm text-muted-foreground">
                        {currentSearchIndex + 1} of {searchResults.length}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigateSearch('prev')}
                        disabled={searchResults.length <= 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigateSearch('next')}
                        disabled={searchResults.length <= 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              )}
              
              {/* PDF Editor area */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3">
                  {renderPdfWithTextElements()}
                  
                  {/* Page navigation controls */}
                  <div className="flex items-center justify-center mt-4 space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Editor sidebar */}
                <div>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Text Editor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedText ? (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="original-text">Original Text</Label>
                            <div
                              id="original-text"
                              className="mt-1 p-2 bg-muted rounded-md text-sm"
                            >
                              {selectedText.text}
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="replacement-text">Replacement Text</Label>
                            <Textarea
                              id="replacement-text"
                              value={replacementText}
                              onChange={(e) => setReplacementText(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              onClick={applyTextReplacement}
                              disabled={!replacementText}
                              className="flex-1"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Replace
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={deleteSelectedText}
                              className="flex-1"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {addingText ? (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="new-text">New Text</Label>
                                <Textarea
                                  id="new-text"
                                  value={newText.text}
                                  onChange={(e) => setNewText({...newText, text: e.target.value})}
                                  className="mt-1"
                                  placeholder="Enter text to add..."
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="font-family">Font</Label>
                                <Select 
                                  value={newText.fontFamily} 
                                  onValueChange={(value) => setNewText({...newText, fontFamily: value})}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select font" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                                    <SelectItem value="Times">Times Roman</SelectItem>
                                    <SelectItem value="Courier">Courier</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label htmlFor="font-size">Font Size: {newText.fontSize}px</Label>
                                <Slider
                                  id="font-size"
                                  min={8}
                                  max={36}
                                  step={1}
                                  value={[newText.fontSize]}
                                  onValueChange={(value) => setNewText({...newText, fontSize: value[0]})}
                                  className="mt-1"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="text-color">Text Color</Label>
                                <div className="flex items-center mt-1 space-x-2">
                                  <input
                                    type="color"
                                    value={newText.color}
                                    onChange={(e) => setNewText({...newText, color: e.target.value})}
                                    className="w-8 h-8 cursor-pointer border rounded"
                                  />
                                  <Input
                                    value={newText.color}
                                    onChange={(e) => setNewText({...newText, color: e.target.value})}
                                    className="flex-1"
                                  />
                                </div>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setAddingText(false)}
                                  className="flex-1"
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel
                                </Button>
                                <Button
                                  disabled={!newText.text}
                                  onClick={() => {
                                    // Instead of adding directly, we enter "placement mode"
                                    // where the next click on the canvas will place the text
                                    toast( "Click on the document",{
                                      description: "Click where you want to place the text"
                                    });
                                  }}
                                  className="flex-1"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Place Text
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="text-center py-2">
                                <p className="text-muted-foreground mb-4">
                                  {textElements.length > 0 
                                    ? "Click on text in the document to edit it" 
                                    : "No text elements detected"}
                                </p>
                                <Button
                                  onClick={() => setAddingText(true)}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add New Text
                                </Button>
                              </div>
                              
                              <Separator />
                              
                              <div className="space-y-2">
                                <h3 className="font-medium text-sm">Edit Operations</h3>
                                {editOperations.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">No edits made yet</p>
                                ) : (
                                  <div className="max-h-60 overflow-y-auto space-y-2">
                                    {editOperations.map((op, idx) => (
                                      <div 
                                        key={idx} 
                                        className="text-xs p-2 border rounded flex items-start justify-between"
                                      >
                                        <div>
                                          <span className="font-semibold">
                                            {op.type === 'replace' ? 'Replace' : 
                                             op.type === 'add' ? 'Add' : 'Remove'}
                                          </span>
                                          <span className="text-muted-foreground ml-1">
                                            (Page {op.pageIndex + 1})
                                          </span>
                                          <div className="mt-1">
                                            {op.type === 'replace' ? (
                                              <>
                                                <div className="line-through">{op.text}</div>
                                                <div>{op.replacementText}</div>
                                              </>
                                            ) : op.type === 'add' ? (
                                              <div>{op.text}</div>
                                            ) : (
                                              <div className="line-through">{op.text}</div>
                                            )}
                                          </div>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-5 w-5 text-destructive"
                                          onClick={() => {
                                            setEditOperations(editOperations.filter((_, i) => i !== idx));
                                          }}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Show download button if file has been saved */}
              {editedPdfUrl && (
                <div className="mt-4">
                  <Alert className="bg-green-50 dark:bg-green-900/20">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle>PDF Edited Successfully</AlertTitle>
                    <AlertDescription>
                      Your PDF has been edited and is ready for download.
                      <div className="mt-2">
                        <Button asChild>
                          <a href={editedPdfUrl} download>
                            <Download className="h-4 w-4 mr-2" />
                            Download Edited PDF
                          </a>
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}