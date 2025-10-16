import { NotFoundException } from '@nestjs/common';
import { DeepMockProxy } from 'jest-mock-extended';
import { TeamsService } from './teams.service';
import { DrizzleDatabase } from '../database/db.tokens';
import { createMockDrizzleDb } from '../../test/mocks/drizzle.mock';
import { createMockTeam } from '../../test/fixtures/team.fixtures';

describe('TeamsService', () => {
  let service: TeamsService;
  let mockDb: DeepMockProxy<DrizzleDatabase>;

  const mockTeam = createMockTeam();

  beforeEach(() => {
    mockDb = createMockDrizzleDb();
    service = new TeamsService(mockDb);
  });

  describe('findById', () => {
    it('should return team when found', async () => {
      mockDb.query.teamsTable.findFirst.mockResolvedValue(mockTeam as any);

      const result = await service.findById('team-1');

      expect(result).toEqual(mockTeam);
      expect(mockDb.query.teamsTable.findFirst).toHaveBeenCalled();
    });

    it('should throw NotFoundException when team not found', async () => {
      mockDb.query.teamsTable.findFirst.mockResolvedValue(undefined);

      await expect(service.findById('nonexistent')).rejects.toThrow(
        new NotFoundException('Team nonexistent not found')
      );
    });
  });
});
