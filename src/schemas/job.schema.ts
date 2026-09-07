// src/schemas/job.schema.ts
import { z } from 'zod';

export const CreateJobSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    location: z.string().min(2, 'Location must be at least 2 characters'),
  }),
});

export const ListJobsSchema = z.object({
  query: z.object({
    status: z.enum(['OPEN', 'CLOSED']).optional(),
  }),
});

export const CreateApplicationSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Job ID format'),
  }),
  body: z.object({
    candidateName: z.string().min(2, 'Candidate name is required'),
    candidateEmail: z.string().email('Invalid email address format'),
  }),
});

export const JobIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Job ID format'),
  }),
});