import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../support/test-app';

describe('Auth E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/auth/signup', () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;

    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: uniqueEmail,
          password: 'Test123!@#',
          displayName: 'Test User',
        })
        .expect(201);

      expect(response.body).toMatchObject({
        access_token: expect.any(String),
        user: {
          email: uniqueEmail,
          displayName: 'Test User',
        },
      });
    });

    it('should reject registration with duplicate email', async () => {
      const duplicateEmail = `duplicate-${Date.now()}@example.com`;

      // First registration
      await request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: duplicateEmail,
          password: 'Test123!@#',
          displayName: 'First User',
        })
        .expect(201);

      // Duplicate registration
      const response = await request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: duplicateEmail,
          password: 'Test123!@#',
          displayName: 'Second User',
        })
        .expect(409);

      expect(response.body).toMatchObject({
        statusCode: 409,
        message: expect.stringContaining('already exists'),
      });
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: 'not-an-email',
          password: 'Test123!@#',
          displayName: 'Test User',
        })
        .expect(400);

      // message can be a string or array
      const message = Array.isArray(response.body.message) 
        ? response.body.message.join(' ') 
        : response.body.message;
      expect(message).toContain('email');
    });

    it('should reject registration with missing fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          // missing password and displayName
        })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    const testEmail = `login-test-${Date.now()}@example.com`;
    const testPassword = 'Test123!@#';

    beforeAll(async () => {
      // Create a test user
      await request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: testEmail,
          password: testPassword,
          displayName: 'Login Test User',
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(200);

      expect(response.body).toMatchObject({
        access_token: expect.any(String),
        user: {
          email: testEmail,
          displayName: 'Login Test User',
        },
      });
    });

    it('should reject login with wrong password', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword123',
        })
        .expect(401);

      expect(response.body).toMatchObject({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test123!@#',
        })
        .expect(401);

      expect(response.body).toMatchObject({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    });

    it('should reject login with missing fields', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testEmail,
          // missing password
        })
        .expect(400);
    });
  });

  describe('Authentication token validation', () => {
    let accessToken: string;
    let userId: string;

    beforeAll(async () => {
      // Register and get token
      const response = await request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: `token-test-${Date.now()}@example.com`,
          password: 'Test123!@#',
          displayName: 'Token Test User',
        });

      accessToken = response.body.access_token;
      userId = response.body.user.id;
    });

    it('should access protected endpoint with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/teams')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should reject protected endpoint without token', async () => {
      await request(app.getHttpServer())
        .get('/api/teams')
        .expect(401);
    });

    it('should reject protected endpoint with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/api/teams')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
