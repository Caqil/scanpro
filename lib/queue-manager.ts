// lib/queue-manager.ts
import { Queue, Job } from 'bullmq';
import Redis from 'ioredis';

// Configure Redis connection
const redisConnection = new Redis(
    process.env.REDIS_URL || 'redis://localhost:6379'
);

// Create the main processing queue
const pdfProcessingQueue = new Queue('pdf-processing', {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: {
            age: 3600, // Keep completed jobs for 1 hour
            count: 1000 // Keep the last 1000 completed jobs
        },
        removeOnFail: {
            age: 24 * 3600 // Keep failed jobs for 24 hours
        },
    },
});

// Job types for TypeScript safety
interface ConversionJob {
    inputPath: string;
    outputPath: string;
    inputFormat: string;
    outputFormat: string;
    quality?: number;
    ocr?: boolean;
    userId?: string;
}

interface CompressionJob {
    inputPath: string;
    outputPath: string;
    quality: 'low' | 'medium' | 'high';
    userId?: string;
}

interface MergeJob {
    inputPaths: string[];
    outputPath: string;
    userId?: string;
}

interface SplitJob {
    inputPath: string;
    outputDir: string;
    pageSets: number[][];
    userId?: string;
}

interface RotationJob {
    inputPath: string;
    outputPath: string;
    rotations: Array<{ pageNumber: number; angle: number }>;
    userId?: string;
}

interface WatermarkJob {
    inputPath: string;
    outputPath: string;
    watermarkType: 'text' | 'image';
    pagesToWatermark: number[];
    options: Record<string, any>;
    userId?: string;
}

interface OcrJob {
    inputPath: string;
    outputPath: string;
    language?: string;
    userId?: string;
}

interface UnlockJob {
    inputPath: string;
    outputPath: string;
    password?: string;
    userId?: string;
}

// Add a job to convert a PDF file
export async function queueConversionJob(jobData: ConversionJob): Promise<Job> {
    return await pdfProcessingQueue.add('convert', jobData);
}

// Add a job to compress a PDF file
export async function queueCompressionJob(jobData: CompressionJob): Promise<Job> {
    return await pdfProcessingQueue.add('compress', jobData);
}

// Add a job to merge PDF files
export async function queueMergeJob(jobData: MergeJob): Promise<Job> {
    return await pdfProcessingQueue.add('merge', jobData);
}

// Add a job to split a PDF file
export async function queueSplitJob(jobData: SplitJob): Promise<Job> {
    return await pdfProcessingQueue.add('split', jobData);
}

// Add a job to rotate a PDF file
export async function queueRotationJob(jobData: RotationJob): Promise<Job> {
    return await pdfProcessingQueue.add('rotate', jobData);
}

// Add a job to watermark a PDF file
export async function queueWatermarkJob(jobData: WatermarkJob): Promise<Job> {
    return await pdfProcessingQueue.add('watermark', jobData);
}

// Add a job to OCR a PDF file
export async function queueOcrJob(jobData: OcrJob): Promise<Job> {
    return await pdfProcessingQueue.add('ocr', jobData);
}

// Add a job to unlock a PDF file
export async function queueUnlockJob(jobData: UnlockJob): Promise<Job> {
    return await pdfProcessingQueue.add('unlock', jobData);
}

// Get job status
export async function getJobStatus(jobId: string): Promise<any> {
    const job = await pdfProcessingQueue.getJob(jobId);

    if (!job) {
        return { status: 'not_found' };
    }

    // Get job state
    const state = await job.getState();

    // Get job progress
    const progress = job.progress;

    // Get job result if completed
    let result = null;
    if (state === 'completed') {
        result = await job.returnvalue;
    }

    // Get error if failed
    let error = null;
    if (state === 'failed') {
        const failedReason = await job.failedReason;
        error = failedReason || 'Unknown error';
    }

    return {
        id: job.id,
        status: state,
        progress,
        result,
        error,
        timestamp: job.timestamp
    };
}

// Clean up all completed jobs older than the specified time
export async function cleanupCompletedJobs(olderThanSeconds: number = 3600): Promise<number> {
    const timestamp = Date.now() - olderThanSeconds * 1000;
    const count = await pdfProcessingQueue.clean(timestamp, 'completed');
    return count;
}

// Clean up all failed jobs older than the specified time
export async function cleanupFailedJobs(olderThanSeconds: number = 24 * 3600): Promise<number> {
    const timestamp = Date.now() - olderThanSeconds * 1000;
    const count = await pdfProcessingQueue.clean(timestamp, 'failed');
    return count;
}

// Get queue statistics
export async function getQueueStats(): Promise<any> {
    const jobCounts = await pdfProcessingQueue.getJobCounts();
    const workers = await pdfProcessingQueue.getWorkers();

    return {
        jobCounts,
        workerCount: workers.length
    };
}

// Export the queue for direct access if needed
export { pdfProcessingQueue };