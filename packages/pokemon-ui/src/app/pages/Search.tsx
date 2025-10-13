import { useMemo, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Grid, Card, Text, Input, Container, Heading, ErrorText } from '../components/ui';
import { useTeams } from '../state/teams';
import { api } from '../api/client';
import { PokemonDetail } from '../components/PokemonDetail';
import { PokemonImage, PokemonName, PokemonId, TypeBadge } from '../components/shared';
import { Pokemon, PaginatedResponse } from '../types/pokemon';
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
  const [all, setAll] = useState<Pokemon[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  // Load Pokemon data
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    api<PaginatedResponse<Pokemon>>(`/pokemon?page=${page}&limit=50`)
      .then((response) => {
        if (mounted) {
          setAll((prev) => page === 1 ? response.data : [...prev, ...response.data]);
          setHasMore(response.meta.hasNextPage);
          setTotal(response.meta.total);
          setInitialLoad(false);
        }
      })
      .catch((err) => setError(err?.message || 'Failed to load pokemon'))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [page]);
  
  // Trigger load more when scroll sentinel is in view (but not on initial load)
  useEffect(() => {
    if (!initialLoad && inView && hasMore && !loading) {
      setPage((p) => p + 1);
    }
  }, [inView, hasMore, loading, initialLoad]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return all;
    return all.filter((p) => p.name.includes(s) || String(p.id) === s);
  }, [q, all]);

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
      {currentTeam && <Text style={{ marginBottom: 12 }}>Adding to: <strong>{currentTeam.name}</strong> ({currentTeam.members.length}/6)</Text>}
      <Input
        placeholder="Search by name or id"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ maxWidth: 400, marginBottom: 16 }}
      />
      {total > 0 && <Text style={{ marginBottom: 12 }}>Showing {all.length} of {total} Pokémon</Text>}
      {loading && page === 1 && <Text>Loading…</Text>}
      {error && <ErrorText>{error}</ErrorText>}
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
      
      {/* Infinite scroll sentinel - only show after initial load */}
      {!initialLoad && hasMore && all.length > 0 && (
        <div ref={loadMoreRef} style={{ height: 20, margin: '24px 0' }}>
          {loading && (
            <Text style={{ textAlign: 'center' }}>Loading more Pokémon...</Text>
          )}
        </div>
      )}
      
      {!hasMore && all.length > 0 && (
        <Text style={{ textAlign: 'center', marginTop: 24, color: '#9ca3af' }}>
          You've reached the end! All {total} Pokémon loaded.
        </Text>
      )}
      {selectedPokemon && (
        <PokemonDetail
          pokemon={selectedPokemon}
          teamsContaining={getTeamsContaining(selectedPokemon.id)}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </Container>
  );
}
