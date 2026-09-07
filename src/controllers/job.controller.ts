// src/controllers/job.controller.ts
import { Request, Response, NextFunction } from 'express';
import { JobService } from '../services/job.service';
import { JobStatus } from '../models/job.model';

export class JobController {
  constructor(private jobService: JobService) {}

  createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const job = await this.jobService.createJob(req.body);
      res.status(201).json(job);
    } catch (err) {
      next(err);
    }
  };

  getJobById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const job = await this.jobService.getJobById(req.params.id);
      res.status(200).json(job);
    } catch (err) {
      next(err);
    }
  };

  listJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const status = req.query.status as JobStatus | undefined;
      const jobs = await this.jobService.listJobs(status);
      res.status(200).json({ data: jobs, total: jobs.length });
    } catch (err) {
      next(err);
    }
  };

  closeJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const job = await this.jobService.closeJob(req.params.id);
      res.status(200).json(job);
    } catch (err) {
      next(err);
    }
  };

  submitApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const application = await this.jobService.submitApplication(req.params.id, req.body);
      res.status(201).json(application);
    } catch (err) {
      next(err);
    }
  };

  listApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const applications = await this.jobService.getApplicationsForJob(req.params.id);
      res.status(200).json({ data: applications, total: applications.length });
    } catch (err) {
      next(err);
    }
  };
}