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
import { 
  FileText, 
  Image, 
  Table, 
  ArrowLeft, 
  ArrowRight, 
  PenTool, 
  LayoutGrid, 
  ArrowDown, 
  RotateCcw, 
  Shield, 
  Edit2, 
  Lock,
  Printer,
  CloudDownload,
  FileCheck,
  FileCheck2,
  BookOpen,
  Wand2,
  Layers
} from "lucide-react";
import { SiteLogo } from "./site-logo";

// Type for tool definition with optional isNew
type ToolDefinition = {
  name: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  isNew?: boolean;
};

// Type for category definition
type CategoryDefinition = {
  category: string;
  description: string;
  tools: ToolDefinition[];
};

const PDF_TOOLS: CategoryDefinition[] = [
  {
    category: "Convert PDF",
    description: "Transform documents between formats",
    tools: [
      { 
        name: "PDF to Word", 
        href: "/convert/pdf-to-docx",
        icon: <FileText className="h-5 w-5 text-blue-500" />,
        description: "Convert PDF to editable Word documents"
      },
      { 
        name: "PDF to Excel", 
        href: "/convert/pdf-to-xlsx",
        icon: <Table className="h-5 w-5 text-green-500" />,
        description: "Extract data from PDFs into spreadsheets"
      },
      { 
        name: "PDF to PowerPoint", 
        href: "/convert/pdf-to-pptx",
        icon: <FileText className="h-5 w-5 text-orange-500" />,
        description: "Convert PDF slides to PowerPoint"
      },
      { 
        name: "PDF to JPG", 
        href: "/convert/pdf-to-jpg",
        icon: <Image className="h-5 w-5 text-yellow-500" />,
        description: "Extract images from PDF documents"
      },
      { 
        name: "PDF to PNG", 
        href: "/convert/pdf-to-png",
        icon: <Image className="h-5 w-5 text-yellow-500" />,
        description: "Extract images from PDF documents"
      },
      { 
        name: "PDF to HTML", 
        href: "/convert/pdf-to-html",
        icon: <LayoutGrid className="h-5 w-5 text-purple-500" />,
        description: "Convert PDFs for web publishing"
      },
      { 
        name: "Word to PDF", 
        href: "/convert/docx-to-pdf",
        icon: <FileText className="h-5 w-5 text-blue-500" />,
        description: "Convert Word documents to PDF"
      },
      { 
        name: "Excel to PDF", 
        href: "/convert/xlsx-to-pdf",
        icon: <Table className="h-5 w-5 text-green-500" />,
        description: "Convert Excel spreadsheets to PDF"
      },
      { 
        name: "PowerPoint to PDF", 
        href: "/convert/pptx-to-pdf",
        icon: <FileText className="h-5 w-5 text-orange-500" />,
        description: "Convert PowerPoint slides to PDF"
      },
      { 
        name: "JPG to PDF", 
        href: "/convert/jpg-to-pdf",
        icon: <Image className="h-5 w-5 text-yellow-500" />,
        description: "Convert images to PDF"
      },
      { 
        name: "PNG to PDF", 
        href: "/convert/png-to-pdf",
        icon: <Image className="h-5 w-5 text-yellow-500" />,
        description: "Convert images to PDF"
      },
      { 
        name: "HTML to PDF", 
        href: "/convert/html-to-pdf",
        icon: <LayoutGrid className="h-5 w-5 text-purple-500" />,
        description: "Convert web pages to PDF"
      },
    ]
  },
  {
    category: "PDF Management",
    description: "Essential PDF manipulation tools",
    tools: [
      { 
        name: "Merge PDF", 
        href: "/merge", 
        icon: <ArrowRight className="h-5 w-5 text-red-500" />,
        description: "Combine multiple PDFs into one"
      },
      { 
        name: "Compress PDF", 
        href: "/compress", 
        icon: <ArrowDown className="h-5 w-5 text-green-500" />,
        description: "Reduce PDF file size"
      },
    ]
  },
  {
    category: "PDF Editing",
    description: "Advanced PDF customization",
    tools: [
      { 
        name: "Add Watermark", 
        href: "/watermark", 
        icon: <Edit2 className="h-5 w-5 text-purple-500" />,
        description: "Add text or image watermarks"
      },
      { 
        name: "OCR", 
        href: "/ocr", 
        icon: <FileCheck2 className="h-5 w-5 text-blue-500" />,
        description: "Extract text from scanned documents"
      },
    ]
  },
  {
    category: "PDF Security",
    description: "Protect and manage PDF access",
    tools: [
      { 
        name: "Unlock PDF", 
        href: "/unlock", 
        icon: <Lock className="h-5 w-5 text-blue-500" />,
        description: "Remove password protection"
      },
      { 
        name: "Protect PDF", 
        href: "/protect", 
        icon: <Shield className="h-5 w-5 text-blue-500" />,
        description: "Add password and encryption"
      },
    ]
  }
];

