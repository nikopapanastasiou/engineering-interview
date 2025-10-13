import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useTeams } from '../state/teams';
import { Button, Card, Container, ErrorText, Grid, Heading, Input, Text } from '../components/ui';
import { PokemonDetail } from '../components/PokemonDetail';
import { api } from '../api/client';
import { Pokemon } from '../types/pokemon';
import styled, { css } from '@emotion/styled';

const teamCardCss = css`
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid ${({ hasWarning }) => (hasWarning ? COLORS.warning : COLORS.gray200)};
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const TeamHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const TeamName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${COLORS.textPrimary};
  margin: 0;
`;

const TeamCount = styled.span<{ isFull?: boolean; isEmpty?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ isFull, isEmpty }) => (isFull ? COLORS.success : isEmpty ? COLORS.error : COLORS.textSecondary)};
`;

const WarningBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #FFF3E0;
  border: 1px solid ${COLORS.warning};
  border-radius: 6px;
  font-size: 12px;
  color: #E65100;
  font-weight: 600;
  margin-top: 8px;
`;

const MemberCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
  padding: 8px;
  background: ${COLORS.surface};
  border: 1px solid ${COLORS.gray200};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  &:hover {
    background: ${COLORS.gray50};
    border-color: ${COLORS.secondary};
  }
`;


const MemberImage = styled.img`
  width: 64px;
  height: 64px;
  object-fit: contain;
`;

const MemberName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${COLORS.textPrimary};
  text-transform: capitalize;
  text-align: center;
`;

const MemberId = styled(PokemonId)`
  font-size: 10px;
`;

const WideModal = styled(Modal)`
  max-width: 900px;
`;

const ModalContent = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  margin-top: 16px;
`;

const LineupSection = styled.div`
  border-right: 1px solid ${COLORS.gray200};
  padding-right: 20px;
`;

const LineupTitle = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: ${COLORS.gray700};
  margin: 0 0 12px 0;
`;

const LineupCard = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: ${COLORS.gray50};
  border: 1px solid ${COLORS.gray200};
  border-radius: 6px;
  margin-bottom: 8px;
  position: relative;
`;

const LineupImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
`;

const LineupInfo = styled.div`
  flex: 1;
`;

const LineupName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${COLORS.textPrimary};
  text-transform: capitalize;
`;

const LineupId = styled.div`
  font-size: 11px;
  color: ${COLORS.gray400};
`;

const LineupRemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: ${COLORS.error};
  color: white;
  border: none;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  opacity: 0.9;
  &:hover {
    opacity: 1;
  }
`;

const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
`;


const SearchPokemonCard = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  padding: 12px;
  background: ${({ disabled }) => (disabled ? COLORS.gray50 : COLORS.surface)};
  border: 1px solid ${COLORS.gray200};
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: all 0.2s;
  min-height: 160px;
  position: relative;
  &:hover {
    ${({ disabled }) => !disabled && `transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-color: ${COLORS.secondary};`}
  }
  &:hover button {
    opacity: 0.9;
  }
`;

const SearchRemoveButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  background: ${COLORS.error};
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  &:hover {
    opacity: 1 !important;
  }
`;

const SearchPokemonImage = styled.img`
  width: 72px;
  height: 72px;
  object-fit: contain;
`;

const SearchPokemonName = styled.div`
  font-weight: 600;
  color: ${COLORS.textPrimary};
  text-transform: capitalize;
  font-size: 13px;
`;

const SmallTypeBadge = styled(TypeBadge)`
  padding: 2px 6px;
  font-size: 9px;
`;

const EmptySlot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: ${COLORS.gray50};
  border: 2px dashed ${COLORS.gray300};
  border-radius: 6px;
  color: ${COLORS.gray400};
  font-size: 12px;
  font-weight: 500;
  min-height: 100px;
`;

