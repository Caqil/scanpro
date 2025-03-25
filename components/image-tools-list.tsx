// components/enhanced-image-tools-list.tsx
"use client"
import { useLanguageStore } from "@/src/store/store";
import { LanguageLink } from "@/components/language-link";
import { MagicCard } from "@/src/components/magicui/magic-card";
import { Badge } from "./ui/badge";

export function ImageToolsList() {
  const { t } = useLanguageStore();
  
  const imageTools = [
    // Conversion Tools
    {
      id: "make-transparent",
      name: t('imageTools.makeTransparent.title') || "Make a PNG Transparent",
      href: "/image-tools/make-transparent",
      description: t('imageTools.makeTransparent.description') || "Quickly replace any color in a PNG file with transparency.",
      icon: "🏝️",
      category: "conversion"
    },
    {
      id: "png-to-jpg",
      name: t('imageTools.pngToJpg.title') || "Convert PNG to JPG",
      href: "/image-tools/png-to-jpg",
      description: t('imageTools.pngToJpg.description') || "Convert PNG graphics files to JPEG format with adjustable quality.",
      icon: "🖼️",
      category: "conversion"
    },
    {
      id: "jpg-to-png",
      name: t('imageTools.jpgToPng.title') || "Convert JPG to PNG",
      href: "/image-tools/jpg-to-png",
      description: t('imageTools.jpgToPng.description') || "Convert JPEG images to PNG format with transparency support.",
      icon: "🔄",
      category: "conversion"
    },
    {
      id: "png-to-webp",
      name: t('imageTools.pngToWebp.title') || "Convert PNG to WebP",
      href: "/image-tools/png-to-webp",
      description: t('imageTools.pngToWebp.description') || "Convert PNG images to WebP for better web performance.",
      icon: "📱",
      category: "conversion"
    },
    {
      id: "webp-to-png",
      name: t('imageTools.webpToPng.title') || "Convert WebP to PNG",
      href: "/image-tools/webp-to-png",
      description: t('imageTools.webpToPng.description') || "Convert WebP images to PNG format for better compatibility.",
      icon: "🔄",
      category: "conversion"
    },
    {
      id: "svg-to-png",
      name: t('imageTools.svgToPng.title') || "Convert SVG to PNG",
      href: "/image-tools/svg-to-png",
      description: t('imageTools.svgToPng.description') || "Convert vector SVG files to raster PNG images.",
      icon: "📊",
      category: "conversion"
    },
    {
      id: "png-to-base64",
      name: t('imageTools.pngToBase64.title') || "Convert PNG to Base64",
      href: "/image-tools/png-to-base64",
      description: t('imageTools.pngToBase64.description') || "Convert PNG images to base64 encoding for embedding in web pages.",
      icon: "🔣",
      category: "conversion"
    },
    {
      id: "base64-to-png",
      name: t('imageTools.base64ToPng.title') || "Convert Base64 to PNG",
      href: "/image-tools/base64-to-png",
      description: t('imageTools.base64ToPng.description') || "Convert base64-encoded image strings back to PNG files.",
      icon: "🔢",
      category: "conversion"
    },
    
    // Editing Tools
    {
      id: "change-colors",
      name: t('imageTools.changeColors.title') || "Change Colors in PNG",
      href: "/image-tools/change-colors",
      description: t('imageTools.changeColors.description') || "Replace specific colors in your PNG images with new colors.",
      icon: "🌈",
      category: "editing"
    },
    {
      id: "change-tone",
      name: t('imageTools.changeTone.title') || "Change Color Tone",
      href: "/image-tools/change-tone",
      description: t('imageTools.changeTone.description') || "Apply color tones and tints to your images for artistic effects.",
      icon: "🎨",
      category: "editing"
    },
    {
      id: "add-noise",
      name: t('imageTools.noise.title') || "Add Noise",
      href: "/image-tools/add-noise",
      description: t('imageTools.noise.description') || "Add film grain or noise effects to your images.",
      icon: "✨",
      category: "editing"
    },
    {
      id: "resize-image",
      name: "Resize Image",
      href: "/image-tools/resize",
      description: "Resize images to exact dimensions while preserving quality.",
      icon: "📏",
      category: "editing",
      isNew: true
    },
    {
      id: "crop-image",
      name: "Crop Image",
      href: "/image-tools/crop",
      description: "Crop images to remove unwanted areas and focus on important content.",
      icon: "✂️",
      category: "editing",
      isNew: true
    },
    {
      id: "rotate-flip",
      name: "Rotate & Flip",
      href: "/image-tools/rotate",
      description: "Rotate and flip images to the correct orientation.",
      icon: "🔄",
      category: "editing",
      isNew: true
    },
    {
      id: "add-text",
      name: "Add Text to Image",
      href: "/image-tools/add-text",
      description: "Add custom text, captions, or watermarks to your images.",
      icon: "📝",
      category: "editing",
      isNew: true
    },
    {
      id: "add-border",
      name: "Add Border",
      href: "/image-tools/add-border",
      description: "Add custom borders to your images with various styles and colors.",
      icon: "🖼️",
      category: "editing",
      isNew: true
    },
    {
      id: "add-watermark",
      name: "Add Watermark",
      href: "/image-tools/add-watermark",
      description: "Add text or image watermarks to protect your photos.",
      icon: "💧",
      category: "editing",
      isNew: true
    },
    
    // Enhancement Tools
    {
      id: "image-filters",
      name: "Apply Image Filters",
      href: "/image-tools/filters",
      description: "Enhance images with professional filters like grayscale, sepia, and more.",
      icon: "🎭",
      category: "enhancement",
      isNew: true
    },
    {
      id: "adjust-brightness",
      name: "Adjust Brightness & Contrast",
      href: "/image-tools/adjust",
      description: "Fine-tune brightness, contrast, saturation and other image properties.",
      icon: "☀️",
      category: "enhancement",
      isNew: true
    },
    {
      id: "sharpen-image",
      name: "Sharpen Image",
      href: "/image-tools/sharpen",
      description: "Enhance image clarity and details with sharpening effects.",
      icon: "🔍",
      category: "enhancement",
      isNew: true
    },
    {
      id: "blur-image",
      name: "Blur Image",
      href: "/image-tools/blur",
      description: "Add blur effects to images for background or privacy purposes.",
      icon: "🌫️",
      category: "enhancement",
      isNew: true
    },
    
    // Optimization Tools
    {
      id: "compress-png",
      name: t('imageTools.compressPng.title') || "Compress PNG",
      href: "/image-tools/compress",
      description: t('imageTools.compressPng.description') || "Reduce PNG file sizes while maintaining quality.",
      icon: "📉",
      category: "optimization"
    },
    {
      id: "compress-jpg",
      name: "Compress JPG",
      href: "/image-tools/compress-jpg",
      description: "Optimize JPG images with adjustable quality settings.",
      icon: "📉",
      category: "optimization",
      isNew: true
    },
    {
      id: "batch-resize",
      name: "Batch Resize",
      href: "/image-tools/batch-resize",
      description: "Resize multiple images at once to the same dimensions.",
      icon: "📚",
      category: "optimization",
      isNew: true
    },
    
    // Advanced Tools
    {
      id: "remove-background",
      name: "Remove Background",
      href: "/image-tools/remove-background",
      description: "Automatically remove backgrounds from photos and images.",
      icon: "✨",
      category: "advanced",
      isNew: true
    },
    {
      id: "image-to-pdf",
      name: "Images to PDF",
      href: "/image-tools/images-to-pdf",
      description: "Convert multiple images to a single PDF document.",
      icon: "📄",
      category: "advanced",
      isNew: true
    },
    {
      id: "merge-images",
      name: "Merge Images",
      href: "/image-tools/merge",
      description: "Combine multiple images side by side or vertically.",
      icon: "🔗",
      category: "advanced",
      isNew: true
    },
    {
      id: "extract-colors",
      name: "Extract Color Palette",
      href: "/image-tools/extract-colors",
      description: "Extract the dominant colors and create a color palette from your image.",
      icon: "🎨",
      category: "advanced",
      isNew: true
    }
  ];

  // Function to get category title
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "conversion":
        return t('imageTools.categories.conversion') || "Format Conversion";
      case "editing":
        return t('imageTools.categories.editing') || "Image Editing";
      case "enhancement":
        return t('imageTools.categories.enhancement') || "Image Enhancement";
      case "optimization":
        return t('imageTools.categories.optimization') || "Optimization";
      case "advanced":
        return t('imageTools.categories.advanced') || "Advanced Tools";
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  // Group tools by category
  const groupedTools = imageTools.reduce((acc, tool) => {
    const category = tool.category || "other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {} as Record<string, typeof imageTools>);

  // Order categories
  const categoryOrder = ["conversion", "editing", "enhancement", "optimization", "advanced", "other"];

  return (
    <div className="space-y-8">
      {categoryOrder.map(category => {
        const tools = groupedTools[category];
        if (!tools || tools.length === 0) return null;
        
        return (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold">{getCategoryTitle(category)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => (
                <LanguageLink key={tool.id} href={tool.href} className="block h-full">
                  <MagicCard 
                    className="h-full cursor-pointer hover:shadow-md transition-all tool-card"
                    gradientColor={
                      category === "conversion" ? "rgba(59, 130, 246, 0.05)" :
                      category === "editing" ? "rgba(139, 92, 246, 0.05)" :
                      category === "enhancement" ? "rgba(16, 185, 129, 0.05)" :
                      category === "optimization" ? "rgba(245, 158, 11, 0.05)" :
                      "rgba(99, 102, 241, 0.05)"
                    }
                    borderColor={
                      category === "conversion" ? "rgba(59, 130, 246, 0.1)" :
                      category === "editing" ? "rgba(139, 92, 246, 0.1)" :
                      category === "enhancement" ? "rgba(16, 185, 129, 0.1)" :
                      category === "optimization" ? "rgba(245, 158, 11, 0.1)" :
                      "rgba(99, 102, 241, 0.1)"
                    }
                    spotlight
                  >
                    <div className="p-5">
                      <div className="flex flex-row items-center gap-3 pb-2">
                        <div className="p-2 rounded-lg text-2xl icon-pulse">{tool.icon}</div>
                        <div>
                          <div className="text-base font-medium flex items-center gap-2">
                            {tool.name}
                            {tool.isNew && (
                              <Badge 
                              variant="outline" 
                              className="bg-primary/10 border-primary/20 text-primary-white text-xs px-1.5 py-0 ml-1.5 h-4"
                            >
                              {t('ui.new')}
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
      })}
    </div>
  );
}