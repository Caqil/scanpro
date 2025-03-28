"use client";

import { useState, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Label 
} from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertCircle, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle, 
  Download, 
  FileText, 
  RefreshCw, 
  ScanLine, 
  Upload 
} from "lucide-react";
import { useLanguageStore } from "@/src/store/store";
import { toast } from "sonner";

export function PdfComparer() {
  const { t } = useLanguageStore();
  
  // State for file inputs
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [modifiedFile, setModifiedFile] = useState<File | null>(null);
  const originalFileInputRef = useRef<HTMLInputElement>(null);
  const modifiedFileInputRef = useRef<HTMLInputElement>(null);

  // Comparison options
  const [compareText, setCompareText] = useState(true);
  const [compareImages, setCompareImages] = useState(true);
  const [compareFormatting, setCompareFormatting] = useState(true);
  const [sensitivityLevel, setSensitivityLevel] = useState(50);
  const [skipAnnotations, setSkipAnnotations] = useState(false);
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  // Handle file selection for original PDF
  const handleOriginalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        toast.error(t('comparePdf.errors.notPdf'));
        return;
      }
      
      setOriginalFile(file);
      setError(null);
    }
  };

  // Handle file selection for modified PDF
  const handleModifiedFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        toast.error(t('comparePdf.errors.notPdf'));
        return;
      }
      
      setModifiedFile(file);
      setError(null);
    }
  };

  // Handle file drop events
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, fileType: 'original' | 'modified') => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        toast.error(t('comparePdf.errors.notPdf'));
        return;
      }
      
      if (fileType === 'original') {
        setOriginalFile(file);
      } else {
        setModifiedFile(file);
      }
      
      setError(null);
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle comparison process
  const handleCompare = async () => {
    if (!originalFile || !modifiedFile) {
      setError(t('comparePdf.errors.missingFiles'));
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setResultUrl(null);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 500);

    try {
      // Create form data for the API request
      const formData = new FormData();
      formData.append('originalFile', originalFile);
      formData.append('modifiedFile', modifiedFile);
      formData.append('compareText', compareText.toString());
      formData.append('compareImages', compareImages.toString());
      formData.append('compareFormatting', compareFormatting.toString());
      formData.append('sensitivityLevel', sensitivityLevel.toString());
      formData.append('skipAnnotations', skipAnnotations.toString());

      // Call the API endpoint
      const response = await fetch('/api/pdf/compare', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to compare PDFs');
      }

      const result = await response.json();
      
      // Set result URL
      setResultUrl(result.fileUrl);
      
      // Complete progress
      setProgress(100);
      toast.success(t('comparePdf.success'));
      
    } catch (err) {
      console.error("PDF comparison error:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error(t('comparePdf.errors.processingFailed'));
    } finally {
      clearInterval(progressInterval);
      setIsProcessing(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setOriginalFile(null);
    setModifiedFile(null);
    setCompareText(true);
    setCompareImages(true);
    setCompareFormatting(true);
    setSensitivityLevel(50);
    setSkipAnnotations(false);
    setError(null);
    setResultUrl(null);
    setProgress(0);
    
    // Reset file inputs
    if (originalFileInputRef.current) originalFileInputRef.current.value = '';
    if (modifiedFileInputRef.current) modifiedFileInputRef.current.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('comparePdf.toolTitle')}</CardTitle>
        <CardDescription>
          {t('comparePdf.toolDescription')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              {t('comparePdf.uploadFiles')}
            </TabsTrigger>
            <TabsTrigger value="options">
              <ScanLine className="h-4 w-4 mr-2" />
              {t('comparePdf.comparisonOptions')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            {/* Original File Upload */}
            <div className="space-y-2">
              <Label htmlFor="originalFile" className="text-base font-medium">
                {t('comparePdf.originalFile')}
              </Label>
              
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center ${originalFile ? 'border-primary' : 'border-muted-foreground/20'} hover:border-primary/50 transition-colors`}
                onDrop={(e) => handleDrop(e, 'original')}
                onDragOver={handleDragOver}
              >
                {originalFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-8 w-8 text-primary" />
                    <p className="font-medium">{originalFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(originalFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setOriginalFile(null);
                        if (originalFileInputRef.current) originalFileInputRef.current.value = '';
                      }}
                    >
                      {t('comparePdf.removeFile')}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="font-medium">{t('comparePdf.dragDropOriginal')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('comparePdf.orClickUpload')}
                    </p>
                    <Button variant="secondary" size="sm" onClick={() => originalFileInputRef.current?.click()}>
                      {t('comparePdf.selectFile')}
                    </Button>
                  </div>
                )}
                <Input 
                  id="originalFile" 
                  type="file" 
                  accept=".pdf" 
                  className="hidden"
                  onChange={handleOriginalFileChange}
                  ref={originalFileInputRef}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-center my-4">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>
            
            {/* Modified File Upload */}
            <div className="space-y-2">
              <Label htmlFor="modifiedFile" className="text-base font-medium">
                {t('comparePdf.modifiedFile')}
              </Label>
              
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center ${modifiedFile ? 'border-primary' : 'border-muted-foreground/20'} hover:border-primary/50 transition-colors`}
                onDrop={(e) => handleDrop(e, 'modified')}
                onDragOver={handleDragOver}
              >
                {modifiedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-8 w-8 text-primary" />
                    <p className="font-medium">{modifiedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(modifiedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setModifiedFile(null);
                        if (modifiedFileInputRef.current) modifiedFileInputRef.current.value = '';
                      }}
                    >
                      {t('comparePdf.removeFile')}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="font-medium">{t('comparePdf.dragDropModified')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('comparePdf.orClickUpload')}
                    </p>
                    <Button variant="secondary" size="sm" onClick={() => modifiedFileInputRef.current?.click()}>
                      {t('comparePdf.selectFile')}
                    </Button>
                  </div>
                )}
                <Input 
                  id="modifiedFile" 
                  type="file" 
                  accept=".pdf" 
                  className="hidden"
                  onChange={handleModifiedFileChange}
                  ref={modifiedFileInputRef}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="options" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="compare-text" className="text-base cursor-pointer">
                    {t('comparePdf.options.compareText')}
                  </Label>
                  <Switch 
                    id="compare-text" 
                    checked={compareText}
                    onCheckedChange={setCompareText}
                  />
                </div>
                {compareText && (
                  <p className="text-sm text-muted-foreground">
                    {t('comparePdf.options.compareTextDescription')}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="compare-images" className="text-base cursor-pointer">
                    {t('comparePdf.options.compareImages')}
                  </Label>
                  <Switch 
                    id="compare-images" 
                    checked={compareImages}
                    onCheckedChange={setCompareImages}
                  />
                </div>
                {compareImages && (
                  <p className="text-sm text-muted-foreground">
                    {t('comparePdf.options.compareImagesDescription')}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="compare-formatting" className="text-base cursor-pointer">
                    {t('comparePdf.options.compareFormatting')}
                  </Label>
                  <Switch 
                    id="compare-formatting" 
                    checked={compareFormatting}
                    onCheckedChange={setCompareFormatting}
                  />
                </div>
                {compareFormatting && (
                  <p className="text-sm text-muted-foreground">
                    {t('comparePdf.options.compareFormattingDescription')}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="skip-annotations" className="text-base cursor-pointer">
                    {t('comparePdf.options.skipAnnotations')}
                  </Label>
                  <Switch 
                    id="skip-annotations" 
                    checked={skipAnnotations}
                    onCheckedChange={setSkipAnnotations}
                  />
                </div>
                {skipAnnotations && (
                  <p className="text-sm text-muted-foreground">
                    {t('comparePdf.options.skipAnnotationsDescription')}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="sensitivity" className="text-base">
                    {t('comparePdf.options.sensitivityLevel')}
                  </Label>
                  <span className="text-sm font-medium">{sensitivityLevel}%</span>
                </div>
                <Slider
                  id="sensitivity"
                  min={10}
                  max={100}
                  step={5}
                  value={[sensitivityLevel]}
                  onValueChange={(values) => setSensitivityLevel(values[0])}
                  className="w-full"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">
                    {t('comparePdf.options.lower')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t('comparePdf.options.higher')}
                  </span>
                </div>
              </div>
              
              <Alert className="bg-muted/50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {t('comparePdf.options.sensitivityNote')}
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>

        {/* Processing Progress */}
        {isProcessing && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <p className="text-sm font-medium">
                {t('comparePdf.processing')}
              </p>
            </div>
            <Progress value={progress} className="h-2 w-full" />
            <p className="text-xs text-muted-foreground text-center">
              {progress < 100 
                ? t('comparePdf.processingStep') 
                : t('comparePdf.processingComplete')}
            </p>
          </div>
        )}

        {/* Results Section */}
        {resultUrl && !isProcessing && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">
                  {t('comparePdf.comparisonResults')}
                </h3>
              </div>
              <Button variant="outline" size="sm" onClick={handleReset}>
                {t('comparePdf.newComparison')}
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              {t('comparePdf.resultsDescription')}
            </p>
            
            <Button asChild className="w-full">
              <a href={resultUrl} download target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                {t('comparePdf.downloadResults')}
              </a>
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={handleReset}
          disabled={isProcessing || (!originalFile && !modifiedFile)}
        >
          {t('comparePdf.reset')}
        </Button>
        
        <Button 
          onClick={handleCompare}
          disabled={isProcessing || !originalFile || !modifiedFile}
        >
          {isProcessing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              {t('comparePdf.comparing')}
            </>
          ) : (
            <>
              <ScanLine className="h-4 w-4 mr-2" />
              {t('comparePdf.compare')}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}