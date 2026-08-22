import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/index.ts';

describe('Auth Flow Integration', () => {
  it('should successfully register and login a user', async () => {
    const userData = {
      name: 'Integration Test User',
      email: 'integration@example.com',
      password: 'password123',
    };

    // 1. Register
    const registerRes = await request(app)
      .post('/v1/api/auth/register')
      .send(userData);

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.data).toHaveProperty('id');
    expect(registerRes.body.data.email).toBe(userData.email);

    // 2. Login
    const loginRes = await request(app)
      .post('/v1/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password,
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data).toHaveProperty('access_token');
    expect(loginRes.body.data).toHaveProperty('refresh_token');
  });

  it('should return 400 for invalid register payload', async () => {
    const res = await request(app)
      .post('/v1/api/auth/register')
      .send({
        name: '',
        email: 'not-an-email',
      });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });
});
