// app/[lang]/image-tools/png-to-base64/png-to-base64-tool.tsx
"use client"
import React, { useState } from "react";
import { ImageProcessor } from "@/components/image-processor";
import { useLanguageStore } from "@/src/store/store";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function PngToBase64Tool() {
  const { t } = useLanguageStore();
  const [includePrefix, setIncludePrefix] = useState(true);
  
  const renderOptions = (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch 
          id="include-prefix" 
          checked={includePrefix}
          onCheckedChange={setIncludePrefix}
        />
        <Label htmlFor="include-prefix">Include data URI prefix</Label>
      </div>
      <p className="text-xs text-muted-foreground">
        When enabled, the output will include the "data:image/png;base64," prefix, making it ready to use in HTML and CSS.
      </p>
    </div>
  );

  return (
    <div>
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold">Convert PNG to Base64</h1>
        <p className="mt-2 text-muted-foreground">
          Convert PNG images to Base64 encoded strings for embedding in websites and applications
        </p>
      </div>
      
      <ImageProcessor
        title="PNG to Base64 Converter"
        description="Upload a PNG image to convert it to a Base64 encoded string."
        processEndpoint="image/png-to-base64"
        fileTypes={["image/png"]}
        processOptions={{ includePrefix }}
        renderOptions={renderOptions}
      />
      
      <div className="mt-12 space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Why Convert PNG to Base64?</h2>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Converting PNG images to Base64 is useful for several purposes:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Embed images directly in HTML, CSS, or JavaScript without external files</li>
              <li>Reduce HTTP requests for small images to improve page load performance</li>
              <li>Include images in data URIs for inline usage</li>
              <li>Store image data in JSON or other text formats</li>
              <li>Send images via APIs that only accept text data</li>
            </ul>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">How to Use Base64 Images</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-base font-medium">In HTML</h3>
              <div className="bg-muted p-3 rounded-md">
                <code className="text-xs"><span className="text-pink-500">&lt;img</span> <span className="text-blue-500">src</span>=<span className="text-green-500">"data:image/png;base64,iVBORw0..."</span> <span className="text-pink-500">/&gt;</span></code>
              </div>
              <p className="text-xs text-muted-foreground">
                Use the Base64 string in an img tag's src attribute.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">In CSS</h3>
              <div className="bg-muted p-3 rounded-md">
                <code className="text-xs"><span className="text-pink-500">.element</span> {'{'}
  <span className="text-blue-500">background-image</span>: <span className="text-green-500">url("data:image/png;base64,iVBORw0...")</span>;
{'}'}</code>
              </div>
              <p className="text-xs text-muted-foreground">
                Use the Base64 string as a background image.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">In JavaScript</h3>
              <div className="bg-muted p-3 rounded-md">
                <code className="text-xs"><span className="text-blue-500">const</span> img = <span className="text-blue-500">new</span> Image();
img.src = <span className="text-green-500">"data:image/png;base64,iVBORw0..."</span>;</code>
              </div>
              <p className="text-xs text-muted-foreground">
                Create an image element with the Base64 data.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-medium mb-4">Important Considerations</h2>
          <div className="space-y-3">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Base64 encoding increases file size by approximately 33%</li>
              <li>Best used for small images (under 10KB) to avoid bloating your code</li>
              <li>Cannot be cached separately from your HTML/CSS/JS files</li>
              <li>Might increase initial page load time for larger images</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}