import { api } from '../api/client';
import { Pokemon, PaginatedResponse } from '../types/pokemon';

export interface FetchPokemonRequest {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Service layer for all Pokemon-related API operations
 * Provides a clean interface and handles error management
 */
export class PokemonService {
  /**
   * Fetch paginated Pokemon data
   */
  static async fetchPokemon(request: FetchPokemonRequest = {}): Promise<PaginatedResponse<Pokemon>> {
    const { page = 1, limit = 50, search } = request;
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search?.trim()) {
        params.set('search', search.trim());
      }
      
      return await api<PaginatedResponse<Pokemon>>(`/pokemon?${params}`);
    } catch (error) {
      throw new Error(`Failed to fetch Pokemon: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch a single Pokemon by ID
   */
  static async fetchPokemonById(id: number): Promise<Pokemon> {
    try {
      return await api<Pokemon>(`/pokemon/${id}`);
    } catch (error) {
      throw new Error(`Failed to fetch Pokemon ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch many Pokemon (for modals, etc.)
   */
  static async fetchManyPokemon(limit: number = 1000): Promise<Pokemon[]> {
    try {
      const response = await api<PaginatedResponse<Pokemon>>(`/pokemon?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Pokemon list: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
