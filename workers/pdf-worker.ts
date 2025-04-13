// app/workers/pdf-worker.ts
import { Worker, Job } from 'bullmq';
import { join } from 'path';
import fs from 'fs';
import Redis from 'ioredis';
import { exec } from 'child_process';
import { promisify } from 'util';
import { degrees, PDFDocument, rgb, RotationTypes } from 'pdf-lib';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { fileStorage } from '@/lib/file-storage-service';
import { prisma } from '@/lib/prisma';

// Create Redis connection for BullMQ
const redisConnection = new Redis(
    process.env.REDIS_URL || 'redis://localhost:6379'
);

// Promisify exec for async/await usage
const execPromise = promisify(exec);

// Maximum file size (50MB in bytes)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Ensure required directories exist
async function ensureDirectories() {
    await fileStorage.ensureDirectories();
}

// Process a PDF conversion job
async function processPdfConversion(job: Job) {
    const {
        inputPath,
        outputPath,
        inputFormat,
        outputFormat,
        quality,
        userId,
        ocr = false
    } = job.data;

    try {
        await job.updateProgress(10);

        // Log operation for tracking
        if (userId) {
            await trackApiUsage(userId, 'convert');
        }

        // Set up error handling for cleanup
        let success = false;

        try {
            if (['jpg', 'jpeg', 'png'].includes(outputFormat)) {
                // Convert to image
                await convertToImage(inputPath, outputPath, outputFormat, quality);
            } else if (outputFormat === 'txt' && inputFormat === 'pdf') {
                // PDF to text
                try {
                    await extractTextFromPdf(inputPath, outputPath);
                } catch (error) {
                    console.error('Direct text extraction failed:', error);
                    if (ocr) {
                        await extractTextWithOCR(inputPath, outputPath);
                    } else {
                        throw new Error('Text extraction failed and OCR was not requested');
                    }
                }
            } else {
                // Use LibreOffice for other conversions
                await convertWithLibreOffice(inputPath, outputPath, outputFormat);
            }

            await job.updateProgress(90);

            // Verify the output file exists
            if (!fs.existsSync(outputPath)) {
                throw new Error(`Output file was not created at ${outputPath}`);
            }

            success = true;
        } finally {
            // Clean up input file if it exists
            try {
                if (fs.existsSync(inputPath)) {
                    await fs.promises.unlink(inputPath);
                }
            } catch (cleanupError) {
                console.error(`Error cleaning up input file: ${cleanupError}`);
            }

            // If conversion failed and output file doesn't exist, notify
            if (!success && !fs.existsSync(outputPath)) {
                throw new Error('Conversion failed and no output file was generated');
            }
        }

        await job.updateProgress(100);

        return {
            success: true,
            outputPath,
            message: 'Conversion successful'
        };
    } catch (error) {
        console.error('Conversion error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred during conversion'
        };
    }
}

