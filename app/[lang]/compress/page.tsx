
import { cn } from "@/lib/utils";
import { ArrowDownIcon, FileIcon, ImageIcon, MailIcon } from "lucide-react";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MultiPdfCompressor } from "@/components/pdf-compressor";
import enTranslations from '@/src/lib/i18n/locales/en';
import idTranslations from '@/src/lib/i18n/locales/id';
import esTranslations from '@/src/lib/i18n/locales/es';
import frTranslations from '@/src/lib/i18n/locales/fr';
import zhTranslations from '@/src/lib/i18n/locales/zh';
import arTranslations from '@/src/lib/i18n/locales/ar';
import hiTranslations from '@/src/lib/i18n/locales/hi';
import ruTranslations from '@/src/lib/i18n/locales/ru';
import ptTranslations from '@/src/lib/i18n/locales/pt';
import deTranslations from '@/src/lib/i18n/locales/de';
import jaTranslations from '@/src/lib/i18n/locales/ja';
import koTranslations from '@/src/lib/i18n/locales/ko';
import itTranslations from '@/src/lib/i18n/locales/it';
import trTranslations from '@/src/lib/i18n/locales/tr';
import { SUPPORTED_LANGUAGES } from '@/src/lib/i18n/config';

type Language = typeof SUPPORTED_LANGUAGES[number];

// Helper function to get translation based on language
function getTranslation(lang: string, key: string): string {
  let translations;
  switch (lang) {
    case "id":
      translations = idTranslations;
      break;
    case "es":
      translations = esTranslations;
      break;
    case "fr":
      translations = frTranslations;
      break;
    case "zh":
      translations = zhTranslations;
      break;
    case "ar":
      translations = arTranslations;
      break;
    case "hi":
      translations = hiTranslations;
      break;
    case "ru":
      translations = ruTranslations;
      break;
    case "pt":
      translations = ptTranslations;
      break;
    case "de":
      translations = deTranslations;
      break;
    case "ja":
      translations = jaTranslations;
      break;
    case "ko":
      translations = koTranslations;
      break;
    case "it":
      translations = itTranslations;
      break;
    case "tr":
      translations = trTranslations;
      break;
    default:
      translations = enTranslations; // Fallback to English
  }
  
  // Navigate through nested keys
  const keys = key.split('.');
  const result = keys.reduce((obj, k) => 
    (obj && obj[k] !== undefined) ? obj[k] : undefined, 
    translations as any
  );
  
  return result !== undefined ? result : key;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: paramLang } = await params;
  const lang = SUPPORTED_LANGUAGES.includes(paramLang as Language) ? paramLang as Language : "en";
  const t = (key: string) => getTranslation(lang, key);
 // Define stop words for supported languages
 const stopWordsByLanguage: Record<string, string[]> = {
  en: ["the", "a", "an", "and", "or", "to", "in", "with", "for", "is", "on", "at"],
  id: ["dan", "di", "ke", "dari", "untuk", "yang", "dengan", "atau", "pada"],
  es: ["el", "la", "los", "las", "y", "o", "en", "con", "para", "de", "a"],
  fr: ["le", "la", "les", "et", "ou", "à", "en", "avec", "pour", "de"],
  zh: ["的", "了", "在", "是", "我", "他", "这", "那", "和", "你"], // Simplified Chinese
  ar: ["في", "من", "إلى", "على", "و", "هذا", "تلك", "مع", "أو"], // Arabic
  hi: ["और", "के", "में", "से", "है", "को", "का", "कि", "पर"], // Hindi
  ru: ["и", "в", "на", "с", "к", "от", "для", "по", "или"], // Russian
  pt: ["e", "ou", "em", "com", "para", "de", "a", "o", "as"], // Portuguese
  de: ["und", "in", "mit", "für", "zu", "auf", "an", "oder"], // German
  ja: ["の", "に", "を", "は", "が", "と", "で", "です"], // Japanese (hiragana)
  ko: ["은", "는", "이", "가", "을", "를", "에", "와"], // Korean
  it: ["e", "o", "in", "con", "per", "di", "a", "il", "la"], // Italian
  tr: ["ve", "ile", "de", "da", "için", "bu", "şu", "veya"] // Turkish
};



