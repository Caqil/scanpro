"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  FileText,
  Image,
  Table,
  ArrowRight,
  ArrowDown,
  Shield,
  Edit2,
  Lock,
  Printer,
  CloudDownload,
  FileCheck,
  FileCheck2,
  BookOpen,
  Wand2,
  Layers,
  Menu,
  X,
  ChevronDown,
  Search,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { SiteLogo } from "./site-logo"

// Type definitions
type ToolDefinition = {
  name: string
  href: string
  icon: React.ReactNode
  description: string
  isNew?: boolean
}

type CategoryDefinition = {
  category: string
  description: string
  tools: ToolDefinition[]
}

// PDF Tools data
const PDF_TOOLS: CategoryDefinition[] = [
  {
    category: "Convert PDF",
    description: "Transform documents between formats",
    tools: [
      {
        name: "PDF to Word",
        href: "/convert/pdf-to-docx",
        icon: <FileText className="h-5 w-5 text-blue-500" />,
        description: "Convert PDF to editable Word documents",
      },
      {
        name: "PDF to Excel",
        href: "/convert/pdf-to-xlsx",
        icon: <Table className="h-5 w-5 text-green-500" />,
        description: "Extract data from PDFs into spreadsheets",
      },
      {
        name: "PDF to PowerPoint",
        href: "/convert/pdf-to-pptx",
        icon: <FileText className="h-5 w-5 text-orange-500" />,
        description: "Convert PDF slides to PowerPoint",
      },
      {
        name: "PDF to JPG",
        href: "/convert/pdf-to-jpg",
        icon: <Image className="h-5 w-5 text-yellow-500" />,
        description: "Extract images from PDF documents",
      },
      {
        name: "PDF to PNG",
        href: "/convert/pdf-to-png",
        icon: <Image className="h-5 w-5 text-yellow-500" />,
        description: "Extract images from PDF documents",
      },
      {
        name: "PDF to HTML",
        href: "/convert/pdf-to-html",
        icon: <FileText className="h-5 w-5 text-purple-500" />,
        description: "Convert PDFs for web publishing",
      },
    ],
  },
  {
    category: "PDF Management",
    description: "Essential PDF manipulation tools",
    tools: [
      {
        name: "Merge PDF",
        href: "/merge",
        icon: <ArrowRight className="h-5 w-5 text-red-500" />,
        description: "Combine multiple PDFs into one",
      },
      {
        name: "Compress PDF",
        href: "/compress",
        icon: <ArrowDown className="h-5 w-5 text-green-500" />,
        description: "Reduce PDF file size",
      },
    ],
  },
  {
    category: "PDF Editing",
    description: "Advanced PDF customization",
    tools: [
      {
        name: "Add Watermark",
        href: "/watermark",
        icon: <Edit2 className="h-5 w-5 text-purple-500" />,
        description: "Add text or image watermarks",
      },
      {
        name: "OCR",
        href: "/ocr",
        icon: <FileCheck2 className="h-5 w-5 text-blue-500" />,
        description: "Extract text from scanned documents",
        isNew: true,
      },
    ],
  },
  {
    category: "PDF Security",
    description: "Protect and manage PDF access",
    tools: [
      {
        name: "Unlock PDF",
        href: "/unlock",
        icon: <Lock className="h-5 w-5 text-blue-500" />,
        description: "Remove password protection",
      },
      {
        name: "Protect PDF",
        href: "/protect",
        icon: <Shield className="h-5 w-5 text-blue-500" />,
        description: "Add password and encryption",
      },
    ],
  },
]

// Company menu data
const COMPANY_MENU: CategoryDefinition[] = [
  {
    category: "About",
    description: "Learn more about our company",
    tools: [
      {
        name: "About Us",
        href: "/about",
        icon: <BookOpen className="h-5 w-5 text-blue-500" />,
        description: "Our mission and story",
      },
      {
        name: "Features",
        href: "/features",
        icon: <Layers className="h-5 w-5 text-purple-500" />,
        description: "Explore our powerful features",
      },
      {
        name: "API",
        href: "/api-docs",
        icon: <CloudDownload className="h-5 w-5 text-green-500" />,
        description: "Developer integration",
      },
    ],
  },
  {
    category: "Support",
    description: "Get help and resources",
    tools: [
      {
        name: "Contact",
        href: "/contact",
        icon: <Printer className="h-5 w-5 text-blue-500" />,
        description: "Reach out to our team",
      },
      {
        name: "Help Center",
        href: "/help",
        icon: <Wand2 className="h-5 w-5 text-purple-500" />,
        description: "Tutorials and support",
      },
      {
        name: "Terms of Service",
        href: "/terms",
        icon: <FileCheck className="h-5 w-5 text-green-500" />,
        description: "Legal terms and conditions",
      },
    ],
  },
]


