import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../src/index.ts';

describe('Task CRUD Integration', () => {
  let token: string;
  let orgId: string;
  let projectId: string;
  let taskId: string;

  beforeAll(async () => {
    // Register and login
    await request(app).post('/v1/api/auth/register').send({ name: 'T', email: 't@ex.com', password: 'password123' });
    const login = await request(app).post('/v1/api/auth/login').send({ email: 't@ex.com', password: 'password123' });
    token = login.body.data.access_token;

    // Create org
    const org = await request(app).post('/v1/api/organizations').set('Authorization', `Bearer ${token}`).send({ name: 'Org T' });
    orgId = org.body.data.id;

    // Create project
    const p = await request(app)
      .post('/v1/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Org-Id', orgId)
      .send({ name: 'Project T', description: 'Desc' });
    projectId = p.body.data.id;
  });

  it('should create a task', async () => {
    const res = await request(app)
      .post('/v1/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Org-Id', orgId)
      .send({
        title: 'Task 1',
        description: 'Task Desc',
        project_id: projectId,
        status: 'todo',
        priority: 'high',
        due_date: new Date().toISOString(),
      });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Task 1');
    taskId = res.body.data.id;
  });

  it('should read tasks', async () => {
    const res = await request(app)
      .get('/v1/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Org-Id', orgId);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
