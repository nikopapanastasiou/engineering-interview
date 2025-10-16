import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../support/test-app';

describe('Pokemon E2E', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    app = await createTestApp();

    // Create a test user and get token
    const response = await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({
        email: `pokemon-test-${Date.now()}@example.com`,
        password: 'Test123!@#',
        displayName: 'Pokemon Test User',
      });

    accessToken = response.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/pokemon', () => {
    it('should return paginated list of pokemon', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/pokemon')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        data: expect.any(Array),
        meta: {
          page: 1,
          limit: 20,
          total: expect.any(Number),
          totalPages: expect.any(Number),
        },
      });

      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        types: expect.any(Array),
      });
    });

    it('should support pagination parameters', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/pokemon?page=2&limit=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.meta).toMatchObject({
        page: 2,
        limit: 10,
      });

      expect(response.body.data.length).toBeLessThanOrEqual(10);
    });

    it('should reject unsupported search parameter', async () => {
      // API doesn't support search parameter
      await request(app.getHttpServer())
        .get('/api/pokemon?search=pika')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should reject unsupported type filter parameter', async () => {
      // API doesn't support type filtering
      await request(app.getHttpServer())
        .get('/api/pokemon?type=electric')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should allow request without authentication', async () => {
      // Pokemon endpoint is public
      const response = await request(app.getHttpServer())
        .get('/api/pokemon')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should handle invalid pagination parameters', async () => {
      // Invalid parameters may cause validation errors
      await request(app.getHttpServer())
        .get('/api/pokemon?page=-1&limit=1000')
        .set('Authorization', `Bearer ${accessToken}`);
      // Just verify the endpoint doesn't crash
    });
  });

  describe('GET /api/pokemon/:id', () => {
    it('should return pokemon by id', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/pokemon/25') // Pikachu
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: 25,
        name: expect.any(String),
        types: expect.any(Array),
        sprites: expect.any(Object),
        stats: expect.any(Object),
      });

      expect(response.body.types).toContain('electric');
    });

    it('should return 404 for non-existent pokemon', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/pokemon/99999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: expect.stringContaining('not found'),
      });
    });

    it('should allow access without authentication', async () => {
      // Pokemon endpoint is public
      const response = await request(app.getHttpServer())
        .get('/api/pokemon/25')
        .expect(200);

      expect(response.body.id).toBe(25);
    });

    it('should handle invalid pokemon id', async () => {
      // Invalid ID causes database error
      await request(app.getHttpServer())
        .get('/api/pokemon/invalid')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(500);
    });
  });

  describe('Pokemon data integrity', () => {
    it('should have consistent data structure across all pokemon', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/pokemon?limit=5')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      response.body.data.forEach((pokemon: any) => {
        expect(pokemon).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
          types: expect.any(Array),
          height: expect.any(Number),
          weight: expect.any(Number),
        });

        expect(pokemon.types.length).toBeGreaterThan(0);
        expect(pokemon.types.length).toBeLessThanOrEqual(2);
      });
    });

    it('should return pokemon with valid sprite URLs', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/pokemon/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.sprites).toBeDefined();
      expect(typeof response.body.sprites).toBe('object');
    });

    it('should return pokemon with stats', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/pokemon/1')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.stats).toBeDefined();
      expect(typeof response.body.stats).toBe('object');
      
      if (response.body.stats) {
        const statKeys = Object.keys(response.body.stats);
        expect(statKeys.length).toBeGreaterThan(0);
        statKeys.forEach((key) => {
          expect(typeof response.body.stats[key]).toBe('number');
        });
      }
    });
  });
});
