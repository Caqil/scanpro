// components/image-tools-list.tsx
"use client"
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/src/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageLink } from "@/components/language-link";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function ImageToolsList() {
  const router = useRouter();
  const { t } = useLanguageStore();
  
  const imageTools = [
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
      id: "add-noise",
      name: "Add Noise to a PNG",
      href: "/image-tools/add-noise",
      description: "Quickly add noisy pixels (white noise) to your PNG image.",
      icon: "🔄"
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
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {imageTools.map((tool) => (
          <LanguageLink key={tool.id} href={tool.href} className="block h-full">
            <Card className="h-full cursor-pointer hover:shadow-md transition-all tool-card">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="p-2 rounded-lg text-2xl icon-pulse">{tool.icon}</div>
                <div>
                  <CardTitle className="text-base flex items-center">
                    {tool.name}
                    {tool.isNew && (
                      <Badge className="ml-2 bg-primary/20 text-primary-foreground text-xs" variant="outline">
                        <Sparkles className="h-3 w-3 mr-1" />
                        New
                      </Badge>
                    )}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </CardContent>
            </Card>
          </LanguageLink>
        ))}
      </div>
    </div>
  );
}