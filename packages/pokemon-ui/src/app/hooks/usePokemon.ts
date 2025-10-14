import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { Pokemon, PaginatedResponse } from '../types/pokemon';

export interface UsePokemonOptions {
  limit?: number;
  search?: string;
}

interface PokemonPageParam {
  page: number;
  limit: number;
  search?: string;
}

// Fetch function for a single page
const fetchPokemonPage = async ({ page, limit, search }: PokemonPageParam): Promise<PaginatedResponse<Pokemon>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search?.trim()) {
    params.set('search', search.trim());
  }
  
  return api<PaginatedResponse<Pokemon>>(`/pokemon?${params}`);
};

export function usePokemon({ limit = 50, search }: UsePokemonOptions = {}) {
  return useInfiniteQuery({
    queryKey: ['pokemon', { limit, search }],
    queryFn: ({ pageParam = 1 }) => 
      fetchPokemonPage({ 
        page: pageParam as number, 
        limit, 
        search 
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If there's a next page, return the next page number
      if (lastPage.meta.hasNextPage) {
        return allPages.length + 1;
      }
      // No more pages
      return undefined;
    },
    // Combine all pages into a single array
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      // Flatten all Pokemon from all pages
      pokemon: data.pages.flatMap(page => page.data),
      // Get total from the last page
      total: data.pages[data.pages.length - 1]?.meta.total || 0,
      // Check if there are more pages
      hasNextPage: data.pages[data.pages.length - 1]?.meta.hasNextPage || false,
    }),
    // Only refetch when search changes
    staleTime: search ? 0 : 5 * 60 * 1000, // 5 minutes for general browsing, immediate for search
  });
}

// Hook for getting a single Pokemon by ID
export function usePokemonById(id: number) {
  return useQuery({
    queryKey: ['pokemon', 'single', id],
    queryFn: () => api<Pokemon>(`/pokemon/${id}`),
    enabled: !!id,
  });
}
