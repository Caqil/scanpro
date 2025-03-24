// components/simple-image-tools-list.tsx
"use client"
import { useLanguageStore } from "@/src/store/store";
import { LanguageLink } from "@/components/language-link";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { MagicCard } from "@/src/components/magicui/magic-card";

export function ImageToolsList() {
  const { t } = useLanguageStore();
  
  const imageTools = [
    // Original tools
    {
      id: "make-transparent",
      name: "Make a PNG Transparent",
      href: "/image-tools/make-transparent",
      description: "Quickly replace any color in a PNG file with transparency.",
      icon: "🏝️",
      isNew: true
    },
    {
      id: "change-colors",
      name: "Change Colors in a PNG",
      href: "/image-tools/change-colors",
      description: "Quickly swap colors in a PNG image.",
      icon: "🌈"
    },
    {
      id: "change-tone",
      name: "Change PNG Color Tone",
      href: "/image-tools/change-tone",
      description: "Quickly replace all colors in a PNG with a single color tone.",
      icon: "🎨"
    },
    {
      id: "compress-png",
      name: "Compress a PNG",
      href: "/image-tools/compress",
      description: "Quickly make a PNG image smaller and reduce its size.",
      icon: "📉"
    },
    {
      id: "png-to-jpg",
      name: "Convert PNG to JPG",
      href: "/image-tools/png-to-jpg",
      description: "Quickly convert a PNG graphics file to a JPEG graphics file.",
      icon: "🖼️"
    },
    {
      id: "jpg-to-png",
      name: "Convert JPG to PNG",
      href: "/image-tools/jpg-to-png",
      description: "Quickly convert a JPEG graphics file to a PNG graphics file.",
      icon: "🔄"
    },
    {
      id: "png-to-webp",
      name: "Convert PNG to WebP",
      href: "/image-tools/png-to-webp",
      description: "Quickly convert a PNG image to a WebP image.",
      icon: "📱"
    },
    {
      id: "webp-to-png",
      name: "Convert WebP to PNG",
      href: "/image-tools/webp-to-png",
      description: "Quickly convert a WebP image to a PNG image.",
      icon: "🔄"
    },
    {
      id: "svg-to-png",
      name: "Convert SVG to PNG",
      href: "/image-tools/svg-to-png",
      description: "Quickly convert an SVG file to a PNG image.",
      icon: "📊"
    },
    {
      id: "png-to-base64",
      name: "Convert PNG to Base64",
      href: "/image-tools/png-to-base64",
      description: "Quickly convert a PNG image to base64 encoding.",
      icon: "🔣"
    },
    {
      id: "base64-to-png",
      name: "Convert Base64 to PNG",
      href: "/image-tools/base64-to-png",
      description: "Quickly convert a base64-encoded image to PNG.",
      icon: "🔢"
    },
    
    // New additional tools
    {
      id: "resize-image",
      name: "Resize Image",
      href: "/image-tools/resize",
      description: "Resize images to exact dimensions while preserving quality.",
      icon: "📏",
      isNew: true
    },
    {
      id: "crop-image",
      name: "Crop Image",
      href: "/image-tools/crop",
      description: "Crop images to remove unwanted areas and focus on important content.",
      icon: "✂️",
      isNew: true
    },
    {
      id: "rotate-image",
      name: "Rotate & Flip",
      href: "/image-tools/rotate",
      description: "Rotate and flip images to correct orientation.",
      icon: "🔄",
      isNew: true
    },
    {
      id: "add-text",
      name: "Add Text to Image",
      href: "/image-tools/add-text",
      description: "Add custom text, captions, or watermarks to your images.",
      icon: "📝",
      isNew: true
    },
    {
      id: "image-filters",
      name: "Apply Image Filters",
      href: "/image-tools/filters",
      description: "Enhance images with professional filters like grayscale, sepia, and more.",
      icon: "🎭",
      isNew: true
    },
    {
      id: "compress-jpg",
      name: "Compress JPG",
      href: "/image-tools/compress-jpg",
      description: "Optimize JPG images with adjustable quality settings.",
      icon: "📉",
      isNew: true
    },
    {
      id: "remove-background",
      name: "Remove Background",
      href: "/image-tools/remove-background",
      description: "Automatically remove backgrounds from photos and images.",
      icon: "✨",
      isNew: true
    },
    {
      id: "image-to-pdf",
      name: "Images to PDF",
      href: "/image-tools/images-to-pdf",
      description: "Convert multiple images to a single PDF document.",
      icon: "📄",
      isNew: true
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {imageTools.map((tool) => (
          <LanguageLink key={tool.id} href={tool.href} className="block h-full">
            <MagicCard 
              className="h-full cursor-pointer hover:shadow-md transition-all tool-card"
              gradientColor="rgba(59, 130, 246, 0.05)"
              borderColor="rgba(59, 130, 246, 0.1)"
              spotlight
            >
              <div className="p-5">
                <div className="flex flex-row items-center gap-3 pb-2">
                  <div className="p-2 rounded-lg text-2xl icon-pulse">{tool.icon}</div>
                  <div>
                    <div className="text-base font-medium flex items-center">
                      {tool.name}
                      {tool.isNew && (
                        <Badge className="ml-2 bg-primary/20 text-primary-foreground text-xs" variant="outline">
                          <Sparkles className="h-3 w-3 mr-1" />
                          New
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </div>
            </MagicCard>
          </LanguageLink>
        ))}
      </div>
    </div>
  );
}