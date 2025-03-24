// app/[lang]/image-tools/change-colors/change-colors-tool.tsx
"use client"
import React, { useState } from "react";
import { ImageProcessor } from "@/components/image-processor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/src/store/store";
import { PlusCircle, MinusCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export function ChangeColorsTool() {
  const { t } = useLanguageStore();
  const [colorMappings, setColorMappings] = useState([
    { sourceColor: "#ff0000", targetColor: "#00ff00" },
  ]);
  const [tolerance, setTolerance] = useState(30);

  const addColorMapping = () => {
    setColorMappings([...colorMappings, { sourceColor: "#000000", targetColor: "#ffffff" }]);
  };

  const removeColorMapping = (index: number) => {
    const newMappings = [...colorMappings];
    newMappings.splice(index, 1);
    setColorMappings(newMappings);
  };

  const updateSourceColor = (index: number, color: string) => {
    const newMappings = [...colorMappings];
    newMappings[index].sourceColor = color;
    setColorMappings(newMappings);
  };

  const updateTargetColor = (index: number, color: string) => {
    const newMappings = [...colorMappings];
    newMappings[index].targetColor = color;
    setColorMappings(newMappings);
  };

  const renderOptions = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Color Mappings</Label>
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={addColorMapping}
            disabled={colorMappings.length >= 5}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Color
          </Button>
        </div>
        
        {colorMappings.map((mapping, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-muted/10">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`source-${index}`}>Source Color</Label>
                <div 
                  className="w-6 h-6 rounded-md border" 
                  style={{ backgroundColor: mapping.sourceColor }}
                />
              </div>
              <div className="flex gap-2">
                <Input
                  id={`source-${index}`}
                  type="color"
                  value={mapping.sourceColor}
                  onChange={(e) => updateSourceColor(index, e.target.value)}
                  className="w-10"
                />
                <Input
                  type="text"
                  value={mapping.sourceColor}
                  onChange={(e) => updateSourceColor(index, e.target.value)}
                  placeholder="#ff0000"
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`target-${index}`}>Target Color</Label>
                <div 
                  className="w-6 h-6 rounded-md border" 
                  style={{ backgroundColor: mapping.targetColor }}
                />
              </div>
              <div className="flex gap-2 items-center">
                <Input
                  id={`target-${index}`}
                  type="color"
                  value={mapping.targetColor}
                  onChange={(e) => updateTargetColor(index, e.target.value)}
                  className="w-10"
                />
                <Input
                  type="text"
                  value={mapping.targetColor}
                  onChange={(e) => updateTargetColor(index, e.target.value)}
                  placeholder="#00ff00"
                  className="flex-1"
                />
                {colorMappings.length > 1 && (
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => removeColorMapping(index)}
                    className="h-8 w-8"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="tolerance">Color Matching Tolerance: {tolerance}</Label>
        </div>
        <Slider
          id="tolerance"
          min={0}
          max={100}
          step={1}
          value={[tolerance]}
          onValueChange={(values) => setTolerance(values[0])}
        />
        <p className="text-xs text-muted-foreground">
          Higher values will match a wider range of similar colors. Lower values require more exact color matching.
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">Change Colors in PNG</h1>
        <p className="mt-2 text-muted-foreground">
          Replace specific colors in your PNG images with new colors
        </p>
      </div>
      
      <ImageProcessor
        title="PNG Color Changer"
        description="Upload a PNG image to change specific colors within it."
        processEndpoint="image/change-colors"
        fileTypes={["image/png"]}
        processOptions={{ 
          colorMappings,
          tolerance
        }}
        renderOptions={renderOptions}
      />
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">How to Change Colors in PNG Images</h2>
          <div className="space-y-3">
            <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-2">
              <li>Upload your PNG image</li>
              <li>Select the color you want to replace by clicking the color picker or entering a hex code</li>
              <li>Choose the new color that will replace the selected color</li>
              <li>Adjust the tolerance to control how strict the color matching should be</li>
              <li>Add more color mappings if needed (up to 5 color pairs)</li>
              <li>Click the "Process Image" button to apply your changes</li>
            </ol>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">What You Can Do With This Tool</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The Color Changer tool is useful for various image editing needs:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Change the color scheme of icons or graphics</li>
              <li>Match artwork colors to your brand colors</li>
              <li>Create variations of the same image with different color themes</li>
              <li>Fix or adjust colors in clip art and illustrations</li>
              <li>Change background or foreground colors without complex editing software</li>
              <li>Create seasonal or themed versions of your images</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Tips for Best Results</h2>
          <div className="space-y-3">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>For more precise color replacement, use a lower tolerance value (10-20)</li>
              <li>To replace similar shades of a color, use a higher tolerance value (30-50)</li>
              <li>This tool works best with images that have solid colors like logos, clip art, and illustrations</li>
              <li>Photos and images with gradients may not get ideal results</li>
              <li>PNG transparency is preserved during color replacement</li>
              <li>Process one color at a time for complex changes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}