const NavItem = ({
  label,
  href,
  dropdown,
  isActive,
  onClick,
}: {
  label: string
  href?: string
  dropdown?: CategoryDefinition[]
  isActive?: boolean
  onClick?: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(dropdown?.[0]?.category || null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  if (!dropdown) {
    return (
      <Link
        href={href || "#"}
        className={cn(
          "px-3 py-2 text-sm font-medium rounded-md transition-colors",
          isActive ? "text-primary bg-primary/10" : "text-foreground/70 hover:text-primary hover:bg-primary/5",
        )}
        onClick={onClick}
      >
        {label}
      </Link>
    )
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        className={cn(
          "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
          isOpen || isActive
            ? "text-primary bg-primary/10"
            : "text-foreground/70 hover:text-primary hover:bg-primary/5",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen ? "rotate-180" : "")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-screen max-w-[900px] bg-background border rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="flex">
            {/* Categories sidebar */}
            <div className="w-64 bg-muted/30 border-r p-2">
              {dropdown.map((category) => (
                <button
                  key={category.category}
                  className={cn(
                    "w-full text-left px-3 py-3 rounded-md transition-colors",
                    activeCategory === category.category
                      ? "bg-primary/15 text-primary"
                      : "hover:bg-muted text-foreground/80",
                  )}
                  onClick={() => setActiveCategory(category.category)}
                >
                  <div className="font-medium">{category.category}</div>
                  <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
                </button>
              ))}
            </div>

            {/* Tools grid */}
            <div className="flex-1 p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {dropdown
                  .find((cat) => cat.category === activeCategory)
                  ?.tools.map((tool) => (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      className="group p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-background border group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
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
                          <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Mobile menu component
const MobileMenu = ({
  isOpen,
  onClose,
  navItems,
}: {
  isOpen: boolean
  onClose: () => void
  navItems: Array<{ label: string; href?: string; dropdown?: CategoryDefinition[] }>
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest("button[data-mobile-toggle]")
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden">
      <div
        ref={menuRef}
        className="fixed inset-y-0 right-0 w-full max-w-sm bg-background shadow-lg p-6 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-8">
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
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>

        <div className="space-y-1 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tools..." className="pl-10" />
          </div>
        </div>

        <div className="space-y-1">
          {navItems.map((item, index) => (
            <div key={index} className="border-b last:border-b-0 py-2">
              {item.dropdown ? (
                <div>
                  <button
                    className="flex items-center justify-between w-full py-2 text-base font-medium"
                    onClick={() => setActiveCategory(activeCategory === item.label ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform", activeCategory === item.label ? "rotate-180" : "")}
                    />
                  </button>

                  {activeCategory === item.label && (
                    <div className="mt-2 space-y-4 pl-4">
                      {item.dropdown.map((category) => (
                        <div key={category.category} className="space-y-2">
                          <div className="font-medium text-sm text-primary">{category.category}</div>
                          <div className="space-y-1">
                            {category.tools.map((tool) => (
                              <Link
                                key={tool.name}
                                href={tool.href}
                                className="flex items-center py-2 text-sm hover:text-primary"
                                onClick={onClose}
                              >
                                <div className="mr-3 opacity-70">{tool.icon}</div>
                                <span>{tool.name}</span>
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
                  href={item.href || "#"}
                  className="block py-2 text-base font-medium hover:text-primary"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t">
          <Button className="w-full">Get Started</Button>
        </div>
      </div>
    </div>
  )
}

export function ProHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Navigation items
  const navItems = [
    {
      label: "PDF Tools",
      dropdown: PDF_TOOLS,
    },
    {
      label: "Company",
      dropdown: COMPANY_MENU,
    },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-6xl mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => (
              <NavItem key={index} label={item.label} href={item.href} dropdown={item.dropdown} />
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">Quick search</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[300px] p-0">
                  <div className="p-2">
                    <Input placeholder="Search tools..." className="h-9" />
                  </div>
                  <div className="border-t">
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4 text-blue-500" />
                      <span>PDF to Word</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Table className="mr-2 h-4 w-4 text-green-500" />
                      <span>PDF to Excel</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ArrowRight className="mr-2 h-4 w-4 text-red-500" />
                      <span>Merge PDF</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <ModeToggle />
              <Button size="sm" variant="outline" className="hidden md:flex">
                Sign in
              </Button>
              <Button size="sm">Get Started</Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              data-mobile-toggle
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} navItems={navItems} />
    </header>
  )
}

