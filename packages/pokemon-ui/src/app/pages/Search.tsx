import React, { useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Grid, Card, Text, Input, Container, Heading, ErrorText } from '../components/ui';
import { useTeams } from '../state/teams';
import { PokemonDetail } from '../components/PokemonDetail';
import { PokemonImage, PokemonName, PokemonId, TypeBadge } from '../components/shared';
import { Pokemon } from '../types/pokemon';
import { usePokemon } from '../hooks/usePokemon';
import styled from '@emotion/styled';

const PokemonCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  min-height: 220px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export function SearchPage() {
  const { addMember, currentTeamId, teams } = useTeams();
  const [q, setQ] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  
  // Use React Query for Pokemon data - this prevents duplicates automatically
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePokemon({ 
    limit: 50,
    search: q.trim() || undefined // Only pass search if there's actually a query
  });
  
  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  // Trigger load more when scroll sentinel is in view
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Client-side filtering for real-time search
  const filtered = useMemo(() => {
    if (!data?.pokemon) return [];
    
    const s = q.trim().toLowerCase();
    if (!s) return data.pokemon;
    
    return data.pokemon.filter((p) => p.name.toLowerCase().includes(s) || String(p.id) === s);
  }, [q, data?.pokemon]);

  function addToTeam(p: Pokemon) {
    if (!currentTeamId) return alert('Create/select a team first on Teams page');
    addMember(currentTeamId, { id: p.id, name: p.name });
    setSelectedPokemon(null);
  }

  function getTeamsContaining(pokemonId: number): string[] {
    return teams.filter((t) => t.members.some((m) => m.id === pokemonId)).map((t) => t.name);
  }

  const currentTeam = teams.find((t) => t.id === currentTeamId);

  return (
    <Container>
      <Heading>Search Pokémon</Heading>
      {currentTeam && (
        <Text style={{ marginBottom: 12 }}>
          Adding to: <strong>{currentTeam.name}</strong> ({currentTeam.members.length}/6)
        </Text>
      )}
      <Input
        placeholder="Search by name or id"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ maxWidth: 400, marginBottom: 16 }}
      />
      
      {/* Status indicators */}
      {data?.total && (
        <Text style={{ marginBottom: 12 }}>
          Showing {filtered.length} of {data.total} Pokémon
        </Text>
      )}
      {isLoading && <Text>Loading…</Text>}
      {error && <ErrorText>{error instanceof Error ? error.message : 'Failed to load pokemon'}</ErrorText>}
      
      {/* Pokemon Grid */}
      <Grid cols={180}>
        {filtered.map((p) => {
          const spriteUrl = p.sprites?.front_default || p.sprites?.other?.['official-artwork']?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
          return (
            <PokemonCard key={p.id} onClick={() => setSelectedPokemon(p)}>
              <PokemonImage src={spriteUrl} alt={p.name} loading="lazy" />
              <PokemonId>#{p.id}</PokemonId>
              <PokemonName>{p.name}</PokemonName>
              <div>
                {p.types?.slice(0, 2).map((t) => (
                  <TypeBadge key={t} type={t}>
                    {t}
                  </TypeBadge>
                ))}
              </div>
            </PokemonCard>
          );
        })}
      </Grid>
      
      {/* Infinite scroll sentinel */}
      {hasNextPage && (
        <div ref={loadMoreRef} style={{ height: 20, margin: '24px 0' }}>
          {isFetchingNextPage && (
            <Text style={{ textAlign: 'center' }}>Loading more Pokémon...</Text>
          )}
        </div>
      )}
      
      {/* End message */}
      {!hasNextPage && filtered.length > 0 && (
        <Text style={{ textAlign: 'center', marginTop: 24, color: '#9ca3af' }}>
          You've reached the end! All {data?.total || filtered.length} Pokémon loaded.
        </Text>
      )}
      
      {/* Pokemon Detail Modal */}
      {selectedPokemon && (
        <PokemonDetail
          pokemon={selectedPokemon}
          teamsContaining={getTeamsContaining(selectedPokemon.id)}
          onClose={() => setSelectedPokemon(null)}
          onAddToTeam={() => addToTeam(selectedPokemon)}
        />
      )}
    </Container>
  );
}
