// src/repositories/job.repository.ts
import { Job, JobStatus } from '../models/job.model';

export interface IJobRepository {
  create(job: Job): Promise<Job>;
  findById(id: string): Promise<Job | null>;
  findAll(filter?: { status?: JobStatus }): Promise<Job[]>;
  update(job: Job): Promise<Job>;
}

export class InMemoryJobRepository implements IJobRepository {
  private jobs: Map<string, Job> = new Map();

  async create(job: Job): Promise<Job> {
    this.jobs.set(job.id, { ...job });
    return { ...job };
  }

  async findById(id: string): Promise<Job | null> {
    const job = this.jobs.get(id);
    return job ? { ...job } : null;
  }

  async findAll(filter?: { status?: JobStatus }): Promise<Job[]> {
    let result = Array.from(this.jobs.values());
    if (filter?.status) {
      result = result.filter((j) => j.status === filter.status);
    }
    return result.map((j) => ({ ...j }));
  }

  async update(job: Job): Promise<Job> {
    this.jobs.set(job.id, { ...job });
    return { ...job };
  }
}