# Job Marketplace API

A RESTful API for a Job Marketplace system built with **Node.js**, **Express**, **TypeScript**, and **Zod**, featuring an in-memory repository architecture and unit tests powered by **Jest** and **SWC**.

---

## 🛠 Tech Stack

- **Runtime:** Node.js (v18+; tested on Node.js v25)
- **Framework:** Express 5
- **Language:** TypeScript 7
- **Runtime Transpiler & Dev Server:** `tsx` + `nodemon`
- **Validation:** Zod
- **Testing:** Jest + `@swc/jest`

---

## 📁 Project Structure

```text
├── src/
│   ├── app.ts                  # Express application factory & middleware wiring
│   ├── server.ts               # Application entry point & HTTP listener
│   ├── controllers/
│   │   └── job.controller.ts   # Request/response handlers
│   ├── services/
│   │   └── job.service.ts      # Core business logic & rules
│   ├── repositories/
│   │   ├── job.repository.ts          # In-memory storage for jobs
│   │   └── application.repository.ts  # In-memory storage for job applications
│   ├── models/
│   │   ├── job.model.ts        # Data structures and interfaces for Job
│   │   └── application.model.ts# Data structures and interfaces for Application
│   ├── schemas/
│   │   └── job.schema.ts       # Zod validation schemas for requests
│   ├── middleware/
│   │   ├── validate.middleware.ts     # Schema validation middleware
│   │   └── error.middleware.ts        # Centralized global error handling
│   └── errors/
│       └── app-error.ts        # Custom domain error classes
├── tests/
│   └── job.service.test.ts     # Unit test suite for JobService
├── jest.config.js              # Jest configuration with SWC transformer
├── package.json                # Project dependencies and npm scripts
└── tsconfig.json               # TypeScript compiler configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or higher, including Node.js v25)
- [npm](https://www.npmjs.com/) (v9.x or higher)

### Installation

Clone or open the project folder in your terminal, then install dependencies:

```bash
npm install --legacy-peer-deps
```

> **Note:** `--legacy-peer-deps` is used to allow compatibility with the latest TypeScript 7 release while preserving dependency resolution.

---

## 💻 Running the Application

### Development Server

Start the application with hot reloading:

```bash
npm run dev
```

Once running, the server will output:

```text
Job Marketplace API running on http://localhost:3000
```

### Changing the Port

By default, the server runs on port `3000`. You can change the port using the `PORT` environment variable:

**Bash / macOS / Linux:**
```bash
PORT=4000 npm run dev
```

**PowerShell (Windows):**
```powershell
$env:PORT=4000; npm run dev
```

**Command Prompt (Windows):**
```cmd
set PORT=4000 && npm run dev
```

---

## 🧪 Running the Test Cases

The test suite tests the core business logic in `JobService`, including job creation, status transitions, application submissions, and validation/error handling.

### Run All Tests

```bash
npm test
```

### Run a Specific Test File

```bash
npm test job.service.test.ts
```

Or using `npx jest`:

```bash
npx jest tests/job.service.test.ts
```

### Run Tests in Watch Mode

Reruns tests automatically whenever source or test files change:

```bash
npm test -- --watch
```

### Run Tests with Verbose Details

Outputs the status of each individual test case:

```bash
npm test -- --verbose
```

### Run Tests with Code Coverage

Generates a test coverage summary in the terminal:

```bash
npm test -- --coverage
```

### Summary of Test Cases Covered

The test suite in `tests/job.service.test.ts` validates:
- **Job Lifecycle:**
  - `should create an open job`: Creates a job with default status `OPEN`.
  - `should close an open job`: Transitions a job status from `OPEN` to `CLOSED`.
  - `should throw BadRequestError if closing an already closed job`: Ensures idempotency/valid transition guard.
- **Application Submissions:**
  - `should accept applications for an OPEN job`: Stores application and links it to `jobId`.
  - `should reject applications for a CLOSED job with JobClosedError`: Verifies closed jobs cannot receive applications.
  - `should throw NotFoundError when applying to a non-existent job`: Ensures foreign key check on job ID.

---

## 📖 API Documentation

Base URL: `http://localhost:3000/api/v1/jobs`

### 1. Create a Job
- **Method:** `POST`
- **Path:** `/api/v1/jobs`
- **Request Body:**
  ```json
  {
    "title": "Senior Backend Engineer",
    "description": "Lead API architecture in TypeScript and Node.js",
    "location": "Remote"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": "c6204c31-7b70-49ff-95f7-4eb7d00f7b9e",
    "title": "Senior Backend Engineer",
    "description": "Lead API architecture in TypeScript and Node.js",
    "location": "Remote",
    "status": "OPEN",
    "createdAt": "2026-09-07T03:00:00.000Z",
    "updatedAt": "2026-09-07T03:00:00.000Z"
  }
  ```

