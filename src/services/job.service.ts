// src/services/job.service.ts
import { randomUUID } from 'crypto';
import { Job, JobStatus, CreateJobDTO } from '../models/job.model';
import { Application, CreateApplicationDTO } from '../models/application.model';
import { IJobRepository } from '../repositories/job.repository';
import { IApplicationRepository } from '../repositories/application.repository';
import { NotFoundError, JobClosedError, BadRequestError } from '../errors/app-error';

export class JobService {
  constructor(
    private jobRepo: IJobRepository,
    private appRepo: IApplicationRepository
  ) {}

  async createJob(dto: CreateJobDTO): Promise<Job> {
    const now = new Date();
    const job: Job = {
      id: randomUUID(),
      title: dto.title.trim(),
      description: dto.description.trim(),
      location: dto.location.trim(),
      status: 'OPEN',
      createdAt: now,
      updatedAt: now,
    };
    return this.jobRepo.create(job);
  }

  async getJobById(id: string): Promise<Job> {
    const job = await this.jobRepo.findById(id);
    if (!job) {
      throw new NotFoundError(`Job with ID '${id}' not found.`);
    }
    return job;
  }

  async listJobs(status?: JobStatus): Promise<Job[]> {
    return this.jobRepo.findAll(status ? { status } : undefined);
  }

  async closeJob(id: string): Promise<Job> {
    const job = await this.getJobById(id);
    if (job.status === 'CLOSED') {
      throw new BadRequestError(`Job '${id}' is already closed.`);
    }

    job.status = 'CLOSED';
    job.updatedAt = new Date();
    return this.jobRepo.update(job);
  }

  async submitApplication(jobId: string, dto: CreateApplicationDTO): Promise<Application> {
    const job = await this.getJobById(jobId);

    if (job.status === 'CLOSED') {
      throw new JobClosedError(jobId);
    }

    const application: Application = {
      id: randomUUID(),
      jobId: job.id,
      candidateName: dto.candidateName.trim(),
      candidateEmail: dto.candidateEmail.toLowerCase().trim(),
      submittedAt: new Date(),
    };

    return this.appRepo.create(application);
  }

  async getApplicationsForJob(jobId: string): Promise<Application[]> {
    // Ensure job exists before returning applications
    await this.getJobById(jobId);
    return this.appRepo.findByJobId(jobId);
  }
}