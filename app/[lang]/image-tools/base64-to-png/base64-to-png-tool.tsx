// app/[lang]/image-tools/base64-to-png/base64-to-png-tool.tsx
"use client"
import React, { useState } from "react";
import { ImageProcessor } from "@/components/image-processor";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/src/store/store";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileImage } from "lucide-react";

export function Base64ToPngTool() {
  const { t } = useLanguageStore();
  const [base64Input, setBase64Input] = useState("");
  const [validBase64, setValidBase64] = useState(false);
  const [error, setError] = useState("");

  // Validate base64 input
  const validateBase64 = (input: string) => {
    // Remove data URL prefix if present
    let base64Data = input.trim();
    if (base64Data.startsWith('data:image')) {
      base64Data = base64Data.split(',')[1] || '';
    }

    try {
      // Check if it's valid base64
      if (base64Data.length === 0) {
        setValidBase64(false);
        setError("");
        return;
      }

      // Basic validation - must be base64 characters only
      const base64Regex = /^[A-Za-z0-9+/=]+$/;
      const isValid = base64Regex.test(base64Data) && base64Data.length % 4 === 0;
      
      setValidBase64(isValid);
      setError(isValid ? "" : "Invalid Base64 string. Please check your input.");
    } catch (err) {
      setValidBase64(false);
      setError("Invalid Base64 string. Please check your input.");
    }
  };

  const renderOptions = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="base64-input">"Paste Base64 String"</Label>
        <Textarea
          id="base64-input"
          value={base64Input}
          onChange={(e) => {
            setBase64Input(e.target.value);
            validateBase64(e.target.value);
          }}
          placeholder="Paste your Base64 encoded image string here..."
          className="min-h-32 font-mono text-xs"
        />
        <p className="text-xs text-muted-foreground">
          "Enter a Base64 string or a complete data URL (starting with 'data:image/...')"
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={base64Input.length === 0}
          onClick={() => setBase64Input("")}
        >
         "Clear"
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">"Convert Base64 to PNG"</h1>
        <p className="mt-2 text-muted-foreground">
          "Convert Base64 encoded image data to a PNG file"
        </p>
      </div>
      
      <Card className="border shadow-sm">
        <div className="p-6 space-y-6">
          {renderOptions}
        </div>
      </Card>
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">"What is Base64?"</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It's commonly used for embedding image data directly in HTML, CSS, or JSON."
            </p>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">"Common Use Cases"</h2>
          <div className="space-y-2">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>"Extract embedded images from CSS or HTML files"</li>
              <li>"Convert data URI scheme images to regular PNGs"</li>
              <li>"Save images from API responses that return Base64 data"</li>
              <li>"Convert clipboard image data to PNG files"</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">"Base64 Image Formats"</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              "Base64 encoded images typically appear in one of these formats:"
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li><code>data:image/png;base64,iVBORw0KGgoAAAANSU...</code> - PNG format</li>
              <li><code>data:image/jpeg;base64,/9j/4AAQSkZJRgABA...</code> - JPEG format</li>
              <li><code>data:image/svg+xml;base64,PHN2ZyB4bWxucz...</code> - SVG format</li>
              <li><code>iVBORw0KGgoAAAANSUhEUgAAA...</code> - Raw Base64 without prefix</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              "Our tool supports all of these formats and will convert them to high-quality PNG files."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}