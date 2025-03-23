"use client";

import { useLanguageStore } from "@/src/store/store";
import { LanguageLink } from "@/components/language-link";
import { Button } from "@/components/ui/button";

export function UnlockHeaderSection() {
  const { t } = useLanguageStore();
  

  return (
    <div className="mx-auto flex flex-col items-center text-center mb-8">
        <div className="mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t('unlockPdf.title')}
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
          {t('unlockPdf.description')}
        </p>
      </div>
  );
}


export function HowToUnlockSection() {
  const { t } = useLanguageStore();
  
  const steps = [
    {
      number: "1",
      title: t('unlockPdf.howTo.upload.title'),
      description: t('unlockPdf.howTo.upload.description')
    },
    {
      number: "2", 
      title: t('unlockPdf.howTo.enterPassword.title'),
      description: t('unlockPdf.howTo.enterPassword.description')
    },
    {
      number: "3",
      title: t('unlockPdf.howTo.download.title'),
      description: t('unlockPdf.howTo.download.description')
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {t('unlockPdf.howTo.title')}
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="font-bold">{step.number}</span>
            </div>
            <h3 className="text-lg font-medium mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FAQSection() {
  const { t } = useLanguageStore();
  
  const faqs = [
    {
      question: t('unlockPdf.faq.passwordRequired.question'),
      answer: t('unlockPdf.faq.passwordRequired.answer')
    },
    {
      question: t('unlockPdf.faq.security.question'),
      answer: t('unlockPdf.faq.security.answer')
    },
    {
      question: t('unlockPdf.faq.restrictions.question'),
      answer: t('unlockPdf.faq.restrictions.answer')
    },
    {
      question: t('unlockPdf.faq.quality.question'),
      answer: t('unlockPdf.faq.quality.answer')
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {t('contact.faq.title')}
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
              {faq.question}
            </h3>
            <p className="text-sm text-muted-foreground">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RelatedToolsSection() {
  const { t } = useLanguageStore();
  
  const tools = [
    {
      href: "/protect",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      ),
      name: t('protectPdf.title')
    },
    {
      href: "/sign",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
          <path d="M20 20h-8.5c-.83 0-1.5-.67-1.5-1.5v-8c0-.83.67-1.5 1.5-1.5h8.5"></path>
          <path d="M16 8V4c0-.5.5-1 1-1h4"></path>
          <path d="M18 15v-7h3"></path>
          <path d="M10 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4"></path>
        </svg>
      ),
      name: "Sign PDF"
    },
    {
      href: "/watermark",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
        </svg>
      ),
      name: t('watermark.title')
    },
    {
      href: "/compress",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
          <path d="M22 12H2m20 0-4 4m4-4-4-4M2 20V4"></path>
        </svg>
      ),
      name: t('compressPdf.title')
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">
        {t('unlockPdf.relatedTools')}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <LanguageLink 
            key={tool.href} 
            href={tool.href} 
            className="border rounded-lg p-4 text-center hover:border-primary transition-colors"
          >
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
                {tool.icon}
              </div>
              <span className="text-sm font-medium">{tool.name}</span>
            </div>
          </LanguageLink>
        ))}
      </div>
      <div className="text-center mt-6">
        <LanguageLink href="/tools">
          <Button variant="outline">
            {t('pdfTools.viewAllTools')}
          </Button>
        </LanguageLink>
      </div>
    </div>
  );
}