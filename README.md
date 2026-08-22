# TaskFlow API

TaskFlow is a multi-tenant task management backend built with Node.js, Express, TypeScript, and PostgreSQL. It features robust organization-based data isolation, asynchronous background jobs using Redis and BullMQ, and comprehensive validation with Zod.

## Features

- Multi-tenant architecture (Users, Organizations, Projects, Tasks).
- Strict data isolation using custom organization headers.
- Background jobs for asynchronous email notifications via BullMQ.
- Cursor/Offset-based pagination and filtering.
- Standardized error handling and API responses.
- Interactive API documentation with Swagger UI.

## Prerequisites

- Node.js 20+
- Docker and Docker Compose
- PostgreSQL (if running locally without Docker)
- Redis (if running locally without Docker)

## Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Configure environment variables. Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://taskflow:taskflow123@localhost:5432/taskflow?schema=public"
JWT_SECRET="your_jwt_secret_key"
REDIS_URL="redis://localhost:6379"
PORT=3000
```

## Running with Docker (Recommended)

The easiest way to get the entire stack running (API, Worker, Database, and Redis) is using Docker Compose.

```bash
docker compose up --build
```

This command will:
- Spin up PostgreSQL and Redis.
- Automatically apply database schemas.
- Start the API server on port 3000.
- Start the BullMQ background worker process.

## Running Locally (Development)

If you prefer to run the Node.js processes directly on your host machine, ensure your local PostgreSQL and Redis servers are running, then execute:

1. Push the database schema:
```bash
npx prisma db push
```

2. Start the API server:
```bash
npm run dev
```

3. In a separate terminal, start the background worker:
```bash
npm run dev:worker
```

## API Documentation

Once the server is running, you can explore the endpoints via Swagger UI:
- http://localhost:3000/api-docs

A Postman collection (`TaskFlow.postman_collection.json`) is also included in the root directory. You can import this directly into Postman or Bruno.

## Testing

The test suite uses Vitest and Supertest. It requires a dedicated test database to ensure isolation.

1. Ensure your `.env.test` is configured to point to a test database (e.g., `taskflow_test`).
2. Run the test suite:

```bash
npm test
```

The tests will automatically truncate the database tables before each integration test to guarantee a clean state.

## Architecture & Design Patterns

The codebase enforces a strict separation of concerns:
- **Routes**: Define HTTP endpoints and attach validation/authentication middleware.
- **Controllers**: Handle request/response lifecycle and payload extraction.
- **Services**: Contain all core business logic and background job queuing.
- **Repositories**: Handle direct database operations via Prisma ORM. 
- **Validation**: Zod is used at the middleware level to enforce strict typing and payload constraints before requests reach the controller.