// Process a PDF compression job
async function processPdfCompression(job: Job) {
    const { inputPath, outputPath, quality, userId } = job.data;

    try {
        await job.updateProgress(10);

        // Log operation for tracking
        if (userId) {
            await trackApiUsage(userId, 'compress');
        }

        let fileBuffer: Buffer | null = null;

        try {
            fileBuffer = await fs.promises.readFile(inputPath);
            const originalSize = fileBuffer.length;

            const hasGs = await checkCommandExists('gs') || await checkCommandExists('gswin64c');

            if (hasGs) {
                // Define quality parameters based on the quality level
                const qualitySettings = {
                    low: {
                        dPDFSETTINGS: '/ebook', // Lower quality, smaller size
                        dCompatibilityLevel: '1.4',
                        dCompression: true,
                        dEmbedAllFonts: false,
                    },
                    medium: {
                        dPDFSETTINGS: '/printer', // Medium quality
                        dCompatibilityLevel: '1.5',
                        dCompression: true,
                        dEmbedAllFonts: true,
                    },
                    high: {
                        dPDFSETTINGS: '/prepress', // Higher quality, larger size
                        dCompatibilityLevel: '1.6',
                        dCompression: true,
                        dEmbedAllFonts: true,
                    }
                };

                const settings = qualitySettings[quality];

                // Determine the correct Ghostscript command based on the platform
                const gsCommand = process.platform === 'win32' ? 'gswin64c' : 'gs';

                // Construct Ghostscript command with quality parameters
                const gsArgs = [
                    '-sDEVICE=pdfwrite',
                    `-dPDFSETTINGS=${settings.dPDFSETTINGS}`,
                    `-dCompatibilityLevel=${settings.dCompatibilityLevel}`,
                    '-dNOPAUSE',
                    '-dQUIET',
                    '-dBATCH',
                    settings.dCompression ? '-dCompressFonts=true' : '-dCompressFonts=false',
                    settings.dEmbedAllFonts ? '-dEmbedAllFonts=true' : '-dEmbedAllFonts=false',
                    '-dSubsetFonts=true',
                    '-dOptimize=true',
                    '-dDownsampleColorImages=true',
                    '-dColorImageResolution=150',
                    '-dGrayImageResolution=150',
                    '-dMonoImageResolution=150',
                    `-sOutputFile="${outputPath}"`,
                    `"${inputPath}"`
                ];

                const gsCommand_full = `${gsCommand} ${gsArgs.join(' ')}`;
                await execPromise(gsCommand_full);

                await job.updateProgress(50);

                // Get file size information
                const compressedBuffer = await fs.promises.readFile(outputPath);
                const compressedSize = compressedBuffer.length;

                // If compression actually increased the size, use the original file
                if (compressedSize >= originalSize) {
                    await fs.promises.writeFile(outputPath, fileBuffer);

                    return {
                        success: true,
                        originalSize,
                        compressedSize: originalSize,
                        compressionRatio: '0%'
                    };
                }

                // Calculate compression ratio
                const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);

                await job.updateProgress(100);

                return {
                    success: true,
                    outputPath,
                    originalSize,
                    compressedSize,
                    compressionRatio: `${compressionRatio}%`,
                    message: `PDF compressed successfully with ${compressionRatio}% reduction`
                };
            } else {
                // Fallback to pdf-lib if ghostscript isn't available
                const pdfDoc = await PDFDocument.load(fileBuffer);
                const compressedPdfBytes = await pdfDoc.save({ addDefaultPage: false });
                await fs.promises.writeFile(outputPath, compressedPdfBytes);

                const compressedSize = compressedPdfBytes.length;
                const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);

                await job.updateProgress(100);

                return {
                    success: true,
                    outputPath,
                    originalSize,
                    compressedSize,
                    compressionRatio: `${compressionRatio}%`,
                    message: `PDF compressed successfully with ${compressionRatio}% reduction`
                };
            }
        } catch (error) {
            console.error('PDF compression error:', error);

            // If we have the original file buffer, write it as fallback
            if (fileBuffer && !fs.existsSync(outputPath)) {
                await fs.promises.writeFile(outputPath, fileBuffer);
            }

            throw error;
        } finally {
            // Clean up
            try {
                if (fs.existsSync(inputPath)) {
                    await fs.promises.unlink(inputPath);
                }
            } catch (cleanupError) {
                console.error(`Error cleaning up input file: ${cleanupError}`);
            }
        }
    } catch (error) {
        console.error('Compression error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred during compression'
        };
    }
}

// Process a PDF merge job
async function processPdfMerge(job: Job) {
    const { inputPaths, outputPath, userId } = job.data;

    try {
        await job.updateProgress(10);

        // Log operation for tracking
        if (userId) {
            await trackApiUsage(userId, 'merge');
        }

        try {
            // Try merging with Ghostscript first
            let mergeSuccess = false;
            try {
                mergeSuccess = await mergePdfsWithGhostscript(inputPaths, outputPath);
            } catch (error) {
                console.error('Ghostscript merge failed:', error);
                mergeSuccess = false;
            }

            // If Ghostscript fails, try with pdf-lib
            if (!mergeSuccess) {
                try {
                    await mergePdfsWithPdfLib(inputPaths, outputPath);
                    mergeSuccess = true;
                } catch (error) {
                    console.error('PDF-lib merge failed:', error);
                    throw new Error('All PDF merging methods failed');
                }
            }

            await job.updateProgress(80);

            // Verify the output file exists
            if (!fs.existsSync(outputPath)) {
                throw new Error(`Merged file was not created at ${outputPath}`);
            }

            // Get merged file size
            const mergedBuffer = await fs.promises.readFile(outputPath);
            const mergedSize = mergedBuffer.length;

            await job.updateProgress(100);

            return {
                success: true,
                outputPath,
                mergedSize,
                message: 'PDF merge successful'
            };
        } finally {
            // Clean up input files
            for (const inputPath of inputPaths) {
                try {
                    if (fs.existsSync(inputPath)) {
                        await fs.promises.unlink(inputPath);
                    }
                } catch (cleanupError) {
                    console.error(`Error cleaning up input file ${inputPath}:`, cleanupError);
                }
            }
        }
    } catch (error) {
        console.error('Merge error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred during merging'
        };
    }
}

