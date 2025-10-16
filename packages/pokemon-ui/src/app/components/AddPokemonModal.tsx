import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { Heading, Text, Input, ErrorText, Grid } from './ui';
import { Overlay, Modal, PokemonId, TypeBadge, COLORS } from './shared';
import { CloseIcon } from './icons';
import { Pokemon } from '../types/pokemon';
import { usePokemon } from '../hooks/usePokemon';

// Types
export interface Team {
  id: string;
  name: string;
  members: Array<{
    id: number;
    name: string;
  }>;
}

export interface AddPokemonModalProps {
  team: Team;
  onClose: () => void;
  onAddPokemon: (pokemon: Pokemon) => void;
  onRemoveMember: (teamId: string, pokemonId: number) => void;
}

// Styled Components
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
    ${({ disabled }) => !disabled && `
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: ${COLORS.secondary};
    `}
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

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${COLORS.gray500};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background: ${COLORS.gray100};
    color: ${COLORS.gray700};
  }
`;

const ScrollableGrid = styled.div`
  max-height: 55vh;
  overflow-y: auto;
  
  /* Add smooth scrolling */
  scroll-behavior: smooth;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  color: ${COLORS.textSecondary};
  font-size: 14px;
`;

export function AddPokemonModal({ 
  team, 
  onClose, 
  onAddPokemon, 
  onRemoveMember 
}: AddPokemonModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const scrollableRef = useRef<HTMLDivElement>(null);

  // Use infinite scroll hook
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePokemon({ 
    limit: 50, 
    search: searchQuery.trim() || undefined 
  });

  // Get all Pokemon from paginated data
  const allPokemon = data?.pokemon || [];

  // Infinite scroll logic
  const handleScroll = useCallback(() => {
    const container = scrollableRef.current;
    if (!container || !hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    // Load next page when 90% scrolled
    if (scrollPercentage > 0.9) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Attach scroll listener
  useEffect(() => {
    const container = scrollableRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const handleAddPokemon = (pokemon: Pokemon) => {
    if (team.members.length >= 6) {
      alert('Team is full (6/6 Pokémon)');
      return;
    }
    
    if (team.members.some((m) => m.id === pokemon.id)) {
      alert(`${pokemon.name} is already on this team!`);
      return;
    }
    
    onAddPokemon(pokemon);
  };

  return (
    <Overlay onClick={onClose}>
      <WideModal onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <CloseIcon size={18} />
        </CloseButton>
        
        <Heading style={{ marginBottom: 8 }}>Add Pokémon to {team.name}</Heading>
        <Text style={{ marginBottom: 0, color: COLORS.textSecondary }}>
          Team: {team.members.length}/6 Pokémon
        </Text>
        
        <ModalContent>
          {/* Current Lineup Section */}
          <LineupSection>
            <LineupTitle>Current Lineup ({team.members.length}/6)</LineupTitle>
            {team.members.length === 0 ? (
              <Text style={{ fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', padding: '20px 0' }}>
                No Pokémon yet
              </Text>
            ) : (
              team.members.map((member) => {
                const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.id}.png`;
                return (
                  <LineupCard key={member.id}>
                    <LineupRemoveButton
                      onClick={() => onRemoveMember(team.id, member.id)}
                      title="Remove from team"
                    >
                      <CloseIcon size={10} />
                    </LineupRemoveButton>
                    <LineupImage src={spriteUrl} alt={member.name} loading="lazy" />
                    <LineupInfo>
                      <LineupName>{member.name}</LineupName>
                      <LineupId>#{member.id}</LineupId>
                    </LineupInfo>
                  </LineupCard>
                );
              })
            )}
          </LineupSection>

          {/* Pokemon Search Section */}
          <SearchSection>
            <Input
              placeholder="Search by name or id"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: 16 }}
            />

            {isLoading && <Text>Loading Pokémon...</Text>}
            {error && <ErrorText>Error loading Pokémon: {error.message}</ErrorText>}

            <ScrollableGrid ref={scrollableRef}>
              <Grid cols={130}>
                {allPokemon.map((pokemon) => {
                  const isOnTeam = team.members.some((m) => m.id === pokemon.id);
                  const spriteUrl = pokemon.sprites?.front_default || 
                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                  
                  return (
                    <SearchPokemonCard
                      key={pokemon.id}
                      disabled={isOnTeam}
                      onClick={() => !isOnTeam && handleAddPokemon(pokemon)}
                    >
                      {isOnTeam && (
                        <SearchRemoveButton
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveMember(team.id, pokemon.id);
                          }}
                          title="Remove from team"
                        >
                          <CloseIcon size={12} />
                        </SearchRemoveButton>
                      )}
                      <SearchPokemonImage src={spriteUrl} alt={pokemon.name} loading="lazy" />
                      <PokemonId>#{pokemon.id}</PokemonId>
                      <SearchPokemonName>{pokemon.name}</SearchPokemonName>
                      <div>
                        {pokemon.types?.slice(0, 2).map((type: string) => (
                          <SmallTypeBadge key={type} type={type}>
                            {type}
                          </SmallTypeBadge>
                        ))}
                      </div>
                    </SearchPokemonCard>
                  );
                })}
              </Grid>
              
              {/* Loading indicator for infinite scroll */}
              {isFetchingNextPage && (
                <LoadingSpinner>Loading more Pokémon...</LoadingSpinner>
              )}
              
              {/* End indicator */}
              {!hasNextPage && allPokemon.length > 0 && (
                <LoadingSpinner>All Pokémon loaded</LoadingSpinner>
              )}
            </ScrollableGrid>
          </SearchSection>
        </ModalContent>
      </WideModal>
    </Overlay>
  );
}
