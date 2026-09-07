// src/repositories/application.repository.ts
import { Application } from '../models/application.model';

export interface IApplicationRepository {
  create(application: Application): Promise<Application>;
  findByJobId(jobId: string): Promise<Application[]>;
}

export class InMemoryApplicationRepository implements IApplicationRepository {
  private applications: Application[] = [];

  async create(application: Application): Promise<Application> {
    const copy = { ...application };
    this.applications.push(copy);
    return { ...copy };
  }

  async findByJobId(jobId: string): Promise<Application[]> {
    return this.applications
      .filter((app) => app.jobId === jobId)
      .map((app) => ({ ...app }));
  }
}