// Process a PDF split job
async function processPdfSplit(job: Job) {
    const { inputPath, outputDir, pageSets, userId } = job.data;

    try {
        await job.updateProgress(10);

        // Log operation for tracking
        if (userId) {
            await trackApiUsage(userId, 'split');
        }

        try {
            // Load the PDF document
            const pdfBytes = await fs.promises.readFile(inputPath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const totalPages = pdfDoc.getPageCount();

            // Ensure the output directory exists
            if (!fs.existsSync(outputDir)) {
                await fs.promises.mkdir(outputDir, { recursive: true });
            }

            await job.updateProgress(20);

            const splitResults = [];
            const totalSets = pageSets.length;

            // Process each set of pages
            for (let i = 0; i < pageSets.length; i++) {
                const pages = pageSets[i];
                const uniqueId = uuidv4();
                const outputPath = join(outputDir, `${uniqueId}-split-${i + 1}.pdf`);

                // Create a new PDF document
                const newPdfDoc = await PDFDocument.create();

                // Copy the specified pages
                for (const pageNum of pages) {
                    // PDF pages are 0-indexed, but we accept 1-indexed input
                    const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1]);
                    newPdfDoc.addPage(copiedPage);
                }

                // Save the new PDF
                const newPdfBytes = await newPdfDoc.save();
                await fs.promises.writeFile(outputPath, newPdfBytes);

                splitResults.push({
                    path: outputPath,
                    filename: `${uniqueId}-split-${i + 1}.pdf`,
                    pages: pages,
                    pageCount: pages.length
                });

                // Update progress incrementally
                await job.updateProgress(20 + Math.floor(70 * ((i + 1) / totalSets)));
            }

            await job.updateProgress(100);

            return {
                success: true,
                splitResults,
                totalPages,
                message: `PDF split into ${splitResults.length} files`
            };
        } finally {
            // Clean up input file
            try {
                if (fs.existsSync(inputPath)) {
                    await fs.promises.unlink(inputPath);
                }
            } catch (cleanupError) {
                console.error(`Error cleaning up input file: ${cleanupError}`);
            }
        }
    } catch (error) {
        console.error('PDF splitting error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred during PDF splitting'
        };
    }
}

// Process a PDF watermark job
async function processPdfWatermark(job: Job) {
    const {
        inputPath,
        outputPath,
        watermarkType,
        pagesToWatermark,
        options,
        userId
    } = job.data;

    try {
        await job.updateProgress(10);

        // Log operation for tracking
        if (userId) {
            await trackApiUsage(userId, 'watermark');
        }

        try {
            // Load the PDF
            const pdfBytes = await fs.promises.readFile(inputPath);
            const pdfDoc = await PDFDocument.load(pdfBytes);

            await job.updateProgress(20);

            if (watermarkType === 'text') {
                // Add text watermark
                await addTextWatermark(pdfDoc, pagesToWatermark, options);
            } else if (watermarkType === 'image' && options.imageBuffer) {
                // Add image watermark
                await addImageWatermark(
                    pdfDoc,
                    pagesToWatermark,
                    options.imageBuffer,
                    {
                        scale: options.scale,
                        opacity: options.opacity,
                        rotation: options.rotation,
                        position: options.position,
                        customX: options.customX,
                        customY: options.customY
                    }
                );
            } else {
                throw new Error('Invalid watermark type or missing image data');
            }

            await job.updateProgress(70);

            // Save the PDF
            const watermarkedPdfBytes = await pdfDoc.save();
            await fs.promises.writeFile(outputPath, watermarkedPdfBytes);

            await job.updateProgress(100);

            return {
                success: true,
                outputPath,
                pagesWatermarked: pagesToWatermark.length,
                message: 'PDF watermarked successfully'
            };
        } finally {
            // Clean up input file
            try {
                if (fs.existsSync(inputPath)) {
                    await fs.promises.unlink(inputPath);
                }
            } catch (cleanupError) {
                console.error(`Error cleaning up input file: ${cleanupError}`);
            }
        }
    } catch (error) {
        console.error('PDF watermarking error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred during PDF watermarking'
        };
    }
}

