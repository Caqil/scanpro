// lib/job-queue.ts
import { getRedisClient } from './redis';

export interface JobData {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  data: Record<string, any>;
  result?: any;
  error?: string;
  progress?: number;
  createdAt: number;
  updatedAt: number;
  startedAt?: number;
  completedAt?: number;
}

export class JobQueue {
  private queueName: string;
  
  constructor(queueName = 'pdf-processing') {
    this.queueName = `scanpro:queue:${queueName}`;
  }
  
  /**
   * Add a job to the queue
   */
  async add(type: string, data: Record<string, any>): Promise<string> {
    const redis = getRedisClient();
    const id = `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const job: JobData = {
      id,
      type,
      status: 'pending',
      data,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Add to queue list
    await redis.rpush(`${this.queueName}:jobs`, id);
    
    // Save job data
    await redis.set(`${this.queueName}:job:${id}`, JSON.stringify(job));
    
    // Add to pending set
    await redis.sadd(`${this.queueName}:pending`, id);
    
    return id;
  }
  
  /**
   * Get next job from the queue
   */
  async getNext(): Promise<JobData | null> {
    const redis = getRedisClient();
    
    // Atomic operation to pop job from list and update status
    const result = await redis.eval(`
      local jobId = redis.call('LPOP', ARGV[1])
      if not jobId then return nil end
      
      local jobData = redis.call('GET', ARGV[2] .. jobId)
      if not jobData then return nil end
      
      redis.call('SREM', ARGV[3], jobId)
      redis.call('SADD', ARGV[4], jobId)
      
      local job = cjson.decode(jobData)
      job.status = 'processing'
      job.updatedAt = tonumber(ARGV[5])
      job.startedAt = tonumber(ARGV[5])
      
      redis.call('SET', ARGV[2] .. jobId, cjson.encode(job))
      
      return jobData
    `, 0, 
      `${this.queueName}:jobs`,
      `${this.queueName}:job:`,
      `${this.queueName}:pending`,
      `${this.queueName}:processing`,
      Date.now().toString()
    );
    
    if (!result) return null;
    
    return JSON.parse(result as string) as JobData;
  }
  
  /**
   * Update job progress
   */
  async updateProgress(jobId: string, progress: number): Promise<boolean> {
    const redis = getRedisClient();
    const jobKey = `${this.queueName}:job:${jobId}`;
    
    const jobData = await redis.get(jobKey);
    if (!jobData) return false;
    
    const job = JSON.parse(jobData) as JobData;
    job.progress = Math.min(100, Math.max(0, progress));
    job.updatedAt = Date.now();
    
    await redis.set(jobKey, JSON.stringify(job));
    return true;
  }
  
  /**
   * Complete a job
   */
  async complete(jobId: string, result?: any): Promise<boolean> {
    const redis = getRedisClient();
    const jobKey = `${this.queueName}:job:${jobId}`;
    
    const jobData = await redis.get(jobKey);
    if (!jobData) return false;
    
    const job = JSON.parse(jobData) as JobData;
    job.status = 'completed';
    job.result = result;
    job.progress = 100;
    job.updatedAt = Date.now();
    job.completedAt = Date.now();
    
    await redis.set(jobKey, JSON.stringify(job));
    await redis.srem(`${this.queueName}:processing`, jobId);
    await redis.sadd(`${this.queueName}:completed`, jobId);
    
    // Keep completed jobs for 24 hours
    await redis.expire(jobKey, 86400);
    
    return true;
  }
  
  /**
   * Fail a job
   */
  async fail(jobId: string, error: string): Promise<boolean> {
    const redis = getRedisClient();
    const jobKey = `${this.queueName}:job:${jobId}`;
    
    const jobData = await redis.get(jobKey);
    if (!jobData) return false;
    
    const job = JSON.parse(jobData) as JobData;
    job.status = 'failed';
    job.error = error;
    job.updatedAt = Date.now();
    
    await redis.set(jobKey, JSON.stringify(job));
    await redis.srem(`${this.queueName}:processing`, jobId);
    await redis.sadd(`${this.queueName}:failed`, jobId);
    
    // Keep failed jobs for 24 hours
    await redis.expire(jobKey, 86400);
    
    return true;
  }
  
  /**
   * Get job status
   */
  async getJob(jobId: string): Promise<JobData | null> {
    const redis = getRedisClient();
    const jobData = await redis.get(`${this.queueName}:job:${jobId}`);
    
    if (!jobData) return null;
    
    return JSON.parse(jobData) as JobData;
  }
}

// Export a default queue instance
export const pdfQueue = new JobQueue('pdf-processing');