export function TeamsPage() {
  const { teams, createTeam, deleteTeam, addMember, removeMember } = useTeams();
  const [newName, setNewName] = useState('');
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingToTeamId, setAddingToTeamId] = useState<string | null>(null);
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingPokemon, setLoadingPokemon] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (showAddModal && allPokemon.length === 0) {
      setLoadingPokemon(true);
      // Fetch all pokemon with a large limit for the modal
      api<{ data: Pokemon[]; meta: any }>('/pokemon?limit=1000')
        .then((response) => setAllPokemon(response.data))
        .catch((err) => setError(err?.message || 'Failed to load pokemon'))
        .finally(() => setLoadingPokemon(false));
    }
  }, [showAddModal, allPokemon.length]);

  function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    createTeam(newName.trim());
    setNewName('');
  }

  function openAddModal(teamId: string) {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;
    if (team.members.length >= 6) {
      alert('This team is full (6/6 Pokémon)');
      return;
    }
    setAddingToTeamId(teamId);
    setShowAddModal(true);
    setSearchQuery('');
  }

  function handleAddPokemon(pokemon: Pokemon) {
    if (!addingToTeamId) return;
    const team = teams.find((t) => t.id === addingToTeamId);
    if (!team) return;
    
    if (team.members.length >= 6) {
      alert('Team is full (6/6 Pokémon)');
      return;
    }
    
    if (team.members.some((m) => m.id === pokemon.id)) {
      alert(`${pokemon.name} is already on this team!`);
      return;
    }
    
    addMember(addingToTeamId, { id: pokemon.id, name: pokemon.name });
  }

  async function handleMemberClick(memberId: number) {
    try {
      const pokemon = await api<Pokemon>(`/pokemon/${memberId}`);
      setSelectedPokemon(pokemon);
    } catch (err) {
      console.error('Failed to load pokemon details', err);
    }
  }

  function getTeamsContaining(pokemonId: number): string[] {
    return teams.filter((t) => t.members.some((m) => m.id === pokemonId)).map((t) => t.name);
  }

  const filteredPokemon = useMemo(() => {
    const s = searchQuery.trim().toLowerCase();
    if (!s) return allPokemon;
    return allPokemon.filter((p) => p.name.includes(s) || String(p.id) === s);
  }, [searchQuery, allPokemon]);

  const addingToTeam = teams.find((t) => t.id === addingToTeamId);

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Heading>Your Teams</Heading>
        <form onSubmit={onCreate} style={{ display: 'flex', gap: 8 }}>
          <Input placeholder="New team name" value={newName} onChange={(e) => setNewName(e.target.value)} style={{ minWidth: 200 }} />
          <Button type="submit">Create Team</Button>
        </form>
      </div>

      {teams.length === 0 ? (
        <Card>
          <Text>No teams yet. Create your first team above!</Text>
        </Card>
      ) : (
        <Grid cols={300}>
          {teams.map((team) => {
            const isFull = team.members.length === 6;
            const hasWarning = team.members.length < 6;
            return (
              <TeamCard key={team.id} hasWarning={hasWarning && team.members.length > 0}>
                <TeamHeader>
                  <TeamName>{team.name}</TeamName>
                  <TeamCount isFull={isFull} isEmpty={team.members.length === 0}>
                    {team.members.length}/6
                  </TeamCount>
                </TeamHeader>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                  {team.members.map((m) => {
                    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${m.id}.png`;
                    return (
                      <MemberCard key={m.id} onClick={() => handleMemberClick(m.id)}>
                        <RemoveButton
                          onClick={(e) => {
                            e.stopPropagation();
                            removeMember(team.id, m.id);
                          }}
                        >
                          ×
                        </RemoveButton>
                        <MemberImage src={spriteUrl} alt={m.name} loading="lazy" />
                        <MemberId>#{m.id}</MemberId>
                        <MemberName>{m.name}</MemberName>
                      </MemberCard>
                    );
                  })}
                  {Array.from({ length: 6 - team.members.length }).map((_, i) => (
                    <EmptySlot key={`empty-${i}`}>Empty</EmptySlot>
                  ))}
                </div>

                {hasWarning && team.members.length > 0 && (
                  <WarningBadge>
                    ⚠️ Team has less than 6 Pokémon
                  </WarningBadge>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <Button onClick={() => openAddModal(team.id)} disabled={isFull} style={{ flex: 1, fontSize: 13 }}>
                    {isFull ? 'Team Full' : 'Add Pokémon'}
                  </Button>
                  <Button onClick={() => deleteTeam(team.id)} variant="danger" style={{ fontSize: 13 }}>
                    Delete
                  </Button>
                </div>
              </TeamCard>
            );
          })}
        </Grid>
      )}

      {showAddModal && addingToTeam && (
        <Overlay onClick={() => setShowAddModal(false)}>
          <WideModal onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowAddModal(false)}>×</CloseButton>
            <Heading style={{ marginBottom: 8 }}>Add Pokémon to {addingToTeam.name}</Heading>
            <Text style={{ marginBottom: 0, color: '#6b7280' }}>Team: {addingToTeam.members.length}/6 Pokémon</Text>
            
            <ModalContent>
              <LineupSection>
                <LineupTitle>Current Lineup ({addingToTeam.members.length}/6)</LineupTitle>
                {addingToTeam.members.length === 0 ? (
                  <Text style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>No Pokémon yet</Text>
                ) : (
                  addingToTeam.members.map((m) => {
                    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${m.id}.png`;
                    return (
                      <LineupCard key={m.id}>
                        <LineupRemoveButton
                          onClick={() => removeMember(addingToTeam.id, m.id)}
                          title="Remove from team"
                        >
                          ×
                        </LineupRemoveButton>
                        <LineupImage src={spriteUrl} alt={m.name} loading="lazy" />
                        <LineupInfo>
                          <LineupName>{m.name}</LineupName>
                          <LineupId>#{m.id}</LineupId>
                        </LineupInfo>
                      </LineupCard>
                    );
                  })
                )}
              </LineupSection>

              <SearchSection>
                <Input
                  placeholder="Search by name or id"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ marginBottom: 16 }}
                />

                {loadingPokemon && <Text>Loading Pokémon...</Text>}
                {error && <ErrorText>{error}</ErrorText>}

                <div style={{ maxHeight: '55vh', overflowY: 'auto' }}>
                  <Grid cols={130}>
                    {filteredPokemon.map((p) => {
                      const isOnTeam = addingToTeam.members.some((m) => m.id === p.id);
                      const spriteUrl = p.sprites?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
                      return (
                        <SearchPokemonCard
                          key={p.id}
                          disabled={isOnTeam}
                          onClick={() => !isOnTeam && handleAddPokemon(p)}
                        >
                          {isOnTeam && (
                            <SearchRemoveButton
                              onClick={(e) => {
                                e.stopPropagation();
                                removeMember(addingToTeam.id, p.id);
                              }}
                              title="Remove from team"
                            >
                              ×
                            </SearchRemoveButton>
                          )}
                          <SearchPokemonImage src={spriteUrl} alt={p.name} loading="lazy" />
                          <MemberId>#{p.id}</MemberId>
                          <SearchPokemonName>{p.name}</SearchPokemonName>
                          <div>
                            {p.types?.slice(0, 2).map((t) => (
                              <SmallTypeBadge key={t} type={t}>
                                {t}
                              </SmallTypeBadge>
                            ))}
                          </div>
                        </SearchPokemonCard>
                      );
                    })}
                  </Grid>
                </div>
              </SearchSection>
            </ModalContent>
          </WideModal>
        </Overlay>
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