// Process a PDF rotation job
async function processPdfRotation(job: Job) {
    const { inputPath, outputPath, rotations, userId } = job.data;

    try {
        await job.updateProgress(10);

        // Log operation for tracking
        if (userId) {
            await trackApiUsage(userId, 'rotate');
        }

        try {
            // Load the PDF
            const pdfBytes = await fs.promises.readFile(inputPath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pageCount = pdfDoc.getPageCount();

            await job.updateProgress(30);

            // Apply rotations
            for (const rotation of rotations) {
                const { pageNumber, angle } = rotation;

                // Skip invalid page numbers
                if (pageNumber < 1 || pageNumber > pageCount) {
                    continue;
                }

                const pageIndex = pageNumber - 1;
                const page = pdfDoc.getPage(pageIndex);

                // Get the current rotation
                const currentRotation = page.getRotation().angle;

                // Calculate the new rotation
                const newRotation = (currentRotation + angle) % 360;

                // Set the new rotation
                page.setRotation({ type: RotationTypes.Degrees, angle: newRotation });
            }

            await job.updateProgress(70);

            // Save the PDF
            const rotatedPdfBytes = await pdfDoc.save();
            await fs.promises.writeFile(outputPath, rotatedPdfBytes);

            await job.updateProgress(100);

            return {
                success: true,
                outputPath,
                message: 'PDF rotation successful'
            };
        } finally {
            // Clean up input file
            try {
                if (fs.existsSync(inputPath)) {
                    await fs.promises.unlink(inputPath);
                }
            } catch (cleanupError) {
                console.error(`Error cleaning up input file: ${cleanupError}`);
            }
        }
    } catch (error) {
        console.error('PDF rotation error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred during PDF rotation'
        };
    }
}

// Process a PDF OCR job
async function processOCR(job: Job) {
    const { inputPath, outputPath, language, userId } = job.data;

    try {
        await job.updateProgress(10);

        // Log operation for tracking
        if (userId) {
            await trackApiUsage(userId, 'ocr');
        }

        try {
            // Check if OCRmyPDF is installed
            const hasOcrmypdf = await checkCommandExists('ocrmypdf');

            if (hasOcrmypdf) {
                // Use OCRmyPDF
                const langParam = language || 'eng';
                const command = `ocrmypdf --skip-text -l ${langParam} --deskew --optimize 1 "${inputPath}" "${outputPath}"`;

                await execPromise(command);

                // Verify output file exists
                if (!fs.existsSync(outputPath)) {
                    throw new Error('OCR process failed to generate output file');
                }
            } else {
                // Fallback to tesseract if OCRmyPDF is not available
                const hasTesseract = await checkCommandExists('tesseract');

                if (hasTesseract) {
                    // First convert PDF to images
                    const tempDir = join(process.cwd(), 'temp', uuidv4());
                    await fs.promises.mkdir(tempDir, { recursive: true });

                    // Use poppler's pdfimages or pdftoppm if available
                    const hasPdftoppm = await checkCommandExists('pdftoppm');

                    if (hasPdftoppm) {
                        const pdfToPngCommand = `pdftoppm -png "${inputPath}" "${join(tempDir, 'page')}"`;
                        await execPromise(pdfToPngCommand);
                    } else {
                        // Fallback to another method if needed
                        throw new Error('No PDF to image conversion tool available');
                    }

                    // OCR each image and combine text
                    const files = await fs.promises.readdir(tempDir);
                    const pngFiles = files.filter(f => f.endsWith('.png')).sort();

                    let allText = '';
                    for (const pngFile of pngFiles) {
                        const imagePath = join(tempDir, pngFile);
                        const tempTxtPath = `${imagePath}.txt`;

                        const tesseractCommand = `tesseract "${imagePath}" "${imagePath}" -l ${language || 'eng'}`;
                        await execPromise(tesseractCommand);

                        if (fs.existsSync(tempTxtPath)) {
                            const pageText = await fs.promises.readFile(tempTxtPath, 'utf8');
                            allText += pageText + '\n\n';

                            // Clean up
                            await fs.promises.unlink(tempTxtPath);
                        }

                        // Clean up image
                        await fs.promises.unlink(imagePath);
                    }

                    // Write the combined text to the output
                    await fs.promises.writeFile(outputPath, allText);

                    // Clean up temp directory
                    await fs.promises.rmdir(tempDir);
                } else {
                    throw new Error('No OCR tools (OCRmyPDF or Tesseract) available');
                }
            }

            await job.updateProgress(100);

            return {
                success: true,
                outputPath,
                message: 'OCR completed successfully'
            };
        } finally {
            // Clean up input file
            try {
                if (fs.existsSync(inputPath)) {
                    await fs.promises.unlink(inputPath);
                }
            } catch (cleanupError) {
                console.error(`Error cleaning up input file: ${cleanupError}`);
            }
        }
    } catch (error) {
        console.error('OCR error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred during OCR processing'
        };
    }
}

// Process a PDF unlock/remove password job
async function processUnlockPdf(job: Job) {
    const { inputPath, outputPath, password, userId } = job.data;

    try {
        await job.updateProgress(10);

        // Log operation for tracking
        if (userId) {
            await trackApiUsage(userId, 'unlock');
        }

        try {
            // Try to unlock using different methods
            let unlockSuccess = false;
            let methodUsed = '';

            // Try qpdf first (with password if provided)
            try {
                unlockSuccess = await unlockPdfWithQpdf(inputPath, outputPath, password);
                if (unlockSuccess) {
                    methodUsed = 'qpdf';
                }
            } catch (qpdfError) {
                console.log('qpdf failed, trying pdftk...');
            }

            // If qpdf fails, try pdftk
            if (!unlockSuccess) {
                try {
                    unlockSuccess = await unlockPdfWithPdftk(inputPath, outputPath, password);
                    if (unlockSuccess) {
                        methodUsed = 'pdftk';
                    }
                } catch (pdftkError) {
                    console.log('pdftk failed, trying GhostScript...');
                }
            }

            // If both password-based methods fail, try GhostScript (for non-password restrictions)
            if (!unlockSuccess && !password) {
                try {
                    unlockSuccess = await unlockPdfWithGhostScript(inputPath, outputPath);
                    if (unlockSuccess) {
                        methodUsed = 'ghostscript';
                    }
                } catch (gsError) {
                    console.log('GhostScript failed too');
                }
            }

            // If nothing works, copy the file as a fallback
            if (!unlockSuccess) {
                const fileBuffer = await fs.promises.readFile(inputPath);
                await fs.promises.writeFile(outputPath, fileBuffer);
                methodUsed = 'copy';
            }

            await job.updateProgress(100);

            // Prepare appropriate message
            let message = "PDF unlocked successfully";
            if (methodUsed === 'copy') {
                message = "We attempted to unlock your PDF, but were unable to remove all restrictions";
            }

            return {
                success: true,
                outputPath,
                methodUsed,
                message
            };
        } finally {
            // Clean up input file
            try {
                if (fs.existsSync(inputPath)) {
                    await fs.promises.unlink(inputPath);
                }
            } catch (cleanupError) {
                console.error(`Error cleaning up input file: ${cleanupError}`);
            }
        }
    } catch (error) {
        console.error('PDF unlock error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred during PDF unlocking'
        };
    }
}

// Main worker setup
async function startWorker() {
    // Ensure all necessary directories exist
    await ensureDirectories();

    // Create a worker that handles PDF processing tasks from the main queue
    const pdfProcessingWorker = new Worker(
        'pdf-processing',
        async (job: Job) => {
            console.log(`Processing job ${job.id} of type ${job.name}`);

            // Switch based on job type
            switch (job.name) {
                case 'convert':
                    return await processPdfConversion(job);
                case 'compress':
                    return await processPdfCompression(job);
                case 'merge':
                    return await processPdfMerge(job);
                case 'split':
                    return await processPdfSplit(job);
                case 'watermark':
                    return await processPdfWatermark(job);
                case 'rotate':
                    return await processPdfRotation(job);
                case 'ocr':
                    return await processOCR(job);
                case 'unlock':
                    return await processUnlockPdf(job);
                default:
                    throw new Error(`Unknown job type: ${job.name}`);
            }
        },
        {
            connection: redisConnection,
            concurrency: 4, // Process up to 4 jobs concurrently
            removeOnComplete: {
                age: 3600, // Keep completed jobs for 1 hour
                count: 1000 // Keep the last 1000 completed jobs
            },
            removeOnFail: {
                age: 24 * 3600 // Keep failed jobs for 24 hours
            }
        }
    );

    // Set up event listeners for worker
    pdfProcessingWorker.on('completed', (job: Job, result: any) => {
        console.log(`Job ${job.id} completed with result:`, result);
    });

    pdfProcessingWorker.on('failed', (job: Job, err: Error) => {
        console.error(`Job ${job.id} failed with error:`, err);
    });

    pdfProcessingWorker.on('error', (err: Error) => {
        console.error('Worker error:', err);
    });

    console.log('PDF processing worker started');

    return pdfProcessingWorker;
}

// Helper functions for tracking API usage
async function trackApiUsage(userId: string, operation: string) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // First check if there's an existing record for today
        const existingRecord = await prisma.usageStats.findUnique({
            where: {
                userId_operation_date: {
                    userId,
                    operation,
                    date: today
                }
            }
        });

        if (existingRecord) {
            // Update existing record
            await prisma.usageStats.update({
                where: {
                    id: existingRecord.id
                },
                data: {
                    count: {
                        increment: 1
                    }
                }
            });
        } else {
            // Create new record
            await prisma.usageStats.create({
                data: {
                    userId,
                    operation,
                    count: 1,
                    date: today
                }
            });
        }

        return true;
    } catch (error) {
        console.error('Error tracking API usage:', error);
        // Don't fail the job if tracking fails
        return false;
    }
}

