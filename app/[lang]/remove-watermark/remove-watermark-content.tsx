"use client";

import { useLanguageStore } from "@/src/store/store";
import { LanguageLink } from "@/components/language-link";

export function RemoveWatermarkHeader() {
  const { t } = useLanguageStore();
  
  return (
    <div className="mx-auto max-w-3xl text-center mb-8 md:mb-12">
      <div className="mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 inline-block">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-blue-500">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
          <path d="m15 6-3 5-3-5"></path>
        </svg>
      </div>
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
        {t('removeWatermark.title')}
      </h1>
      <p className="mt-4 text-xl text-muted-foreground">
        {t('removeWatermark.description')}
      </p>
    </div>
  );
}