// Additional company and product information
const COMPANY_MENU: CategoryDefinition[] = [
  {
    category: "About",
    description: "Learn more about our company",
    tools: [
      { 
        name: "About Us", 
        href: "/about", 
        icon: <BookOpen className="h-5 w-5 text-blue-500" />,
        description: "Our mission and story"
      },
      { 
        name: "Features", 
        href: "/features", 
        icon: <Layers className="h-5 w-5 text-purple-500" />,
        description: "Explore our powerful features"
      },
      { 
        name: "API", 
        href: "/api-docs", 
        icon: <CloudDownload className="h-5 w-5 text-green-500" />,
        description: "Developer integration"
      },
    ]
  },
  {
    category: "Support",
    description: "Get help and resources",
    tools: [
      { 
        name: "Contact", 
        href: "/contact", 
        icon: <Printer className="h-5 w-5 text-blue-500" />,
        description: "Reach out to our team"
      },
      { 
        name: "Help Center", 
        href: "/help", 
        icon: <Wand2 className="h-5 w-5 text-purple-500" />,
        description: "Tutorials and support"
      },
      { 
        name: "Terms of Service", 
        href: "/terms", 
        icon: <FileCheck className="h-5 w-5 text-green-500" />,
        description: "Legal terms and conditions"
      },
    ]
  }
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Navigation items for desktop and mobile
  const navItems = [
    { 
      label: "PDF Tools", 
      dropdown: PDF_TOOLS 
    },
    { 
      label: "Company", 
      dropdown: COMPANY_MENU 
    },
    { href: "/pricing", label: "Pricing" },
  ];

  // Function to toggle mobile category
  const toggleMobileCategory = (category: string) => {
    setActiveMobileCategory(
      activeMobileCategory === category ? null : category
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            {/* Updated yellow background to match logo color */}
            <div className="bg-primary p-1 rounded-md">
              <SiteLogo />
            </div>
            <span className="font-bold text-xl hidden sm:inline-block" suppressHydrationWarning={true}>
              ScanPro
            </span>
            {/* <Badge variant="outline" className="hidden lg:flex ml-2 border-primary/50 text-primary-foreground bg-primary/20">
              Beta
            </Badge> */}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            item.dropdown ? (
              <div 
                key={item.label} 
                className="relative group"
                onMouseEnter={() => setActiveCategory(item.dropdown[0].category)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <button className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  {item.label}
                </button>
                
                {/* Dropdown Mega Menu */}
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-[1200px] mx-auto mt-4 p-6 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top"
                >
                  <div className="grid grid-cols-4 gap-6">
                    {/* Categories */}
                    <div className="col-span-1 border-r pr-4">
                      {item.dropdown.map((category) => (
                        <button
                          key={category.category}
                          className={`w-full text-left px-3 py-2 rounded ${
                            activeCategory === category.category 
                              ? 'bg-primary/20 text-primary-foreground' 
                              : 'hover:bg-muted text-muted-foreground'
                          }`}
                          onClick={() => setActiveCategory(category.category)}
                        >
                          <div className="font-semibold">{category.category}</div>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </button>
                      ))}
                    </div>

                    {/* Active Category Tools */}
                    <div className="col-span-3 grid grid-cols-3 gap-4">
                      {item.dropdown
                        .find(cat => cat.category === activeCategory || activeCategory === null)
                        ?.tools.map((tool) => (
                          <Link
                            key={tool.name}
                            href={tool.href}
                            className="p-3 rounded-lg hover:bg-muted/50 flex items-start gap-3 group"
                          >
                            <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/30 transition-colors">
                              {tool.icon}
                            </div>
                            <div>
                              <div className="font-medium flex items-center">
                                {tool.name}
                                {tool.isNew && (
                                  <Badge 
                                    variant="outline" 
                                    className="ml-2 bg-primary/20 text-primary-foreground text-xs border-primary/40"
                                  >
                                    New
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{tool.description}</p>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <ModeToggle />
          
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

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background/95 backdrop-blur border-t max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="container max-w-6xl mx-auto py-4 space-y-4">
            {navItems.map((item) => (
              item.dropdown ? (
                <div key={item.label} className="space-y-2">
                  <div 
                    className="px-3 py-2 text-lg font-semibold text-foreground flex justify-between items-center"
                    onClick={() => toggleMobileCategory(item.label)}
                  >
                    {item.label}
                    <span>
                      {activeMobileCategory === item.label ? '−' : '+'}
                    </span>
                  </div>
                  
                  {activeMobileCategory === item.label && (
                    <div>
                      {item.dropdown.map((category) => (
                        <div 
                          key={category.category} 
                          className="space-y-2 border-b pb-4 last:border-b-0"
                        >
                          <div className="px-3 text-sm font-medium text-primary">
                            {category.category}
                            <p className="text-xs text-muted-foreground">
                              {category.description}
                            </p>
                          </div>
                          <div className="space-y-1">
                            {category.tools.map((tool) => (
                              <Link
                                key={tool.name}
                                href={tool.href}
                                className="flex items-center px-3 py-2 hover:bg-primary/10 rounded-md"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <div className="mr-3">
                                  {tool.icon}
                                </div>
                                <span className="flex-grow">{tool.name}</span>
                                {tool.isNew && (
                                  <Badge 
                                    variant="outline" 
                                    className="ml-2 bg-primary/20 text-primary-foreground text-xs border-primary/40"
                                  >
                                    New
                                  </Badge>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-lg font-medium hover:bg-primary/10 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </header>
  );
}