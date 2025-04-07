"use client";

import { useState, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLanguageStore } from "@/src/store/store";
import { 
  FileIcon,
  UploadIcon,
  Trash2Icon,
  FileTextIcon,
  ImageIcon,
  DownloadIcon,
  CheckIcon
} from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";

interface FileWithPreview extends File {
  preview?: string;
}

export function RemoveWatermarkClient() {
  const { t } = useLanguageStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [processedFileUrl, setProcessedFileUrl] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  
  // Removal options
  const [removalMethod, setRemovalMethod] = useState<string>("standard");
  const [watermarkType, setWatermarkType] = useState<string>("both");
  const [textPattern, setTextPattern] = useState<string>("");
  const [enhanceContrast, setEnhanceContrast] = useState<boolean>(false);
  const [backgroundCleanup, setBackgroundCleanup] = useState<boolean>(false);
  const [preserveFormFields, setPreserveFormFields] = useState<boolean>(true);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const selectedFile = files[0];
    if (selectedFile.type !== "application/pdf") {
      toast({
        title: t("ui.error"),
        description: t("ui.invalidFile"),
        variant: "destructive"
      });
      return;
    }

    handleFile(selectedFile);
  };

  const handleFile = (selectedFile: File) => {
    const fileWithPreview = selectedFile as FileWithPreview;
    setFile(fileWithPreview);
    
    // Reset states
    setIsProcessing(false);
    setProcessedFileUrl("");
    setProgress(0);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length === 0) return;
    
    const droppedFile = files[0];
    if (droppedFile.type !== "application/pdf") {
      toast({
        title: t("ui.error"),
        description: t("ui.invalidFile"),
        variant: "destructive"
      });
      return;
    }
    
    handleFile(droppedFile);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  const removeWatermark = async () => {
    if (!file) {
      toast({
        title: t("ui.error"),
        description: t("removeWatermark.errors.noFile"),
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("removalMethod", removalMethod);
      formData.append("watermarkType", watermarkType);
      formData.append("textPattern", textPattern);
      formData.append("enhanceContrast", enhanceContrast.toString());
      formData.append("backgroundCleanup", backgroundCleanup.toString());
      formData.append("preserveFormFields", preserveFormFields.toString());

      setProgress(30);

      const response = await fetch("/api/pdf/remove-watermark", {
        method: "POST",
        body: formData,
      });

      setProgress(80);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setProcessedFileUrl(result.fileUrl);
        setProgress(100);
        toast({
          title: t("removeWatermark.success"),
          description: t("removeWatermark.successDesc"),
        });
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error removing watermark:", error);
      toast({
        title: t("removeWatermark.errors.failed"),
        
        description: error instanceof Error ? error.message : t("removeWatermark.errors.unknown"),
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedFileUrl) {
      window.open(processedFileUrl, "_blank");
    }
  };

  const resetForm = () => {
    setFile(null);
    setProcessedFileUrl("");
    setProgress(0);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const renderUploadSection = () => (
    <div 
      className={`border-2 border-dashed rounded-lg p-6 md:p-10 text-center transition-colors ${
        isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/20"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf"
        onChange={handleFileChange}
      />
      <div className="mb-4 p-3 rounded-full bg-primary/10 mx-auto w-16 h-16 flex items-center justify-center">
        <UploadIcon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {t("removeWatermark.uploadTitle")}
      </h3>
      <p className="text-muted-foreground mb-6">
        {t("removeWatermark.uploadDesc")}
      </p>
      <Button 
        onClick={() => fileInputRef.current?.click()}
        className="mx-auto"
      >
        {t("fileUploader.browse")}
      </Button>
      <p className="mt-4 text-xs text-muted-foreground">
        PDF {t("fileUploader.maxSize")}
      </p>
    </div>
  );

  const renderFilePreview = () => (
    <div className="rounded-lg border p-4">
      <div className="flex items-center">
        <div className="p-2 bg-muted rounded mr-3">
          <FileIcon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file?.name}</p>
          <p className="text-xs text-muted-foreground">
            {(file?.size ? Math.round(file.size / 1024) : 0)} KB
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={resetForm}
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderOptionsPanel = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t("removeWatermark.form.removalMethod")}</Label>
        <RadioGroup 
          defaultValue="standard" 
          value={removalMethod} 
          onValueChange={setRemovalMethod}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard" className="font-normal">
              {t("removeWatermark.form.standardMethod")}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="advanced" id="advanced" />
            <Label htmlFor="advanced" className="font-normal">
              {t("removeWatermark.form.advancedMethod")}
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>{t("removeWatermark.form.watermarkType")}</Label>
        <RadioGroup 
          defaultValue="both" 
          value={watermarkType} 
          onValueChange={setWatermarkType}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both" className="font-normal">
              {t("removeWatermark.form.bothTypes")}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="text" />
            <Label htmlFor="text" className="font-normal flex items-center">
              <FileTextIcon className="h-4 w-4 mr-1.5" />
              {t("removeWatermark.form.textWatermarks")}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="image" id="image" />
            <Label htmlFor="image" className="font-normal flex items-center">
              <ImageIcon className="h-4 w-4 mr-1.5" />
              {t("removeWatermark.form.imageWatermarks")}
            </Label>
          </div>
        </RadioGroup>
      </div>

      {(watermarkType === 'text' || watermarkType === 'both') && (
        <div className="space-y-2">
          <Label htmlFor="textPattern">{t("removeWatermark.form.textPattern")}</Label>
          <Input 
            id="textPattern" 
            placeholder={t("removeWatermark.form.textPatternPlaceholder")}
            value={textPattern}
            onChange={(e) => setTextPattern(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {t("removeWatermark.form.textPatternHint")}
          </p>
        </div>
      )}

      <div className="space-y-3 pt-2">
        <Label>{t("removeWatermark.form.advancedOptions")}</Label>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="enhanceContrast" 
            checked={enhanceContrast}
            onCheckedChange={(checked) => 
              setEnhanceContrast(checked === true)
            }
          />
          <div className="grid gap-1.5 leading-none">
            <Label 
              htmlFor="enhanceContrast" 
              className="font-normal cursor-pointer"
            >
              {t("removeWatermark.form.enhanceContrast")}
            </Label>
            <p className="text-xs text-muted-foreground">
              {t("removeWatermark.form.enhanceContrastHint")}
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="backgroundCleanup" 
            checked={backgroundCleanup}
            onCheckedChange={(checked) => 
              setBackgroundCleanup(checked === true)
            }
          />
          <div className="grid gap-1.5 leading-none">
            <Label 
              htmlFor="backgroundCleanup" 
              className="font-normal cursor-pointer"
            >
              {t("removeWatermark.form.backgroundCleanup")}
            </Label>
            <p className="text-xs text-muted-foreground">
              {t("removeWatermark.form.backgroundCleanupHint")}
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="preserveFormFields" 
            checked={preserveFormFields}
            onCheckedChange={(checked) => 
              setPreserveFormFields(checked === true)
            }
          />
          <div className="grid gap-1.5 leading-none">
            <Label 
              htmlFor="preserveFormFields" 
              className="font-normal cursor-pointer"
            >
              {t("removeWatermark.form.preserveFormFields")}
            </Label>
            <p className="text-xs text-muted-foreground">
              {t("removeWatermark.form.preserveFormFieldsHint")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProcessingState = () => (
    <div className="text-center p-6">
      <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
      <h3 className="text-lg font-medium mb-2">
        {t("removeWatermark.processing")}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {t("removeWatermark.processingDesc")}
      </p>
      <Progress value={progress} className="w-full h-2" />
    </div>
  );

  const renderSuccessState = () => (
    <div className="text-center p-6">
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
        <CheckIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">
        {t("removeWatermark.success")}
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        {t("removeWatermark.successDesc")}
      </p>
      <div className="flex space-x-3 justify-center">
        <Button variant="outline" onClick={resetForm}>
          {t("ui.reupload")}
        </Button>
        <Button onClick={handleDownload}>
          <DownloadIcon className="mr-2 h-4 w-4" />
          {t("ui.download")}
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("removeWatermark.title")}</CardTitle>
        <CardDescription>{t("removeWatermark.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {!file && renderUploadSection()}
        
        {file && !isProcessing && !processedFileUrl && (
          <div className="space-y-6">
            {renderFilePreview()}
            <Separator />
            {renderOptionsPanel()}
          </div>
        )}
        
        {isProcessing && renderProcessingState()}
        
        {processedFileUrl && renderSuccessState()}
      </CardContent>
      {file && !isProcessing && !processedFileUrl && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetForm}>
            {t("ui.cancel")}
          </Button>
          <Button onClick={removeWatermark}>
            {t("removeWatermark.removeWatermark")}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}