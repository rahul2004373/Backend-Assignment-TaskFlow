import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../src/index.ts';

describe('Tenant Isolation Integration', () => {
  let user1Token: string;
  let user2Token: string;
  let org1Id: string;
  let org2Id: string;
  let project1Id: string;

  beforeAll(async () => {
    // Register User 1
    await request(app).post('/v1/api/auth/register').send({ name: 'U1', email: 'u1@ex.com', password: 'password123' });
    const login1 = await request(app).post('/v1/api/auth/login').send({ email: 'u1@ex.com', password: 'password123' });
    user1Token = login1.body.data.access_token;

    // Register User 2
    await request(app).post('/v1/api/auth/register').send({ name: 'U2', email: 'u2@ex.com', password: 'password123' });
    const login2 = await request(app).post('/v1/api/auth/login').send({ email: 'u2@ex.com', password: 'password123' });
    user2Token = login2.body.data.access_token;

    // User 1 creates Org 1
    const org1 = await request(app).post('/v1/api/organizations').set('Authorization', `Bearer ${user1Token}`).send({ name: 'Org 1' });
    org1Id = org1.body.data.id;

    // User 2 creates Org 2
    const org2 = await request(app).post('/v1/api/organizations').set('Authorization', `Bearer ${user2Token}`).send({ name: 'Org 2' });
    org2Id = org2.body.data.id;

    // User 1 creates Project in Org 1
    const p1 = await request(app)
      .post('/v1/api/projects')
      .set('Authorization', `Bearer ${user1Token}`)
      .set('X-Org-Id', org1Id)
      .send({ name: 'Project 1', description: 'Desc' });
    project1Id = p1.body.data.id;
  });

  it('should allow User 1 to read their project in Org 1', async () => {
    const res = await request(app)
      .get(`/v1/api/projects/${project1Id}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .set('X-Org-Id', org1Id);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Project 1');
  });

  it('should return 403 when User 2 attempts to access Org 1 context', async () => {
    const res = await request(app)
      .get(`/v1/api/projects/${project1Id}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .set('X-Org-Id', org1Id); // User 2 trying to use Org 1 context

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('FORBIDDEN');
  });
});
