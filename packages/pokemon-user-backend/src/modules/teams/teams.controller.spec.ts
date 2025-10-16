import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { mock, MockProxy } from 'jest-mock-extended';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { createMockTeam } from '../../test/fixtures/team.fixtures';
import { createMockPokemon, createMockRosterEntry } from '../../test/fixtures/pokemon.fixtures';
import { createMockAuthRequest } from '../../test/fixtures/user.fixtures';

describe('TeamsController', () => {
  let controller: TeamsController;
  let mockTeamsService: MockProxy<TeamsService>;

  const mockTeam = createMockTeam();
  const mockRosterEntry = createMockRosterEntry();
  const mockAuthenticatedRequest = createMockAuthRequest();

  beforeEach(async () => {
    mockTeamsService = mock<TeamsService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        { provide: TeamsService, useValue: mockTeamsService },
      ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
  });

  describe('findAll', () => {
    it('should return teams for authenticated user', async () => {
      const userTeams = [mockTeam];
      mockTeamsService.findAllByUser.mockResolvedValue(userTeams);

      const result = await controller.findAll(mockAuthenticatedRequest);

      expect(mockTeamsService.findAllByUser).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(userTeams);
    });
  });

  describe('findOne', () => {
    it('should return a team by id', async () => {
      mockTeamsService.findById.mockResolvedValue(mockTeam);

      const result = await controller.findOne('team-1');

      expect(mockTeamsService.findById).toHaveBeenCalledWith('team-1');
      expect(result).toEqual(mockTeam);
    });

    it('should throw NotFoundException when team not found', async () => {
      const notFoundError = new NotFoundException('Team not found');
      mockTeamsService.findById.mockRejectedValue(notFoundError);

      await expect(controller.findOne('nonexistent')).rejects.toThrow(notFoundError);
    });
  });

  describe('create', () => {
    const createTeamDto = {
      name: 'New Team',
      userId: 'user-1', // This gets overridden by the controller
    };

    it('should create a new team for authenticated user', async () => {
      const createdTeam = { ...createTeamDto, id: 'new-team', userId: 'user-1' };
      mockTeamsService.create.mockResolvedValue(createdTeam as any);

      const result = await controller.create(mockAuthenticatedRequest, createTeamDto);

      expect(mockTeamsService.create).toHaveBeenCalledWith({
        ...createTeamDto,
        userId: 'user-1',
      });
      expect(result).toEqual(createdTeam);
    });
  });

  describe('update', () => {
    const updateTeamDto = {
      name: 'Updated Team',
    };

    it('should update an existing team', async () => {
      const updatedTeam = { ...mockTeam, ...updateTeamDto };
      mockTeamsService.update.mockResolvedValue(updatedTeam);

      const result = await controller.update('team-1', updateTeamDto);

      expect(mockTeamsService.update).toHaveBeenCalledWith('team-1', updateTeamDto);
      expect(result).toEqual(updatedTeam);
    });

    it('should throw NotFoundException when team not found', async () => {
      const notFoundError = new NotFoundException('Team not found');
      mockTeamsService.update.mockRejectedValue(notFoundError);

      await expect(controller.update('nonexistent', updateTeamDto)).rejects.toThrow(notFoundError);
    });
  });

  describe('remove', () => {
    it('should remove a team', async () => {
      mockTeamsService.remove.mockResolvedValue(undefined);

      await controller.remove('team-1');

      expect(mockTeamsService.remove).toHaveBeenCalledWith('team-1');
    });

    it('should throw NotFoundException when team not found', async () => {
      const notFoundError = new NotFoundException('Team not found');
      mockTeamsService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove('nonexistent')).rejects.toThrow(notFoundError);
    });
  });

  describe('addPokemon', () => {
    const addPokemonDto = {
      pokemonId: 1,
    };

    it('should add pokemon to team', async () => {
      const teamPokemon = { teamId: 'team-1', pokemonId: 1 };
      mockTeamsService.addPokemon.mockResolvedValue(teamPokemon);

      const result = await controller.addPokemon('team-1', addPokemonDto);

      expect(mockTeamsService.addPokemon).toHaveBeenCalledWith('team-1', 1);
      expect(result).toEqual(teamPokemon);
    });
  });

  describe('removePokemon', () => {
    it('should remove pokemon from team', async () => {
      mockTeamsService.removePokemon.mockResolvedValue(undefined);

      await controller.removePokemon('team-1', '1');

      expect(mockTeamsService.removePokemon).toHaveBeenCalledWith('team-1', 1);
    });

    it('should throw NotFoundException when pokemon not in team', async () => {
      const notFoundError = new NotFoundException('Pokemon not in team');
      mockTeamsService.removePokemon.mockRejectedValue(notFoundError);

      await expect(controller.removePokemon('team-1', '999')).rejects.toThrow(notFoundError);
    });
  });

  describe('roster', () => {
    it('should return team roster with pokemon details', async () => {
      const roster = [mockRosterEntry];
      mockTeamsService.roster.mockResolvedValue(roster as any);

      const result = await controller.roster('team-1');

      expect(mockTeamsService.roster).toHaveBeenCalledWith('team-1');
      expect(result).toEqual(roster);
    });
  });
});
