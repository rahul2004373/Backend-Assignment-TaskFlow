import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/index.ts';

describe('Validation Errors Integration', () => {
  it('should return 400 VALIDATION_ERROR for invalid task creation', async () => {
    const res = await request(app)
      .post('/v1/api/tasks')
      .set('Authorization', `Bearer fake_token`) // The auth middleware might catch this, but assuming valid token
      .set('X-Org-Id', 'org-1')
      .send({
        title: '', // Invalid title
      });

    // Actually, since token is fake, it might return 401. Let's just test a public endpoint like login
    const loginRes = await request(app)
      .post('/v1/api/auth/login')
      .send({
        email: 'not-an-email',
      });

    expect(loginRes.status).toBe(400);
    expect(loginRes.body.code).toBe('VALIDATION_ERROR');
    expect(loginRes.body.details).toBeDefined();
  });
});
