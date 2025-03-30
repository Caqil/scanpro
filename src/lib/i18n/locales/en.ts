/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  metadata: {
    title: "ScanPro - Free PDF Converter, Editor & OCR Online",
    template: "%s | ScanPro - PDF Tools",
    description: "Easily convert, edit, compress, merge, split, and OCR PDFs with ScanPro. Free, fast online tools—no downloads required.",
    keywords: "PDF converter, PDF editor, OCR online, compress PDF, merge PDF, split PDF, free PDF tools, online PDF editor, ScanPro"
  },
  nav: {
    tools: "Tools",
    company: "Company",
    pricing: "Pricing",
    convertPdf: "Convert PDF",
    convertPdfDesc: "Transform PDFs to and from other formats",
    selectLanguage: "Select Language",
    downloadApp: "Download App",
    getApp: "Get our mobile app for on-the-go PDF tools",
    appStores: "Get ScanPro App",
    mobileTools: "PDF tools on the go",
    signIn: "Sign in",
    signUp: "Sign up",
    signOut: "Sign out",
    dashboard: "Dashboard",
    profile: "Profile",
    account: "Account"

  },
  auth: {
    // Login
    email: "Email",
    emailPlaceholder: "name@example.com",
    password: "Password",
    passwordPlaceholder: "Your password",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "Confirm your password",
    forgotPassword: "Forgot password?",
    rememberMe: "Remember me",
    signIn: "Sign In",
    signingIn: "Signing in...",
    orContinueWith: "Or continue with",
    dontHaveAccount: "Don't have an account?",
    signUp: "Sign up",
    loginSuccess: "Signed in successfully",
    loginError: "An error occurred. Please try again.",
    invalidCredentials: "Invalid email or password",
    emailRequired: "Email is required",
    passwordRequired: "Password is required",
    invalidEmail: "Please enter a valid email address",

    // Registration
    name: "Name",
    namePlaceholder: "Your name",
    createAccount: "Create Account",
    creatingAccount: "Creating account...",
    alreadyHaveAccount: "Already have an account?",
    nameRequired: "Name is required",
    passwordLength: "Password must be at least 8 characters",
    passwordStrength: "Password strength",
    passwordWeak: "Weak",
    passwordFair: "Fair",
    passwordGood: "Good",
    passwordStrong: "Strong",
    passwordsDoNotMatch: "Passwords do not match",
    agreeTerms: "I agree to the",
    termsOfService: "terms of service",
    and: "and",
    privacyPolicy: "privacy policy",
    agreeToTerms: "Please agree to the terms of service",
    registrationFailed: "Registration failed",
    accountCreated: "Account created successfully",
    unknownError: "An error occurred",

    // Password Reset
    forgotInstructions: "Enter your email and we'll send you instructions to reset your password.",
    sendResetLink: "Send Reset Link",
    sending: "Sending...",
    resetEmailSent: "Password reset email sent",
    resetPasswordError: "Failed to send reset email",
    checkYourEmail: "Check your email",
    resetInstructions: "If an account exists with that email, we've sent instructions to reset your password.",
    didntReceiveEmail: "Didn't receive an email?",
    tryAgain: "Try again",
    backToLogin: "Back to login"
  },

  // Dashboard
  dashboard: {
    title: "Dashboard",
    overview: "Overview",
    apiKeys: "API Keys",
    subscription: "Subscription",
    profile: "Profile",
    totalUsage: "Total Usage",
    operations: "operations this month",
    active: "Active",
    inactive: "Inactive",
    keysAllowed: "keys allowed",
    mostUsed: "Most Used",
    of: "of",
    files: "files",
    usageByOperation: "Usage by Operation",
    apiUsageBreakdown: "Your API usage breakdown for the current month",
    noData: "No data available",
    createApiKey: "Create API Key",
    revokeApiKey: "Revoke API Key",
    confirmRevoke: "Are you sure you want to revoke this API key? This action cannot be undone.",
    keyRevoked: "API key revoked successfully",
    noApiKeys: "No API Keys",
    noApiKeysDesc: "You haven't created any API keys yet.",
    createFirstApiKey: "Create Your First API Key",
    keyName: "Key Name",
    keyNamePlaceholder: "My API Key",
    keyNameDesc: "Give your key a descriptive name to easily identify it later.",
    permissions: "Permissions",
    generateKey: "Generate Key",
    newApiKeyCreated: "New API Key Created",
    copyKeyDesc: "Copy this key now. For security reasons, you won't be able to see it again!",
    copyAndClose: "Copy and Close",
    keyCopied: "API key copied to clipboard",
    lastUsed: "Last used",
    never: "Never"
  },

  // Subscription
  subscription: {
    currentPlan: "Current Plan",
    subscriptionDetails: "Your subscription details and usage limits",
    plan: "Plan",
    free: "Free",
    basic: "Basic",
    pro: "Pro",
    enterprise: "Enterprise",
    renewsOn: "Your subscription renews on",
    cancelSubscription: "Cancel Subscription",
    changePlan: "Change Plan",
    upgrade: "Upgrade",
    downgrade: "Downgrade",
    features: "Features",
    limitations: "Limitations",
    confirm: "Confirm",
    cancel: "Cancel",
    subscriptionCanceled: "Subscription canceled successfully",
    upgradeSuccess: "Subscription upgraded successfully",
    pricingPlans: "Pricing Plans",
    monthly: "month",
    operationsPerMonth: "operations per month",
    requestsPerHour: "requests per hour",
    apiKey: "API key",
    apiKeys: "API keys",
    basicPdf: "Basic PDF operations",
    allPdf: "All PDF operations",
    basicOcr: "Basic OCR",
    advancedOcr: "Advanced OCR",
    prioritySupport: "Priority support",
    customWatermarks: "Custom watermarks",
    noWatermarking: "No watermarking",
    limitedOcr: "Limited OCR",
    noPrioritySupport: "No priority support",
    dedicatedSupport: "Dedicated support",
    customIntegration: "Custom integration help",
    whiteLabel: "White-label options"
  },

  // Profile
  profile: {
    title: "Profile Information",
    subtitle: "Update your personal information",
    changePassword: "Change Password",
    changePasswordDesc: "Update your account password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    profileUpdated: "Profile updated successfully",
    passwordUpdated: "Password updated successfully",
    updateProfile: "Update Profile",
    updating: "Updating...",
    emailCannotChange: "Email cannot be changed",
    passwordChanged: "Your password has been changed successfully",
    incorrectPassword: "Current password is incorrect"
  },
  // Hero section
  hero: {
    badge: "Powerful PDF Tools",
    title: "All-in-One PDF Converter & Editor",
    description: "Free online PDF tools to convert, compress, merge, split, rotate, watermark and more. No installation required.",
    btConvert: "Start Converting",
    btTools: "Explore All Tools"
  },

  popular: {
    pdfToWord: "PDF to Word",
    pdfToWordDesc: "Easily convert your PDF files into easy to edit DOC and DOCX documents.",
    pdfToExcel: "PDF to Excel",
    pdfToExcelDesc: "Pull data straight from PDFs into Excel spreadsheets in a few short seconds.",
    pdfToPowerPoint: "PDF to PowerPoint",
    pdfToPowerPointDesc: "Transform your PDF presentations into editable PowerPoint slides.",
    pdfToJpg: "PDF to JPG",
    pdfToJpgDesc: "Convert PDF pages to JPG images or extract all images from a PDF.",
    pdfToPng: "PDF to PNG",
    pdfToPngDesc: "Convert PDF pages to transparent PNG images with high quality.",
    pdfToHtml: "PDF to HTML",
    pdfToHtmlDesc: "Transform PDF documents into web-friendly HTML format.",
    wordToPdf: "Word to PDF",
    wordToPdfDesc: "Convert Word documents to PDF with perfect formatting and layout.",
    excelToPdf: "Excel to PDF",
    excelToPdfDesc: "Turn your Excel spreadsheets into perfectly formatted PDF documents.",
    powerPointToPdf: "PowerPoint to PDF",
    powerPointToPdfDesc: "Convert PowerPoint presentations to PDF for easy sharing.",
    jpgToPdf: "JPG to PDF",
    jpgToPdfDesc: "Create PDF files from your JPG images with customizable options.",
    pngToPdf: "PNG to PDF",
    pngToPdfDesc: "Convert PNG images to PDF with transparent background support.",
    htmlToPdf: "HTML to PDF",
    htmlToPdfDesc: "Convert webpages and HTML content to PDF documents.",
    mergePdf: "Merge PDF",
    mergePdfDesc: "Combine PDFs in the order you want with the easiest PDF merger available.",
    splitPdf: "Split PDF",
    splitPdfDesc: "Extract specific pages or split PDF into multiple documents.",
    compressPdf: "Compress PDF",
    compressPdfDesc: "Reduce file size while optimizing for maximal PDF quality.",
    rotatePdf: "Rotate PDF",
    rotatePdfDesc: "Change page orientation by rotating PDF pages as needed.",
    watermark: "Add Watermark",
    watermarkDesc: "Add text or image watermarks to protect and brand your PDF documents.",
    unlockPdf: "Unlock PDF",
    unlockPdfDesc: "Remove password protection and restrictions from PDF files.",
    protectPdf: "Protect PDF",
    protectPdfDesc: "Add password protection to secure your PDF documents.",
    signPdf: "Sign PDF",
    signPdfDesc: "Add digital signatures to your PDF documents securely.",
    ocr: "OCR",
    ocrDesc: "Extract text from scanned documents using Optical Character Recognition.",
    editPdf: "Edit PDF",
    editPdfDesc: "Make changes to text, images and pages in your PDF documents.",
    redactPdf: "Redact PDF",
    redactPdfDesc: "Permanently remove sensitive information from your PDF files.",
    viewAll: "View All PDF Tools"
  },

  // Converter section
  converter: {
    title: "Start Converting",
    description: "Upload your PDF and select the format you want to convert to",
    tabUpload: "Upload & Convert",
    tabApi: "API Integration",
    apiTitle: "Integrate with our API",
    apiDesc: "Use our REST API to convert PDFs programmatically in your application",
    apiDocs: "View API Docs"
  },

  // Convert Page
  convert: {
    title: {
      pdfToWord: "Convert PDF to Word",
      pdfToExcel: "Convert PDF to Excel",
      pdfToPowerPoint: "Convert PDF to PowerPoint",
      pdfToJpg: "Convert PDF to JPG",
      pdfToPng: "Convert PDF to PNG",
      pdfToHtml: "Convert PDF to HTML",
      wordToPdf: "Convert Word to PDF",
      excelToPdf: "Convert Excel to PDF",
      powerPointToPdf: "Convert PowerPoint to PDF",
      jpgToPdf: "Convert JPG to PNG",
      pngToPdf: "Convert PNG to PDF",
      htmlToPdf: "Convert HTML to PDF",
      generic: "Convert Your File"
    },
    description: {
      pdfToWord: "Transform PDF documents to editable Word files quickly and easily",
      pdfToExcel: "Extract tables and data from PDF files into Excel spreadsheets",
      pdfToPowerPoint: "Turn PDF presentations into editable PowerPoint slides",
      pdfToJpg: "Convert PDF pages to high-quality JPG images",
      pdfToPng: "Convert PDF pages to transparent PNG images",
      pdfToHtml: "Convert PDF documents to HTML web pages",
      wordToPdf: "Convert Word documents to PDF format with perfect formatting",
      excelToPdf: "Transform Excel spreadsheets to PDF documents",
      powerPointToPdf: "Convert PowerPoint presentations to PDF format",
      jpgToPdf: "Create PDF files from your JPG images",
      pngToPdf: "Create PDF files from your PNG images",
      htmlToPdf: "Convert HTML web pages to PDF documents",
      generic: "Select a file to convert between formats"
    },
    howTo: {
      title: "How to Convert {from} to {to}",
      step1: {
        title: "Upload",
        description: "Upload the {from} file you want to convert"
      },
      step2: {
        title: "Convert",
        description: "Click the Convert button and our system will process your file"
      },
      step3: {
        title: "Download",
        description: "Download your converted {to} file"
      }
    },
    options: {
      title: "Conversion Options",
      ocr: "Enable OCR (Optical Character Recognition)",
      ocrDescription: "Extract text from scanned documents or images",
      preserveLayout: "Preserve original layout",
      preserveLayoutDescription: "Maintain the original document's formatting and layout",
      quality: "Output quality",
      qualityDescription: "Set the quality level for the converted file",
      qualityOptions: {
        low: "Low (smaller file size)",
        medium: "Medium (balanced)",
        high: "High (best quality)"
      },
      pageOptions: "Page options",
      allPages: "All pages",
      selectedPages: "Selected pages",
      pageRangeDescription: "Enter page numbers and/or page ranges separated by commas",
      pageRangeExample: "Example: 1,3,5-12"
    },
    moreTools: "Related Conversion Tools",
    expertTips: {
      title: "Expert Tips",
      pdfToWord: [
        "For best results, ensure your PDF has clear, machine-readable text",
        "Enable OCR for scanned documents or image-based PDFs",
        "Complex layouts may require minor adjustments after conversion"
      ],
      pdfToExcel: [
        "Tables with clear borders convert more accurately",
        "Pre-process scanned PDFs with OCR for better data extraction",
        "Check spreadsheet formulas after conversion as they may not transfer"
      ],
      generic: [
        "Higher quality settings result in larger file sizes",
        "Use OCR for documents with scanned text or images containing text",
        "Preview your file after conversion to ensure accuracy"
      ]
    },
    advantages: {
      title: "Advantages of Converting {from} to {to}",
      pdfToWord: [
        "Edit and modify text that was locked in PDF format",
        "Update content without recreating the entire document",
        "Extract information for use in other documents"
      ],
      pdfToExcel: [
        "Analyze and manipulate data that was in static PDF form",
        "Create charts and perform calculations with extracted data",
        "Easily update financial reports or numerical information"
      ],
      wordToPdf: [
        "Create universally readable documents that maintain formatting",
        "Protect content from unwanted modifications",
        "Ensure consistent appearance across all devices and platforms"
      ],
      generic: [
        "Transform your document into a more useful format",
        "Access and use content in programs that support the target format",
        "Share files in formats that others can easily open"
      ]
    }
  },

  // Features section
  features: {
    title: "Features",
    description: "Everything you need to convert and manage your PDF files",
    documentFormats: {
      title: "Document Formats",
      description: "Convert to DOCX, DOC, RTF, ODT and more with perfect formatting and layout preservation"
    },
    spreadsheets: {
      title: "Spreadsheets",
      description: "Transform PDFs to XLSX, CSV and other spreadsheet formats with proper cell structures"
    },
    images: {
      title: "Images",
      description: "Extract high-quality JPG and PNG images from your PDF files with resolution control"
    },
    webFormats: {
      title: "Web Formats",
      description: "Convert to HTML and other web-friendly formats for online publishing"
    },
    ocrTech: {
      title: "OCR Technology",
      description: "Extract text from scanned documents with advanced Optical Character Recognition"
    },
    batchProcessing: {
      title: "Batch Processing",
      description: "Convert multiple PDFs at once to save time with our efficient batch processing"
    }
  },

  // CTA section
  cta: {
    title: "Ready to Convert?",
    description: "Transform your PDFs into any format you need, completely free.",
    startConverting: "Start Converting",
    exploreTools: "Explore All Tools"
  },

  // PDF Tools Page
  pdfTools: {
    title: "All PDF Tools",
    description: "Everything you need to work with PDFs in one place",
    keywords: "PDF converter, PDF editor, convert from PDF, convert to PDF, organize PDF, PDF security, free PDF tools, online PDF utilities, pdfTools",
    categories: {
      convertFromPdf: "Convert from PDF",
      convertToPdf: "Convert to PDF",
      basicTools: "Basic Tools",
      organizePdf: "Organize PDF",
      pdfSecurity: "PDF Security"
    }
  },

  // Tool Descriptions
  toolDescriptions: {
    pdfToWord: "Easily convert your PDF files into easy to edit DOC and DOCX documents.",
    pdfToPowerpoint: "Turn your PDF files into easy to edit PPT and PPTX slideshows.",
    pdfToExcel: "Pull data straight from PDFs into Excel spreadsheets in a few short seconds.",
    pdfToJpg: "Convert each PDF page into a JPG or extract all images contained in a PDF.",
    pdfToPng: "Convert each PDF page into a PNG or extract all images contained in a PDF.",
    pdfToHtml: "Convert webpages in HTML to PDF. Copy and paste the URL of the page.",
    wordToPdf: "Make DOC and DOCX files easy to read by converting them to PDF.",
    powerpointToPdf: "Make PPT and PPTX slideshows easy to view by converting them to PDF.",
    excelToPdf: "Make EXCEL spreadsheets easy to read by converting them to PDF.",
    jpgToPdf: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.",
    pngToPdf: "Convert PNG images to PDF in seconds. Easily adjust orientation and margins.",
    htmlToPdf: "Convert webpages to PDF. Copy and paste the URL to convert it to PDF.",
    mergePdf: "Combine PDFs in the order you want with the easiest PDF merger available.",
    splitPdf: "Split PDF files into multiple documents or extract specific pages from your PDF.",
    compressPdf: "Reduce file size while optimizing for maximal PDF quality.",
    rotatePdf: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!",
    watermark: "Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.",
    unlockPdf: "Remove PDF password security, giving you the freedom to use your PDFs as you want.",
    protectPdf: "Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.",
    ocr: "Extract text from scanned documents using Optical Character Recognition."
  },
  splitPdf: {
    title: "Split PDF",
    description: "Split PDF files into multiple documents or extract specific pages",
    howTo: {
      title: "How to Split PDF Files",
      step1: {
        title: "Upload",
        description: "Upload the PDF file you want to split or extract pages from"
      },
      step2: {
        title: "Choose Split Method",
        description: "Select how you want to split your PDF: by page ranges, extract each page, or split every N pages"
      },
      step3: {
        title: "Download",
        description: "Download your split PDF files individually"
      }
    },
    options: {
      splitMethod: "Split Method",
      byRange: "Split by page ranges",
      extractAll: "Extract all pages as separate PDFs",
      everyNPages: "Split every N pages",
      everyNPagesNumber: "Number of pages per file",
      everyNPagesHint: "Each output file will contain this many pages",
      pageRanges: "Page Ranges",
      pageRangesHint: "Enter page ranges separated by commas. Example: 1-5, 8, 11-13 will create 3 PDF files"
    },
    splitting: "Splitting PDF...",
    splitDocument: "Split Document",
    splitSuccess: "PDF successfully split!",
    splitSuccessDesc: "Your PDF has been split into {count} separate files",
    results: {
      title: "Split PDF Results",
      part: "Part",
      pages: "Pages",
      pagesCount: "pages"
    },
    faq: {
      title: "Frequently Asked Questions",
      q1: {
        question: "What happens to my PDF files after splitting?",
        answer: "All uploaded and generated files are automatically deleted from our servers after 24 hours for your privacy and security."
      },
      q2: {
        question: "Is there a limit to how many pages I can split?",
        answer: "The free version allows you to split PDFs with up to 100 pages. For larger documents, consider our premium plan."
      },
      q3: {
        question: "Can I extract specific pages from a PDF?",
        answer: "Yes, you can use the \"Split by page ranges\" option to extract specific pages or page ranges from your PDF document."
      },
      q4: {
        question: "Can I re-order pages while splitting?",
        answer: "Currently, the split tool maintains the original page order. To reorder pages, you would need to use our PDF Merger tool with the extracted pages."
      }
    },
    useCases: {
      title: "Popular Uses for PDF Splitting",
      chapters: {
        title: "Chapter Separation",
        description: "Split large books or reports into individual chapters for easier navigation and sharing"
      },
      extract: {
        title: "Page Extraction",
        description: "Extract specific pages like forms, certificates, or important sections from longer documents"
      },
      remove: {
        title: "Remove Pages",
        description: "Extract all needed pages and leave out unwanted content like advertisements or blank pages"
      },
      size: {
        title: "Size Reduction",
        description: "Break large PDFs into smaller files for easier sharing via email or messaging apps"
      }
    }
  },
  // Merge PDF Page
  mergePdf: {
    title: "Merge PDF Files",
    description: "Combine multiple PDF files into a single document quickly and easily",
    howTo: {
      title: "How to Merge PDF Files",
      step1: {
        title: "Upload Files",
        description: "Upload the PDF files you want to combine. You can select multiple files at once."
      },
      step2: {
        title: "Arrange Order",
        description: "Drag and drop to rearrange the files in the order you want them to appear in the final PDF."
      },
      step3: {
        title: "Download",
        description: "Click the Merge PDFs button and download your combined PDF file."
      }
    },
    faq: {
      title: "Frequently Asked Questions",
      q1: {
        question: "Is there a limit to how many PDFs I can merge?",
        answer: "You can merge up to 20 PDF files at once with our free tool. For larger batches, consider our premium plan."
      },
      q2: {
        question: "Will my PDF files remain private?",
        answer: "Yes, your privacy is our priority. All uploaded files are automatically deleted from our servers after processing."
      },
      q3: {
        question: "Can I merge password-protected PDFs?",
        answer: "For password-protected PDFs, you will need to unlock them first using our Unlock PDF tool, and then merge them."
      }
    },
    relatedTools: "Explore More PDF Tools",
    viewAllTools: "View All PDF Tools",
    of: "of",
    files: "files",
    filesToMerge: "Files to Merge",
    dragToReorder: "Drag to Reorder", // Added missing value
    downloadReady: "Download Ready", // Added missing value
    downloadMerged: "Download Merged", // Added missing value
    mergePdfs: "Merge PDFs", // Added missing value
    successMessage: "PDF merged successfully",
  },

  // OCR Page
  ocr: {
    title: "OCR Text Extraction",
    description: "Extract text from scanned PDFs and images using powerful Optical Character Recognition technology",
    howTo: {
      title: "How OCR Text Extraction Works",
      step1: {
        title: "Upload",
        description: "Upload your scanned PDF document or image-based PDF file."
      },
      step2: {
        title: "Configure OCR",
        description: "Select language, page range, and advanced options for best results."
      },
      step3: {
        title: "Get Text",
        description: "Copy the extracted text or download it as a text file for further use."
      }
    },
    faq: {
      title: "Frequently Asked Questions",
      questions: {
        accuracy: {
          question: "How accurate is the OCR text extraction?",
          answer: "Our OCR technology typically achieves 90-99% accuracy for clearly printed text in well-scanned documents. Accuracy may decrease with poor quality scans, unusual fonts, or complex layouts."
        },
        languages: {
          question: "Which languages are supported?",
          answer: "We support over 100 languages including English, French, German, Spanish, Italian, Portuguese, Chinese, Japanese, Korean, Russian, Arabic, Hindi and many more."
        },
        recognition: {
          question: "Why isn't my text being recognized correctly?",
          answer: "Several factors can affect OCR accuracy: document quality, resolution, contrast, complex layouts, handwriting, unusual fonts, or selecting the wrong language."
        },
        pageLimit: {
          question: "Is there a limit to how many pages I can process?",
          answer: "For free users, there's a limit of 50 pages per PDF. Premium users can process PDFs with up to 500 pages."
        },
        security: {
          question: "Is my data secure during OCR processing?",
          answer: "Yes, your security is our priority. All uploaded files are processed on secure servers and automatically deleted after processing."
        }
      }
    },
    relatedTools: "Related PDF Tools",
    processing: {
      title: "Processing OCR",
      message: "OCR processing can take a few minutes depending on document size and complexity"
    },
    results: {
      title: "Extracted Text",
      copy: "Copy",
      download: "Download .txt"
    },
    languages: {
      english: "English",
      french: "French",
      german: "German",
      spanish: "Spanish",
      chinese: "Chinese",
      japanese: "Japanese",
      arabic: "Arabic",
      russian: "Russian"
    },
    whatIsOcr: {
      title: "Optical Character Recognition (OCR)",
      description: "Is a technology that converts different types of documents, such as scanned paper documents, PDF files, or images captured by a digital camera, into editable and searchable data.",
      explanation: "OCR analyzes the structure of the document image, identifies characters and text elements, and then converts them into a machine-readable format.",
      extractionList: {
        scannedPdfs: "Scanned PDFs where the text exists as an image",
        imageOnlyPdfs: "Image-only PDFs with no underlying text layer",
        embeddedImages: "PDFs containing embedded images with text",
        textCopyingIssues: "Documents where copying text directly doesn't work"
      }
    },
    whenToUse: {
      title: "When to Use OCR Text Extraction",
      idealFor: "Ideal for:",
      idealForList: {
        scannedDocuments: "Scanned documents saved as PDFs",
        oldDocuments: "Old documents without digital text layers",
        textSelectionIssues: "PDFs where text selection/copying doesn't work",
        textInImages: "Images containing text that needs to be extracted",
        searchableArchives: "Creating searchable archives from scanned documents"
      },
      notNecessaryFor: "Not necessary for:",
      notNecessaryForList: {
        digitalPdfs: "Native digital PDFs where text can already be selected",
        createdDigitally: "PDFs created directly from digital documents",
        copyPasteAvailable: "Documents where you can already copy and paste text",
        formatPreservation: "Files that need format preservation (use our PDF to DOCX conversion instead)"
      }
    },
    limitations: {
      title: "OCR Limitations & Tips",
      description: "While our OCR technology is powerful, there are some limitations to be aware of:",
      factorsAffecting: "Factors affecting OCR accuracy:",
      factorsList: {
        documentQuality: "Document quality (resolution, contrast)",
        complexLayouts: "Complex layouts and formatting",
        handwrittenText: "Handwritten text (limited recognition)",
        specialCharacters: "Special characters and symbols",
        multipleLanguages: "Multiple languages in one document"
      },
      tipsForBest: "Tips for best results:",
      tipsList: {
        highQualityScans: "Use high-quality scans (300 DPI or higher)",
        correctLanguage: "Select the correct language for your document",
        enhanceScannedImages: "Enable \"Enhance scanned images\" for better accuracy",
        smallerPageRanges: "Process smaller page ranges for large documents",
        reviewText: "Review and correct the extracted text afterward"
      }
    },
    options: {
      scope: "Pages to Extract",
      all: "All Pages",
      custom: "Specific Pages",
      pages: "Page Numbers",
      pagesHint: "E.g. 1,3,5-9",
      enhanceScanned: "Enhance scanned images",
      enhanceScannedHint: "Pre-process images to improve OCR accuracy (recommended for scanned documents)",
      preserveLayout: "Preserve layout",
      preserveLayoutHint: "Try to maintain the original layout with paragraphs and line breaks"
    }
  },

  // Protect PDF Page
  protectPdf: {
    title: "Password Protect PDF",
    description: "Secure your PDF documents with password protection and custom access permissions",
    howTo: {
      title: "How to Protect Your PDF",
      step1: {
        title: "Upload",
        description: "Upload the PDF file you want to protect with a password."
      },
      step2: {
        title: "Set Security Options",
        description: "Create a password and customize permissions for printing, copying, and editing."
      },
      step3: {
        title: "Download",
        description: "Download your password-protected PDF file ready for secure sharing."
      }
    },
    why: {
      title: "Why Protect Your PDFs?",
      confidentiality: {
        title: "Confidentiality",
        description: "Ensure that only authorized individuals with the password can open and view your sensitive documents."
      },
      controlledAccess: {
        title: "Controlled Access",
        description: "Set specific permissions to determine what recipients can do with your document, like printing or editing."
      },
      authorizedDistribution: {
        title: "Authorized Distribution",
        description: "Control who can access your document when sharing contracts, research, or intellectual property."
      },
      documentExpiration: {
        title: "Document Expiration",
        description: "Password protection adds an extra layer of security for time-sensitive documents that shouldn't be accessible indefinitely."
      }
    },
    security: {
      title: "Understanding PDF Security",
      passwords: {
        title: "User Password vs. Owner Password",
        user: "User Password: Required to open the document. Anyone without this password cannot view the content.",
        owner: "Owner Password: Controls permissions. With our tool, we set both passwords to be the same for simplicity."
      },
      encryption: {
        title: "Encryption Levels",
        aes128: "128-bit AES: Provides good security and is compatible with Acrobat Reader 7 and later versions.",
        aes256: "256-bit AES: Offers stronger security but requires Acrobat Reader X (10) or later versions."
      },
      permissions: {
        title: "Permission Controls",
        printing: {
          title: "Printing",
          description: "Controls whether the document can be printed and at what quality level."
        },
        copying: {
          title: "Content Copying",
          description: "Controls whether text and images can be selected and copied to the clipboard."
        },
        editing: {
          title: "Editing",
          description: "Controls document modifications, including annotations, form filling, and content changes."
        }
      }
    },
    form: {
      password: "Password",
      confirmPassword: "Confirm Password",
      encryptionLevel: "Encryption Level",
      permissions: {
        title: "Access Permissions",
        allowAll: "Allow All (Password to Open Only)",
        restricted: "Restricted Access (Custom Permissions)"
      },
      allowedActions: "Allowed Actions:",
      allowPrinting: "Allow Printing",
      allowCopying: "Allow Copying Text and Images",
      allowEditing: "Allow Editing and Annotations"
    },
    bestPractices: {
      title: "Password Protection Best Practices",
      dos: "Do's",
      donts: "Don'ts",
      dosList: [
        "Use strong, unique passwords with a mix of letters, numbers, and special characters",
        "Store passwords securely in a password manager",
        "Share passwords through secure channels separate from the PDF",
        "Use 256-bit encryption for highly sensitive documents"
      ],
      dontsList: [
        "Use simple, easy-to-guess passwords like \"password123\" or \"1234\"",
        "Send the password in the same email as the PDF",
        "Use the same password for all your protected PDFs",
        "Rely solely on password protection for extremely sensitive information"
      ]
    },
    faq: {
      encryptionDifference: {
        question: "What's the difference between the encryption levels?",
        answer: "We offer 128-bit and 256-bit AES encryption. 128-bit is compatible with older PDF readers (Acrobat 7 and later), while 256-bit provides stronger security but requires newer readers (Acrobat X and later)."
      },
      removeProtection: {
        question: "Can I remove the password protection later?",
        answer: "Yes, you can use our Unlock PDF tool to remove password protection from your PDF files, but you'll need to know the current password to do so."
      },
      securityStrength: {
        question: "How secure is the password protection?",
        answer: "Our tool uses industry-standard AES encryption. The security depends on the strength of your password and the encryption level you choose. We recommend using strong, unique passwords with a mix of characters."
      },
      contentQuality: {
        question: "Will password protection affect the PDF content or quality?",
        answer: "No, password protection only adds security to your document and doesn't alter the content, layout, or quality of your PDF in any way."
      },
      batchProcessing: {
        question: "Can I protect multiple PDFs at once?",
        answer: "Currently, our tool processes one PDF at a time. For batch processing of multiple files, consider our API or premium solutions."
      }
    },
    protecting: "Protecting...",
    protected: "PDF successfully protected!",
    protectedDesc: "Your PDF file has been encrypted and password-protected."
  },

  // Watermark Page
  watermark: {
    title: "Add Watermark to PDF",
    description: "Protect your documents by adding custom text watermarks",
    howTo: {
      title: "How to Add a Watermark",
      step1: {
        title: "Upload",
        description: "Upload the PDF file you want to add a watermark to. You can preview how it will look before applying."
      },
      step2: {
        title: "Customize",
        description: "Set the text, position, size, color, and opacity of your watermark to match your needs."
      },
      step3: {
        title: "Download",
        description: "Process and download your watermarked PDF file ready for distribution."
      }
    },
    form: {
      text: "Watermark Text",
      textColor: "Text Color",
      opacity: "Opacity",
      size: "Size",
      rotation: "Rotation",
      position: "Position",
      pages: "Pages to Watermark",
      allPages: "All pages",
      specificPages: "Specific pages",
      pageNumbers: "Page Numbers",
      pageNumbersHint: "Enter page numbers separated by commas (e.g. 1,3,5,8)"
    },
    positions: {
      topLeft: "Top Left",
      topCenter: "Top Center",
      topRight: "Top Right",
      centerLeft: "Center Left",
      center: "Center",
      centerRight: "Center Right",
      bottomLeft: "Bottom Left",
      bottomCenter: "Bottom Center",
      bottomRight: "Bottom Right"
    },
    preview: {
      title: "Watermark Preview",
      note: "This is a simplified preview. The actual result may vary."
    },
    faq: {
      title: "Frequently Asked Questions",
      q1: {
        question: "What kind of watermarks can I add?",
        answer: "Our tool supports text watermarks with customizable content, position, size, color, opacity, and rotation. You can add watermarks like \"CONFIDENTIAL,\" \"DRAFT,\" or your company name."
      },
      q2: {
        question: "Can I watermark only specific pages in my PDF?",
        answer: "Yes, you can choose to watermark all pages or specify which pages should have the watermark by entering their page numbers."
      },
      q3: {
        question: "Are the watermarks permanent?",
        answer: "Yes, the watermarks are permanently embedded in the PDF document. However, they can be placed with varying opacity to balance visibility and legibility of the content."
      },
      q4: {
        question: "Will watermarking affect the file quality?",
        answer: "No, our watermarking tool only adds the specified text without affecting the original document quality or file size significantly."
      }
    },
    addingWatermark: "Adding watermark to your PDF...",
    watermarkSuccess: "Watermark successfully added!",
    watermarkSuccessDesc: "Your PDF file has been watermarked and is ready for download."
  },

  // Compress PDF
  compressPdf: {
    title: "Compress PDF Files",
    description: "Reduce PDF file sizes effortlessly while preserving document quality",
    quality: {
      high: "High Quality",
      highDesc: "Minimal compression, best visual quality",
      balanced: "Balanced",
      balancedDesc: "Good compression with minimal visual loss",
      maximum: "Maximum Compression",
      maximumDesc: "Highest compression ratio, may reduce visual quality"
    },
    processing: {
      title: "Processing Options",
      processAllTogether: "Process all files simultaneously",
      processSequentially: "Process files one by one"
    },
    status: {
      uploading: "Uploading...",
      compressing: "Compressing...",
      completed: "Completed",
      failed: "Failed"
    },
    results: {
      title: "Compression Results Summary",
      totalOriginal: "Total Original",
      totalCompressed: "Total Compressed",
      spaceSaved: "Space Saved",
      averageReduction: "Average Reduction",
      downloadAll: "Download All Compressed Files as ZIP"
    },
    of: "of",
    files: "files",
    filesToCompress: "Files to Compress",
    compressAll: "Compress Files",
    qualityPlaceholder: "Select compression quality",
    reduction: "reduction",
    zipDownloadSuccess: "All compressed files downloaded successfully",
    overallProgress: "Overall Progress",
    reducedBy: "was reduced by",
    success: "Compression successful",
    error: {
      noFiles: "Please select PDF files to compress",
      noCompressed: "No compressed files available for download",
      downloadZip: "Failed to download ZIP archive",
      generic: "Failed to compress PDF file",
      unknown: "An unknown error occurred",
      failed: "Failed to compress your file"
    },
    // Added sections for the new content components
    howTo: {
      title: "How to Compress PDF Files",
      step1: {
        title: "Upload PDF",
        description: "Upload the PDF file you want to compress. Files up to 100MB are supported."
      },
      step2: {
        title: "Choose Quality",
        description: "Select your preferred compression level based on your needs."
      },
      step3: {
        title: "Download",
        description: "Download your compressed PDF file, ready to share or store."
      }
    },
    why: {
      title: "Why Compress PDFs?",
      uploadSpeed: {
        title: "Lightning-Fast Uploads",
        description: "Share compressed PDFs quickly with faster upload speeds"
      },
      emailFriendly: {
        title: "Email Friendly",
        description: "Fit within email size limits without compromising quality"
      },
      storage: {
        title: "Storage Efficient",
        description: "Maximize space on your devices and cloud storage"
      },
      quality: {
        title: "Maintained Quality",
        description: "Choose compression levels that preserve the quality you need"
      }
    },
    faq: {
      title: "Frequently Asked Questions",
      howMuch: {
        question: "How much can PDF files be compressed?",
        answer: "Most PDF files can be compressed by 20-80%, depending on the content. Documents with many images typically achieve higher compression rates than text-heavy documents. Our compression tool offers different quality levels to balance file size and visual quality based on your needs."
      },
      quality: {
        question: "Will compression affect the quality of my PDF?",
        answer: "Our compression tool offers different quality settings. High quality compression maintains visual fidelity while still reducing file size. Medium and low quality settings apply more aggressive compression, which may affect image quality but results in smaller files. Text content remains sharp and readable at all compression levels."
      },
      secure: {
        question: "Is my PDF data secure when compressing?",
        answer: "Yes, we take data security seriously. All file processing happens on our secure servers, and your files are automatically deleted after processing (typically within 24 hours). We don't share your files with third parties, and all data transfers are encrypted using HTTPS."
      },
      fileLimits: {
        question: "What are the file size limits?",
        answer: "Free users can compress PDF files up to 10MB. Premium subscribers can compress larger files: Basic plan allows up to 50MB, Pro plan up to 100MB, and Enterprise plan up to 500MB per file. If you need to process larger files, please contact us for custom solutions."
      },
      batch: {
        question: "Can I compress multiple PDFs at once?",
        answer: "Yes, our tool supports batch compression. You can upload and compress multiple PDF files simultaneously, saving you time when processing multiple documents. Premium users get higher limits on batch processing."
      }
    },
    modes: {
      title: "Compression Modes",
      moderate: {
        title: "Moderate Compression",
        description: "Balanced approach that reduces file size while maintaining good visual quality. Perfect for most documents where quality is important but some size reduction is needed."
      },
      high: {
        title: "High Compression",
        description: "More aggressive compression that significantly reduces file size. Some image quality loss may be noticeable, but text remains clear and legible."
      },
      lossless: {
        title: "Lossless Compression",
        description: "Reduces file size without affecting quality by removing redundant data, optimizing structure, and cleaning metadata. No visual differences from the original."
      }
    },
    bestPractices: {
      title: "Best Practices for PDF Compression",
      dos: "Do's",
      donts: "Don'ts",
      dosList: [
        "Compress images before creating PDFs for best results",
        "Choose the appropriate compression level for your needs",
        "Keep original files as backups before compression",
        "Use lossless compression for important documents",
        "Remove unnecessary pages to further reduce file size"
      ],
      dontsList: [
        "Don't overcompress documents needed for printing",
        "Don't compress legal or archival documents if every detail matters",
        "Don't compress already heavily compressed PDFs repeatedly",
        "Don't expect huge reductions for PDFs with mostly text",
        "Don't compress if file size isn't an issue"
      ]
    },
    relatedTools: {
      title: "Related Tools",
      merge: "Merge PDF",
      split: "Split PDF",
      pdfToWord: "PDF to Word",
      pdfToJpg: "PDF to JPG",
      viewAll: "View All Tools"
    }
  },
  // Unlock PDF
  unlockPdf: {
    title: "Unlock PDF Files",
    description: "Remove password protection from your PDF documents for unrestricted access",
    howTo: {
      title: "How to Unlock PDF Files",
      upload: {
        title: "Upload",
        description: "Upload the password-protected PDF file you want to unlock."
      },
      enterPassword: {
        title: "Enter Password",
        description: "If needed, enter the current password that protects the PDF."
      },
      download: {
        title: "Download",
        description: "Download your unlocked PDF file with no password restrictions."
      }
    },
    faq: {
      passwordRequired: {
        question: "Do I need to know the current password?",
        answer: "Yes, to unlock a PDF, you need to know the current password. Our tool cannot bypass or crack passwords; it simply removes the protection after you provide the correct password."
      },
      security: {
        question: "Is the unlocking process secure?",
        answer: "Yes, all processing happens on our secure servers. We do not store your PDFs or passwords. Files are automatically deleted after processing, and all data transfer is encrypted."
      },
      restrictions: {
        question: "Can I unlock a PDF with owner restrictions but no open password?",
        answer: "Yes, some PDFs don't require a password to open but have restrictions on printing, editing, or copying. Our tool can remove these restrictions too. Just upload the file without entering a password."
      },
      quality: {
        question: "Will unlocking affect the PDF quality or content?",
        answer: "No, our unlocking process only removes the security settings. It does not alter the content, formatting, or quality of your PDF file in any way."
      }
    },
    passwordProtected: "Password Protected",
    notPasswordProtected: "Not Password Protected",
    unlocking: "Unlocking your PDF...",
    unlockSuccess: "PDF successfully unlocked!",
    unlockSuccessDesc: "Your PDF file has been unlocked and is ready for download."
  },

  // File Uploader
  fileUploader: {
    dropHere: "Drop your file here",
    dropHereaDesc: "Drop your PDF file here or click to browse",
    dragAndDrop: "Drag & drop your file",
    browse: "Browse Files",
    dropHereDesc: "Drop your file here or click to browse.",
    maxSize: "Maximum size is 100MB.",
    remove: "Remove",
    inputFormat: "Input Format",
    outputFormat: "Output Format",
    ocr: "Enable OCR",
    ocrDesc: "Extract text from scanned documents using Optical Character Recognition",
    quality: "Quality",
    low: "Low",
    high: "High",
    password: "Password",
    categories: {
      documents: "Documents",
      spreadsheets: "Spreadsheets",
      presentations: "Presentations",
      images: "Images"
    },
    converting: "Converting",
    successful: "Conversion Successful",
    successDesc: "Your file has been successfully converted and is now ready for download.",
    download: "Download Converted File",
    filesSecurity: "Files are automatically deleted after 24 hours for privacy and security."
  },

  // Common UI elements
  ui: {
    upload: "Upload",
    download: "Download",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    next: "Next",
    previous: "Previous",
    finish: "Finish",
    processing: "Processing...",
    success: "Success!",
    error: "Error",
    copy: "Copy",
    remove: "Remove",
    browse: "Browse",
    dragDrop: "Drag & Drop",
    or: "or",
    close: "Close",
    apply: "Apply",
    loading: "Loading...",
    preview: "Preview",
    reupload: "Upload Another File",
    continue: "Continue",
    skip: "Skip",
    retry: "Retry",
    addMore: "Add More",
    clear: "Clear",
    clearAll: "Clear All",
    done: "Done",
    extract: "extract",
    new: "New!",
    phone: "Phone",
    address: "Address",
    filesSecurity: "Files are automatically deleted after 24 hours for privacy and security."
  },

  contact: {
    title: "Contact Us",
    description: "Have questions or feedback? We'd love to hear from you.",
    form: {
      title: "Send Us a Message",
      description: "Fill out the form below and we'll get back to you as soon as possible.",
      name: "Your Name",
      email: "Email Address",
      subject: "Subject",
      message: "Message",
      submit: "Send Message"
    },
    success: "Message Sent Successfully",
    successDesc: "Thank you for reaching out. We'll get back to you as soon as possible.",
    error: "Failed to Send Message",
    errorDesc: "There was an error sending your message. Please try again later.",
    validation: {
      name: "Name is required",
      email: "Please enter a valid email address",
      subject: "Subject is required",
      message: "Message is required"
    },
    supportHours: {
      title: "Support Hours",
      description: "When we're available to help",
      weekdays: "Monday - Friday",
      weekdayHours: "9:00 AM - 6:00 PM EST",
      saturday: "Saturday",
      saturdayHours: "10:00 AM - 4:00 PM EST",
      sunday: "Sunday",
      closed: "Closed"
    },
    faq: {
      title: "Frequently Asked Questions",
      responseTime: {
        question: "How long does it take to get a response?",
        answer: "We aim to respond to all inquiries within 24-48 business hours. During peak times, it may take up to 72 hours."
      },
      technicalSupport: {
        question: "Can I get support for a technical issue?",
        answer: "Yes, our technical support team is available to help you with any issues you're experiencing with our PDF tools."
      },
      phoneSupport: {
        question: "Do you offer phone support?",
        answer: "We provide phone support during our listed support hours. For immediate assistance, email is often the fastest way to get help."
      },
      security: {
        question: "Is my personal information secure?",
        answer: "We take your privacy seriously. All communication is encrypted, and we never share your personal information with third parties."
      }
    }
  },
  // About Page
  about: {
    title: "About ScanPro",
    mission: {
      title: "Our Mission",
      description: "We believe in making PDF management accessible to everyone. Our online tools help you work with PDFs quickly and easily, with no software to install."
    },
    team: {
      title: "Our Team",
      description: "We're a dedicated team of developers and designers passionate about creating simple yet powerful PDF tools."
    },
    technology: {
      title: "Our Technology",
      description: "Our platform uses cutting-edge technology to provide high-quality PDF conversion, editing, and security while keeping your data safe."
    }
  },

  // Pricing Page
  pricing: {
    title: "Simple, Transparent Pricing",
    description: "Choose the plan that fits your needs",
    free: {
      title: "Free",
      description: "Basic PDF tasks for occasional users",
      features: [
        "Convert up to 3 files/day",
        "PDF to Word, Excel, PowerPoint",
        "Basic compression",
        "Merge up to 5 PDFs",
        "Add simple watermarks",
        "Standard OCR"
      ]
    },
    pro: {
      title: "Pro",
      description: "More power for regular PDF users",
      features: [
        "Unlimited conversions",
        "Priority processing",
        "Advanced compression",
        "Merge unlimited PDFs",
        "Custom watermarks",
        "Advanced OCR with 100+ languages",
        "Batch processing",
        "No ads"
      ]
    },
    business: {
      title: "Business",
      description: "Complete solution for teams",
      features: [
        "Everything in Pro plan",
        "Multiple team members",
        "API access",
        "GDPR compliance",
        "Dedicated support",
        "Usage analytics",
        "Custom branding options"
      ]
    },
    monthly: "Monthly",
    annually: "Annually",
    savePercent: "Save 20%",
    currentPlan: "Current Plan",
    upgrade: "Upgrade Now",
    getStarted: "Get Started",
    contact: "Contact Sales"
  },

  // Terms and Privacy Pages
  legal: {
    termsTitle: "Terms of Service",
    privacyTitle: "Privacy Policy",
    lastUpdated: "Last Updated",
    introduction: {
      title: "Introduction",
      description: "Please read these terms carefully before using our service."
    },
    dataUse: {
      title: "How We Use Your Data",
      description: "We process your files only to provide the service you requested. All files are automatically deleted after 24 hours."
    },
    cookies: {
      title: "Cookies and Tracking",
      description: "We use cookies to improve your experience and analyze website traffic."
    },
    rights: {
      title: "Your Rights",
      description: "You have the right to access, correct, or delete your personal information."
    }
  },

  // Error Pages
  error: {
    notFound: "Page Not Found",
    notFoundDesc: "Sorry, we couldn't find the page you're looking for.",
    serverError: "Server Error",
    serverErrorDesc: "Sorry, something went wrong on our server. Please try again later.",
    goHome: "Go Home",
    tryAgain: "Try Again"
  },
  universalCompressor: {
    title: "Universal File Compressor",
    description: "Compress PDF, images, and Office documents while maintaining quality",
    dropHereDesc: "Drag and drop files here (PDF, JPG, PNG, DOCX, PPTX, XLSX)",
    filesToCompress: "Files to Compress",
    compressAll: "Compress All Files",
    results: {
      title: "Compression Results",
      downloadAll: "Download All Compressed Files"
    },
    fileTypes: {
      pdf: "PDF Document",
      image: "Image",
      office: "Office Document",
      unknown: "Unknown File"
    },
    howTo: {
      title: "How to Compress Files",
      step1: {
        title: "Upload Files",
        description: "Upload the files you want to compress"
      },
      step2: {
        title: "Choose Quality",
        description: "Select your preferred compression level"
      },
      step3: {
        title: "Download",
        description: "Click compress and download your compressed files"
      }
    },
    faq: {
      compressionRate: {
        question: "How much can files be compressed?",
        answer: "Compression rates vary by file type and content. PDFs typically compress by 20-70%, images by 30-80%, and Office documents by 10-50%."
      },
      quality: {
        question: "Will compression affect the quality of my files?",
        answer: "Our compression algorithms balance size reduction with quality preservation. The 'High' quality setting will maintain nearly identical visual quality."
      },
      sizeLimit: {
        question: "Is there a file size limit?",
        answer: "Yes, you can compress files up to 100MB each."
      }
    }
  },
  repairPdf: {
    title: "Repair PDF Files",
    description: "Fix corrupted PDF files, recover content, and optimize document structure",

    howTo: {
      title: "How to Repair Your PDF",
      step1: {
        title: "Upload Your PDF",
        description: "Select the PDF file you want to repair from your device"
      },
      step2: {
        title: "Choose Repair Mode",
        description: "Select the appropriate repair method based on your file's issues"
      },
      step3: {
        title: "Download Repaired PDF",
        description: "Download your repaired PDF file with fixed structure and content"
      }
    },

    why: {
      title: "Why Repair PDFs",
      corruptedFiles: {
        title: "Fix Corrupted Files",
        description: "Recover content and structure from damaged PDF files that won't open properly"
      },
      missingContent: {
        title: "Recover Missing Content",
        description: "Restore missing images, text or pages from partially corrupted documents"
      },
      documentStructure: {
        title: "Fix Document Structure",
        description: "Repair broken internal structure, page references, and links"
      },
      fileSize: {
        title: "Optimize File Size",
        description: "Clean up unnecessary data and optimize file size without quality loss"
      }
    },

    modes: {
      title: "Available Repair Modes",
      standard: {
        title: "Standard Repair",
        description: "Fix common PDF issues, including broken cross-references, malformed objects, and stream errors. Best for mildly corrupted PDFs that still open but display errors."
      },
      advanced: {
        title: "Advanced Recovery",
        description: "Deep repair for severely damaged PDFs with serious structural issues. Recovers as much content as possible from files that won't open at all."
      },
      optimization: {
        title: "Optimization",
        description: "Restructure and optimize the PDF file without losing content. Removes redundant data, fixes minor issues, and improves overall file structure."
      }
    },

    faq: {
      title: "Frequently Asked Questions",
      whatCanRepair: {
        question: "What types of PDF issues can be fixed?",
        answer: "Our repair tool can fix a wide range of problems including corrupted file structures, broken page references, damaged content streams, missing cross-reference tables, and invalid objects. It can often recover content from PDFs that won't open or display correctly in standard PDF viewers."
      },
      completelyDamaged: {
        question: "Can you repair completely damaged PDFs?",
        answer: "While our advanced repair mode can recover content from severely damaged PDFs, a 100% recovery isn't always possible if the file is completely corrupted. However, even in extreme cases, we can often recover partial content, especially text and basic elements."
      },
      contentQuality: {
        question: "Will repairing affect content quality?",
        answer: "No, our repair process maintains the quality of recoverable content. Unlike some tools that simply extract and recreate PDFs (which can lose formatting), we attempt to preserve the original structure while fixing only the corrupted parts."
      },
      passwordProtected: {
        question: "Can you repair password-protected PDFs?",
        answer: "Yes, you can repair password-protected PDFs if you have the password. You'll need to enter the password during the repair process. We do not, however, attempt to bypass or remove encryption from protected documents without proper authorization."
      },
      dataSecurity: {
        question: "Is my PDF data secure during the repair process?",
        answer: "Yes, we take data security seriously. Your files are processed securely on our servers, not shared with third parties, and are automatically deleted after processing. We use encryption for all file transfers, and the entire repair process happens in a secure environment."
      }
    },

    bestPractices: {
      title: "Best Practices for PDF Recovery",
      dos: "Do's",
      donts: "Don'ts",
      dosList: [
        "Keep backups of original files before repair attempts",
        "Try the Standard repair mode first before using Advanced recovery",
        "Check the PDF with multiple viewers if possible",
        "Note which pages or elements are problematic before repair",
        "Use the Optimization mode for large but functional PDFs"
      ],
      dontsList: [
        "Don't repeatedly save corrupted PDFs as this can worsen the damage",
        "Don't use repair as a substitute for proper PDF creation",
        "Don't expect 100% recovery from severely damaged files",
        "Don't open repaired files in older PDF viewers that might re-corrupt them",
        "Don't skip checking the repaired file for content accuracy"
      ]
    },

    relatedTools: {
      title: "Related Tools",
      compress: "Compress PDF",
      unlock: "Unlock PDF",
      protect: "Protect PDF",
      edit: "Edit PDF",
      viewAll: "View All Tools"
    },

    form: {
      title: "PDF Repair Tool",
      description: "Fix corrupted PDFs, recover content, and optimize document structure",
      upload: "Upload PDF for Repair",
      dragDrop: "Drag and drop your PDF file here, or click to browse",
      selectFile: "Select PDF File",
      maxFileSize: "Maximum file size: 100MB",
      change: "Change File",
      repairModes: "Repair Mode",
      standardRepair: "Standard Repair",
      standardDesc: "Fix common issues such as broken links and structural problems",
      advancedRecovery: "Advanced Recovery",
      advancedDesc: "Deep recovery for severely damaged or corrupted PDF files",
      optimization: "Optimization",
      optimizationDesc: "Clean and optimize PDF structure without losing content",
      advancedOptions: "Advanced Options",
      showOptions: "Show Options",
      hideOptions: "Hide Options",
      preserveFormFields: "Preserve Form Fields",
      preserveFormFieldsDesc: "Maintain interactive form fields when possible",
      preserveAnnotations: "Preserve Annotations",
      preserveAnnotationsDesc: "Keep comments, highlights and other annotations",
      preserveBookmarks: "Preserve Bookmarks",
      preserveBookmarksDesc: "Maintain document outline and bookmarks",
      optimizeImages: "Optimize Images",
      optimizeImagesDesc: "Recompress images to reduce file size",
      password: "PDF Password",
      passwordDesc: "This PDF is password protected. Enter the password to repair it.",
      repair: "Repair PDF",
      repairing: "Repairing PDF...",
      security: "Your files are processed securely. All uploads are automatically deleted after processing.",
      analyzing: "Analyzing PDF structure",
      rebuilding: "Rebuilding document structure",
      recovering: "Recovering content",
      fixing: "Fixing cross-references",
      optimizing: "Optimizing file",
      finishing: "Finishing up"
    },

    results: {
      success: "PDF Repaired Successfully",
      successMessage: "Your PDF has been repaired and is ready for download.",
      issues: "Repair Issues Detected",
      issuesMessage: "We encountered issues while repairing your PDF. Some content may not be recoverable.",
      details: "Repair Details",
      fixed: "Fixed Issues",
      warnings: "Warnings",
      fileSize: "File Size",
      original: "Original",
      new: "New",
      reduction: "reduction",
      download: "Download Repaired PDF",
      repairAnother: "Repair Another PDF"
    }
  },
  faq: {
    categories: {
      general: "General",
      conversion: "Conversion",
      security: "Security",
      account: "Account",
      api: "Api",
    },
    general: {
      question1: "What is ScanPro?",
      answer1: "ScanPro is a comprehensive online platform for PDF management and conversion. Our tools help you convert, edit, merge, split, compress, and secure your PDF documents through an intuitive web interface or API.",
      question2: "Do I need to create an account to use ScanPro?",
      answer2: "No, you can use our basic PDF tools without registering. However, creating a free account gives you benefits like saved history, higher file size limits, and access to additional features.",
      question3: "Is my data secure on ScanPro?",
      answer3: "Yes, all files are processed securely on our servers with encryption. We don't share your files with third parties, and files are automatically deleted from our servers after processing (within 24 hours). For more details, please see our Privacy Policy.",
      question4: "What devices and browsers does ScanPro support?",
      answer4: "ScanPro works on all modern browsers including Chrome, Firefox, Safari, and Edge. Our platform is fully responsive and works on desktop, tablet, and mobile devices."
    },
    conversion: {
      question1: "What file types can I convert to and from?",
      answer1: "ScanPro supports converting PDFs to many formats including Word (DOCX), Excel (XLSX), PowerPoint (PPTX), images (JPG, PNG), HTML, and plain text. You can also convert these formats back to PDF.",
      question2: "How accurate are your PDF conversions?",
      answer2: "Our conversion engine uses advanced algorithms to maintain formatting, including fonts, images, tables, and layout. However, very complex documents may have minor formatting differences. For best results, we recommend using our 'PDF to Word' or 'PDF to Excel' tools for documents with complex formatting.",
      question3: "Is there a file size limit for conversions?",
      answer3: "Free users can convert files up to 10MB. Basic subscribers can convert files up to 50MB, Pro subscribers up to 100MB, and Enterprise users up to 500MB. If you need to process larger files, please contact us for custom solutions.",
      question4: "Why did my PDF conversion fail?",
      answer4: "Conversions may fail if the file is corrupted, password-protected, or contains complex elements our system can't process. Try using our 'Repair PDF' tool first, then retry the conversion. If you're still having issues, try our 'Advanced' conversion mode or contact support."
    },
    security: {
      question1: "How do I password protect my PDF?",
      answer1: "Use our 'Protect PDF' tool. Upload your PDF, set a password, choose permission restrictions (if desired), and click 'Protect PDF'. You can control whether users can print, edit, or copy content from your PDF.",
      question2: "Can I remove a password from my PDF?",
      answer2: "Yes, use our 'Unlock PDF' tool. You'll need to provide the current password to remove protection. Note that we only help remove password protection from documents you own or have authorization to modify.",
      question3: "What encryption level do you use for PDF protection?",
      answer3: "We use industry-standard 256-bit AES encryption for PDF protection, which offers strong security for your documents. We also support 128-bit encryption if you need compatibility with older PDF readers."
    },
    account: {
      question1: "How do I upgrade my subscription?",
      answer1: "Log in to your account, go to Dashboard, and select the 'Subscription' tab. Choose the plan that meets your needs and follow the payment instructions. Your new features will be activated immediately after payment.",
      question2: "Can I cancel my subscription?",
      answer2: "Yes, you can cancel your subscription at any time from your Dashboard under the 'Subscription' tab. You'll continue to have access to premium features until the end of your current billing period.",
      question3: "How do I reset my password?",
      answer3: "On the login page, click 'Forgot password?' and enter your email address. We'll send you a password reset link that will be valid for 1 hour. If you don't receive the email, check your spam folder or contact support."
    },
    api: {
      question1: "How do I get an API key?",
      answer1: "Register for an account, then go to Dashboard > API Keys to create your first API key. Free accounts get 1 API key, Basic subscribers get 3, Pro subscribers get 10, and Enterprise users get 50+ keys.",
      question2: "What are the API rate limits?",
      answer2: "Rate limits depend on your subscription tier: Free (10 requests/hour), Basic (100 requests/hour), Pro (1,000 requests/hour), Enterprise (5,000+ requests/hour). Monthly operation limits also apply to each tier.",
      question3: "How do I integrate the API with my application?",
      answer3: "Our API uses standard REST endpoints with JSON responses. You can find comprehensive documentation, code samples, and SDKs in our Developer section. We provide examples for various programming languages including JavaScript, Python, PHP, and Java."
    },
    title: "Frequently Asked Questions"
  },
  footer: {
    description: "Advanced PDF tools for professionals. Convert, edit, protect and optimize your documents with our powerful web-based platform and API.",
    contactUs: "Contact Us",
    address: "123 Document Street, PDF City, 94103, United States",
    subscribe: "Subscribe to Our Newsletter",
    subscribeText: "Get the latest news, updates and tips delivered directly to your inbox.",
    emailPlaceholder: "Your email address",
    subscribeButton: "Subscribe",
    pdfTools: "PDF Tools",
    pdfManagement: "PDF Management",
    company: "Company",
    support: "Support",
    aboutUs: "About Us",
    careers: "Careers",
    blog: "Blog",
    helpCenter: "Help Center",
    apiDocs: "API Documentation",
    faqs: "FAQs",
    tutorials: "Tutorials",
    systemStatus: "System Status",
    allRightsReserved: "All rights reserved.",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    cookiePolicy: "Cookie Policy",
    security: "Security",
    sitemap: "Sitemap",
    validEmail: "Please enter a valid email address",
    subscribeSuccess: "Thanks for subscribing to our newsletter!",
    viewAllTools: "View All PDF Tools",
    repairPdf: "Repair PDF",
    socialFacebook: "Facebook",
    socialTwitter: "Twitter",
    socialInstagram: "Instagram",
    socialLinkedin: "LinkedIn",
    socialGithub: "GitHub",
    socialYoutube: "YouTube"
  },
  security: {
    hero: {
      title: "Security & Privacy at ScanPro",
      subtitle: "We take the security and privacy of your documents seriously. Learn how we protect your data."
    },
    measures: {
      title: "How We Protect Your Data"
    },
    sections: {
      encryption: {
        title: "End-to-End Encryption",
        description: "All files are encrypted during transfer with TLS 1.3 and at rest with AES-256 encryption. Your documents never travel unprotected."
      },
      temporaryStorage: {
        title: "Temporary Storage",
        description: "Files are automatically deleted within 24 hours of processing. We don't keep your documents longer than necessary."
      },
      access: {
        title: "Access Controls",
        description: "Robust authentication and authorization systems ensure only you can access your documents and account information."
      },
      infrastructure: {
        title: "Secure Infrastructure",
        description: "Our systems run on enterprise-grade cloud providers with ISO 27001 certification and regular security audits."
      },
      compliance: {
        title: "Compliance",
        description: "Our operations follow GDPR, CCPA, and other regional privacy regulations to ensure your data rights are protected."
      },
      monitoring: {
        title: "Continuous Monitoring",
        description: "Automated and manual security reviews, vulnerability scans, and intrusion detection protect against emerging threats."
      }
    },
    tabs: {
      security: "Security",
      privacy: "Privacy",
      compliance: "Compliance"
    },
    tabContent: {
      security: {
        title: "Our Security Approach",
        description: "Comprehensive security measures to protect your files and data",
        encryption: {
          title: "Strong Encryption",
          description: "We use TLS 1.3 for data in transit and AES-256 for data at rest. All file transfers are encrypted end-to-end."
        },
        auth: {
          title: "Secure Authentication",
          description: "Multi-factor authentication, secure password storage using bcrypt, and regular account monitoring for suspicious activities."
        },
        hosting: {
          title: "Secure Hosting",
          description: "Our infrastructure is hosted on enterprise-grade cloud providers with ISO 27001 certification. We implement network segmentation, firewalls, and intrusion detection systems."
        },
        updates: {
          title: "Regular Updates",
          description: "We maintain regular security patches and updates, conduct vulnerability assessments, and perform penetration testing to identify and address potential issues."
        }
      },
      privacy: {
        title: "Privacy Practices",
        description: "How we handle your personal data and documents",
        viewPolicy: "View Full Privacy Policy"
      },
      compliance: {
        title: "Compliance & Certifications",
        description: "Standards and regulations we adhere to",
        approach: {
          title: "Our Compliance Approach",
          description: "ScanPro is designed with privacy and security by design principles. We regularly review and update our practices to comply with evolving regulations."
        },
        gdpr: {
          title: "GDPR Compliance"
        },
        hipaa: {
          title: "HIPAA Considerations"
        }
      }
    },
    retention: {
      title: "Data Retention Policy",
      description: "We follow strict data minimization practices. Here's how long we keep different types of data:",
      documents: {
        title: "Uploaded Documents",
        description: "Files are automatically deleted from our servers within 24 hours of processing. We don't keep copies of your documents unless you explicitly opt into storage features available for paid plans."
      },
      account: {
        title: "Account Information",
        description: "Basic account information is kept as long as you maintain an active account. You can delete your account at any time, which will remove your personal information from our systems."
      },
      usage: {
        title: "Usage Data",
        description: "Anonymous usage statistics are retained for up to 36 months to help us improve our services. This data cannot be used to identify you personally."
      }
    },
    contact: {
      title: "Have Security Questions?",
      description: "Our security team is ready to answer your questions about how we protect your data and privacy.",
      button: "Contact Security Team"
    },
    policy: {
      button: "Privacy Policy"
    },
    faq: {
      dataCollection: {
        question: "What personal data does ScanPro collect?",
        answer: "We collect minimal information needed to provide our services. For registered users, this includes email, name, and usage statistics. We also collect anonymous usage data to improve our services. We don't analyze, scan, or mine the content of your documents."
      },
      documentStorage: {
        question: "How long do you store my documents?",
        answer: "Documents are automatically deleted from our servers after processing, typically within 24 hours. For paid subscribers, document storage options are available, but these are opt-in features only."
      },
      thirdParty: {
        question: "Do you share my data with third parties?",
        answer: "We do not sell or rent your personal data. We only share data with third parties when necessary to provide our services (such as payment processors for subscriptions) or when required by law. All third-party providers are carefully vetted and bound by data protection agreements."
      },
      security: {
        question: "How do you secure my data?",
        answer: "We use industry-standard security measures including TLS encryption for data transfer, AES-256 encryption for stored data, secure infrastructure providers, access controls, and regular security audits. Our systems are designed with security as a priority."
      },
      rights: {
        question: "What are my rights regarding my data?",
        answer: "Depending on your region, you have rights including: access to your data, correction of inaccurate data, deletion of your data, restriction of processing, data portability, and objection to processing. To exercise these rights, contact our support team."
      },
      breach: {
        question: "What happens in case of a data breach?",
        answer: "We have protocols to detect, respond to, and notify affected users of any data breach in accordance with applicable laws. We conduct regular security assessments to minimize the risk of breaches and maintain a detailed incident response plan."
      }
    }
  }
}

