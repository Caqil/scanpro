"use client"
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { 
  FileIcon, 
  HamburgerMenuIcon,
  Cross1Icon
} from "@radix-ui/react-icons";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-md">
              <FileIcon className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-xl hidden sm:inline-block" suppressHydrationWarning={true}>
                ScanPro
              </span>
            <Badge variant="outline" className="hidden lg:flex ml-2">
              Beta
            </Badge>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/" 
            className="text-sm font-medium transition-colors hover:text-primary after:content-[''] after:block after:h-0.5 after:scale-x-0 after:bg-primary after:transition-transform hover:after:scale-x-100"
          >
            Home
          </Link>
          <Link 
            href="/features" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary after:content-[''] after:block after:h-0.5 after:scale-x-0 after:bg-primary after:transition-transform hover:after:scale-x-100"
          >
            Features
          </Link>
          <Link 
              href="/editor" 
              className="flex items-center px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-primary/5 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              PDF Editor
            </Link>
          <Link 
            href="/pricing" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary after:content-[''] after:block after:h-0.5 after:scale-x-0 after:bg-primary after:transition-transform hover:after:scale-x-100"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <div className="hidden md:block">
           
          </div>
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
          <div className="container max-w-6xl mx-auto py-4 space-y-3">
            <Link 
              href="/" 
              className="flex items-center px-2 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-primary/5 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/features" 
              className="flex items-center px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-primary/5 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/editor" 
              className="flex items-center px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-primary/5 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              PDF Editor
            </Link>
            
          </div>
        </div>
      )}
    </header>
  );
}