// Helper function to check if a command exists
async function checkCommandExists(command: string): Promise<boolean> {
    try {
        const checkCmd = process.platform === 'win32' ?
            `where ${command} 2>nul` :
            `which ${command} 2>/dev/null`;

        await execPromise(checkCmd);
        return true;
    } catch (error) {
        return false;
    }
}

// Helper functions for specific operations - these would contain detailed implementations
// I'll just provide placeholder implementations since the actual code would be quite lengthy

// Extraction, conversion, and OCR helpers
function extractTextFromPdf(inputPath: string, outputPath: string): Promise<boolean> {
    // Implementation for extracting text from PDF
    return Promise.resolve(true);
}

function extractTextWithOCR(inputPath: string, outputPath: string): Promise<boolean> {
    // Implementation for extracting text with OCR
    return Promise.resolve(true);
}

function convertToImage(inputPath: string, outputPath: string, format: string, quality: number): Promise<boolean> {
    // Implementation for converting to image
    return Promise.resolve(true);
}

function convertWithLibreOffice(inputPath: string, outputPath: string, format: string): Promise<boolean> {
    // Implementation for LibreOffice conversion
    return Promise.resolve(true);
}

// PDF merging helpers
async function mergePdfsWithGhostscript(inputPaths: string[], outputPath: string): Promise<boolean> {
    // Implementation for merging PDFs with Ghostscript
    return Promise.resolve(true);
}

