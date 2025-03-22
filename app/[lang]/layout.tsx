// app/[lang]/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Footer } from "@/components/footer"
import { ProHeader } from "@/components/pro-header"
import { notFound } from "next/navigation"
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import "../globals.css"

// Define supported languages
const languages = ["en", "id"]

// Font configuration
export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// For static generation of all language variants
export function generateStaticParams() {
  return languages.map((lang) => ({ lang }))
}

// Import translation files for server components
import enTranslations from "@/src/lib/i18n/locales/en"
import idTranslations from "@/src/lib/i18n/locales/id"

// Helper function to get translation from the translation files
function getTranslation(translations: any, path: string): string {
  const keys = path.split(".")
  const result = keys.reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), translations)
  return result !== undefined ? result : path
}

// Generate metadata based on language parameter
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  // Await the params object before accessing its properties
  const { lang } = await params

  // Validate language parameter
  if (!languages.includes(lang)) {
    notFound()
  }

  // Get translations for the current language
  const translations = lang === "en" ? enTranslations : idTranslations

  // Create a translation function similar to t()
  const t = (key: string) => getTranslation(translations, key)

  return {
    title: {
      default: t("metadata.title"),
      template: t("metadata.template"),
    },
    description: t("metadata.description"),
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://scanpro.cc"),
    alternates: {
      canonical: `/${lang}`,
      languages: {
        "en-US": "/en",
        "id-ID": "/id",
      },
    },
  }
}

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: string }>
}>) {
  // Await the params object before accessing its properties
  const { lang } = await params

  // Validate language parameter
  if (!languages.includes(lang)) {
    notFound()
  }

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <ProHeader urlLanguage={lang} />
            <div className="flex-1 mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">{children}</div>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}