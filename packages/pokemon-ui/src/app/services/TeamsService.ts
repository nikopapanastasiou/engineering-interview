import { api } from '../api/client';

export interface CreateTeamRequest {
  name: string;
}

export interface AddPokemonRequest {
  pokemonId: number;
}

export interface UpdateTeamRequest {
  name: string;
}

export interface BackendTeam {
  id: string;
  name: string;
  profileId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendTeamMember {
  teamId: string;
  pokemonId: number;
  pokemon: {
    id: number;
    name: string;
  };
}

export interface Team {
  id: string;
  name: string;
  members: Array<{
    id: number;
    name: string;
  }>;
}

/**
 * Service layer for all team-related API operations
 * Provides a clean interface and handles error management
 */
export class TeamsService {
  /**
   * Fetch all teams for the current user
   */
  static async fetchTeams(): Promise<Team[]> {
    try {
      const backendTeams = await api<BackendTeam[]>('/teams');
      
      // Fetch roster for each team
      const teamsWithMembers = await Promise.all(
        backendTeams.map(async (bt) => {
          try {
            const roster = await api<BackendTeamMember[]>(`/teams/${bt.id}/roster`);
            const members = roster.map((r) => ({
              id: r.pokemonId,
              name: r.pokemon?.name || '',
            }));
            return { id: bt.id, name: bt.name, members };
          } catch {
            // If roster fetch fails, return team with empty members
            return { id: bt.id, name: bt.name, members: [] };
          }
        })
      );
      
      return teamsWithMembers;
    } catch (error) {
      throw new Error(`Failed to fetch teams: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new team
   */
  static async createTeam(request: CreateTeamRequest): Promise<BackendTeam> {
    try {
      const created = await api<BackendTeam>('/teams', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      return created;
    } catch (error) {
      throw new Error(`Failed to create team: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update team name
   */
  static async updateTeam(teamId: string, request: UpdateTeamRequest): Promise<void> {
    try {
      await api(`/teams/${teamId}`, {
        method: 'PATCH',
        body: JSON.stringify(request),
      });
    } catch (error) {
      throw new Error(`Failed to update team: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a team
   */
  static async deleteTeam(teamId: string): Promise<void> {
    try {
      await api(`/teams/${teamId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      throw new Error(`Failed to delete team: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Add a Pokemon to a team
   */
  static async addPokemonToTeam(teamId: string, request: AddPokemonRequest): Promise<void> {
    try {
      await api(`/teams/${teamId}/pokemon`, {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error) {
      throw new Error(`Failed to add Pokemon to team: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Remove a Pokemon from a team
   */
  static async removePokemonFromTeam(teamId: string, pokemonId: number): Promise<void> {
    try {
      await api(`/teams/${teamId}/pokemon/${pokemonId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      throw new Error(`Failed to remove Pokemon from team: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
