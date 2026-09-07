// src/errors/app-error.ts
export abstract class AppError extends Error {
  abstract readonly statusCode: number;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  readonly statusCode = 404;
}

export class BadRequestError extends AppError {
  readonly statusCode = 400;
}

export class JobClosedError extends AppError {
  readonly statusCode = 422; // Unprocessable Entity
  constructor(jobId: string) {
    super(`Job '${jobId}' is closed and no longer accepting applications.`);
  }
}