/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  metadata: {
    title: "ScanPro - All-in-One PDF Converter & Editor | Free Online",
    template: "%s | ScanPro PDF Tools",
    description: "Powerful free online PDF tools: Convert, compress, merge, split, edit, OCR and more. No installation required.",
  },
  nav: {
    tools: "Tools",
    company: "Company",
    pricing: "Pricing",
    convertPdf: "Convert PDF",
    convertPdfDesc: "Transform PDFs to and from other formats",
    selectLanguage: "Select Language"
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
    compressPdf: "Reduce file size while optimizing for maximal PDF quality.",
    rotatePdf: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!",
    watermark: "Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.",
    unlockPdf: "Remove PDF password security, giving you the freedom to use your PDFs as you want.",
    protectPdf: "Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.",
    ocr: "Extract text from scanned documents using Optical Character Recognition."
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
    filesToMerge: "Files to Merge"
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
    title: "Compress PDF",
    description: "Reduce PDF file size while maintaining quality",
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

}