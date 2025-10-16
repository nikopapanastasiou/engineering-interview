import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../support/test-app';

describe('Teams E2E', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    app = await createTestApp();

    // Create a test user and get token
    const response = await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({
        email: `teams-test-${Date.now()}@example.com`,
        password: 'Test123!@#',
        displayName: 'Teams Test User',
      });

    accessToken = response.body.access_token;
    userId = response.body.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/teams', () => {
    it('should create a new team', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/teams')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'My Elite Four Team',
        })
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: 'My Elite Four Team',
        userId: expect.any(String),
        createdAt: expect.any(String),
      });
    });

    it('should reject team creation without authentication', async () => {
      await request(app.getHttpServer())
        .post('/api/teams')
        .send({
          name: 'Unauthorized Team',
        })
        .expect(401);
    });

    it('should reject team creation with invalid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/teams')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          // missing name
        })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });

    it('should coerce non-string name to string', async () => {
      // API uses transform: true which coerces types
      const response = await request(app.getHttpServer())
        .post('/api/teams')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 123,
        })
        .expect(201);

      expect(response.body.name).toBe('123');
    });
  });

  describe('GET /api/teams', () => {
    let teamId: string;

    beforeAll(async () => {
      // Create a team for testing
      const response = await request(app.getHttpServer())
        .post('/api/teams')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Team for Listing',
        });

      teamId = response.body.id;
    });

    it('should return all teams for authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/teams')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        userId: expect.any(String),
      });
    });

    it('should reject request without authentication', async () => {
      await request(app.getHttpServer())
        .get('/api/teams')
        .expect(401);
    });
  });

  describe('GET /api/teams/:id', () => {
    let teamId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/teams')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Team for Get',
        });

      teamId = response.body.id;
    });

    it('should return team by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/teams/${teamId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: teamId,
        name: 'Test Team for Get',
        userId: expect.any(String),
      });
    });

    it('should return 404 for non-existent team', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app.getHttpServer())
        .get(`/api/teams/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: expect.stringContaining('not found'),
      });
    });
  });

  describe('PATCH /api/teams/:id', () => {
    let teamId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/teams')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Team to Update',
        });

      teamId = response.body.id;
    });

    it('should update team name', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/teams/${teamId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Updated Team Name',
        })
        .expect(200);

      expect(response.body).toMatchObject({
        id: teamId,
        name: 'Updated Team Name',
      });
    });

    it('should return 404 for non-existent team', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .patch(`/api/teams/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'New Name',
        })
        .expect(404);
    });
  });

  describe('DELETE /api/teams/:id', () => {
    it('should delete a team', async () => {
      // Create a team to delete
      const createResponse = await request(app.getHttpServer())
        .post('/api/teams')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Team to Delete',
        });

      const teamId = createResponse.body.id;

      // Delete the team
      await request(app.getHttpServer())
        .delete(`/api/teams/${teamId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Verify it's deleted
      await request(app.getHttpServer())
        .get(`/api/teams/${teamId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent team', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .delete(`/api/teams/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('POST /api/teams/:id/pokemon', () => {
    let teamId: string;

    beforeEach(async () => {
      // Create a fresh team for each test
      const response = await request(app.getHttpServer())
        .post('/api/teams')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Team for Pokemon',
        });

      teamId = response.body.id;
    });

    it('should add pokemon to team', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/teams/${teamId}/pokemon`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          pokemonId: 25, // Pikachu
        })
        .expect(201);

      expect(response.body).toMatchObject({
        teamId,
        pokemonId: 25,
      });
    });

    it('should reject adding pokemon with invalid ID', async () => {
      await request(app.getHttpServer())
        .post(`/api/teams/${teamId}/pokemon`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          pokemonId: -1,
        })
        .expect(400);
    });

    it('should reject adding duplicate pokemon to team', async () => {
      // Add pokemon first time
      await request(app.getHttpServer())
        .post(`/api/teams/${teamId}/pokemon`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          pokemonId: 25,
        })
        .expect(201);

      // Try to add same pokemon again
      const response = await request(app.getHttpServer())
        .post(`/api/teams/${teamId}/pokemon`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          pokemonId: 25,
        })
        .expect(409);

      expect(response.body.message).toContain('already exists');
    });

    it('should reject adding more than 6 pokemon to team', async () => {
      // Add 6 pokemon
      for (let i = 1; i <= 6; i++) {
        await request(app.getHttpServer())
          .post(`/api/teams/${teamId}/pokemon`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            pokemonId: i,
          })
          .expect(201);
      }

      // Try to add 7th pokemon - database constraint will prevent this
      const response = await request(app.getHttpServer())
        .post(`/api/teams/${teamId}/pokemon`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          pokemonId: 7,
        })
        .expect(500);

      // Database constraint error
      expect(response.body.statusCode).toBe(500);
    });
  });

  describe('DELETE /api/teams/:id/pokemon/:pokemonId', () => {
    let teamId: string;

    beforeEach(async () => {
      // Create a team with a pokemon
      const response = await request(app.getHttpServer())
        .post('/api/teams')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Team for Pokemon Removal',
        });

      teamId = response.body.id;

      await request(app.getHttpServer())
        .post(`/api/teams/${teamId}/pokemon`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          pokemonId: 25,
        });
    });

    it('should remove pokemon from team', async () => {
      await request(app.getHttpServer())
        .delete(`/api/teams/${teamId}/pokemon/25`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Verify pokemon is removed
      const roster = await request(app.getHttpServer())
        .get(`/api/teams/${teamId}/roster`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(roster.body).toHaveLength(0);
    });

    it('should return 404 when removing non-existent pokemon', async () => {
      await request(app.getHttpServer())
        .delete(`/api/teams/${teamId}/pokemon/999`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('GET /api/teams/:id/roster', () => {
    let teamId: string;

    beforeAll(async () => {
      // Create a team with pokemon
      const response = await request(app.getHttpServer())
        .post('/api/teams')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Team with Roster',
        });

      teamId = response.body.id;

      // Add some pokemon
      await request(app.getHttpServer())
        .post(`/api/teams/${teamId}/pokemon`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ pokemonId: 25 }); // Pikachu

      await request(app.getHttpServer())
        .post(`/api/teams/${teamId}/pokemon`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ pokemonId: 1 }); // Bulbasaur
    });

    it('should return team roster with pokemon details', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/teams/${teamId}/roster`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        teamId,
        pokemonId: expect.any(Number),
        pokemon: {
          id: expect.any(Number),
          name: expect.any(String),
        },
      });
    });

    it('should return empty array for team with no pokemon', async () => {
      // Create empty team
      const emptyTeamResponse = await request(app.getHttpServer())
        .post('/api/teams')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Empty Team',
        });

      const response = await request(app.getHttpServer())
        .get(`/api/teams/${emptyTeamResponse.body.id}/roster`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });
});
