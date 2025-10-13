import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useTeams } from '../state/teams';
import { Button, Card, Container, ErrorText, Grid, Heading, Input, Text } from '../components/ui';
import { PokemonDetail } from '../components/PokemonDetail';
import { PokemonImage, PokemonName, PokemonId, TypeBadge } from '../components/shared';
import styled from '@emotion/styled';

type Pokemon = {
  id: number;
  name: string;
  height?: number;
  weight?: number;
  base_experience?: number;
  types?: string[];
  abilities?: string[];
  stats?: Record<string, number>;
  sprites?: any;
};

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
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    api<Pokemon[]>('/pokemon')
      .then((data) => {
        if (mounted) setAll(data);
      })
      .catch((err) => setError(err?.message || 'Failed to load pokemon'))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

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
      {loading && <Text>Loading…</Text>}
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
      {selectedPokemon && (
        <PokemonDetail
          pokemon={selectedPokemon}
          teamsContaining={getTeamsContaining(selectedPokemon.id)}
          onClose={() => setSelectedPokemon(null)}
          onAddToTeam={currentTeamId ? () => addToTeam(selectedPokemon) : undefined}
        />
      )}
    </Container>
  );
}
