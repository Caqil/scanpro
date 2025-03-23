"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Signature, Trash, Type, Check, X } from "lucide-react";

interface SignaturePadProps {
  onSignatureCapture: (signatureImage: string) => void;
}

export function SignaturePad({ onSignatureCapture }: SignaturePadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"draw" | "type">("draw");
  const [typedSignature, setTypedSignature] = useState("");
  const [fontFamily, setFontFamily] = useState("cursive");
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  
  // Initialize canvas for drawing
  useEffect(() => {
    if (canvasRef.current && activeTab === "draw") {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        // Set canvas dimensions
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Set up drawing styles
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000000";
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [activeTab, isOpen]);
  
  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      isDrawingRef.current = true;
      
      // Get correct coordinates
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Start new path
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      // Get correct coordinates
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Continue path and stroke
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };
  
  const endDrawing = () => {
    isDrawingRef.current = false;
    
    // Save the signature from canvas
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL("image/png");
      setSignatureImage(dataUrl);
    }
  };
  
  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignatureImage(null);
      }
    }
  };
  
  // Generate signature image from typed text
  const generateTypedSignature = () => {
    if (!typedSignature) return;
    
    // Create a temporary canvas to generate the signature
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 200;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set text style
      ctx.font = `48px ${fontFamily}`;
      ctx.fillStyle = "#000000";
      
      // Center the text
      const textMetrics = ctx.measureText(typedSignature);
      const x = (canvas.width - textMetrics.width) / 2;
      const y = canvas.height / 2;
      
      // Draw the text
      ctx.fillText(typedSignature, x, y);
      
      // Save as image
      const dataUrl = canvas.toDataURL("image/png");
      setSignatureImage(dataUrl);
    }
  };
  
  // Apply signature when done
  const applySignature = () => {
    if (signatureImage) {
      onSignatureCapture(signatureImage);
      setIsOpen(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Signature className="mr-2 h-4 w-4" />
          Create Signature
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Signature</DialogTitle>
          <DialogDescription>
            Draw your signature or type it to add to your PDF document.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          defaultValue="draw" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "draw" | "type")}
          className="mt-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="draw">Draw</TabsTrigger>
            <TabsTrigger value="type">Type</TabsTrigger>
          </TabsList>
          
          <TabsContent value="draw" className="mt-4">
            <div className="border rounded-md bg-white dark:bg-gray-900 p-2">
              <div className="text-sm text-muted-foreground mb-2">
                Draw your signature below
              </div>
              <canvas
                ref={canvasRef}
                className="border w-full h-32 cursor-crosshair bg-white dark:bg-gray-950"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
              />
              <div className="flex justify-end mt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearCanvas}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="type" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type your signature</label>
                <Input
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  placeholder="Type your name here"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Select font</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                >
                  <option value="cursive">Signature (Cursive)</option>
                  <option value="'Brush Script MT', cursive">Brush Script</option>
                  <option value="'Dancing Script', cursive">Dancing Script</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="Arial, sans-serif">Arial</option>
                </select>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={generateTypedSignature}>
                  <Type className="h-4 w-4 mr-1" />
                  Generate Signature
                </Button>
              </div>
              
              {signatureImage && activeTab === "type" && (
                <div className="mt-4 border rounded-md p-4 bg-white dark:bg-gray-900">
                  <div className="text-sm text-muted-foreground mb-2">
                    Signature preview:
                  </div>
                  <div className="bg-white dark:bg-gray-950 p-4 flex justify-center">
                    <img src={signatureImage} alt="Your signature" className="max-h-20" />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Preview signature */}
        {signatureImage && (
          <div className="mt-4 border rounded-md p-4 bg-muted/20">
            <div className="text-sm font-medium mb-2">Your signature</div>
            <div className="bg-white dark:bg-gray-950 p-4 flex justify-center">
              <img src={signatureImage} alt="Your signature" className="max-h-24" />
            </div>
          </div>
        )}
        
        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={applySignature} 
            disabled={!signatureImage}
            variant="default"
          >
            <Check className="mr-2 h-4 w-4" />
            Apply Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}