// app/[lang]/image-tools/image-tools-content.tsx
"use client"
import { FileImage, Image } from "lucide-react";
import { useLanguageStore } from "@/src/store/store";
import { LanguageLink } from "@/components/language-link";
import { Button } from "@/components/ui/button";

export function ImageToolsHeaderSection() {
  const { t } = useLanguageStore();
  
  return (
    <div className="mx-auto flex flex-col items-center text-center mb-8">
      <div className="mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
        <FileImage className="h-8 w-8 text-blue-500" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Image Processing Tools
      </h1>
      <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
        Free online tools to convert, transform and edit your images
      </p>
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-sm text-green-600 dark:text-green-400">
          <FileImage size={16} />
          <span>PNG</span>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-600 dark:text-blue-400">
          <Image size={16} />
          <span>JPG</span>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 text-sm text-purple-600 dark:text-purple-400">
          <Image size={16} />
          <span>WebP</span>
        </div>
      </div>
    </div>
  );
}

export function HowToUseImageTools() {
  const { t } = useLanguageStore();
  
  const steps = [
    {
      title: "Select a Tool",
      description: "Choose the image processing tool you need from our wide selection."
    },
    {
      title: "Upload Your Image",
      description: "Upload the image you want to process. We support PNG, JPG, and WebP formats."
    },
    {
      title: "Download",
      description: "Process your image and download the result with a single click."
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">How to Use Our Image Tools</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">{index + 1}</span>
            </div>
            <h3 className="text-lg font-medium mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}