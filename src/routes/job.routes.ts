// src/routes/job.routes.ts
import { Router } from 'express';
import { JobController } from '../controllers/job.controller';
import { validate } from '../middleware/validate.middleware';
import {
  CreateJobSchema,
  ListJobsSchema,
  JobIdParamSchema,
  CreateApplicationSchema,
} from '../schemas/job.schema';

export const createJobRouter = (controller: JobController): Router => {
  const router = Router();

  router.post('/', validate(CreateJobSchema), controller.createJob);
  router.get('/', validate(ListJobsSchema), controller.listJobs);
  router.get('/:id', validate(JobIdParamSchema), controller.getJobById);
  router.patch('/:id/close', validate(JobIdParamSchema), controller.closeJob);

  router.post('/:id/applications', validate(CreateApplicationSchema), controller.submitApplication);
  router.get('/:id/applications', validate(JobIdParamSchema), controller.listApplications);

  return router;
};