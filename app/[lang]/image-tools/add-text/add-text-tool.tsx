"use client"
import React, { useState } from "react";
import { ImageProcessor } from "@/components/image-processor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguageStore } from "@/src/store/store";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { addTextPreview } from "@/lib/image-preview";

export function AddTextTool() {
  const { t } = useLanguageStore();
  const [text, setText] = useState("Your Text Here");
  const [fontSize, setFontSize] = useState(32);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor, setTextColor] = useState("#000000");
  const [positionX, setPositionX] = useState(50); // percentage
  const [positionY, setPositionY] = useState(50); // percentage
  const [alignment, setAlignment] = useState("center");
  const [opacity, setOpacity] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [bgColor, setBgColor] = useState("");
  const [bgOpacity, setBgOpacity] = useState(0);
  const [padding, setPadding] = useState(10);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState("#000000");
  const [shadowEnabled, setShadowEnabled] = useState(false);
  const [shadowColor, setShadowColor] = useState("#000000");
  const [shadowBlur, setShadowBlur] = useState(5);
  const [shadowOffsetX, setShadowOffsetX] = useState(2);
  const [shadowOffsetY, setShadowOffsetY] = useState(2);
  const [preset, setPreset] = useState("none");

  // Apply presets
  const applyPreset = (presetName: string) => {
    setPreset(presetName);
    
    switch (presetName) {
      case "watermark":
        setText("WATERMARK");
        setFontSize(42);
        setFontFamily("Arial");
        setTextColor("#000000");
        setAlignment("center");
        setOpacity(30);
        setRotation(45);
        setBgColor("");
        setBgOpacity(0);
        setPadding(10);
        setBorderWidth(0);
        setBorderColor("#000000");
        setShadowEnabled(false);
        break;
      case "caption":
        setText("Image Caption");
        setFontSize(24);
        setFontFamily("Arial");
        setTextColor("#ffffff");
        setAlignment("center");
        setOpacity(100);
        setRotation(0);
        setBgColor("#000000");
        setBgOpacity(50);
        setPadding(10);
        setBorderWidth(0);
        setBorderColor("#000000");
        setShadowEnabled(false);
        setPositionX(50);
        setPositionY(90);
        break;
      case "title":
        setText("TITLE");
        setFontSize(48);
        setFontFamily("Impact");
        setTextColor("#ffffff");
        setAlignment("center");
        setOpacity(100);
        setRotation(0);
        setBgColor("");
        setBgOpacity(0);
        setPadding(10);
        setBorderWidth(0);
        setBorderColor("#000000");
        setShadowEnabled(true);
        setShadowColor("#000000");
        setShadowBlur(5);
        setShadowOffsetX(2);
        setShadowOffsetY(2);
        setPositionX(50);
        setPositionY(20);
        break;
      case "meme":
        setText("MEME TEXT");
        setFontSize(36);
        setFontFamily("Impact");
        setTextColor("#ffffff");
        setAlignment("center");
        setOpacity(100);
        setRotation(0);
        setBgColor("");
        setBgOpacity(0);
        setPadding(10);
        setBorderWidth(2);
        setBorderColor("#000000");
        setShadowEnabled(false);
        setPositionX(50);
        setPositionY(15);
        break;
      case "signature":
        setText("Signature");
        setFontSize(24);
        setFontFamily("Brush Script MT");
        setTextColor("#0000ff");
        setAlignment("right");
        setOpacity(100);
        setRotation(0);
        setBgColor("");
        setBgOpacity(0);
        setPadding(5);
        setBorderWidth(0);
        setBorderColor("#000000");
        setShadowEnabled(false);
        setPositionX(85);
        setPositionY(85);
        break;
      case "none":
      default:
        // Keep current settings
        break;
    }
  };

  const renderOptions = (
    <div className="space-y-6">
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="position">Position</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="preset">Presets</Label>
            <Select value={preset} onValueChange={applyPreset}>
              <SelectTrigger id="preset">
                <SelectValue placeholder="Select a preset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Custom</SelectItem>
                <SelectItem value="watermark">Watermark</SelectItem>
                <SelectItem value="caption">Caption</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="meme">Meme Text</SelectItem>
                <SelectItem value="signature">Signature</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="text">Text Content</Label>
            <Input
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="font-family">Font</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger id="font-family">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
                <SelectItem value="Impact">Impact</SelectItem>
                <SelectItem value="Brush Script MT">Brush Script MT</SelectItem>
                <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
            </div>
            <Slider
              id="font-size"
              min={8}
              max={120}
              step={1}
              value={[fontSize]}
              onValueChange={(values) => setFontSize(values[0])}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="text-color">Text Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                id="text-color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-10 h-10"
              />
              <Input
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                placeholder="#000000"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="opacity">Opacity: {opacity}%</Label>
            </div>
            <Slider
              id="opacity"
              min={0}
              max={100}
              step={1}
              value={[opacity]}
              onValueChange={(values) => setOpacity(values[0])}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alignment">Text Alignment</Label>
            <RadioGroup
              id="alignment"
              value={alignment}
              onValueChange={setAlignment}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="left" id="align-left" />
                <Label htmlFor="align-left" className="cursor-pointer">
                  <AlignLeft className="h-5 w-5" />
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="center" id="align-center" />
                <Label htmlFor="align-center" className="cursor-pointer">
                  <AlignCenter className="h-5 w-5" />
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="right" id="align-right" />
                <Label htmlFor="align-right" className="cursor-pointer">
                  <AlignRight className="h-5 w-5" />
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bg-color">Background Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                id="bg-color"
                value={bgColor || "#000000"}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10"
              />
              <Input
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                placeholder="None"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="bg-opacity">Background Opacity: {bgOpacity}%</Label>
            </div>
            <Slider
              id="bg-opacity"
              min={0}
              max={100}
              step={1}
              value={[bgOpacity]}
              onValueChange={(values) => setBgOpacity(values[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="padding">Padding: {padding}px</Label>
            </div>
            <Slider
              id="padding"
              min={0}
              max={50}
              step={1}
              value={[padding]}
              onValueChange={(values) => setPadding(values[0])}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="border-settings">Border</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="border-width" className="text-xs">Width: {borderWidth}px</Label>
                <Slider
                  id="border-width"
                  min={0}
                  max={20}
                  step={1}
                  value={[borderWidth]}
                  onValueChange={(values) => setBorderWidth(values[0])}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="border-color"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  className="w-10 h-10"
                />
                <Input
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="position" className="space-y-4 mt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="position-x">Horizontal Position: {positionX}%</Label>
            </div>
            <Slider
              id="position-x"
              min={0}
              max={100}
              step={1}
              value={[positionX]}
              onValueChange={(values) => setPositionX(values[0])}
            />
            <p className="text-xs text-muted-foreground">
              0% = Left, 50% = Center, 100% = Right
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="position-y">Vertical Position: {positionY}%</Label>
            </div>
            <Slider
              id="position-y"
              min={0}
              max={100}
              step={1}
              value={[positionY]}
              onValueChange={(values) => setPositionY(values[0])}
            />
            <p className="text-xs text-muted-foreground">
              0% = Top, 50% = Middle, 100% = Bottom
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="rotation">Rotation: {rotation}°</Label>
            </div>
            <Slider
              id="rotation"
              min={-180}
              max={180}
              step={1}
              value={[rotation]}
              onValueChange={(values) => setRotation(values[0])}
            />
          </div>
          
          <div className="space-y-4 border-t pt-4 mt-4">
            <Label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={shadowEnabled}
                onChange={(e) => setShadowEnabled(e.target.checked)}
              />
              Text Shadow
            </Label>
            
            {shadowEnabled && (
              <div className="space-y-4 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="shadow-color">Shadow Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="shadow-color"
                      value={shadowColor}
                      onChange={(e) => setShadowColor(e.target.value)}
                      className="w-10 h-10"
                    />
                    <Input
                      value={shadowColor}
                      onChange={(e) => setShadowColor(e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shadow-blur">Blur: {shadowBlur}px</Label>
                  <Slider
                    id="shadow-blur"
                    min={0}
                    max={20}
                    step={1}
                    value={[shadowBlur]}
                    onValueChange={(values) => setShadowBlur(values[0])}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shadow-offset-x">Horizontal Offset: {shadowOffsetX}px</Label>
                    <Slider
                      id="shadow-offset-x"
                      min={-20}
                      max={20}
                      step={1}
                      value={[shadowOffsetX]}
                      onValueChange={(values) => setShadowOffsetX(values[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shadow-offset-y">Vertical Offset: {shadowOffsetY}px</Label>
                    <Slider
                      id="shadow-offset-y"
                      min={-20}
                      max={20}
                      step={1}
                      value={[shadowOffsetY]}
                      onValueChange={(values) => setShadowOffsetY(values[0])}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">Add Text to Image</h1>
        <p className="mt-2 text-muted-foreground">
          Add custom text, captions, or watermarks to your images
        </p>
      </div>
      
      <ImageProcessor
        title="Text on Image Tool"
        description="Upload an image to add custom text with various styling options."
        processEndpoint="image/add-text"
        fileTypes={["image/jpeg", "image/png", "image/webp"]}
        processOptions={{
          text,
          fontSize,
          fontFamily,
          textColor,
          positionX,
          positionY,
          alignment,
          opacity,
          rotation,
          bgColor,
          bgOpacity,
          padding,
          borderWidth,
          borderColor,
          shadowEnabled,
          shadowColor,
          shadowBlur,
          shadowOffsetX,
          shadowOffsetY
        }}
        renderOptions={renderOptions}
        previewRenderer={addTextPreview}
      />
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Why Add Text to Images?</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Adding text to images serves various purposes in digital content creation:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Create watermarks to protect your intellectual property</li>
              <li>Add captions to explain the context of photos</li>
              <li>Create eye-catching titles for social media posts</li>
              <li>Label diagrams and instructional images</li>
              <li>Add copyright information to published images</li>
              <li>Generate memes by adding humorous text</li>
              <li>Create quotes or inspirational images</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Text Styling Options Explained</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Font & Size</h3>
              <p className="text-sm text-muted-foreground">
                Choose from a variety of fonts and adjust the size to make your text stand out or blend in. Larger fonts work well for titles, while smaller fonts are better for captions or watermarks.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Color & Opacity</h3>
              <p className="text-sm text-muted-foreground">
                Select the perfect color for your text and adjust opacity to control how prominently it appears on your image. Lower opacity works well for watermarks, while full opacity is better for titles.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Position & Rotation</h3>
              <p className="text-sm text-muted-foreground">
                Place your text anywhere on the image using horizontal and vertical positioning sliders. Rotation allows for dynamic angles that can add visual interest or create diagonal watermarks.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Background & Border</h3>
              <p className="text-sm text-muted-foreground">
                Add a background color behind your text to improve readability, especially on busy images. Borders can help text stand out and are particularly useful for meme-style captions.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Tips for Best Results</h2>
          <div className="space-y-3">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Choose fonts that complement the style and purpose of your image</li>
              <li>Ensure text has enough contrast with the background for readability</li>
              <li>Use text shadows for better visibility on varied backgrounds</li>
              <li>For watermarks, use lower opacity (20-30%) to avoid distracting from the main image</li>
              <li>Place text away from the main subject or important details in the image</li>
              <li>Consider using semi-transparent backgrounds for captions over busy images</li>
              <li>For memes, use bold fonts with black borders for maximum readability</li>
              <li>Use the presets as starting points, then customize to your specific needs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}