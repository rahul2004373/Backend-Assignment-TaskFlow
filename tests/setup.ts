import { beforeAll, beforeEach, afterAll } from 'vitest';
import { prisma } from '../src/lib/prisma.ts';

beforeAll(async () => {
  // Check if we are connected to the test database
  if (!process.env.DATABASE_URL?.includes('taskflow_test')) {
    console.warn('WARNING: Not using the test database. Ensure DATABASE_URL is set correctly in .env.test');
  }
});

beforeEach(async () => {
  // Truncate all tables before each test to ensure clean state
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.error('Error truncating tables:', error);
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});
