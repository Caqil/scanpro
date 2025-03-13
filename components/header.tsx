"use client"
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { 
  FileIcon, 
  GearIcon,
  GitHubLogoIcon,
  HamburgerMenuIcon,
  Cross1Icon
} from "@radix-ui/react-icons";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <FileIcon className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              PDF Converter Pro
            </span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link 
            href="/features" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Features
          </Link>
          <Link 
            href="/api-docs" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            API
          </Link>
          <Link 
            href="/pricing" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link href="/dashboard" className="hidden md:block">
            <Button variant="default" size="sm">
              <GearIcon className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="https://github.com/yourusername/pdf-converter" target="_blank" rel="noopener noreferrer" className="hidden md:block">
            <Button variant="outline" size="icon">
              <GitHubLogoIcon className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <Cross1Icon className="h-5 w-5" />
            ) : (
              <HamburgerMenuIcon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <Link 
              href="/" 
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/features" 
              className="block text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/api-docs" 
              className="block text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              API
            </Link>
            <Link 
              href="/pricing" 
              className="block text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="pt-4 border-t flex justify-between">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" size="sm">
                  <GearIcon className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link 
                href="https://github.com/yourusername/pdf-converter" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button variant="outline" size="icon">
                  <GitHubLogoIcon className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}