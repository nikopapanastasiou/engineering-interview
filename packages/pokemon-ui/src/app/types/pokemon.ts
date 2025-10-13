/**
 * Shared Pokemon type definitions
 * Centralized to avoid duplication across components
 */

export interface Pokemon {
  id: number;
  name: string;
  height?: number;
  weight?: number;
  baseExperience?: number;
  types?: string[];
  abilities?: string[];
  stats?: Record<string, number>;
  sprites?: {
    front_default?: string;
    front_shiny?: string;
    other?: {
      'official-artwork'?: {
        front_default?: string;
      };
      dream_world?: {
        front_default?: string;
      };
      home?: {
        front_default?: string;
        front_shiny?: string;
      };
    };
  };
  
  // Enhanced fields from species data
  description?: string;
  genus?: string;
  generation?: string;
  habitat?: string;
  shape?: string;
  color?: string;
  isLegendary?: boolean;
  isMythical?: boolean;
  evolutionChainId?: number;
  captureRate?: number;
  baseHappiness?: number;
  growthRate?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
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
