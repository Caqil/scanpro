"use client";

import Link from "next/link";
import { LanguageLink } from "@/components/language-link";
import { SiteLogo } from "@/components/site-logo";
import { useLanguageStore } from "@/src/store/store";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Github, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export function Footer() {
  const { t } = useLanguageStore();
  const [email, setEmail] = useState("");
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    toast.success("Thanks for subscribing to our newsletter!");
    setEmail("");
  };
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-muted/20 mt-12">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Top section with logo, description and newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <SiteLogo className="h-8 w-8" />
              <span className="font-bold text-xl">ScanPro</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Advanced PDF tools for professionals. Convert, edit, protect and optimize your 
              documents with our powerful web-based platform and API.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground">support@scanpro.cc</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  123 Document Street, PDF City, 94103, United States
                </span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Subscribe to Our Newsletter</h3>
            <p className="text-sm text-muted-foreground">
              Get the latest news, updates and tips delivered directly to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
        
        {/* Navigation menus */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 border-t border-border pt-8">
          <div>
            <h3 className="font-medium mb-4">PDF Tools</h3>
            <ul className="space-y-2">
              <li>
                <LanguageLink href="/convert/pdf-to-docx" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  PDF to Word
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/convert/pdf-to-xlsx" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  PDF to Excel
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/convert/pdf-to-pptx" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  PDF to PowerPoint
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/convert/pdf-to-jpg" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  PDF to JPG
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/tools" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  View All PDF Tools
                </LanguageLink>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">PDF Management</h3>
            <ul className="space-y-2">
              <li>
                <LanguageLink href="/merge" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Merge PDF
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/split" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Split PDF
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/compress" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Compress PDF
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/protect" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Protect PDF
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/repair" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Repair PDF
                </LanguageLink>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <LanguageLink href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </LanguageLink>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <LanguageLink href="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/developer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  API Documentation
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/tutorials" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Tutorials
                </LanguageLink>
              </li>
              <li>
                <LanguageLink href="/status" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  System Status
                </LanguageLink>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section with legal info */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentYear} ScanPro. All rights reserved.
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            <LanguageLink href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </LanguageLink>
            <LanguageLink href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </LanguageLink>
            <LanguageLink href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookie Policy
            </LanguageLink>
            <LanguageLink href="/security" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Security
            </LanguageLink>
            <LanguageLink href="/sitemap" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Sitemap
            </LanguageLink>
          </div>
        </div>
      </div>
    </footer>
  );
}