---

### 2. List Jobs
- **Method:** `GET`
- **Path:** `/api/v1/jobs`
- **Optional Query Parameter:**
  - `status`: Filter by status (`OPEN` or `CLOSED`), e.g., `/api/v1/jobs?status=OPEN`
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "c6204c31-7b70-49ff-95f7-4eb7d00f7b9e",
        "title": "Senior Backend Engineer",
        "description": "Lead API architecture in TypeScript and Node.js",
        "location": "Remote",
        "status": "OPEN",
        "createdAt": "2026-09-07T03:00:00.000Z",
        "updatedAt": "2026-09-07T03:00:00.000Z"
      }
    ],
    "total": 1
  }
  ```

---

### 3. Get Job by ID
- **Method:** `GET`
- **Path:** `/api/v1/jobs/:id`
- **Path Parameter:**
  - `id`: Valid UUID of the job
- **Response (200 OK):**
  ```json
  {
    "id": "c6204c31-7b70-49ff-95f7-4eb7d00f7b9e",
    "title": "Senior Backend Engineer",
    "description": "Lead API architecture in TypeScript and Node.js",
    "location": "Remote",
    "status": "OPEN",
    "createdAt": "2026-09-07T03:00:00.000Z",
    "updatedAt": "2026-09-07T03:00:00.000Z"
  }
  ```
- **Error (404 Not Found):**
  ```json
  {
    "error": "NotFoundError",
    "message": "Job with ID '...' not found"
  }
  ```

---

### 4. Close a Job
- **Method:** `PATCH`
- **Path:** `/api/v1/jobs/:id/close`
- **Response (200 OK):**
  ```json
  {
    "id": "c6204c31-7b70-49ff-95f7-4eb7d00f7b9e",
    "title": "Senior Backend Engineer",
    "description": "Lead API architecture in TypeScript and Node.js",
    "location": "Remote",
    "status": "CLOSED",
    "createdAt": "2026-09-07T03:00:00.000Z",
    "updatedAt": "2026-09-07T03:05:00.000Z"
  }
  ```
- **Error (400 Bad Request):** If the job is already `CLOSED`.

---

### 5. Submit an Application
- **Method:** `POST`
- **Path:** `/api/v1/jobs/:id/applications`
- **Path Parameter:**
  - `id`: Valid UUID of the job
- **Request Body:**
  ```json
  {
    "candidateName": "Jane Doe",
    "candidateEmail": "jane.doe@example.com"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": "e4b6c934-2978-4395-8121-65123d463b21",
    "jobId": "c6204c31-7b70-49ff-95f7-4eb7d00f7b9e",
    "candidateName": "Jane Doe",
    "candidateEmail": "jane.doe@example.com",
    "submittedAt": "2026-09-07T03:10:00.000Z"
  }
  ```
- **Error (422 Unprocessable Entity):** If the job is `CLOSED`.
- **Error (404 Not Found):** If the job does not exist.

---

### 6. List Applications for a Job
- **Method:** `GET`
- **Path:** `/api/v1/jobs/:id/applications`
- **Path Parameter:**
  - `id`: Valid UUID of the job
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "e4b6c934-2978-4395-8121-65123d463b21",
        "jobId": "c6204c31-7b70-49ff-95f7-4eb7d00f7b9e",
        "candidateName": "Jane Doe",
        "candidateEmail": "jane.doe@example.com",
        "submittedAt": "2026-09-07T03:10:00.000Z"
      }
    ],
    "total": 1
  }
  ```

---

## 🛡 Business Rules & Error Handling

1. **Job Status Guard**: Newly created jobs start in `OPEN` status.
2. **Application Restriction**: Candidates can only apply to jobs in `OPEN` status. Submitting to a `CLOSED` job returns a `422 Unprocessable Entity` (`JobClosedError`).
3. **Idempotent Closure Guard**: Attempting to close a job that is already `CLOSED` returns a `400 Bad Request` (`BadRequestError`).
4. **Validation**: All incoming requests are validated against strict Zod schemas. Invalid payloads return HTTP `400` with descriptive error messages.
5. **Centralized Error Handling**: Any operational or unexpected errors are caught by Express middleware and formatted into a consistent JSON response:
   ```json
   {
     "error": "ErrorName",
     "message": "Detailed error message"
   }
   ```