// Keyword extraction function with language-specific stop words
const extractKeywords = (text: string, language: string): string[] => {
  // Select stop words based on language, default to English if not found
  const stopWords = stopWordsByLanguage[language] || stopWordsByLanguage["en"];
  
  // Convert to lowercase (for Latin-based languages) and remove punctuation
  const words = text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/);
  
  // Filter out stop words and short words, then count frequency
  const filteredWords = words
    .filter(word => !stopWords.includes(word) && word.length > 2)
    .reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  // Sort by frequency and take top 5
  return Object.keys(filteredWords)
    .sort((a, b) => filteredWords[b] - filteredWords[a])
    .slice(0, 5);
};
// Get translated title and description
const title = t("compressPdf.title");
const description = t("compressPdf.description");
// Combine title and description for keyword extraction
const keywords = extractKeywords(`${title} ${description}`, lang);
  return {
    title:title,
    description: description,
    keywords:keywords,
    openGraph: {
      title: t("compressPdf.title"),
      description: t("compressPdf.description"),
      url: `/${lang}/compress`,
      siteName: "ScanPro",
      locale: {
        'en': 'en_US',
        'id': 'id_ID',
        'es': 'es_ES',
        'fr': 'fr_FR',
        'zh': 'zh_CN',
        'ar': 'ar_SA',
        'hi': 'hi_IN',
        'ru': 'ru_RU',
        'pt': 'pt_BR',
        'de': 'de_DE',
        'ja': 'ja_JP',
        'ko': 'ko_KR',
        'it': 'it_IT',
        'tr': 'tr_TR'
    }[lang] || 'en_US',
    },
    alternates: {
      canonical: `/${lang}/compress`,
      languages: Object.fromEntries(
        SUPPORTED_LANGUAGES.map(code => {
          const langCode = {
            'en': 'en-US',
            'id': 'id-ID',
            'es': 'es-ES',
            'fr': 'fr-FR',
            'zh': 'zh-CN',
            'ar': 'ar-SA',
            'hi': 'hi-IN',
            'ru': 'ru-RU',
            'pt': 'pt-BR',
            'de': 'de-DE',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
            'it': 'it-IT',
            'tr': 'tr-TR'
          }[code] || `${code}`;
          
          return [langCode, `/${code}/compress`];
        })
      ),
    }
  };
}

export default function CompressPage() {
  return (
    <div className="container max-w-5xl py-12 mx-auto">
      {/* Header Section */}
      <div className="mx-auto flex flex-col items-center text-center mb-8">
        <div className="mb-4 p-3 rounded-full bg-green-100 dark:bg-green-900/30">
          <ArrowDownIcon className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Compress PDF
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
          Reduce PDF file sizes effortlessly while preserving document quality
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-12">
        {/* Compression Tool Card */}
        <section>
          <MultiPdfCompressor />
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-center">How to Compress PDF Files</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
                <span className="font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Upload</h3>
              <p className="text-sm text-muted-foreground">
                Upload the PDF file you want to compress. Files up to 100MB are supported.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
                <span className="font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Choose Quality</h3>
              <p className="text-sm text-muted-foreground">
                Select your preferred compression level based on your needs.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
                <span className="font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Download</h3>
              <p className="text-sm text-muted-foreground">
                Download your compressed PDF file, ready to share or store.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-8 bg-muted/20 rounded-xl px-6">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">
              Why Compress Your PDFs?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Optimize your documents for easier sharing, storage, and faster handling
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<ArrowDownIcon className="h-6 w-6 text-green-500" />}
              title="Lightning-Fast Uploads"
              description="Share compressed PDFs quickly with faster upload speeds"
            />
            <FeatureCard
              icon={<MailIcon className="h-6 w-6 text-green-500" />}
              title="Email Friendly"
              description="Fit within email size limits without compromising quality"
            />
            <FeatureCard
              icon={<FileIcon className="h-6 w-6 text-green-500" />}
              title="Storage Efficient"
              description="Maximize space on your devices and cloud storage"
            />
          </div>
        </section>
{/* More Tools Section */}
<section>
        <h2 className="text-2xl font-bold mb-6 text-center">More PDF Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/merge" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
                <ArrowDownIcon className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-sm font-medium">Merge PDF</span>
            </div>
          </Link>
          <Link href="/split" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
                <ArrowDownIcon className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-sm font-medium">Split PDF</span>
            </div>
          </Link>
          <Link href="/convert/pdf-to-docx" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
                <FileIcon className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-sm font-medium">PDF to Word</span>
            </div>
          </Link>
          <Link href="/convert/pdf-to-jpg" className="border rounded-lg p-4 text-center hover:border-primary transition-colors">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-2">
                <ImageIcon className="h-5 w-5 text-yellow-500" />
              </div>
              <span className="text-sm font-medium">PDF to JPG</span>
            </div>
          </Link>
        </div>
        <div className="text-center mt-6">
          <Link href="/tools">
            <Button variant="outline">View All PDF Tools</Button>
          </Link>
        </div>
      </section>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div
      className={cn(
        "group relative p-6 bg-card rounded-lg shadow-sm border border-border/20",
        "hover:shadow-md transition-all duration-300"
      )}
    >
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
      <div className="relative flex flex-col items-center text-center">
        <div
          className={cn(
            "h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4",
            "transform group-hover:scale-110 transition-transform duration-200"
          )}
        >
          {icon}
        </div>
        <h3
          className={cn(
            "text-xl font-semibold mb-2 text-foreground",
            "group-hover:text-primary transition-colors duration-200"
          )}
        >
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}