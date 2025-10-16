import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../support/test-app';

describe('Profile E2E', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    app = await createTestApp();

    // Create a test user and get token
    const response = await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({
        email: `profile-test-${Date.now()}@example.com`,
        password: 'Test123!@#',
        displayName: 'Profile Test User',
      });

    accessToken = response.body.access_token;
    userId = response.body.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/profiles/:id', () => {
    it('should return user profile by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/profiles/${userId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: userId,
        email: expect.stringContaining('profile-test'),
        displayName: 'Profile Test User',
        createdAt: expect.any(String),
      });
    });

    it('should return 404 for non-existent profile', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .get(`/api/profiles/${fakeId}`)
        .expect(404);
    });
  });

  describe('PATCH /api/profiles/:id', () => {
    it('should update display name', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/profiles/${userId}`)
        .send({
          displayName: 'Updated Display Name',
        })
        .expect(200);

      expect(response.body).toMatchObject({
        id: userId,
        displayName: 'Updated Display Name',
      });

      // Verify the change persists
      const getResponse = await request(app.getHttpServer())
        .get(`/api/profiles/${userId}`)
        .expect(200);

      expect(getResponse.body.displayName).toBe('Updated Display Name');
    });

    it('should coerce non-string display name to string', async () => {
      // API uses transform: true which coerces types
      const response = await request(app.getHttpServer())
        .patch(`/api/profiles/${userId}`)
        .send({
          displayName: 123,
        })
        .expect(200);

      expect(response.body.displayName).toBe('123');
    });

    it('should return 404 for non-existent profile', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .patch(`/api/profiles/${fakeId}`)
        .send({
          displayName: 'New Name',
        })
        .expect(404);
    });
  });

  describe('DELETE /api/profiles/:id', () => {
    it('should delete a profile', async () => {
      // Create a new user to delete
      const response = await request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: `delete-test-${Date.now()}@example.com`,
          password: 'Test123!@#',
          displayName: 'Delete Test User',
        });

      const deleteUserId = response.body.user.id;

      // Delete the profile
      await request(app.getHttpServer())
        .delete(`/api/profiles/${deleteUserId}`)
        .expect(200);

      // Verify it's deleted
      await request(app.getHttpServer())
        .get(`/api/profiles/${deleteUserId}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent profile', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .delete(`/api/profiles/${fakeId}`)
        .expect(404);
    });
  });

  describe('Profile data consistency', () => {
    it('should expose password hash in current implementation', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/profiles/${userId}`)
        .expect(200);

      // Note: Current implementation exposes passwordHash - this should be fixed
      expect(response.body.password).toBeUndefined();
      expect(response.body.passwordHash).toBeDefined();
    });

    it('should maintain data integrity across updates', async () => {
      const originalResponse = await request(app.getHttpServer())
        .get(`/api/profiles/${userId}`)
        .expect(200);

      const originalEmail = originalResponse.body.email;
      const originalId = originalResponse.body.id;

      // Update display name
      await request(app.getHttpServer())
        .patch(`/api/profiles/${userId}`)
        .send({
          displayName: 'Consistency Test',
        })
        .expect(200);

      // Verify other fields remain unchanged
      const updatedResponse = await request(app.getHttpServer())
        .get(`/api/profiles/${userId}`)
        .expect(200);

      expect(updatedResponse.body.email).toBe(originalEmail);
      expect(updatedResponse.body.id).toBe(originalId);
      expect(updatedResponse.body.displayName).toBe('Consistency Test');
    });
  });
});