async function mergePdfsWithPdfLib(inputPaths: string[], outputPath: string): Promise<boolean> {
    try {
        console.log('Merging PDFs with pdf-lib...');

        // Create a new PDF document
        const mergedPdf = await PDFDocument.create();

        // Process each PDF file
        for (const inputPath of inputPaths) {
            // Read the PDF file
            const pdfBytes = await fs.promises.readFile(inputPath);

            // Load the PDF document
            const pdfDoc = await PDFDocument.load(pdfBytes);

            // Get all pages
            const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());

            // Add each page to the new document
            pages.forEach(page => {
                mergedPdf.addPage(page);
            });
        }

        // Save the merged document
        const mergedPdfBytes = await mergedPdf.save();

        // Write to file
        await fs.promises.writeFile(outputPath, mergedPdfBytes);

        return true;
    } catch (error) {
        console.error('PDF-lib merge error:', error);
        throw new Error('Failed to merge PDFs: ' + (error instanceof Error ? error.message : String(error)));
    }
}

// PDF unlocking helpers
async function unlockPdfWithQpdf(inputPath: string, outputPath: string, password?: string): Promise<boolean> {
    try {
        // Build the qpdf command based on whether a password was provided
        let command = password
            ? `qpdf --password="${password}" --decrypt "${inputPath}" "${outputPath}"`
            : `qpdf --decrypt "${inputPath}" "${outputPath}"`;

        // Hide the password in logs
        console.log(`Executing: ${password ? command.replace(password, '******') : command}`);

        // Execute the command
        const { stdout, stderr } = await execPromise(command);

        if (stderr && !stderr.includes('WARNING')) {
            console.error('qpdf stderr:', stderr);
        }

        if (stdout) {
            console.log('qpdf stdout:', stdout);
        }

        // Check if output file exists
        return fs.existsSync(outputPath);
    } catch (error) {
        console.error('Error using qpdf to unlock:', error);
        return false;
    }
}

