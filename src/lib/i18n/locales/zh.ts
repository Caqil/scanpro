/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
    metadata: {
        title: "ScanPro - 多功能PDF转换器与编辑器 | 免费在线",
        template: "%s | ScanPro PDF工具",
        description: "强大的免费在线PDF工具：转换、压缩、合并、拆分、编辑、OCR等，无需安装。",
    },
    nav: {
        tools: "工具",
        company: "公司",
        pricing: "定价",
        convertPdf: "转换PDF",
        convertPdfDesc: "将PDF转换为其他格式或从其他格式转换为PDF",
        selectLanguage: "选择语言"
    },

    // 英雄部分
    hero: {
        badge: "强大的PDF工具",
        title: "多功能PDF转换器与编辑器",
        description: "免费在线PDF工具，支持转换、压缩、合并、拆分、旋转、添加水印等，无需安装。",
        btConvert: "开始转换",
        btTools: "探索所有工具"
    },

    popular: {
        pdfToWord: "PDF转Word",
        pdfToWordDesc: "轻松将您的PDF文件转换为易于编辑的DOC和DOCX文档。",
        pdfToExcel: "PDF转Excel",
        pdfToExcelDesc: "几秒钟内将PDF中的数据直接提取到Excel电子表格中。",
        pdfToPowerPoint: "PDF转PowerPoint",
        pdfToPowerPointDesc: "将您的PDF演示文稿转换为可编辑的PowerPoint幻灯片。",
        pdfToJpg: "PDF转JPG",
        pdfToJpgDesc: "将PDF页面转换为JPG图片或提取PDF中的所有图片。",
        pdfToPng: "PDF转PNG",
        pdfToPngDesc: "将PDF页面转换为高质量透明PNG图片。",
        pdfToHtml: "PDF转HTML",
        pdfToHtmlDesc: "将PDF文档转换为适合网页的HTML格式。",
        wordToPdf: "Word转PDF",
        wordToPdfDesc: "将Word文档转换为格式和布局完美的PDF。",
        excelToPdf: "Excel转PDF",
        excelToPdfDesc: "将您的Excel电子表格转换为格式完美的PDF文档。",
        powerPointToPdf: "PowerPoint转PDF",
        powerPointToPdfDesc: "将PowerPoint演示文稿转换为PDF，便于分享。",
        jpgToPdf: "JPG转PDF",
        jpgToPdfDesc: "使用可自定义选项从JPG图片创建PDF文件。",
        pngToPdf: "PNG转PDF",
        pngToPdfDesc: "将PNG图片转换为支持透明背景的PDF。",
        htmlToPdf: "HTML转PDF",
        htmlToPdfDesc: "将网页和HTML内容转换为PDF文档。",
        mergePdf: "合并PDF",
        mergePdfDesc: "使用最简单的PDF合并工具按您想要的顺序合并PDF。",
        splitPdf: "拆分PDF",
        splitPdfDesc: "提取特定页面或将PDF拆分为多个文档。",
        compressPdf: "压缩PDF",
        compressPdfDesc: "减小文件大小，同时优化PDF的最大质量。",
        rotatePdf: "旋转PDF",
        rotatePdfDesc: "根据需要旋转PDF页面以更改页面方向。",
        watermark: "添加水印",
        watermarkDesc: "为您的PDF文档添加文本或图片水印，以保护和标记。",
        unlockPdf: "解锁PDF",
        unlockPdfDesc: "移除PDF文件的密码保护和限制。",
        protectPdf: "保护PDF",
        protectPdfDesc: "添加密码保护以确保您的PDF文档安全。",
        signPdf: "签署PDF",
        signPdfDesc: "安全地将数字签名添加到您的PDF文档中。",
        ocr: "OCR",
        ocrDesc: "使用光学字符识别从扫描文档中提取文本。",
        editPdf: "编辑PDF",
        editPdfDesc: "对PDF文档中的文本、图片和页面进行更改。",
        redactPdf: "编辑PDF",
        redactPdfDesc: "永久删除PDF文件中的敏感信息。",
        viewAll: "查看所有PDF工具"
    },

    // 转换器部分
    converter: {
        title: "开始转换",
        description: "上传您的PDF并选择要转换的格式",
        tabUpload: "上传与转换",
        tabApi: "API集成",
        apiTitle: "与我们的API集成",
        apiDesc: "使用我们的REST API在您的应用程序中以编程方式转换PDF",
        apiDocs: "查看API文档"
    },

    // 转换页面
    convert: {
        title: {
            pdfToWord: "PDF转Word",
            pdfToExcel: "PDF转Excel",
            pdfToPowerPoint: "PDF转PowerPoint",
            pdfToJpg: "PDF转JPG",
            pdfToPng: "PDF转PNG",
            pdfToHtml: "PDF转HTML",
            wordToPdf: "Word转PDF",
            excelToPdf: "Excel转PDF",
            powerPointToPdf: "PowerPoint转PDF",
            jpgToPdf: "JPG转PNG",
            pngToPdf: "PNG转PDF",
            htmlToPdf: "HTML转PDF",
            generic: "转换您的文件"
        },
        description: {
            pdfToWord: "快速轻松地将PDF文档转换为可编辑的Word文件",
            pdfToExcel: "从PDF文件中提取表格和数据到Excel电子表格",
            pdfToPowerPoint: "将PDF演示文稿转换为可编辑的PowerPoint幻灯片",
            pdfToJpg: "将PDF页面转换为高质量JPG图片",
            pdfToPng: "将PDF页面转换为透明PNG图片",
            pdfToHtml: "将PDF文档转换为HTML网页",
            wordToPdf: "将Word文档转换为格式完美的PDF格式",
            excelToPdf: "将Excel电子表格转换为PDF文档",
            powerPointToPdf: "将PowerPoint演示文稿转换为PDF格式",
            jpgToPdf: "从您的JPG图片创建PDF文件",
            pngToPdf: "从您的PNG图片创建PDF文件",
            htmlToPdf: "将HTML网页转换为PDF文档",
            generic: "选择文件以在格式之间转换"
        },
        howTo: {
            title: "如何将{from}转换为{to}",
            step1: {
                title: "上传",
                description: "上传您想转换的{from}文件"
            },
            step2: {
                title: "转换",
                description: "点击转换按钮，我们的系统将处理您的文件"
            },
            step3: {
                title: "下载",
                description: "下载您转换后的{to}文件"
            }
        },
        options: {
            title: "转换选项",
            ocr: "启用OCR（光学字符识别）",
            ocrDescription: "从扫描文档或图片中提取文本",
            preserveLayout: "保留原始布局",
            preserveLayoutDescription: "保持原始文档的格式和布局",
            quality: "输出质量",
            qualityDescription: "设置转换文件的质量级别",
            qualityOptions: {
                low: "低（较小文件大小）",
                medium: "中（平衡）",
                high: "高（最佳质量）"
            },
            pageOptions: "页面选项",
            allPages: "所有页面",
            selectedPages: "选定页面",
            pageRangeDescription: "输入页面编号和/或页面范围，用逗号分隔",
            pageRangeExample: "示例：1,3,5-12"
        },
        moreTools: "相关转换工具",
        expertTips: {
            title: "专家提示",
            pdfToWord: [
                "为获得最佳效果，请确保您的PDF具有清晰、可机读的文本",
                "对扫描文档或基于图片的PDF启用OCR",
                "复杂布局可能在转换后需要轻微调整"
            ],
            pdfToExcel: [
                "边框清晰的表格转换更准确",
                "对扫描的PDF预处理OCR以获得更好的数据提取",
                "转换后检查电子表格公式，因为它们可能不会转移"
            ],
            generic: [
                "高质量设置会导致文件大小更大",
                "对带有扫描文本或含文本图片的文档使用OCR",
                "转换后预览文件以确保准确性"
            ]
        },
        advantages: {
            title: "将{from}转换为{to}的优势",
            pdfToWord: [
                "编辑和修改锁定在PDF格式中的文本",
                "无需重新创建整个文档即可更新内容",
                "提取信息以用于其他文档"
            ],
            pdfToExcel: [
                "分析和操作静态PDF形式中的数据",
                "使用提取的数据创建图表和执行计算",
                "轻松更新财务报告或数字信息"
            ],
            wordToPdf: [
                "创建保持格式的通用的可读文档",
                "防止内容被意外修改",
                "确保在所有设备和平台上外观一致"
            ],
            generic: [
                "将您的文档转换为更有用的格式",
                "在支持目标格式的程序中访问和使用内容",
                "以他人易于打开的格式分享文件"
            ]
        }
    },

    // 功能部分
    features: {
        title: "功能",
        description: "转换和管理PDF文件所需的一切",
        documentFormats: {
            title: "文档格式",
            description: "转换为DOCX、DOC、RTF、ODT等，完美保留格式和布局"
        },
        spreadsheets: {
            title: "电子表格",
            description: "将PDF转换为XLSX、CSV等电子表格格式，保持正确的单元格结构"
        },
        images: {
            title: "图片",
            description: "从PDF文件中提取高质量JPG和PNG图片，支持分辨率控制"
        },
        webFormats: {
            title: "网页格式",
            description: "转换为HTML和其他适合在线发布的网页友好格式"
        },
        ocrTech: {
            title: "OCR技术",
            description: "使用高级光学字符识别从扫描文档中提取文本"
        },
        batchProcessing: {
            title: "批量处理",
            description: "一次性转换多个PDF以节省时间，高效的批量处理"
        }
    },

    // 行动号召部分
    cta: {
        title: "准备好转换了吗？",
        description: "将您的PDF转换为您需要的任何格式，完全免费。",
        startConverting: "开始转换",
        exploreTools: "探索所有工具"
    },

    // PDF工具页面
    pdfTools: {
        title: "所有PDF工具",
        description: "在一个地方处理PDF所需的一切",
        categories: {
            convertFromPdf: "从PDF转换",
            convertToPdf: "转换为PDF",
            basicTools: "基本工具",
            organizePdf: "组织PDF",
            pdfSecurity: "PDF安全"
        }
    },

    // 工具描述
    toolDescriptions: {
        pdfToWord: "轻松将您的PDF文件转换为易于编辑的DOC和DOCX文档。",
        pdfToPowerpoint: "将您的PDF文件转换为易于编辑的PPT和PPTX幻灯片。",
        pdfToExcel: "几秒钟内将PDF中的数据直接提取到Excel电子表格中。",
        pdfToJpg: "将每个PDF页面转换为JPG或提取PDF中包含的所有图片。",
        pdfToPng: "将每个PDF页面转换为PNG或提取PDF中包含的所有图片。",
        pdfToHtml: "将HTML网页转换为PDF。复制并粘贴页面URL。",
        wordToPdf: "通过转换为PDF使DOC和DOCX文件易于阅读。",
        powerpointToPdf: "通过转换为PDF使PPT和PPTX幻灯片易于查看。",
        excelToPdf: "通过转换为PDF使EXCEL电子表格易于阅读。",
        jpgToPdf: "在几秒钟内将JPG图片转换为PDF。轻松调整方向和边距。",
        pngToPdf: "在几秒钟内将PNG图片转换为PDF。轻松调整方向和边距。",
        htmlToPdf: "将网页转换为PDF。复制并粘贴URL以转换为PDF。",
        mergePdf: "使用最简单的PDF合并工具按您想要的顺序合并PDF。",
        compressPdf: "减小文件大小，同时优化PDF的最大质量。",
        rotatePdf: "根据需要旋转您的PDF。甚至可以一次旋转多个PDF！",
        watermark: "在几秒钟内在您的PDF上添加图片或文本水印。选择字体、透明度和位置。",
        unlockPdf: "移除PDF密码安全，让您自由使用PDF。",
        protectPdf: "使用密码保护PDF文件。加密PDF文档以防止未经授权的访问。",
        ocr: "使用光学字符识别从扫描文档中提取文本。"
    },

    // 合并PDF页面
    mergePdf: {
        title: "合并PDF文件",
        description: "快速轻松地将多个PDF文件合并为单个文档",
        howTo: {
            title: "如何合并PDF文件",
            step1: {
                title: "上传文件",
                description: "上传您想要合并的PDF文件。您可以一次选择多个文件。"
            },
            step2: {
                title: "排列顺序",
                description: "拖放以按照您希望在最终PDF中出现的顺序重新排列文件。"
            },
            step3: {
                title: "下载",
                description: "点击合并PDF按钮并下载您的合并PDF文件。"
            }
        },
        faq: {
            title: "常见问题",
            q1: {
                question: "我可以合并多少个PDF文件？",
                answer: "使用我们的免费工具，您可以一次合并最多20个PDF文件。对于更大的批量，请考虑我们的高级计划。"
            },
            q2: {
                question: "我的PDF文件会保持私密吗？",
                answer: "是的，您的隐私是我们的首要任务。所有上传的文件在处理后会自动从我们的服务器中删除。"
            },
            q3: {
                question: "我可以合并受密码保护的PDF吗？",
                answer: "对于受密码保护的PDF，您需要先使用我们的解锁PDF工具解锁，然后再合并它们。"
            }
        },
        relatedTools: "探索更多PDF工具",
        viewAllTools: "查看所有PDF工具",
        of: "的",
        files: "文件",
        filesToMerge: "要合并的文件"
    },

    // OCR页面
    ocr: {
        title: "OCR文本提取",
        description: "使用强大的光学字符识别技术从扫描的PDF和图片中提取文本",
        howTo: {
            title: "OCR文本提取如何工作",
            step1: {
                title: "上传",
                description: "上传您的扫描PDF文档或基于图片的PDF文件。"
            },
            step2: {
                title: "配置OCR",
                description: "选择语言、页面范围和高级选项以获得最佳结果。"
            },
            step3: {
                title: "获取文本",
                description: "复制提取的文本或将其下载为文本文件以供进一步使用。"
            }
        },
        faq: {
            title: "常见问题",
            questions: {
                accuracy: {
                    question: "OCR文本提取的准确性如何？",
                    answer: "我们的OCR技术通常对清晰打印文本和高品质扫描文档的准确率达到90-99%。对于低质量扫描、非常规字体或复杂布局，准确性可能会降低。"
                },
                languages: {
                    question: "支持哪些语言？",
                    answer: "我们支持超过100种语言，包括英语、法语、德语、西班牙语、意大利语、葡萄牙语、中文、日语、韩语、俄语、阿拉伯语、印地语等。"
                },
                recognition: {
                    question: "为什么我的文本没有被正确识别？",
                    answer: "几个因素可能影响OCR准确性：文档质量、分辨率、对比度、复杂布局、手写文字、非常规字体或选择了错误的语言。"
                },
                pageLimit: {
                    question: "我可以处理的页面数量有限制吗？",
                    answer: "对于免费用户，每个PDF限制为50页。高级用户可以处理高达500页的PDF。"
                },
                security: {
                    question: "OCR处理期间我的数据安全吗？",
                    answer: "是的，您的安全是我们的首要任务。所有上传的文件在安全服务器上处理，并在处理后自动删除。"
                }
            }
        },
        relatedTools: "相关PDF工具",
        processing: {
            title: "处理OCR",
            message: "OCR处理可能需要几分钟，具体取决于文档大小和复杂性"
        },
        results: {
            title: "提取的文本",
            copy: "复制",
            download: "下载.txt"
        },
        languages: {
            english: "英语",
            french: "法语",
            german: "德语",
            spanish: "西班牙语",
            chinese: "中文",
            japanese: "日语",
            arabic: "阿拉伯语",
            russian: "俄语"
        },
        whatIsOcr: {
            title: "光学字符识别（OCR）",
            description: "是一种技术，可以将各种类型的文档（如扫描的纸质文档、PDF文件或数码相机拍摄的图片）转换为可编辑和可搜索的数据。",
            explanation: "OCR分析文档图像的结构，识别字符和文本元素，然后将其转换为机器可读的格式。",
            extractionList: {
                scannedPdfs: "文本以图像形式存在的扫描PDF",
                imageOnlyPdfs: "没有底层文本层的仅图像PDF",
                embeddedImages: "包含带文本的嵌入式图片的PDF",
                textCopyingIssues: "无法直接复制文本的文档"
            }
        },
        whenToUse: {
            title: "何时使用OCR文本提取",
            idealFor: "非常适合：",
            idealForList: {
                scannedDocuments: "保存为PDF的扫描文档",
                oldDocuments: "没有数字文本层的旧文档",
                textSelectionIssues: "无法选择/复制文本的PDF",
                textInImages: "需要提取文本的图片",
                searchableArchives: "从扫描文档创建可搜索的档案"
            },
            notNecessaryFor: "不必要用于：",
            notNecessaryForList: {
                digitalPdfs: "已经可以选择文本的原生数字PDF",
                createdDigitally: "直接从数字文档创建的PDF",
                copyPasteAvailable: "已经可以复制粘贴文本的文档",
                formatPreservation: "需要保留格式的文件（请改用我们的PDF转DOCX转换）"
            }
        },
        limitations: {
            title: "OCR限制与建议",
            description: "虽然我们的OCR技术很强大，但需要注意一些限制：",
            factorsAffecting: "影响OCR准确性的因素：",
            factorsList: {
                documentQuality: "文档质量（分辨率、对比度）",
                complexLayouts: "复杂布局和格式",
                handwrittenText: "手写文本（识别有限）",
                specialCharacters: "特殊字符和符号",
                multipleLanguages: "一个文档中的多种语言"
            },
            tipsForBest: "获得最佳结果的建议：",
            tipsList: {
                highQualityScans: "使用高质量扫描（300 DPI或更高）",
                correctLanguage: "为您的文档选择正确的语言",
                enhanceScannedImages: "启用“增强扫描图像”以提高准确性",
                smallerPageRanges: "处理大文档时使用较小的页面范围",
                reviewText: "之后审查并更正提取的文本"
            }
        },
        options: {
            scope: "提取的页面",
            all: "所有页面",
            custom: "特定页面",
            pages: "页面编号",
            pagesHint: "例如：1,3,5-9",
            enhanceScanned: "增强扫描图像",
            enhanceScannedHint: "预处理图像以提高OCR准确性（推荐用于扫描文档）",
            preserveLayout: "保留布局",
            preserveLayoutHint: "尝试保持原始布局，包括段落和换行"
        }
    },

    // 保护PDF页面
    protectPdf: {
        title: "密码保护PDF",
        description: "通过密码保护和自定义访问权限保护您的PDF文档",
        howTo: {
            title: "如何保护您的PDF",
            step1: {
                title: "上传",
                description: "上传您想用密码保护的PDF文件。"
            },
            step2: {
                title: "设置安全选项",
                description: "创建密码并为打印、复制和编辑自定义权限。"
            },
            step3: {
                title: "下载",
                description: "下载您受密码保护的PDF文件，准备好安全分享。"
            }
        },
        why: {
            title: "为什么要保护您的PDF？",
            confidentiality: {
                title: "保密性",
                description: "确保只有拥有密码的授权人员才能打开和查看您的敏感文档。"
            },
            controlledAccess: {
                title: "受控访问",
                description: "设置特定权限以决定接收者可以对您的文档做什么，例如打印或编辑。"
            },
            authorizedDistribution: {
                title: "授权分发",
                description: "在分享合同、研究或知识产权时控制谁可以访问您的文档。"
            },
            documentExpiration: {
                title: "文档过期",
                description: "密码保护为不应无限期访问的时效性文档增加额外的安全层。"
            }
        },
        security: {
            title: "了解PDF安全",
            passwords: {
                title: "用户密码与所有者密码",
                user: "用户密码：打开文档所需。没有此密码，任何人无法查看内容。",
                owner: "所有者密码：控制权限。使用我们的工具，我们将两个密码设置为相同以简化操作。"
            },
            encryption: {
                title: "加密级别",
                aes128: "128位AES：提供良好的安全性，兼容Acrobat Reader 7及更高版本。",
                aes256: "256位AES：提供更强的安全性，但需要Acrobat Reader X（10）及更高版本。"
            },
            permissions: {
                title: "权限控制",
                printing: {
                    title: "打印",
                    description: "控制文档是否可以打印以及打印的质量级别。"
                },
                copying: {
                    title: "内容复制",
                    description: "控制是否可以选择文本和图片并复制到剪贴板。"
                },
                editing: {
                    title: "编辑",
                    description: "控制文档修改，包括注释、表单填写和内容更改。"
                }
            }
        },
        form: {
            password: "密码",
            confirmPassword: "确认密码",
            encryptionLevel: "加密级别",
            permissions: {
                title: "访问权限",
                allowAll: "全部允许（仅需打开密码）",
                restricted: "受限访问（自定义权限）"
            },
            allowedActions: "允许的操作：",
            allowPrinting: "允许打印",
            allowCopying: "允许复制文本和图片",
            allowEditing: "允许编辑和注释"
        },
        bestPractices: {
            title: "密码保护最佳实践",
            dos: "应该做",
            donts: "不要做",
            dosList: [
                "使用包含字母、数字和特殊字符的强大、独特密码",
                "在密码管理器中安全存储密码",
                "通过与PDF分开的的安全渠道分享密码",
                "对高度敏感的文档使用256位加密"
            ],
            dontsList: [
                "使用简单、易猜的密码，如“password123”或“1234”",
                "在发送PDF的同一封邮件中包含密码",
                "对所有受保护的PDF使用相同的密码",
                "仅依靠密码保护来保护极其敏感的信息"
            ]
        },
        faq: {
            encryptionDifference: {
                question: "加密级别有什么区别？",
                answer: "我们提供128位和256位AES加密。128位兼容较旧的PDF阅读器（Acrobat 7及以上），而256位提供更强的安全性，但需要较新的阅读器（Acrobat X及以上）。"
            },
            removeProtection: {
                question: "我可以稍后移除密码保护吗？",
                answer: "是的，您可以使用我们的解锁PDF工具从PDF文件中移除密码保护，但您需要知道当前的密码才能这样做。"
            },
            securityStrength: {
                question: "密码保护有多安全？",
                answer: "我们的工具使用行业标准的AES加密。安全性取决于您密码的强度和您选择的加密级别。我们建议使用包含多种字符的强大、独特密码。"
            },
            contentQuality: {
                question: "密码保护会影响PDF内容或质量吗？",
                answer: "不会，密码保护仅为您的文档增加安全性，不会以任何方式改变PDF的内容、布局或质量。"
            },
            batchProcessing: {
                question: "我可以一次保护多个PDF吗？",
                answer: "目前，我们的工具一次处理一个PDF。对于多个文件的批量处理，请考虑我们的API或高级解决方案。"
            }
        },
        protecting: "保护中...",
        protected: "PDF已成功保护！",
        protectedDesc: "您的PDF文件已加密并受密码保护。"
    },

    // 水印页面
    watermark: {
        title: "为PDF添加水印",
        description: "通过添加自定义文本水印保护您的文档",
        howTo: {
            title: "如何添加水印",
            step1: {
                title: "上传",
                description: "上传您想添加水印的PDF文件。您可以在应用前预览其外观。"
            },
            step2: {
                title: "自定义",
                description: "设置水印的文本、位置、大小、颜色和透明度以满足您的需求。"
            },
            step3: {
                title: "下载",
                description: "处理并下载您添加了水印的PDF文件，准备好分发。"
            }
        },
        form: {
            text: "水印文本",
            textColor: "文本颜色",
            opacity: "透明度",
            size: "大小",
            rotation: "旋转",
            position: "位置",
            pages: "要添加水印的页面",
            allPages: "所有页面",
            specificPages: "特定页面",
            pageNumbers: "页面编号",
            pageNumbersHint: "输入页面编号，用逗号分隔（例如：1,3,5,8）"
        },
        positions: {
            topLeft: "左上",
            topCenter: "顶部中央",
            topRight: "右上",
            centerLeft: "中央左",
            center: "中央",
            centerRight: "中央右",
            bottomLeft: "左下",
            bottomCenter: "底部中央",
            bottomRight: "右下"
        },
        preview: {
            title: "水印预览",
            note: "这是一个简化的预览。实际结果可能有所不同。"
        },
        faq: {
            title: "常见问题",
            q1: {
                question: "我可以添加哪些类型的水印？",
                answer: "我们的工具支持文本水印，可自定义内容、位置、大小、颜色、透明度和旋转。您可以添加如“机密”、“草稿”或公司名称等水印。"
            },
            q2: {
                question: "我可以只为PDF中的特定页面添加水印吗？",
                answer: "是的，您可以选择为所有页面添加水印，或通过输入页面编号指定应添加水印的页面。"
            },
            q3: {
                question: "水印是永久的吗？",
                answer: "是的，水印会永久嵌入PDF文档中。然而，可以通过调整透明度来平衡可见性和内容的清晰度。"
            },
            q4: {
                question: "添加水印会影响文件质量吗？",
                answer: "不会，我们的水印工具仅添加指定的文本，不会显著影响原始文档的质量或文件大小。"
            }
        },
        addingWatermark: "正在为您的PDF添加水印...",
        watermarkSuccess: "水印添加成功！",
        watermarkSuccessDesc: "您的PDF文件已添加水印并准备好下载。"
    },

    // 压缩PDF
    compressPdf: {
        title: "压缩PDF",
        description: "减小PDF文件大小，同时保持质量",
        quality: {
            high: "高质量",
            highDesc: "最小的压缩，最佳视觉质量",
            balanced: "平衡",
            balancedDesc: "良好的压缩，视觉损失最小",
            maximum: "最大压缩",
            maximumDesc: "最高的压缩比，可能会降低视觉质量"
        },
        processing: {
            title: "处理选项",
            processAllTogether: "同时处理所有文件",
            processSequentially: "逐一处理文件"
        },
        status: {
            uploading: "上传中...",
            compressing: "压缩中...",
            completed: "完成",
            failed: "失败"
        },
        results: {
            title: "压缩结果概要",
            totalOriginal: "原始总大小",
            totalCompressed: "压缩后总大小",
            spaceSaved: "节省的空间",
            averageReduction: "平均减少",
            downloadAll: "下载所有压缩文件为ZIP"
        },
        of: "的",
        files: "文件",
        filesToCompress: "要压缩的文件",
        compressAll: "压缩文件",
        qualityPlaceholder: "选择压缩质量",
        reduction: "减少",
        zipDownloadSuccess: "所有压缩文件下载成功",
        overallProgress: "总体进度",
        reducedBy: "减少了",
        success: "压缩成功",
        error: {
            noFiles: "请选择要压缩的PDF文件",
            noCompressed: "没有可下载的压缩文件",
            downloadZip: "无法下载ZIP归档文件",
            generic: "无法压缩PDF文件",
            unknown: "发生未知错误",
            failed: "无法压缩您的文件"
        }
    },

    // 解锁PDF
    unlockPdf: {
        title: "解锁PDF文件",
        description: "移除PDF文档的密码保护以实现无限制访问",
        howTo: {
            title: "如何解锁PDF文件",
            upload: {
                title: "上传",
                description: "上传您想解锁的受密码保护的PDF文件。"
            },
            enterPassword: {
                title: "输入密码",
                description: "如有需要，输入保护PDF的当前密码。"
            },
            download: {
                title: "下载",
                description: "下载您解锁后的PDF文件，没有密码限制。"
            }
        },
        faq: {
            passwordRequired: {
                question: "我需要知道当前密码吗？",
                answer: "是的，要解锁PDF，您需要知道当前密码。我们的工具无法绕过或破解密码；它只是在您提供正确密码后移除保护。"
            },
            security: {
                question: "解锁过程安全吗？",
                answer: "是的，所有处理都在我们的安全服务器上进行。我们不会存储您的PDF或密码。文件在处理后自动删除，所有数据传输都经过加密。"
            },
            restrictions: {
                question: "我可以解锁有所有者限制但无打开密码的PDF吗？",
                answer: "是的，有些PDF不需要密码即可打开，但对打印、编辑或复制有限制。我们的工具也可以移除这些限制。只需上传文件，无需输入密码。"
            },
            quality: {
                question: "解锁会影响PDF质量或内容吗？",
                answer: "不会，我们的解锁过程仅移除安全设置，不会以任何方式改变PDF文件的内容、格式或质量。"
            }
        },
        passwordProtected: "受密码保护",
        notPasswordProtected: "未受密码保护",
        unlocking: "正在解锁您的PDF...",
        unlockSuccess: "PDF成功解锁！",
        unlockSuccessDesc: "您的PDF文件已解锁并准备好下载。"
    },

    // 文件上传器
    fileUploader: {
        dropHere: "将文件拖放到这里",
        dropHereaDesc: "将您的PDF文件拖放到这里或点击浏览",
        dragAndDrop: "拖放您的文件",
        browse: "浏览文件",
        dropHereDesc: "将文件拖放到这里或点击浏览。",
        maxSize: "最大大小为100MB。",
        remove: "移除",
        inputFormat: "输入格式",
        outputFormat: "输出格式",
        ocr: "启用OCR",
        ocrDesc: "使用光学字符识别从扫描文档中提取文本",
        quality: "质量",
        low: "低",
        high: "高",
        password: "密码",
        categories: {
            documents: "文档",
            spreadsheets: "电子表格",
            presentations: "演示文稿",
            images: "图片"
        },
        converting: "转换中",
        successful: "转换成功",
        successDesc: "您的文件已成功转换，现在可以下载。",
        download: "下载转换后的文件",
        filesSecurity: "文件在24小时后自动删除，以确保隐私和安全。"
    },

    // 常用UI元素
    ui: {
        upload: "上传",
        download: "下载",
        cancel: "取消",
        confirm: "确认",
        save: "保存",
        next: "下一步",
        previous: "上一步",
        finish: "完成",
        processing: "处理中...",
        success: "成功！",
        error: "错误",
        copy: "复制",
        remove: "移除",
        browse: "浏览",
        dragDrop: "拖放",
        or: "或",
        close: "关闭",
        apply: "应用",
        loading: "加载中...",
        preview: "预览",
        reupload: "上传另一个文件",
        continue: "继续",
        skip: "跳过",
        retry: "重试",
        addMore: "添加更多",
        clear: "清除",
        clearAll: "全部清除",
        done: "完成",
        extract: "提取",
        new: "新！",
        phone: "电话",
        address: "地址",
        filesSecurity: "文件在24小时后自动删除，以确保隐私和安全。"
    },

    contact: {
        title: "联系我们",
        description: "有问题或反馈？我们很乐意听到您的意见。",
        form: {
            title: "给我们发送消息",
            description: "填写下面的表格，我们将尽快回复您。",
            name: "您的姓名",
            email: "电子邮件地址",
            subject: "主题",
            message: "消息",
            submit: "发送消息"
        },
        success: "消息发送成功",
        successDesc: "感谢您联系我们。我们将尽快回复您。",
        error: "消息发送失败",
        errorDesc: "发送您的消息时出错。请稍后再试。",
        validation: {
            name: "姓名必填",
            email: "请输入有效的电子邮件地址",
            subject: "主题必填",
            message: "消息必填"
        },
        supportHours: {
            title: "支持时间",
            description: "我们何时可以提供帮助",
            weekdays: "周一至周五",
            weekdayHours: "上午9:00 - 下午6:00（美国东部时间）",
            saturday: "周六",
            saturdayHours: "上午10:00 - 下午4:00（美国东部时间）",
            sunday: "周日",
            closed: "关闭"
        },
        faq: {
            title: "常见问题",
            responseTime: {
                question: "回复需要多长时间？",
                answer: "我们旨在在24-48个工作小时内回复所有询问。在高峰期，可能需要最多72小时。"
            },
            technicalSupport: {
                question: "我可以获得技术支持吗？",
                answer: "是的，我们的技术支持团队可以帮助您解决使用PDF工具时遇到的任何问题。"
            },
            phoneSupport: {
                question: "你们提供电话支持吗？",
                answer: "我们在列出的支持时间内提供电话支持。如需即时帮助，电子邮件通常是最快的方式。"
            },
            security: {
                question: "我的个人信息安全吗？",
                answer: "我们非常重视您的隐私。所有通信都经过加密，我们从不与第三方分享您的个人信息。"
            }
        }
    },
    // 关于页面
    about: {
        title: "关于ScanPro",
        mission: {
            title: "我们的使命",
            description: "我们相信让每个人都能轻松管理PDF。我们的在线工具帮助您快速轻松地处理PDF，无需安装软件。"
        },
        team: {
            title: "我们的团队",
            description: "我们是一支致力于创建简单但强大的PDF工具的开发者和设计师团队。"
        },
        technology: {
            title: "我们的技术",
            description: "我们的平台使用尖端技术，提供高质量的PDF转换、编辑和安全性，同时确保您的数据安全。"
        }
    },

    // 定价页面
    pricing: {
        title: "简单透明的定价",
        description: "选择适合您需求的计划",
        free: {
            title: "免费",
            description: "适合偶尔用户的PDF基本任务",
            features: [
                "每天最多转换3个文件",
                "PDF转Word、Excel、PowerPoint",
                "基本压缩",
                "合并最多5个PDF",
                "添加简单水印",
                "标准OCR"
            ]
        },
        pro: {
            title: "专业版",
            description: "为常规PDF用户提供更多功能",
            features: [
                "无限转换",
                "优先处理",
                "高级压缩",
                "合并无限PDF",
                "自定义水印",
                "支持100多种语言的高级OCR",
                "批量处理",
                "无广告"
            ]
        },
        business: {
            title: "商业版",
            description: "团队的完整解决方案",
            features: [
                "专业版中的所有功能",
                "多团队成员",
                "API访问",
                "符合GDPR",
                "专属支持",
                "使用分析",
                "自定义品牌选项"
            ]
        },
        monthly: "每月",
        annually: "每年",
        savePercent: "节省20%",
        currentPlan: "当前计划",
        upgrade: "立即升级",
        getStarted: "开始使用",
        contact: "联系销售"
    },

    // 条款和隐私页面
    legal: {
        termsTitle: "服务条款",
        privacyTitle: "隐私政策",
        lastUpdated: "最后更新",
        introduction: {
            title: "引言",
            description: "请在使用我们的服务前仔细阅读这些条款。"
        },
        dataUse: {
            title: "我们如何使用您的数据",
            description: "我们仅处理您的文件以提供您请求的服务。所有文件在24小时后自动删除。"
        },
        cookies: {
            title: "Cookie和追踪",
            description: "我们使用Cookie来改善您的体验并分析网站流量。"
        },
        rights: {
            title: "您的权利",
            description: "您有权访问、更正或删除您的个人信息。"
        }
    },

    // 错误页面
    error: {
        notFound: "页面未找到",
        notFoundDesc: "抱歉，我们找不到您要找的页面。",
        serverError: "服务器错误",
        serverErrorDesc: "抱歉，我们的服务器出现了问题。请稍后再试。",
        goHome: "返回首页",
        tryAgain: "再次尝试"
    },
    universalCompressor: {
        title: "通用文件压缩器",
        description: "压缩PDF、图片和Office文档，同时保持质量",
        dropHereDesc: "将文件拖放到此处（PDF、JPG、PNG、DOCX、PPTX、XLSX）",
        filesToCompress: "要压缩的文件",
        compressAll: "压缩所有文件",
        results: {
            title: "压缩结果",
            downloadAll: "下载所有压缩文件"
        },
        fileTypes: {
            pdf: "PDF文档",
            image: "图片",
            office: "Office文档",
            unknown: "未知文件"
        },
        howTo: {
            title: "如何压缩文件",
            step1: {
                title: "上传文件",
                description: "上传您想压缩的文件"
            },
            step2: {
                title: "选择质量",
                description: "选择您偏好的压缩级别"
            },
            step3: {
                title: "下载",
                description: "点击压缩并下载您的压缩文件"
            }
        },
        faq: {
            compressionRate: {
                question: "文件可以压缩多少？",
                answer: "压缩率因文件类型和内容而异。PDF通常压缩20-70%，图片压缩30-80%，Office文档压缩10-50%。"
            },
            quality: {
                question: "压缩会影响文件质量吗？",
                answer: "我们的压缩算法在减少文件大小和保持质量之间取得平衡。'高质量'设置将保持几乎相同的视觉质量。"
            },
            sizeLimit: {
                question: "有文件大小限制吗？",
                answer: "是的，您可以压缩每个文件高达100MB。"
            }
        }
    }
}