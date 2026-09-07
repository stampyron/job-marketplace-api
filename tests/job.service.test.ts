// tests/job.service.test.ts
import { InMemoryJobRepository } from '../src/repositories/job.repository';
import { InMemoryApplicationRepository } from '../src/repositories/application.repository';
import { JobService } from '../src/services/job.service';
import { NotFoundError, JobClosedError, BadRequestError } from '../src/errors/app-error';

describe('JobService Unit Tests', () => {
  let jobRepo: InMemoryJobRepository;
  let appRepo: InMemoryApplicationRepository;
  let service: JobService;

  beforeEach(() => {
    jobRepo = new InMemoryJobRepository();
    appRepo = new InMemoryApplicationRepository();
    service = new JobService(jobRepo, appRepo);
  });

  describe('Job Lifecycle', () => {
    it('should create an open job', async () => {
      const job = await service.createJob({
        title: 'Senior Backend Engineer',
        description: 'Lead API architecture in TypeScript',
        location: 'Remote',
      });

      expect(job.id).toBeDefined();
      expect(job.status).toBe('OPEN');
      expect(job.title).toBe('Senior Backend Engineer');
    });

    it('should close an open job', async () => {
      const job = await service.createJob({
        title: 'Product Manager',
        description: 'Drive growth',
        location: 'Kuala Lumpur',
      });

      const closed = await service.closeJob(job.id);
      expect(closed.status).toBe('CLOSED');
    });

    it('should throw BadRequestError if closing an already closed job', async () => {
      const job = await service.createJob({
        title: 'DevOps Engineer',
        description: 'Manage K8s clusters',
        location: 'Remote',
      });

      await service.closeJob(job.id);
      await expect(service.closeJob(job.id)).rejects.toThrow(BadRequestError);
    });
  });

  describe('Application Submissions', () => {
    it('should accept applications for an OPEN job', async () => {
      const job = await service.createJob({
        title: 'Frontend Developer',
        description: 'React/Next.js experience needed',
        location: 'Singapore',
      });

      const application = await service.submitApplication(job.id, {
        candidateName: 'Jane Doe',
        candidateEmail: 'jane@example.com',
      });

      expect(application.id).toBeDefined();
      expect(application.jobId).toBe(job.id);
      expect(application.candidateEmail).toBe('jane@example.com');

      const applications = await service.getApplicationsForJob(job.id);
      expect(applications).toHaveLength(1);
    });

    it('should reject applications for a CLOSED job with JobClosedError', async () => {
      const job = await service.createJob({
        title: 'QA Lead',
        description: 'Automated testing strategy',
        location: 'Hybrid',
      });

      await service.closeJob(job.id);

      await expect(
        service.submitApplication(job.id, {
          candidateName: 'John Smith',
          candidateEmail: 'john@example.com',
        })
      ).rejects.toThrow(JobClosedError);
    });

    it('should throw NotFoundError when applying to a non-existent job', async () => {
      await expect(
        service.submitApplication('non-existent-uuid', {
          candidateName: 'Ghost Applicant',
          candidateEmail: 'ghost@example.com',
        })
      ).rejects.toThrow(NotFoundError);
    });
  });
});