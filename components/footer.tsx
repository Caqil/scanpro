"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { FileIcon } from "@radix-ui/react-icons";
import { LanguageLink } from "./language-link";
import { useLanguageStore } from "@/src/store/store";

export function Footer() {
  const { t } = useLanguageStore();
  // Add client-side rendering protection
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initial static content for server rendering
  if (!mounted) {
    return (
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <FileIcon className="h-6 w-6" />
            <nav className="flex gap-4 md:gap-6">
              {/* Empty navigation during server render */}
            </nav>
          </div>
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6 md:px-0">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} ScanPro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <FileIcon className="h-6 w-6" />
          <nav className="flex gap-4 md:gap-6">
          
          <LanguageLink
              href="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              About Us
            </LanguageLink>
            <LanguageLink
              href="/features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Features
            </LanguageLink>
            <LanguageLink
              href="/sitemap"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Sitemap
            </LanguageLink>
            </nav>
        </div>
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6 md:px-0">
          <nav className="flex gap-4 md:gap-6">
            <LanguageLink
              href="/terms"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Terms
            </LanguageLink>
            <LanguageLink
              href="/privacy"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Privacy
            </LanguageLink>
            <LanguageLink
              href="/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Contact
            </LanguageLink>
          </nav>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ScanPro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}