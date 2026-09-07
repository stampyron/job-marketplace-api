// src/app.ts
import express, { Application } from 'express';
import { InMemoryJobRepository } from './repositories/job.repository';
import { InMemoryApplicationRepository } from './repositories/application.repository';
import { JobService } from './services/job.service';
import { JobController } from './controllers/job.controller';
import { createJobRouter } from './routes/job.routes';
import { errorHandler } from './middleware/error.middleware';

export const createApp = (): Application => {
  const app = express();
  app.use(express.json());

  // Dependency Injection Wiring
  const jobRepo = new InMemoryJobRepository();
  const appRepo = new InMemoryApplicationRepository();
  const jobService = new JobService(jobRepo, appRepo);
  const jobController = new JobController(jobService);

  // Mount API
  app.use('/api/v1/jobs', createJobRouter(jobController));

  // Global Error Handler
  app.use(errorHandler);

  return app;
};