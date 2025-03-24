/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
    metadata: {
        title: "ScanPro - Convertisseur et Éditeur PDF Tout-en-Un | Gratuit en Ligne",
        template: "%s | Outils PDF ScanPro",
        description: "Outils PDF gratuits et puissants en ligne : Convertir, compresser, fusionner, diviser, éditer, OCR et plus encore. Aucune installation requise.",
    },
    nav: {
        tools: "Outils",
        company: "Entreprise",
        pricing: "Tarification",
        convertPdf: "Convertir PDF",
        convertPdfDesc: "Transformer les PDF vers et depuis d'autres formats",
        selectLanguage: "Sélectionner la langue",
        downloadApp: "Télécharger l’Application",
        getApp: "Obtenez notre application mobile pour des outils PDF en déplacement",
        appStores: "Obtenez l’Application ScanPro",
        mobileTools: "Outils PDF en déplacement"
    },

    // Section Héros
    hero: {
        badge: "Outils PDF Puissants",
        title: "Convertisseur et Éditeur PDF Tout-en-Un",
        description: "Outils PDF gratuits en ligne pour convertir, compresser, fusionner, diviser, faire pivoter, ajouter des filigranes et plus encore. Aucune installation requise.",
        btConvert: "Commencer à Convertir",
        btTools: "Explorer Tous les Outils"
    },

    popular: {
        pdfToWord: "PDF vers Word",
        pdfToWordDesc: "Convertissez facilement vos fichiers PDF en documents DOC et DOCX faciles à éditer.",
        pdfToExcel: "PDF vers Excel",
        pdfToExcelDesc: "Extrayez les données directement des PDF dans des feuilles de calcul Excel en quelques secondes.",
        pdfToPowerPoint: "PDF vers PowerPoint",
        pdfToPowerPointDesc: "Transformez vos présentations PDF en diapositives PowerPoint modifiables.",
        pdfToJpg: "PDF vers JPG",
        pdfToJpgDesc: "Convertissez les pages PDF en images JPG ou extrayez toutes les images d’un PDF.",
        pdfToPng: "PDF vers PNG",
        pdfToPngDesc: "Convertissez les pages PDF en images PNG transparentes de haute qualité.",
        pdfToHtml: "PDF vers HTML",
        pdfToHtmlDesc: "Transformez les documents PDF en format HTML adapté au web.",
        wordToPdf: "Word vers PDF",
        wordToPdfDesc: "Convertissez les documents Word en PDF avec un formatage et une mise en page parfaits.",
        excelToPdf: "Excel vers PDF",
        excelToPdfDesc: "Transformez vos feuilles de calcul Excel en documents PDF parfaitement formatés.",
        powerPointToPdf: "PowerPoint vers PDF",
        powerPointToPdfDesc: "Convertissez les présentations PowerPoint en PDF pour un partage facile.",
        jpgToPdf: "JPG vers PDF",
        jpgToPdfDesc: "Créez des fichiers PDF à partir de vos images JPG avec des options personnalisables.",
        pngToPdf: "PNG vers PDF",
        pngToPdfDesc: "Convertissez les images PNG en PDF avec prise en charge des fonds transparents.",
        htmlToPdf: "HTML vers PDF",
        htmlToPdfDesc: "Convertissez des pages web et du contenu HTML en documents PDF.",
        mergePdf: "Fusionner PDF",
        mergePdfDesc: "Combinez les PDF dans l’ordre souhaité avec le fusionneur PDF le plus simple disponible.",
        splitPdf: "Diviser PDF",
        splitPdfDesc: "Extrayez des pages spécifiques ou divisez un PDF en plusieurs documents.",
        compressPdf: "Compresser PDF",
        compressPdfDesc: "Réduisez la taille des fichiers tout en optimisant la qualité maximale du PDF.",
        rotatePdf: "Faire pivoter PDF",
        rotatePdfDesc: "Changez l’orientation des pages en faisant pivoter les pages PDF selon vos besoins.",
        watermark: "Ajouter un filigrane",
        watermarkDesc: "Ajoutez des filigranes textuels ou d’image pour protéger et marquer vos documents PDF.",
        unlockPdf: "Déverrouiller PDF",
        unlockPdfDesc: "Supprimez la protection par mot de passe et les restrictions des fichiers PDF.",
        protectPdf: "Protéger PDF",
        protectPdfDesc: "Ajoutez une protection par mot de passe pour sécuriser vos documents PDF.",
        signPdf: "Signer PDF",
        signPdfDesc: "Ajoutez des signatures numériques à vos documents PDF en toute sécurité.",
        ocr: "OCR",
        ocrDesc: "Extrayez le texte des documents numérisés grâce à la reconnaissance optique de caractères.",
        editPdf: "Éditer PDF",
        editPdfDesc: "Modifiez le texte, les images et les pages de vos documents PDF.",
        redactPdf: "Caviarder PDF",
        redactPdfDesc: "Supprimez définitivement les informations sensibles de vos fichiers PDF.",
        viewAll: "Voir Tous les Outils PDF"
    },

    // Section Convertisseur
    converter: {
        title: "Commencer à Convertir",
        description: "Téléchargez votre PDF et sélectionnez le format vers lequel vous souhaitez convertir",
        tabUpload: "Télécharger & Convertir",
        tabApi: "Intégration API",
        apiTitle: "Intégrez avec notre API",
        apiDesc: "Utilisez notre API REST pour convertir des PDF par programmation dans votre application",
        apiDocs: "Voir la Documentation API"
    },

    // Page de Conversion
    convert: {
        title: {
            pdfToWord: "Convertir PDF en Word",
            pdfToExcel: "Convertir PDF en Excel",
            pdfToPowerPoint: "Convertir PDF en PowerPoint",
            pdfToJpg: "Convertir PDF en JPG",
            pdfToPng: "Convertir PDF en PNG",
            pdfToHtml: "Convertir PDF en HTML",
            wordToPdf: "Convertir Word en PDF",
            excelToPdf: "Convertir Excel en PDF",
            powerPointToPdf: "Convertir PowerPoint en PDF",
            jpgToPdf: "Convertir JPG en PNG",
            pngToPdf: "Convertir PNG en PDF",
            htmlToPdf: "Convertir HTML en PDF",
            generic: "Convertir Votre Fichier"
        },
        description: {
            pdfToWord: "Transformez rapidement et facilement les documents PDF en fichiers Word modifiables",
            pdfToExcel: "Extrayez les tableaux et données des fichiers PDF dans des feuilles de calcul Excel",
            pdfToPowerPoint: "Transformez les présentations PDF en diapositives PowerPoint modifiables",
            pdfToJpg: "Convertissez les pages PDF en images JPG de haute qualité",
            pdfToPng: "Convertissez les pages PDF en images PNG transparentes",
            pdfToHtml: "Convertissez les documents PDF en pages web HTML",
            wordToPdf: "Convertissez les documents Word en format PDF avec un formatage parfait",
            excelToPdf: "Transformez les feuilles de calcul Excel en documents PDF",
            powerPointToPdf: "Convertissez les présentations PowerPoint en format PDF",
            jpgToPdf: "Créez des fichiers PDF à partir de vos images JPG",
            pngToPdf: "Créez des fichiers PDF à partir de vos images PNG",
            htmlToPdf: "Convertissez les pages web HTML en documents PDF",
            generic: "Sélectionnez un fichier à convertir entre différents formats"
        },
        howTo: {
            title: "Comment Convertir {from} en {to}",
            step1: {
                title: "Télécharger",
                description: "Téléchargez le fichier {from} que vous souhaitez convertir"
            },
            step2: {
                title: "Convertir",
                description: "Cliquez sur le bouton Convertir et notre système traitera votre fichier"
            },
            step3: {
                title: "Télécharger",
                description: "Téléchargez votre fichier {to} converti"
            }
        },
        options: {
            title: "Options de Conversion",
            ocr: "Activer l’OCR (Reconnaissance Optique de Caractères)",
            ocrDescription: "Extrayez le texte des documents numérisés ou des images",
            preserveLayout: "Préserver la mise en page originale",
            preserveLayoutDescription: "Maintenir le formatage et la mise en page du document original",
            quality: "Qualité de sortie",
            qualityDescription: "Définir le niveau de qualité pour le fichier converti",
            qualityOptions: {
                low: "Basse (taille de fichier réduite)",
                medium: "Moyenne (équilibrée)",
                high: "Haute (meilleure qualité)"
            },
            pageOptions: "Options de pages",
            allPages: "Toutes les pages",
            selectedPages: "Pages sélectionnées",
            pageRangeDescription: "Entrez les numéros de page et/ou les plages de pages séparées par des virgules",
            pageRangeExample: "Exemple : 1,3,5-12"
        },
        moreTools: "Outils de Conversion Associés",
        expertTips: {
            title: "Conseils d’Experts",
            pdfToWord: [
                "Pour de meilleurs résultats, assurez-vous que votre PDF contient un texte clair et lisible par machine",
                "Activez l’OCR pour les documents numérisés ou les PDF basés sur des images",
                "Les mises en page complexes peuvent nécessiter des ajustements mineurs après conversion"
            ],
            pdfToExcel: [
                "Les tableaux avec des bordures claires se convertissent plus précisément",
                "Prétraitez les PDF numérisés avec l’OCR pour une meilleure extraction de données",
                "Vérifiez les formules des feuilles de calcul après conversion, car elles peuvent ne pas être transférées"
            ],
            generic: [
                "Des paramètres de qualité plus élevés entraînent des tailles de fichiers plus grandes",
                "Utilisez l’OCR pour les documents avec du texte numérisé ou des images contenant du texte",
                "Prévisualisez votre fichier après conversion pour garantir l’exactitude"
            ]
        },
        advantages: {
            title: "Avantages de Convertir {from} en {to}",
            pdfToWord: [
                "Modifiez et éditez le texte qui était verrouillé au format PDF",
                "Mettez à jour le contenu sans recréer tout le document",
                "Extrayez des informations pour une utilisation dans d’autres documents"
            ],
            pdfToExcel: [
                "Analysez et manipulez des données qui étaient sous forme PDF statique",
                "Créez des graphiques et effectuez des calculs avec les données extraites",
                "Mettez facilement à jour des rapports financiers ou des informations numériques"
            ],
            wordToPdf: [
                "Créez des documents universellement lisibles qui conservent leur formatage",
                "Protégez le contenu contre des modifications non désirées",
                "Assurez une apparence cohérente sur tous les appareils et plateformes"
            ],
            generic: [
                "Transformez votre document dans un format plus utile",
                "Accédez et utilisez le contenu dans des programmes prenant en charge le format cible",
                "Partagez des fichiers dans des formats que d’autres peuvent ouvrir facilement"
            ]
        }
    },

    // Section Fonctionnalités
    features: {
        title: "Fonctionnalités",
        description: "Tout ce dont vous avez besoin pour convertir et gérer vos fichiers PDF",
        documentFormats: {
            title: "Formats de Documents",
            description: "Convertissez en DOCX, DOC, RTF, ODT et plus encore avec une préservation parfaite du formatage et de la mise en page"
        },
        spreadsheets: {
            title: "Feuilles de Calcul",
            description: "Transformez les PDF en XLSX, CSV et autres formats de feuilles de calcul avec des structures de cellules appropriées"
        },
        images: {
            title: "Images",
            description: "Extrayez des images JPG et PNG de haute qualité de vos fichiers PDF avec contrôle de la résolution"
        },
        webFormats: {
            title: "Formats Web",
            description: "Convertissez en HTML et autres formats adaptés au web pour une publication en ligne"
        },
        ocrTech: {
            title: "Technologie OCR",
            description: "Extrayez le texte des documents numérisés avec une reconnaissance optique de caractères avancée"
        },
        batchProcessing: {
            title: "Traitement par Lots",
            description: "Convertissez plusieurs PDF à la fois pour gagner du temps avec notre traitement par lots efficace"
        }
    },

    // Section Appel à l’Action
    cta: {
        title: "Prêt à Convertir ?",
        description: "Transformez vos PDF dans n’importe quel format dont vous avez besoin, entièrement gratuitement.",
        startConverting: "Commencer à Convertir",
        exploreTools: "Explorer Tous les Outils"
    },

    // Page des Outils PDF
    pdfTools: {
        title: "Tous les Outils PDF",
        description: "Tout ce dont vous avez besoin pour travailler avec les PDF en un seul endroit",
        categories: {
            convertFromPdf: "Convertir depuis PDF",
            convertToPdf: "Convertir en PDF",
            basicTools: "Outils de Base",
            organizePdf: "Organiser PDF",
            pdfSecurity: "Sécurité PDF"
        }
    },

    // Descriptions des Outils
    toolDescriptions: {
        pdfToWord: "Convertissez facilement vos fichiers PDF en documents DOC et DOCX faciles à éditer.",
        pdfToPowerpoint: "Transformez vos fichiers PDF en diaporamas PPT et PPTX faciles à éditer.",
        pdfToExcel: "Extrayez les données directement des PDF dans des feuilles de calcul Excel en quelques secondes.",
        pdfToJpg: "Convertissez chaque page PDF en JPG ou extrayez toutes les images contenues dans un PDF.",
        pdfToPng: "Convertissez chaque page PDF en PNG ou extrayez toutes les images contenues dans un PDF.",
        pdfToHtml: "Convertissez des pages web HTML en PDF. Copiez et collez l’URL de la page.",
        wordToPdf: "Rendez les fichiers DOC et DOCX faciles à lire en les convertissant en PDF.",
        powerpointToPdf: "Rendez les diaporamas PPT et PPTX faciles à consulter en les convertissant en PDF.",
        excelToPdf: "Rendez les feuilles de calcul Excel faciles à lire en les convertissant en PDF.",
        jpgToPdf: "Convertissez les images JPG en PDF en quelques secondes. Ajustez facilement l’orientation et les marges.",
        pngToPdf: "Convertissez les images PNG en PDF en quelques secondes. Ajustez facilement l’orientation et les marges.",
        htmlToPdf: "Convertissez des pages web en PDF. Copiez et collez l’URL pour la convertir en PDF.",
        mergePdf: "Combinez les PDF dans l’ordre souhaité avec le fusionneur PDF le plus simple disponible.",
        splitPdf: "Divisez les fichiers PDF en plusieurs documents ou extrayez des pages spécifiques de votre PDF.",
        compressPdf: "Réduisez la taille des fichiers tout en optimisant la qualité maximale du PDF.",
        rotatePdf: "Faites pivoter vos PDF comme vous en avez besoin. Vous pouvez même faire pivoter plusieurs PDF à la fois !",
        watermark: "Ajoutez une image ou un texte en filigrane sur votre PDF en quelques secondes. Choisissez la typographie, la transparence et la position.",
        unlockPdf: "Supprimez la sécurité par mot de passe des PDF, vous donnant la liberté d’utiliser vos PDF comme vous le souhaitez.",
        protectPdf: "Protégez les fichiers PDF avec un mot de passe. Chiffrez les documents PDF pour empêcher tout accès non autorisé.",
        ocr: "Extrayez le texte des documents numérisés grâce à la reconnaissance optique de caractères."
    },
    splitPdf: {
        title: "Diviser PDF",
        description: "Divisez des fichiers PDF en plusieurs documents ou extrayez des pages spécifiques",
        howTo: {
            title: "Comment Diviser des Fichiers PDF",
            step1: {
                title: "Télécharger",
                description: "Téléchargez le fichier PDF que vous souhaitez diviser ou dont vous voulez extraire des pages"
            },
            step2: {
                title: "Choisir la Méthode de Division",
                description: "Sélectionnez comment vous voulez diviser votre PDF : par plages de pages, extraire chaque page, ou diviser toutes les N pages"
            },
            step3: {
                title: "Télécharger",
                description: "Téléchargez vos fichiers PDF divisés individuellement"
            }
        },
        options: {
            splitMethod: "Méthode de Division",
            byRange: "Diviser par plages de pages",
            extractAll: "Extraire toutes les pages en PDFs séparés",
            everyNPages: "Diviser toutes les N pages",
            everyNPagesNumber: "Nombre de pages par fichier",
            everyNPagesHint: "Chaque fichier de sortie contiendra ce nombre de pages",
            pageRanges: "Plages de Pages",
            pageRangesHint: "Entrez les plages de pages séparées par des virgules. Exemple : 1-5, 8, 11-13 créera 3 fichiers PDF"
        },
        splitting: "Division du PDF...",
        splitDocument: "Diviser le Document",
        splitSuccess: "PDF divisé avec succès !",
        splitSuccessDesc: "Votre PDF a été divisé en {count} fichiers séparés",
        results: {
            title: "Résultats de la Division PDF",
            part: "Partie",
            pages: "Pages",
            pagesCount: "pages"
        },
        faq: {
            title: "Questions Fréquemment Posées",
            q1: {
                question: "Que deviennent mes fichiers PDF après la division ?",
                answer: "Tous les fichiers téléchargés et générés sont automatiquement supprimés de nos serveurs après 24 heures pour votre confidentialité et sécurité."
            },
            q2: {
                question: "Y a-t-il une limite au nombre de pages que je peux diviser ?",
                answer: "La version gratuite permet de diviser des PDFs jusqu’à 100 pages. Pour des documents plus volumineux, envisagez notre plan premium."
            },
            q3: {
                question: "Puis-je extraire des pages spécifiques d’un PDF ?",
                answer: "Oui, vous pouvez utiliser l’option \"Diviser par plages de pages\" pour extraire des pages ou plages de pages spécifiques de votre document PDF."
            },
            q4: {
                question: "Puis-je réorganiser les pages pendant la division ?",
                answer: "Actuellement, l’outil de division conserve l’ordre original des pages. Pour réorganiser les pages, vous devrez utiliser notre outil de Fusion PDF avec les pages extraites."
            }
        },
        useCases: {
            title: "Utilisations Populaires de la Division PDF",
            chapters: {
                title: "Séparation des Chapitres",
                description: "Divisez de gros livres ou rapports en chapitres individuels pour une navigation et un partage plus faciles"
            },
            extract: {
                title: "Extraction de Pages",
                description: "Extrayez des pages spécifiques comme des formulaires, certificats ou sections importantes de documents plus longs"
            },
            remove: {
                title: "Supprimer des Pages",
                description: "Extrayez toutes les pages nécessaires et laissez de côté le contenu indésirable comme les publicités ou les pages blanches"
            },
            size: {
                title: "Réduction de Taille",
                description: "Divisez de gros PDFs en fichiers plus petits pour faciliter le partage par email ou applications de messagerie"
            }
        }
    },
    // Page Fusionner PDF
    mergePdf: {
        title: "Fusionner des Fichiers PDF",
        description: "Combinez plusieurs fichiers PDF en un seul document rapidement et facilement",
        howTo: {
            title: "Comment Fusionner des Fichiers PDF",
            step1: {
                title: "Télécharger les Fichiers",
                description: "Téléchargez les fichiers PDF que vous souhaitez combiner. Vous pouvez sélectionner plusieurs fichiers à la fois."
            },
            step2: {
                title: "Arranger l’Ordre",
                description: "Glissez-déposez pour réorganiser les fichiers dans l’ordre où vous voulez qu’ils apparaissent dans le PDF final."
            },
            step3: {
                title: "Télécharger",
                description: "Cliquez sur le bouton Fusionner les PDF et téléchargez votre fichier PDF combiné."
            }
        },
        faq: {
            title: "Questions Fréquemment Posées",
            q1: {
                question: "Y a-t-il une limite au nombre de PDF que je peux fusionner ?",
                answer: "Vous pouvez fusionner jusqu’à 20 fichiers PDF à la fois avec notre outil gratuit. Pour des lots plus importants, envisagez notre plan premium."
            },
            q2: {
                question: "Mes fichiers PDF resteront-ils privés ?",
                answer: "Oui, votre confidentialité est notre priorité. Tous les fichiers téléchargés sont automatiquement supprimés de nos serveurs après traitement."
            },
            q3: {
                question: "Puis-je fusionner des PDF protégés par mot de passe ?",
                answer: "Pour les PDF protégés par mot de passe, vous devrez d’abord les déverrouiller avec notre outil Déverrouiller PDF, puis les fusionner."
            }
        },
        relatedTools: "Explorer Plus d’Outils PDF",
        viewAllTools: "Voir Tous les Outils PDF",
        of: "de",
        files: "fichiers",
        filesToMerge: "Fichiers à Fusionner"
    },

    // Page OCR
    ocr: {
        title: "Extraction de Texte par OCR",
        description: "Extrayez le texte des PDF numérisés et des images grâce à une puissante technologie de reconnaissance optique de caractères",
        howTo: {
            title: "Comment Fonctionne l’Extraction de Texte par OCR",
            step1: {
                title: "Télécharger",
                description: "Téléchargez votre document PDF numérisé ou fichier PDF basé sur une image."
            },
            step2: {
                title: "Configurer l’OCR",
                description: "Sélectionnez la langue, la plage de pages et les options avancées pour de meilleurs résultats."
            },
            step3: {
                title: "Obtenir le Texte",
                description: "Copiez le texte extrait ou téléchargez-le sous forme de fichier texte pour une utilisation ultérieure."
            }
        },
        faq: {
            title: "Questions Fréquemment Posées",
            questions: {
                accuracy: {
                    question: "Quelle est la précision de l’extraction de texte par OCR ?",
                    answer: "Notre technologie OCR atteint généralement une précision de 90 à 99 % pour un texte clairement imprimé dans des documents bien numérisés. La précision peut diminuer avec des numérisations de mauvaise qualité, des polices inhabituelles ou des mises en page complexes."
                },
                languages: {
                    question: "Quelles langues sont prises en charge ?",
                    answer: "Nous prenons en charge plus de 100 langues, dont l’anglais, le français, l’allemand, l’espagnol, l’italien, le portugais, le chinois, le japonais, le coréen, le russe, l’arabe, l’hindi et bien d’autres."
                },
                recognition: {
                    question: "Pourquoi mon texte n’est-il pas reconnu correctement ?",
                    answer: "Plusieurs facteurs peuvent affecter la précision de l’OCR : la qualité du document, la résolution, le contraste, les mises en page complexes, l’écriture manuscrite, les polices inhabituelles ou le choix d’une langue incorrecte."
                },
                pageLimit: {
                    question: "Y a-t-il une limite au nombre de pages que je peux traiter ?",
                    answer: "Pour les utilisateurs gratuits, il y a une limite de 50 pages par PDF. Les utilisateurs premium peuvent traiter des PDF jusqu’à 500 pages."
                },
                security: {
                    question: "Mes données sont-elles sécurisées pendant le traitement OCR ?",
                    answer: "Oui, votre sécurité est notre priorité. Tous les fichiers téléchargés sont traités sur des serveurs sécurisés et automatiquement supprimés après traitement."
                }
            }
        },
        relatedTools: "Outils PDF Associés",
        processing: {
            title: "Traitement OCR",
            message: "Le traitement OCR peut prendre quelques minutes selon la taille et la complexité du document"
        },
        results: {
            title: "Texte Extrait",
            copy: "Copier",
            download: "Télécharger .txt"
        },
        languages: {
            english: "Anglais",
            french: "Français",
            german: "Allemand",
            spanish: "Espagnol",
            chinese: "Chinois",
            japanese: "Japonais",
            arabic: "Arabe",
            russian: "Russe"
        },
        whatIsOcr: {
            title: "Reconnaissance Optique de Caractères (OCR)",
            description: "Est une technologie qui convertit différents types de documents, tels que des documents papier numérisés, des fichiers PDF ou des images capturées par une caméra numérique, en données modifiables et recherchables.",
            explanation: "L’OCR analyse la structure de l’image du document, identifie les caractères et les éléments textuels, puis les convertit en un format lisible par machine.",
            extractionList: {
                scannedPdfs: "PDF numérisés où le texte existe sous forme d’image",
                imageOnlyPdfs: "PDF uniquement composés d’images sans couche de texte sous-jacente",
                embeddedImages: "PDF contenant des images intégrées avec du texte",
                textCopyingIssues: "Documents où la copie directe du texte ne fonctionne pas"
            }
        },
        whenToUse: {
            title: "Quand Utiliser l’Extraction de Texte par OCR",
            idealFor: "Idéal pour :",
            idealForList: {
                scannedDocuments: "Documents numérisés enregistrés en PDF",
                oldDocuments: "Anciens documents sans couche de texte numérique",
                textSelectionIssues: "PDF où la sélection/copie de texte ne fonctionne pas",
                textInImages: "Images contenant du texte à extraire",
                searchableArchives: "Création d’archives recherchables à partir de documents numérisés"
            },
            notNecessaryFor: "Non nécessaire pour :",
            notNecessaryForList: {
                digitalPdfs: "PDF numériques natifs où le texte peut déjà être sélectionné",
                createdDigitally: "PDF créés directement à partir de documents numériques",
                copyPasteAvailable: "Documents où vous pouvez déjà copier et coller le texte",
                formatPreservation: "Fichiers nécessitant la préservation du format (utilisez plutôt notre conversion PDF vers DOCX)"
            }
        },
        limitations: {
            title: "Limites et Conseils OCR",
            description: "Bien que notre technologie OCR soit puissante, il y a certaines limites à connaître :",
            factorsAffecting: "Facteurs affectant la précision de l’OCR :",
            factorsList: {
                documentQuality: "Qualité du document (résolution, contraste)",
                complexLayouts: "Mises en page et formatages complexes",
                handwrittenText: "Texte manuscrit (reconnaissance limitée)",
                specialCharacters: "Caractères spéciaux et symboles",
                multipleLanguages: "Plusieurs langues dans un même document"
            },
            tipsForBest: "Conseils pour de meilleurs résultats :",
            tipsList: {
                highQualityScans: "Utilisez des numérisations de haute qualité (300 DPI ou plus)",
                correctLanguage: "Sélectionnez la langue correcte pour votre document",
                enhanceScannedImages: "Activez « Améliorer les images numérisées » pour une meilleure précision",
                smallerPageRanges: "Traitez des plages de pages plus petites pour les grands documents",
                reviewText: "Vérifiez et corrigez le texte extrait après coup"
            }
        },
        options: {
            scope: "Pages à Extraire",
            all: "Toutes les Pages",
            custom: "Pages Spécifiques",
            pages: "Numéros de Pages",
            pagesHint: "Ex. : 1,3,5-9",
            enhanceScanned: "Améliorer les images numérisées",
            enhanceScannedHint: "Prétraitez les images pour améliorer la précision de l’OCR (recommandé pour les documents numérisés)",
            preserveLayout: "Préserver la mise en page",
            preserveLayoutHint: "Essayez de maintenir la mise en page originale avec des paragraphes et des sauts de ligne"
        }
    },

    // Page Protéger PDF
    protectPdf: {
        title: "Protéger un PDF par Mot de Passe",
        description: "Sécurisez vos documents PDF avec une protection par mot de passe et des permissions d’accès personnalisées",
        howTo: {
            title: "Comment Protéger Votre PDF",
            step1: {
                title: "Télécharger",
                description: "Téléchargez le fichier PDF que vous souhaitez protéger avec un mot de passe."
            },
            step2: {
                title: "Définir les Options de Sécurité",
                description: "Créez un mot de passe et personnalisez les permissions pour l’impression, la copie et l’édition."
            },
            step3: {
                title: "Télécharger",
                description: "Téléchargez votre fichier PDF protégé par mot de passe, prêt pour un partage sécurisé."
            }
        },
        why: {
            title: "Pourquoi Protéger Vos PDF ?",
            confidentiality: {
                title: "Confidentialité",
                description: "Assurez-vous que seules les personnes autorisées avec le mot de passe peuvent ouvrir et consulter vos documents sensibles."
            },
            controlledAccess: {
                title: "Accès Contrôlé",
                description: "Définissez des permissions spécifiques pour déterminer ce que les destinataires peuvent faire avec votre document, comme l’impression ou l’édition."
            },
            authorizedDistribution: {
                title: "Distribution Autorisée",
                description: "Contrôlez qui peut accéder à votre document lors du partage de contrats, de recherches ou de propriété intellectuelle."
            },
            documentExpiration: {
                title: "Expiration des Documents",
                description: "La protection par mot de passe ajoute une couche supplémentaire de sécurité pour les documents sensibles au temps qui ne devraient pas être accessibles indéfiniment."
            }
        },
        security: {
            title: "Comprendre la Sécurité PDF",
            passwords: {
                title: "Mot de Passe Utilisateur vs Mot de Passe Propriétaire",
                user: "Mot de Passe Utilisateur : Requis pour ouvrir le document. Sans ce mot de passe, personne ne peut voir le contenu.",
                owner: "Mot de Passe Propriétaire : Contrôle les permissions. Avec notre outil, nous définissons les deux mots de passe comme identiques pour plus de simplicité."
            },
            encryption: {
                title: "Niveaux de Chiffrement",
                aes128: "AES 128 bits : Offre une bonne sécurité et est compatible avec Acrobat Reader 7 et versions ultérieures.",
                aes256: "AES 256 bits : Offre une sécurité plus forte mais nécessite Acrobat Reader X (10) ou versions ultérieures."
            },
            permissions: {
                title: "Contrôles des Permissions",
                printing: {
                    title: "Impression",
                    description: "Contrôle si le document peut être imprimé et à quel niveau de qualité."
                },
                copying: {
                    title: "Copie de Contenu",
                    description: "Contrôle si le texte et les images peuvent être sélectionnés et copiés dans le presse-papiers."
                },
                editing: {
                    title: "Édition",
                    description: "Contrôle les modifications du document, y compris les annotations, le remplissage de formulaires et les changements de contenu."
                }
            }
        },
        form: {
            password: "Mot de Passe",
            confirmPassword: "Confirmer le Mot de Passe",
            encryptionLevel: "Niveau de Chiffrement",
            permissions: {
                title: "Permissions d’Accès",
                allowAll: "Tout Autoriser (Mot de Passe pour Ouvrir Uniquement)",
                restricted: "Accès Restreint (Permissions Personnalisées)"
            },
            allowedActions: "Actions Autorisées :",
            allowPrinting: "Autoriser l’Impression",
            allowCopying: "Autoriser la Copie de Texte et d’Images",
            allowEditing: "Autoriser l’Édition et les Annotations"
        },
        bestPractices: {
            title: "Meilleures Pratiques de Protection par Mot de Passe",
            dos: "À Faire",
            donts: "À Ne Pas Faire",
            dosList: [
                "Utilisez des mots de passe forts et uniques avec un mélange de lettres, chiffres et caractères spéciaux",
                "Stockez les mots de passe en toute sécurité dans un gestionnaire de mots de passe",
                "Partagez les mots de passe via des canaux sécurisés séparés du PDF",
                "Utilisez un chiffrement 256 bits pour les documents très sensibles"
            ],
            dontsList: [
                "Utilisez des mots de passe simples et faciles à deviner comme « motdepasse123 » ou « 1234 »",
                "Envoyez le mot de passe dans le même courriel que le PDF",
                "Utilisez le même mot de passe pour tous vos PDF protégés",
                "Comptez uniquement sur la protection par mot de passe pour des informations extrêmement sensibles"
            ]
        },
        faq: {
            encryptionDifference: {
                question: "Quelle est la différence entre les niveaux de chiffrement ?",
                answer: "Nous proposons un chiffrement AES 128 bits et 256 bits. Le 128 bits est compatible avec les anciens lecteurs PDF (Acrobat 7 et ultérieur), tandis que le 256 bits offre une sécurité plus forte mais nécessite des lecteurs plus récents (Acrobat X et ultérieur)."
            },
            removeProtection: {
                question: "Puis-je supprimer la protection par mot de passe plus tard ?",
                answer: "Oui, vous pouvez utiliser notre outil Déverrouiller PDF pour supprimer la protection par mot de passe de vos fichiers PDF, mais vous devrez connaître le mot de passe actuel pour le faire."
            },
            securityStrength: {
                question: "Quelle est la robustesse de la protection par mot de passe ?",
                answer: "Notre outil utilise le chiffrement AES standard de l’industrie. La sécurité dépend de la force de votre mot de passe et du niveau de chiffrement choisi. Nous recommandons d’utiliser des mots de passe forts et uniques avec un mélange de caractères."
            },
            contentQuality: {
                question: "La protection par mot de passe affectera-t-elle le contenu ou la qualité du PDF ?",
                answer: "Non, la protection par mot de passe ajoute uniquement de la sécurité à votre document et n’altère en aucune façon le contenu, la mise en page ou la qualité de votre PDF."
            },
            batchProcessing: {
                question: "Puis-je protéger plusieurs PDF à la fois ?",
                answer: "Actuellement, notre outil traite un PDF à la fois. Pour le traitement par lots de plusieurs fichiers, envisagez notre API ou nos solutions premium."
            }
        },
        protecting: "Protection en cours...",
        protected: "PDF protégé avec succès !",
        protectedDesc: "Votre fichier PDF a été chiffré et protégé par mot de passe."
    },

    // Page Filigrane
    watermark: {
        title: "Ajouter un Filigrane au PDF",
        description: "Protégez vos documents en ajoutant des filigranes textuels personnalisés",
        howTo: {
            title: "Comment Ajouter un Filigrane",
            step1: {
                title: "Télécharger",
                description: "Téléchargez le fichier PDF auquel vous souhaitez ajouter un filigrane. Vous pouvez prévisualiser son apparence avant de l’appliquer."
            },
            step2: {
                title: "Personnaliser",
                description: "Définissez le texte, la position, la taille, la couleur et l’opacité de votre filigrane selon vos besoins."
            },
            step3: {
                title: "Télécharger",
                description: "Traitez et téléchargez votre fichier PDF avec filigrane prêt pour la distribution."
            }
        },
        form: {
            text: "Texte du Filigrane",
            textColor: "Couleur du Texte",
            opacity: "Opacité",
            size: "Taille",
            rotation: "Rotation",
            position: "Position",
            pages: "Pages à Marquer",
            allPages: "Toutes les pages",
            specificPages: "Pages spécifiques",
            pageNumbers: "Numéros de Pages",
            pageNumbersHint: "Entrez les numéros de pages séparés par des virgules (ex. : 1,3,5,8)"
        },
        positions: {
            topLeft: "Haut Gauche",
            topCenter: "Haut Centre",
            topRight: "Haut Droite",
            centerLeft: "Centre Gauche",
            center: "Centre",
            centerRight: "Centre Droite",
            bottomLeft: "Bas Gauche",
            bottomCenter: "Bas Centre",
            bottomRight: "Bas Droite"
        },
        preview: {
            title: "Aperçu du Filigrane",
            note: "Ceci est un aperçu simplifié. Le résultat final peut varier."
        },
        faq: {
            title: "Questions Fréquemment Posées",
            q1: {
                question: "Quel type de filigranes puis-je ajouter ?",
                answer: "Notre outil prend en charge les filigranes textuels avec un contenu, une position, une taille, une couleur, une opacité et une rotation personnalisables. Vous pouvez ajouter des filigranes comme « CONFIDENTIEL », « BROUILLON » ou le nom de votre entreprise."
            },
            q2: {
                question: "Puis-je mettre un filigrane uniquement sur certaines pages de mon PDF ?",
                answer: "Oui, vous pouvez choisir de mettre un filigrane sur toutes les pages ou spécifier quelles pages doivent avoir le filigrane en entrant leurs numéros de page."
            },
            q3: {
                question: "Les filigranes sont-ils permanents ?",
                answer: "Oui, les filigranes sont intégrés de manière permanente dans le document PDF. Cependant, ils peuvent être placés avec une opacité variable pour équilibrer visibilité et lisibilité du contenu."
            },
            q4: {
                question: "L’ajout d’un filigrane affectera-t-il la qualité du fichier ?",
                answer: "Non, notre outil d’ajout de filigrane n’ajoute que le texte spécifié sans affecter significativement la qualité ou la taille du document original."
            }
        },
        addingWatermark: "Ajout du filigrane à votre PDF...",
        watermarkSuccess: "Filigrane ajouté avec succès !",
        watermarkSuccessDesc: "Votre fichier PDF a été marqué et est prêt à être téléchargé."
    },

    // Compresser PDF
    compressPdf: {
        title: "Compresser PDF",
        description: "Réduisez la taille des fichiers PDF tout en maintenant la qualité",
        quality: {
            high: "Haute Qualité",
            highDesc: "Compression minimale, meilleure qualité visuelle",
            balanced: "Équilibré",
            balancedDesc: "Bonne compression avec une perte visuelle minimale",
            maximum: "Compression Maximale",
            maximumDesc: "Ratio de compression le plus élevé, peut réduire la qualité visuelle"
        },
        processing: {
            title: "Options de Traitement",
            processAllTogether: "Traiter tous les fichiers simultanément",
            processSequentially: "Traiter les fichiers un par un"
        },
        status: {
            uploading: "Téléchargement...",
            compressing: "Compression...",
            completed: "Terminé",
            failed: "Échoué"
        },
        results: {
            title: "Résumé des Résultats de Compression",
            totalOriginal: "Total Original",
            totalCompressed: "Total Compressé",
            spaceSaved: "Espace Économisé",
            averageReduction: "Réduction Moyenne",
            downloadAll: "Télécharger Tous les Fichiers Compressés en ZIP"
        },
        of: "de",
        files: "fichiers",
        filesToCompress: "Fichiers à Compresser",
        compressAll: "Compresser les Fichiers",
        qualityPlaceholder: "Sélectionner la qualité de compression",
        reduction: "réduction",
        zipDownloadSuccess: "Tous les fichiers compressés ont été téléchargés avec succès",
        overallProgress: "Progrès Global",
        reducedBy: "a été réduit de",
        success: "Compression réussie",
        error: {
            noFiles: "Veuillez sélectionner des fichiers PDF à compresser",
            noCompressed: "Aucun fichier compressé disponible pour le téléchargement",
            downloadZip: "Échec du téléchargement de l’archive ZIP",
            generic: "Échec de la compression du fichier PDF",
            unknown: "Une erreur inconnue s’est produite",
            failed: "Échec de la compression de votre fichier"
        }
    },

    // Déverrouiller PDF
    unlockPdf: {
        title: "Déverrouiller des Fichiers PDF",
        description: "Supprimez la protection par mot de passe de vos documents PDF pour un accès sans restriction",
        howTo: {
            title: "Comment Déverrouiller des Fichiers PDF",
            upload: {
                title: "Télécharger",
                description: "Téléchargez le fichier PDF protégé par mot de passe que vous souhaitez déverrouiller."
            },
            enterPassword: {
                title: "Entrer le Mot de Passe",
                description: "Si nécessaire, entrez le mot de passe actuel qui protège le PDF."
            },
            download: {
                title: "Télécharger",
                description: "Téléchargez votre fichier PDF déverrouillé sans restrictions de mot de passe."
            }
        },
        faq: {
            passwordRequired: {
                question: "Dois-je connaître le mot de passe actuel ?",
                answer: "Oui, pour déverrouiller un PDF, vous devez connaître le mot de passe actuel. Notre outil ne peut pas contourner ou craquer les mots de passe ; il supprime simplement la protection après que vous avez fourni le mot de passe correct."
            },
            security: {
                question: "Le processus de déverrouillage est-il sécurisé ?",
                answer: "Oui, tout le traitement se fait sur nos serveurs sécurisés. Nous ne stockons pas vos PDF ni vos mots de passe. Les fichiers sont automatiquement supprimés après traitement, et toutes les données transférées sont chiffrées."
            },
            restrictions: {
                question: "Puis-je déverrouiller un PDF avec des restrictions de propriétaire mais sans mot de passe d’ouverture ?",
                answer: "Oui, certains PDF ne nécessitent pas de mot de passe pour être ouverts mais ont des restrictions sur l’impression, l’édition ou la copie. Notre outil peut également supprimer ces restrictions. Téléchargez simplement le fichier sans entrer de mot de passe."
            },
            quality: {
                question: "Le déverrouillage affectera-t-il la qualité ou le contenu du PDF ?",
                answer: "Non, notre processus de déverrouillage supprime uniquement les paramètres de sécurité. Il n’altère en aucune façon le contenu, le formatage ou la qualité de votre fichier PDF."
            }
        },
        passwordProtected: "Protégé par Mot de Passe",
        notPasswordProtected: "Non Protégé par Mot de Passe",
        unlocking: "Déverrouillage de votre PDF...",
        unlockSuccess: "PDF déverrouillé avec succès !",
        unlockSuccessDesc: "Votre fichier PDF a été déverrouillé et est prêt à être téléchargé."
    },

    // Téléchargeur de Fichiers
    fileUploader: {
        dropHere: "Déposez votre fichier ici",
        dropHereaDesc: "Déposez votre fichier PDF ici ou cliquez pour parcourir",
        dragAndDrop: "Glissez et déposez votre fichier",
        browse: "Parcourir les Fichiers",
        dropHereDesc: "Déposez votre fichier ici ou cliquez pour parcourir.",
        maxSize: "La taille maximale est de 100 Mo.",
        remove: "Supprimer",
        inputFormat: "Format d’Entrée",
        outputFormat: "Format de Sortie",
        ocr: "Activer l’OCR",
        ocrDesc: "Extrayez le texte des documents numérisés grâce à la reconnaissance optique de caractères",
        quality: "Qualité",
        low: "Basse",
        high: "Haute",
        password: "Mot de Passe",
        categories: {
            documents: "Documents",
            spreadsheets: "Feuilles de Calcul",
            presentations: "Présentations",
            images: "Images"
        },
        converting: "Conversion en cours",
        successful: "Conversion Réussie",
        successDesc: "Votre fichier a été converti avec succès et est maintenant prêt à être téléchargé.",
        download: "Télécharger le Fichier Converti",
        filesSecurity: "Les fichiers sont automatiquement supprimés après 24 heures pour des raisons de confidentialité et de sécurité."
    },

    // Éléments d’Interface Communs
    ui: {
        upload: "Télécharger",
        download: "Télécharger",
        cancel: "Annuler",
        confirm: "Confirmer",
        save: "Enregistrer",
        next: "Suivant",
        previous: "Précédent",
        finish: "Terminer",
        processing: "Traitement en cours...",
        success: "Succès !",
        error: "Erreur",
        copy: "Copier",
        remove: "Supprimer",
        browse: "Parcourir",
        dragDrop: "Glisser & Déposer",
        or: "ou",
        close: "Fermer",
        apply: "Appliquer",
        loading: "Chargement...",
        preview: "Aperçu",
        reupload: "Télécharger un Autre Fichier",
        continue: "Continuer",
        skip: "Passer",
        retry: "Réessayer",
        addMore: "Ajouter Plus",
        clear: "Effacer",
        clearAll: "Tout Effacer",
        done: "Terminé",
        extract: "extraire",
        new: "Nouveau !",
        phone: "Téléphone",
        address: "Adresse",
        filesSecurity: "Les fichiers sont automatiquement supprimés après 24 heures pour des raisons de confidentialité et de sécurité."
    },

    contact: {
        title: "Contactez-Nous",
        description: "Des questions ou des commentaires ? Nous serions ravis d’avoir de vos nouvelles.",
        form: {
            title: "Envoyez-Nous un Message",
            description: "Remplissez le formulaire ci-dessous et nous vous répondrons dès que possible.",
            name: "Votre Nom",
            email: "Adresse Email",
            subject: "Sujet",
            message: "Message",
            submit: "Envoyer le Message"
        },
        success: "Message Envoyé avec Succès",
        successDesc: "Merci de nous avoir contactés. Nous vous répondrons dès que possible.",
        error: "Échec de l’Envoi du Message",
        errorDesc: "Une erreur s’est produite lors de l’envoi de votre message. Veuillez réessayer plus tard.",
        validation: {
            name: "Le nom est requis",
            email: "Veuillez entrer une adresse email valide",
            subject: "Le sujet est requis",
            message: "Le message est requis"
        },
        supportHours: {
            title: "Heures de Support",
            description: "Quand nous sommes disponibles pour vous aider",
            weekdays: "Lundi - Vendredi",
            weekdayHours: "9h00 - 18h00 HNE",
            saturday: "Samedi",
            saturdayHours: "10h00 - 16h00 HNE",
            sunday: "Dimanche",
            closed: "Fermé"
        },
        faq: {
            title: "Questions Fréquemment Posées",
            responseTime: {
                question: "Combien de temps faut-il pour obtenir une réponse ?",
                answer: "Nous visons à répondre à toutes les demandes dans un délai de 24 à 48 heures ouvrables. Pendant les périodes de pointe, cela peut prendre jusqu’à 72 heures."
            },
            technicalSupport: {
                question: "Puis-je obtenir un support pour un problème technique ?",
                answer: "Oui, notre équipe de support technique est disponible pour vous aider avec tout problème que vous rencontrez avec nos outils PDF."
            },
            phoneSupport: {
                question: "Proposez-vous un support téléphonique ?",
                answer: "Nous offrons un support téléphonique pendant nos heures de support indiquées. Pour une assistance immédiate, le courriel est souvent le moyen le plus rapide d’obtenir de l’aide."
            },
            security: {
                question: "Mes informations personnelles sont-elles sécurisées ?",
                answer: "Nous prenons votre vie privée au sérieux. Toutes les communications sont chiffrées, et nous ne partageons jamais vos informations personnelles avec des tiers."
            }
        }
    },
    // Page À Propos
    about: {
        title: "À Propos de ScanPro",
        mission: {
            title: "Notre Mission",
            description: "Nous croyons en la nécessité de rendre la gestion des PDF accessible à tous. Nos outils en ligne vous aident à travailler avec les PDF rapidement et facilement, sans logiciel à installer."
        },
        team: {
            title: "Notre Équipe",
            description: "Nous sommes une équipe dédiée de développeurs et de designers passionnés par la création d’outils PDF simples mais puissants."
        },
        technology: {
            title: "Notre Technologie",
            description: "Notre plateforme utilise une technologie de pointe pour fournir une conversion, une édition et une sécurité des PDF de haute qualité tout en gardant vos données en sécurité."
        }
    },

    // Page Tarification
    pricing: {
        title: "Tarification Simple et Transparente",
        description: "Choisissez le plan qui correspond à vos besoins",
        free: {
            title: "Gratuit",
            description: "Tâches PDF de base pour les utilisateurs occasionnels",
            features: [
                "Convertir jusqu’à 3 fichiers/jour",
                "PDF vers Word, Excel, PowerPoint",
                "Compression de base",
                "Fusionner jusqu’à 5 PDF",
                "Ajouter des filigranes simples",
                "OCR standard"
            ]
        },
        pro: {
            title: "Pro",
            description: "Plus de puissance pour les utilisateurs réguliers de PDF",
            features: [
                "Conversions illimitées",
                "Traitement prioritaire",
                "Compression avancée",
                "Fusionner des PDF illimités",
                "Filigranes personnalisés",
                "OCR avancé avec plus de 100 langues",
                "Traitement par lots",
                "Sans publicités"
            ]
        },
        business: {
            title: "Entreprise",
            description: "Solution complète pour les équipes",
            features: [
                "Tout dans le plan Pro",
                "Plusieurs membres d’équipe",
                "Accès API",
                "Conformité RGPD",
                "Support dédié",
                "Analyse d’utilisation",
                "Options de personnalisation de marque"
            ]
        },
        monthly: "Mensuel",
        annually: "Annuel",
        savePercent: "Économisez 20 %",
        currentPlan: "Plan Actuel",
        upgrade: "Mettre à Niveau Maintenant",
        getStarted: "Commencer",
        contact: "Contacter les Ventes"
    },

    // Pages Termes et Confidentialité
    legal: {
        termsTitle: "Conditions de Service",
        privacyTitle: "Politique de Confidentialité",
        lastUpdated: "Dernière Mise à Jour",
        introduction: {
            title: "Introduction",
            description: "Veuillez lire attentivement ces conditions avant d’utiliser notre service."
        },
        dataUse: {
            title: "Comment Nous Utilisons Vos Données",
            description: "Nous traitons vos fichiers uniquement pour fournir le service que vous avez demandé. Tous les fichiers sont automatiquement supprimés après 24 heures."
        },
        cookies: {
            title: "Cookies et Suivi",
            description: "Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic du site web."
        },
        rights: {
            title: "Vos Droits",
            description: "Vous avez le droit d’accéder, de corriger ou de supprimer vos informations personnelles."
        }
    },

    // Pages d’Erreur
    error: {
        notFound: "Page Non Trouvée",
        notFoundDesc: "Désolé, nous n’avons pas pu trouver la page que vous cherchez.",
        serverError: "Erreur de Serveur",
        serverErrorDesc: "Désolé, quelque chose s’est mal passé sur notre serveur. Veuillez réessayer plus tard.",
        goHome: "Retourner à l’Accueil",
        tryAgain: "Réessayer"
    },
    universalCompressor: {
        title: "Compresseur de fichiers universel",
        description: "Compressez des PDF, images et documents Office tout en maintenant la qualité",
        dropHereDesc: "Glissez et déposez les fichiers ici (PDF, JPG, PNG, DOCX, PPTX, XLSX)",
        filesToCompress: "Fichiers à compresser",
        compressAll: "Compresser tous les fichiers",
        results: {
            title: "Résultats de la compression",
            downloadAll: "Télécharger tous les fichiers compressés"
        },
        fileTypes: {
            pdf: "Document PDF",
            image: "Image",
            office: "Document Office",
            unknown: "Fichier inconnu"
        },
        howTo: {
            title: "Comment compresser des fichiers",
            step1: {
                title: "Télécharger des fichiers",
                description: "Téléchargez les fichiers que vous souhaitez compresser"
            },
            step2: {
                title: "Choisir la qualité",
                description: "Sélectionnez votre niveau de compression préféré"
            },
            step3: {
                title: "Télécharger",
                description: "Cliquez sur compresser et téléchargez vos fichiers compressés"
            }
        },
        faq: {
            compressionRate: {
                question: "De combien les fichiers peuvent-ils être compressés ?",
                answer: "Les taux de compression varient selon le type de fichier et le contenu. Les PDF sont généralement compressés de 20 à 70 %, les images de 30 à 80 % et les documents Office de 10 à 50 %."
            },
            quality: {
                question: "La compression affectera-t-elle la qualité de mes fichiers ?",
                answer: "Nos algorithmes de compression équilibrent la réduction de taille avec la préservation de la qualité. Le réglage 'Haute qualité' maintient une qualité visuelle presque identique."
            },
            sizeLimit: {
                question: "Y a-t-il une limite de taille de fichier ?",
                answer: "Oui, vous pouvez compresser des fichiers jusqu'à 100 Mo chacun."
            }
        }
    },
    imageTools: {
        title: "Outils d'Image",
        description: "Outils en ligne gratuits pour convertir, éditer et transformer vos images",
        headerSection: "Outils de Traitement d'Images",
        headerDescription: "Outils en ligne gratuits pour convertir, transformer et éditer vos images",
        supportedFormats: "Formats Pris en Charge",
        howToUse: {
            title: "Comment Utiliser Nos Outils d'Image",
            step1: {
                title: "Sélectionner un Outil",
                description: "Choisissez l'outil de traitement d'image dont vous avez besoin parmi notre large sélection."
            },
            step2: {
                title: "Télécharger Votre Image",
                description: "Téléchargez l'image que vous souhaitez éditer. Nous prenons en charge les formats PNG, JPG et WebP."
            },
            step3: {
                title: "Télécharger",
                description: "Éditez votre image et téléchargez le résultat en un seul clic."
            }
        },
        noiseGenerator: {
            title: "Ajouter du Bruit à un PNG",
            description: "Ajoutez des effets de grain de film ou de bruit à vos images PNG pour un design artistique",
            toolTitle: "Générateur de Bruit PNG",
            toolDescription: "Téléchargez une image PNG pour ajouter des effets de bruit ou de grain.",
            options: {
                noiseAmount: "Quantité de Bruit",
                noiseAmountHint: "Des valeurs plus élevées génèrent un bruit plus perceptible. Pour des effets subtils, utilisez des valeurs inférieures à 30 %.",
                noiseType: "Type de Bruit",
                noiseTypeHint: "Le bruit gaussien ajoute un grain subtil, tandis que Salt & Pepper ajoute des pixels blancs et noirs aléatoires.",
                gaussianNoise: "Gaussien (Uniforme)",
                saltPepperNoise: "Salt & Pepper (Éclaboussé)",
                monochrome: "Bruit Monochrome",
                monochromeHint: "S'il est activé, le bruit sera uniquement en noir et blanc. S'il est désactivé, un bruit coloré sera utilisé."
            },
            why: {
                title: "Pourquoi Ajouter du Bruit aux Images ?",
                description: "Ajouter du bruit ou du grain aux images peut servir plusieurs objectifs artistiques et pratiques :",
                reasons: [
                    "Créer une esthétique vintage ou cinématographique",
                    "Ajouter de la texture à des images plates ou d'apparence numérique",
                    "Réduire le banding dans les zones de dégradé de couleur",
                    "Créer des effets usés ou vieillis",
                    "Ajouter de l'intérêt visuel à des designs simples ou minimalistes",
                    "Simuler une photographie en basse lumière"
                ]
            },
            types: {
                title: "Types d'Effets de Bruit",
                gaussian: {
                    title: "Bruit Gaussien",
                    description: "Le bruit gaussien crée un grain uniforme semblable à celui d'un film en ajoutant des variations aléatoires aux valeurs des pixels. La distribution suit une courbe normale (gaussienne) et produit un effet naturel, semblable au grain d'un film."
                },
                saltPepper: {
                    title: "Bruit Salt & Pepper",
                    description: "Ce type de bruit ajoute des pixels blancs et noirs aléatoires à l'image, créant un effet éclaboussé. Il ressemble à l'apparence de petites particules de poussière ou de défauts et offre un aspect plus rugueux et texturé."
                }
            },
            tips: {
                title: "Conseils pour de Meilleurs Résultats",
                tips: [
                    "Pour des effets de grain de film subtils, utilisez un bruit gaussien avec une intensité de 10-20 %",
                    "Le bruit monochrome ressemble davantage au grain de film classique",
                    "Le bruit Salt & Pepper à faible valeur (5-15 %) peut ajouter une texture intéressante aux zones de couleur unie",
                    "Le bruit coloré peut apporter une esthétique unique aux images avec des palettes de couleurs limitées",
                    "Des quantités de bruit plus élevées (50 %+) créent des effets stylisés plus dramatiques",
                    "Pour des effets photo vintage, combinez le bruit avec une teinte sépia ou délavée"
                ]
            }
        },
        makeTransparent: {
            title: "Rendre un PNG Transparent",
            description: "Remplacez n'importe quelle couleur dans votre image PNG par de la transparence",
            toolTitle: "Rendre un PNG Transparent",
            toolDescription: "Téléchargez une image PNG et sélectionnez la couleur que vous souhaitez rendre transparente.",
            options: {
                color: "Couleur à rendre transparente :",
                colorPickerHint: "Cliquez sur le carré pour utiliser le sélecteur de couleur ou entrez un code couleur hexadécimal (par exemple, #ff0000)"
            },
            how: {
                title: "Comment Rendre un PNG Transparent",
                description: "Cet outil vous aide à créer des PNG transparents en supprimant des couleurs spécifiques de votre image. Cela est particulièrement utile pour :",
                uses: [
                    "Supprimer les fonds blancs des logos",
                    "Créer des images de produits avec un fond transparent",
                    "Préparer des graphiques pour la conception web où la transparence est nécessaire",
                    "Créer des superpositions pour des présentations ou du matériel marketing"
                ]
            },
            tips: {
                title: "Conseils pour de Meilleurs Résultats",
                choosing: {
                    title: "Choisir les Couleurs",
                    description: "Pour de meilleurs résultats, sélectionnez des couleurs qui contrastent avec les éléments que vous souhaitez conserver. L'outil ajuste les couleurs dans une petite plage de tolérance."
                },
                complex: {
                    title: "Images Complexes",
                    description: "Pour les images avec des dégradés ou des ombres, vous devrez peut-être éditer l'image plusieurs fois avec différentes sélections de couleur."
                }
            }
        },
        changeColors: {
            title: "Changer les Couleurs dans un PNG",
            description: "Remplacez des couleurs spécifiques dans vos images PNG par de nouvelles couleurs",
            toolTitle: "Changeur de Couleurs PNG",
            toolDescription: "Téléchargez une image PNG pour changer des couleurs spécifiques dans celle-ci.",
            options: {
                mappings: "Mappage des Couleurs",
                addColor: "Ajouter une Couleur",
                sourceColor: "Couleur Source",
                targetColor: "Couleur Cible",
                tolerance: "Tolérance de Correspondance des Couleurs",
                toleranceHint: "Des valeurs plus élevées ajustent une gamme plus large de couleurs similaires. Des valeurs plus faibles nécessitent une correspondance de couleur plus précise."
            },
            how: {
                title: "Comment Changer les Couleurs dans les Images PNG",
                steps: [
                    "Téléchargez votre image PNG",
                    "Sélectionnez la couleur à remplacer en cliquant sur le sélecteur de couleur ou en entrant un code hexadécimal",
                    "Choisissez la nouvelle couleur qui remplacera celle sélectionnée",
                    "Ajustez la tolérance pour contrôler la précision de la correspondance des couleurs",
                    "Ajoutez d'autres mappages de couleurs si nécessaire (jusqu'à 5 paires de couleurs)",
                    "Cliquez sur le bouton 'Traiter l'Image' pour appliquer vos modifications"
                ]
            },
            uses: {
                title: "Que Pouvez-Vous Faire avec Cet Outil",
                description: "L'outil de changement de couleur est utile pour divers besoins d'édition d'image :",
                uses: [
                    "Changer le schéma de couleur des icônes ou graphiques",
                    "Ajuster les couleurs d'une œuvre d'art aux couleurs de votre marque",
                    "Créer des variations de la même image avec différents thèmes de couleur",
                    "Corriger ou ajuster les couleurs dans des cliparts et illustrations",
                    "Changer les couleurs de fond ou de premier plan sans logiciel d'édition complexe",
                    "Créer des versions saisonnières ou thématiques de vos images"
                ]
            },
            tips: {
                title: "Conseils pour de Meilleurs Résultats",
                tips: [
                    "Pour un remplacement de couleur plus précis, utilisez une valeur de tolérance plus basse (10-20)",
                    "Pour remplacer des teintes similaires, utilisez une valeur de tolérance plus élevée (30-50)",
                    "Cet outil fonctionne mieux avec des images ayant des zones de couleur unie comme les logos, cliparts et illustrations",
                    "Les photos et images avec dégradés peuvent ne pas donner des résultats idéaux",
                    "La transparence PNG est maintenue pendant le remplacement de couleur",
                    "Éditez une couleur à la fois pour des changements complexes"
                ]
            }
        },
        changeTone: {
            title: "Changer le Ton d'un PNG",
            description: "Appliquez un ton ou une teinte à vos images PNG pour des effets artistiques",
            toolTitle: "Changeur de Ton PNG",
            toolDescription: "Téléchargez une image PNG pour appliquer un effet de ton de couleur.",
            options: {
                preset: "Préréglage de Ton",
                presetHint: "Choisissez un préréglage ou sélectionnez 'Couleur Personnalisée' pour définir votre propre ton",
                custom: "Couleur Personnalisée",
                sepia: "Sépia",
                coolBlue: "Bleu Froid",
                forestGreen: "Vert Forêt",
                warmRed: "Rouge Chaud",
                richPurple: "Pourpre Riche",
                cyan: "Cyan",
                vintage: "Vintage",
                toneColor: "Couleur du Ton",
                toneColorHint: "Choisissez la couleur avec laquelle votre image sera teintée",
                intensity: "Intensité de l'Effet",
                intensityHint: "Des valeurs plus élevées produisent un effet de couleur plus fort, des valeurs plus faibles sont plus subtiles",
                preserveGrays: "Préserver les Couleurs en Niveaux de Gris",
                preserveGraysHint: "Si activé, les zones noires, blanches et grises de l'image originale sont maintenues"
            },
            what: {
                title: "Qu'est-ce que la Teinture ?",
                description: "La teinture (ou tonification) est une technique qui applique une superposition de couleur à une image, modifiant tout son schéma de couleur vers un ton spécifique. Cela crée une apparence cohérente et peut modifier drastiquement l'ambiance et la sensation de vos images.",
                examples: "Les exemples courants incluent le ton sépia (marron) pour des effets vintage, le ton bleu pour des atmosphères froides/nocturnes et les tons chauds (rouge/orange) pour des sensations de coucher de soleil ou de nostalgie."
            },
            popular: {
                title: "Effets de Ton Populaires",
                sepia: {
                    title: "Ton Sépia",
                    description: "Crée un ton chaud et brun qui rappelle les vieilles photographies. Parfait pour générer une sensation vieillie et nostalgique."
                },
                blue: {
                    title: "Ton Bleu/Cyan",
                    description: "Crée une atmosphère fraîche et apaisante. Souvent utilisé pour des scènes nocturnes, des thèmes d'hiver ou pour évoquer des sentiments de calme et de sérénité."
                },
                green: {
                    title: "Ton Vert",
                    description: "Ajoute une sensation naturelle et terreuse. Idéal pour des thèmes environnementaux, des scènes de forêt ou pour créer un effet numérique type Matrix avec des intensités plus élevées."
                },
                red: {
                    title: "Ton Rouge/Orange",
                    description: "Ajoute de la chaleur et de l'énergie aux images. Utile pour des effets de coucher de soleil, pour générer une sensation de chaleur ou pour ajouter une tension dramatique dans des scènes sombres."
                }
            },
            tips: {
                title: "Conseils pour de Meilleurs Résultats",
                tips: [
                    "Pour des effets subtils, utilisez des valeurs d'intensité plus faibles (10-30 %)",
                    "L'option 'Préserver les Niveaux de Gris' aide à maintenir le contraste dans votre image en laissant les zones noires et blanches intactes",
                    "Essayez différents préréglages pour trouver l'ambiance parfaite pour votre image",
                    "Pour des effets dramatiques, utilisez des valeurs d'intensité plus élevées (70-100 %)",
                    "Les couleurs complémentaires (opposées sur la roue des couleurs) peuvent créer des contrastes intéressants",
                    "La transparence PNG est maintenue pendant l'ajustement de ton"
                ]
            }
        },
        pngToJpg: {
            title: "Convertir PNG en JPG",
            description: "Convertissez vos images PNG au format JPG avec des paramètres de qualité ajustables",
            toolTitle: "Convertisseur de PNG en JPG",
            toolDescription: "Téléchargez une image PNG pour la convertir au format JPG.",
            options: {
                quality: "Qualité JPEG",
                qualityHint: "Une qualité plus élevée entraîne des tailles de fichier plus grandes. Une qualité plus faible réduit la taille du fichier, mais peut introduire des artefacts."
            },
            why: {
                title: "Pourquoi Convertir PNG en JPG ?",
                description: "Convertir PNG en JPG peut être utile pour plusieurs raisons :",
                reasons: [
                    "Tailles de fichier plus petites pour un chargement plus rapide sur les sites web",
                    "Meilleure compatibilité avec certains systèmes plus anciens",
                    "Capacité d'ajuster les niveaux de compression selon vos besoins",
                    "Moins d'espace de stockage requis pour les bibliothèques d'images"
                ]
            },
            differences: {
                title: "PNG vs JPG : Différences Clés",
                png: {
                    title: "Caractéristiques de PNG",
                    description: "PNG prend en charge la transparence et la compression sans perte, ce qui le rend idéal pour les graphiques avec des bords nets et des fonds transparents."
                },
                jpg: {
                    title: "Caractéristiques de JPG",
                    description: "JPG utilise une compression avec perte, ce qui le rend idéal pour les photos et les images complexes où une légère perte de qualité est acceptable pour des tailles de fichier plus petites."
                }
            }
        },
        jpgToPng: {
            title: "Convertir JPG en PNG",
            description: "Convertissez vos images JPG au format PNG avec prise en charge de la transparence",
            toolTitle: "Convertisseur de JPG en PNG",
            toolDescription: "Téléchargez une image JPG pour la convertir au format PNG.",
            why: {
                title: "Pourquoi Convertir JPG en PNG ?",
                description: "Convertir JPG en PNG peut être avantageux pour de nombreuses raisons :",
                reasons: [
                    "Meilleure qualité sans artefacts de compression",
                    "Prise en charge de la transparence dans vos images",
                    "Format sans perte qui préserve les détails de l'image",
                    "Idéal pour les images avec du texte ou des bords nets"
                ]
            },
            differences: {
                title: "JPG vs PNG : Différences Clés",
                jpg: {
                    title: "Caractéristiques de JPG",
                    description: "JPG utilise une compression avec perte, ce qui le rend idéal pour les photos et les images complexes où la taille du fichier est plus importante que la qualité parfaite."
                },
                png: {
                    title: "Caractéristiques de PNG",
                    description: "PNG utilise une compression sans perte et prend en charge la transparence. Il est meilleur pour les images nécessitant une haute qualité, des bords nets ou des fonds transparents."
                }
            }
        },
        pngToWebp: {
            title: "Convertir PNG en WebP",
            description: "Convertissez vos images PNG au format WebP pour une meilleure compression et des performances web",
            toolTitle: "Convertisseur de PNG en WebP",
            toolDescription: "Téléchargez une image PNG pour la convertir au format WebP avec une qualité ajustable.",
            options: {
                quality: "Qualité WebP",
                qualityHint: "Une qualité plus élevée entraîne des tailles de fichier plus grandes. Une qualité plus faible réduit la taille du fichier, mais peut introduire des artefacts."
            },
            why: {
                title: "Pourquoi Convertir PNG en WebP ?",
                description: "Convertir PNG au format WebP offre plusieurs avantages :",
                reasons: [
                    "WebP offre une meilleure compression que PNG tout en maintenant la qualité visuelle",
                    "Des tailles de fichier plus petites entraînent des temps de chargement de sites web plus rapides",
                    "WebP prend en charge à la fois la compression sans perte et avec perte",
                    "WebP conserve la transparence du canal alpha comme PNG",
                    "Peut réduire la taille des fichiers image jusqu'à 30 % par rapport à PNG"
                ]
            },
            differences: {
                title: "PNG vs WebP : Différences Clés",
                png: {
                    title: "Caractéristiques de PNG",
                    description: "PNG utilise une compression sans perte qui conserve toutes les données de l'image. Il est largement pris en charge par tous les navigateurs et plateformes, mais entraîne des tailles de fichier plus grandes."
                },
                webp: {
                    title: "Caractéristiques de WebP",
                    description: "WebP offre une compression avec et sans perte avec des tailles de fichier significativement plus petites. Il prend en charge la transparence comme PNG, mais dispose de meilleurs algorithmes de compression, ce qui le rend idéal pour une utilisation web."
                }
            },
            browser: {
                title: "Compatibilité avec les Navigateurs",
                description: "Bien que WebP offre de meilleures performances, la compatibilité avec les navigateurs doit être prise en compte :",
                support: [
                    "Chrome, Edge, Firefox et Opera prennent pleinement en charge WebP",
                    "Safari a ajouté la prise en charge de WebP à partir de la version 14 (macOS Big Sur)",
                    "Pour les navigateurs plus anciens, envisagez d'utiliser des images de secours ou l'élément picture"
                ]
            }
        },
        webpToPng: {
            title: "Convertir WebP en PNG",
            description: "Convertissez des images WebP au format PNG pour une meilleure compatibilité et des options d'édition",
            toolTitle: "Convertisseur de WebP en PNG",
            toolDescription: "Téléchargez une image WebP pour la convertir au format PNG.",
            why: {
                title: "Pourquoi Convertir WebP en PNG ?",
                description: "Convertir des images WebP au format PNG est utile pour plusieurs raisons :",
                reasons: [
                    "Meilleure compatibilité avec les logiciels et navigateurs plus anciens qui ne prennent pas en charge WebP",
                    "Qualité sans perte pour l'édition dans un logiciel graphique",
                    "PNG est plus accepté pour l'impression et la publication",
                    "Conserve la transparence des images WebP",
                    "Plus facile à éditer et manipuler dans la plupart des applications d'édition d'image"
                ]
            },
            differences: {
                title: "WebP vs PNG : Différences de Format",
                webp: {
                    title: "Caractéristiques de WebP",
                    description: "WebP a été développé par Google comme un format d'image moderne avec une compression supérieure. Il offre une compression avec et sans perte avec des tailles de fichier plus petites que les formats traditionnels."
                },
                png: {
                    title: "Caractéristiques de PNG",
                    description: "PNG est un format d'image largement pris en charge qui utilise une compression sans perte. Il est compatible avec presque tous les logiciels, appareils et plateformes, ce qui en fait un excellent choix pour une compatibilité universelle."
                }
            },
            when: {
                title: "Quand Utiliser Cette Conversion",
                description: "Envisagez de convertir WebP en PNG dans ces situations :",
                situations: [
                    "Lorsque vous avez besoin d'éditer l'image dans un logiciel qui ne prend pas en charge WebP",
                    "Pour partager avec des utilisateurs qui pourraient utiliser des navigateurs ou logiciels plus anciens",
                    "Pour des besoins d'impression, car de nombreux services d'impression préfèrent PNG",
                    "Lorsque la qualité de l'image est plus importante que la taille du fichier"
                ]
            }
        },
        svgToPng: {
            title: "Convertir SVG en PNG",
            description: "Convertissez des graphiques vectoriels au format SVG en images rasterisées au format PNG avec des dimensions personnalisées",
            toolTitle: "Convertisseur de SVG en PNG",
            toolDescription: "Téléchargez un fichier SVG pour le convertir en une image PNG.",
            options: {
                width: "Largeur (px)",
                height: "Hauteur (px)",
                dimensionsHint: "Définissez les dimensions de sortie souhaitées. Le SVG sera mis à l'échelle pour s'adapter à ces dimensions tout en maintenant le rapport d'aspect."
            },
            why: {
                title: "Pourquoi Convertir SVG en PNG ?",
                description: "Convertir SVG en PNG est utile dans de nombreux scénarios :",
                reasons: [
                    "Créer des images rasterisées pour des plateformes qui ne prennent pas en charge SVG",
                    "Assurer une visualisation cohérente sur différents navigateurs et appareils",
                    "Générer des miniatures ou des aperçus de graphiques vectoriels",
                    "Créer des images de taille fixe pour des cas d'utilisation spécifiques comme les réseaux sociaux",
                    "Éviter les modifications de l'œuvre vectorielle originale"
                ]
            },
            differences: {
                title: "SVG vs PNG : Différences de Format",
                svg: {
                    title: "Caractéristiques de SVG",
                    description: "SVG (Scalable Vector Graphics) est un format vectoriel qui utilise des formules mathématiques pour définir des formes. Cela rend les SVG indépendants de la résolution et parfaits pour les designs responsifs et l'impression de haute qualité à n'importe quelle taille."
                },
                png: {
                    title: "Caractéristiques de PNG",
                    description: "PNG (Portable Network Graphics) est un format rasterisé composé de pixels. Il a une résolution fixe, mais offre une excellente qualité avec prise en charge de la transparence et est universellement compatible avec toutes les applications et plateformes."
                }
            },
            tips: {
                title: "Conseils pour de Meilleurs Résultats",
                tips: [
                    "Choisissez des dimensions adaptées à votre cas d'utilisation prévu",
                    "Pour des icônes nettes, utilisez des dimensions qui sont des multiples de la vue originale du SVG",
                    "Si votre SVG a des détails fins, utilisez des dimensions plus grandes pour les préserver",
                    "Pour une utilisation web, trouvez un équilibre entre qualité et taille de fichier",
                    "PNG prend en charge la transparence, donc les zones transparentes de votre SVG seront conservées"
                ]
            }
        },
        compressPng: {
            title: "Compresser des Images PNG",
            description: "Réduisez la taille des fichiers PNG tout en maintenant la qualité pour un chargement plus rapide sur les sites web et le partage",
            toolTitle: "Compresseur de PNG",
            toolDescription: "Téléchargez une image PNG pour la compresser avec des paramètres de qualité ajustables.",
            options: {
                quality: "Qualité",
                qualityHint: "Une qualité plus élevée entraîne des tailles de fichier plus grandes. Une qualité plus faible réduit la taille du fichier, mais peut introduire des artefacts.",
                lossless: "Utiliser la Compression sans Perte",
                losslessHint: "La compression sans perte conserve tous les détails de l'image, mais entraîne des fichiers plus grands que la compression avec perte.",
                preserveTransparency: "Préserver la Transparence",
                preserveTransparencyHint: "Maintenez les zones transparentes dans votre image PNG. La désactiver peut entraîner des fichiers plus petits, mais ajoute un fond blanc."
            },
            why: {
                title: "Pourquoi Compresser des Images PNG ?",
                description: "Compresser des images PNG offre plusieurs avantages :",
                benefits: [
                    "Temps de chargement des sites web plus rapides",
                    "Moins de consommation d'espace de stockage",
                    "Moins d'utilisation de bande passante lors du partage de fichiers",
                    "Meilleure expérience utilisateur sur les appareils mobiles",
                    "Meilleures performances SEO (Google prend en compte la vitesse de chargement des pages)"
                ]
            },
            compression: {
                title: "Compression avec Perte vs Sans Perte",
                lossy: {
                    title: "Compression avec Perte",
                    description: "La compression avec perte réduit la taille du fichier en supprimant définitivement certaines données de l'image. Cela entraîne des fichiers plus petits, mais peut affecter la qualité de l'image, surtout avec des paramètres de basse qualité."
                },
                lossless: {
                    title: "Compression sans Perte",
                    description: "La compression sans perte réduit la taille du fichier sans supprimer de données de l'image. Cela préserve 100 % de la qualité originale de l'image, mais entraîne des tailles de fichier plus grandes par rapport à la compression avec perte."
                }
            },
            tips: {
                title: "Conseils pour de Meilleurs Résultats",
                tips: [
                    "Pour les photos et images complexes, une compression avec perte avec une qualité d'environ 80-90 % offre généralement le meilleur équilibre",
                    "Pour les graphiques, logos ou images avec du texte, utilisez une compression sans perte pour maintenir la netteté",
                    "Si la transparence est importante pour votre cas d'utilisation, assurez-vous que l'option 'Préserver la Transparence' est activée",
                    "Prévisualisez l'image compressée avant de la télécharger pour vous assurer qu'elle répond à vos attentes de qualité",
                    "Utilisez une qualité plus élevée (90 %+) pour les images qui seront éditées ultérieurement"
                ]
            }
        },
        pngToBase64: {
            title: "Convertir PNG en Base64",
            description: "Convertissez des images PNG en chaînes codées en Base64 pour les intégrer dans des sites web et des applications",
            toolTitle: "Convertisseur de PNG en Base64",
            toolDescription: "Téléchargez une image PNG pour la convertir en une chaîne codée en Base64.",
            why: {
                title: "Pourquoi Convertir PNG en Base64 ?",
                description: "Convertir des images PNG en Base64 est utile pour plusieurs objectifs :",
                reasons: [
                    "Intégrer des images directement dans HTML, CSS ou JavaScript sans fichiers externes",
                    "Réduire les requêtes HTTP pour les petites images, améliorant les performances de chargement de la page",
                    "Insérer des images dans des URI de données pour une utilisation en ligne",
                    "Stocker des données d'image dans JSON ou d'autres formats de texte",
                    "Envoyer des images via des API qui n'acceptent que des données textuelles"
                ]
            },
            usage: {
                title: "Comment Utiliser des Images Base64",
                html: {
                    title: "Dans HTML",
                    description: "Utilisez la chaîne Base64 dans l'attribut src d'une balise img :"
                },
                css: {
                    title: "Dans CSS",
                    description: "Utilisez la chaîne Base64 comme image de fond :"
                },
                js: {
                    title: "Dans JavaScript",
                    description: "Créez un élément d'image avec les données Base64 :"
                }
            },
            considerations: {
                title: "Considérations Importantes",
                considerations: [
                    "Le codage Base64 augmente la taille du fichier d'environ 33 %",
                    "Idéal pour les petites images (moins de 10 Ko) pour éviter de surcharger votre code",
                    "Ne peut pas être mis en cache séparément de vos fichiers HTML/CSS/JS",
                    "Peut augmenter le temps de chargement initial de la page avec des images plus grandes"
                ]
            }
        },
        base64ToPng: {
            title: "Convertir Base64 en PNG",
            description: "Convertissez des chaînes codées en Base64 en images PNG",
            toolTitle: "Convertisseur de Base64 en PNG",
            toolDescription: "Collez une chaîne codée en Base64 pour la reconvertir en une image PNG.",
            options: {
                input: "Chaîne Base64",
                inputHint: "Collez ici la chaîne codée en Base64. Vous pouvez inclure ou omettre le préfixe URI de données."
            },
            why: {
                title: "Pourquoi Convertir Base64 en PNG ?",
                description: "Convertir Base64 en PNG est utile lorsque :",
                reasons: [
                    "Extraire des images intégrées dans HTML, CSS ou JavaScript",
                    "Enregistrer des images intégrées en tant que fichiers séparés",
                    "Éditer ou traiter des images qui ont été stockées sous forme de Base64",
                    "Convertir des données reçues d'API utilisant le codage Base64",
                    "Déboguer ou vérifier le contenu des images intégrées"
                ]
            },
            finding: {
                title: "Trouver des Images Base64",
                description: "Vous pouvez trouver des images codées en Base64 à divers endroits :",
                sources: [
                    "Inspectez le code source HTML à la recherche de balises img avec des attributs src commençant par 'data:image/'",
                    "Recherchez dans les fichiers CSS des propriétés background-image avec des URI de données",
                    "Examinez le code JavaScript à la recherche de variables de chaîne contenant des données d'image",
                    "Analysez les réponses d'API qui contiennent des données d'image"
                ]
            }
        }
    }
}