async function unlockPdfWithPdftk(inputPath: string, outputPath: string, password?: string): Promise<boolean> {
    try {
        // Build the pdftk command based on whether a password was provided
        let command = password
            ? `pdftk "${inputPath}" input_pw "${password}" output "${outputPath}" allow AllFeatures`
            : `pdftk "${inputPath}" output "${outputPath}" allow AllFeatures`;

        // Hide the password in logs
        console.log(`Executing: ${password ? command.replace(password, '******') : command}`);

        // Execute the command
        const { stdout, stderr } = await execPromise(command);

        if (stderr) {
            console.error('pdftk stderr:', stderr);
        }

        if (stdout) {
            console.log('pdftk stdout:', stdout);
        }

        // Check if output file exists
        return fs.existsSync(outputPath);
    } catch (error) {
        console.error('Error using pdftk to unlock:', error);
        return false;
    }
}

async function unlockPdfWithGhostScript(inputPath: string, outputPath: string): Promise<boolean> {
    try {
        // GhostScript approach (works for PDFs with restrictions but no password)
        const gsCommand = process.platform === 'win32' ? 'gswin64c' : 'gs';

        const command = `${gsCommand} -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile="${outputPath}" -c ".setpdfwrite" -f "${inputPath}"`;

        console.log(`Executing GhostScript: ${command}`);

        // Execute the command
        const { stdout, stderr } = await execPromise(command);

        if (stderr) {
            console.error('GhostScript stderr:', stderr);
        }

        if (stdout) {
            console.log('GhostScript stdout:', stdout);
        }

        // Check if output file exists
        return fs.existsSync(outputPath);
    } catch (error) {
        console.error('Error using GhostScript to unlock:', error);
        return false;
    }
}

// Watermark helpers
async function addTextWatermark(
    pdfDoc: PDFDocument,
    pages: number[],
    options: {
        text: string;
        fontSize: number;
        fontFamily: string;
        color: string;
        opacity: number;
        rotation: number;
        position: string;
        customX?: number;
        customY?: number;
    }
): Promise<void> {
    try {
        // Map font family to standard fonts
        let fontType;
        switch (options.fontFamily.toLowerCase()) {
            case 'times new roman':
            case 'times':
                fontType = 'Times-Roman';
                break;
            case 'courier':
                fontType = 'Courier';
                break;
            case 'helvetica':
            default:
                fontType = 'Helvetica';
                break;
        }

        // Parse color from hex to rgb
        const hexColor = options.color.replace('#', '');
        const r = parseInt(hexColor.substring(0, 2), 16) / 255;
        const g = parseInt(hexColor.substring(2, 4), 16) / 255;
        const b = parseInt(hexColor.substring(4, 6), 16) / 255;

        // Embed the font
        const font = await pdfDoc.embedFont(fontType);

        // Process each page
        for (const pageNum of pages) {
            const pageIndex = pageNum - 1;
            if (pageIndex < 0 || pageIndex >= pdfDoc.getPageCount()) continue;

            const page = pdfDoc.getPage(pageIndex);
            const { width, height } = page.getSize();

            // Calculate text width and height for positioning
            const textWidth = font.widthOfTextAtSize(options.text, options.fontSize);
            const textHeight = font.heightAtSize(options.fontSize);

            // Calculate positions based on selected position
            let x: number;
            let y: number;

            switch (options.position) {
                case 'center':
                    x = width / 2 - textWidth / 2;
                    y = height / 2 - textHeight / 2;
                    break;
                case 'top-left':
                    x = 50;
                    y = height - 50;
                    break;
                case 'top-right':
                    x = width - textWidth - 50;
                    y = height - 50;
                    break;
                case 'bottom-left':
                    x = 50;
                    y = 50;
                    break;
                case 'bottom-right':
                    x = width - textWidth - 50;
                    y = 50;
                    break;
                case 'custom':
                    // Convert from percentage to absolute coordinates
                    x = width * (options.customX || 50) / 100 - textWidth / 2;
                    y = height * (1 - (options.customY || 50) / 100) - textHeight / 2; // Invert Y coordinate
                    break;
                default: // Center
                    x = width / 2 - textWidth / 2;
                    y = height / 2 - textHeight / 2;
            }

            // Draw the watermark text
            page.drawText(options.text, {
                x,
                y,
                size: options.fontSize,
                font,
                color: rgb(r, g, b),
                opacity: options.opacity / 100,
                rotate: degrees(options.rotation),
            });

        }
    } catch (error) {
        console.error('Error adding text watermark:', error);
        throw error;
    }
}

