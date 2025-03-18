"use client"
import Link from "next/link";
import { FileIcon } from "@radix-ui/react-icons";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <FileIcon className="h-6 w-6" />
          <nav className="flex gap-4 md:gap-6">
          
          <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              About Us
            </Link>
            <Link
              href="/features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Featuras
            </Link>
            <Link
              href="/api-doc"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              API
            </Link>
            </nav>
        </div>
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6 md:px-0">
          <nav className="flex gap-4 md:gap-6">
            <Link
              href="/terms"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ScanPro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}