// src/models/application.model.ts
export interface Application {
  id: string;
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  submittedAt: Date;
}

export type CreateApplicationDTO = Omit<Application, 'id' | 'jobId' | 'submittedAt'>;