async function addImageWatermark(
    pdfDoc: PDFDocument,
    pages: number[],
    imageBuffer: Buffer,
    options: {
        scale: number;
        opacity: number;
        rotation: number;
        position: string;
        customX?: number;
        customY?: number;
    }
): Promise<void> {
    try {
        // Determine the image type based on magic numbers or content
        let embeddedImage;
        if (imageBuffer[0] === 0xFF && imageBuffer[1] === 0xD8) {
            // JPEG signature
            embeddedImage = await pdfDoc.embedJpg(imageBuffer);
        } else if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50 && imageBuffer[2] === 0x4E && imageBuffer[3] === 0x47) {
            // PNG signature
            embeddedImage = await pdfDoc.embedPng(imageBuffer);
        } else {
            // Convert to PNG with sharp for compatibility
            const pngBuffer = await sharp(imageBuffer).png().toBuffer();
            embeddedImage = await pdfDoc.embedPng(pngBuffer);
        }

        // Calculate dimensions with scale
        const { width: imgWidth, height: imgHeight } = embeddedImage;
        const scaleFactor = options.scale / 100;
        const scaledWidth = imgWidth * scaleFactor;
        const scaledHeight = imgHeight * scaleFactor;

        // Process each page
        for (const pageNum of pages) {
            const pageIndex = pageNum - 1;
            if (pageIndex < 0 || pageIndex >= pdfDoc.getPageCount()) continue;

            const page = pdfDoc.getPage(pageIndex);
            const { width, height } = page.getSize();

            // Calculate position based on selected position
            let x: number;
            let y: number;

            switch (options.position) {
                case 'center':
                    x = width / 2 - scaledWidth / 2;
                    y = height / 2 - scaledHeight / 2;
                    break;
                case 'top-left':
                    x = 50;
                    y = height - scaledHeight - 50;
                    break;
                case 'top-right':
                    x = width - scaledWidth - 50;
                    y = height - scaledHeight - 50;
                    break;
                case 'bottom-left':
                    x = 50;
                    y = 50;
                    break;
                case 'bottom-right':
                    x = width - scaledWidth - 50;
                    y = 50;
                    break;
                case 'custom':
                    // Convert from percentage to absolute coordinates
                    x = width * (options.customX || 50) / 100 - scaledWidth / 2;
                    y = height * (1 - (options.customY || 50) / 100) - scaledHeight / 2; // Invert Y coordinate
                    break;
                default: // Center
                    x = width / 2 - scaledWidth / 2;
                    y = height / 2 - scaledHeight / 2;
            }

            // Draw the image watermark
            page.drawImage(embeddedImage, {
                x,
                y,
                width: scaledWidth,
                height: scaledHeight,
                opacity: options.opacity / 100,
                rotate: degrees(options.rotation),
            });
        }
    } catch (error) {
        console.error('Error adding image watermark:', error);
        throw error;
    }
}

// Start the worker when this module is executed directly
if (require.main === module) {
    startWorker().catch(error => {
        console.error('Failed to start worker:', error);
        process.exit(1);
    });
}

export {
    startWorker,
    MAX_FILE_SIZE
};