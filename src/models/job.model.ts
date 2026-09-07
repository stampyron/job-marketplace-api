// src/models/job.model.ts
export type JobStatus = 'OPEN' | 'CLOSED';

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateJobDTO = Omit<Job, 'id' | 'status' | 'createdAt' | 'updatedAt'>;