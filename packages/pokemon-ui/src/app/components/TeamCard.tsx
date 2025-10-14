import styled from '@emotion/styled';
import { Button } from './ui';
import { Card, PokemonId, RemoveButton, COLORS } from './shared';
import { CloseIcon, WarningIcon } from './icons';

// Types
export interface TeamPokemon {
  id: number;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  members: TeamPokemon[];
}

export interface TeamCardProps {
  team: Team;
  onMemberClick: (memberId: number) => void;
  onRemoveMember: (teamId: string, pokemonId: number) => void;
  onAddPokemon: (teamId: string) => void;
  onDeleteTeam: (teamId: string) => void;
}

// Styled Components
const StyledTeamCard = styled(Card)<{ hasWarning?: boolean }>`
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
  color: ${({ isFull, isEmpty }) => 
    isFull ? COLORS.success : 
    isEmpty ? COLORS.error : 
    COLORS.textSecondary
  };
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

const MembersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

export function TeamCard({ 
  team, 
  onMemberClick, 
  onRemoveMember, 
  onAddPokemon, 
  onDeleteTeam 
}: TeamCardProps) {
  const isFull = team.members.length === 6;
  const hasWarning = team.members.length < 6 && team.members.length > 0;

  return (
    <StyledTeamCard hasWarning={hasWarning}>
      <TeamHeader>
        <TeamName>{team.name}</TeamName>
        <TeamCount isFull={isFull} isEmpty={team.members.length === 0}>
          {team.members.length}/6
        </TeamCount>
      </TeamHeader>

      {/* Team Members Grid */}
      <MembersGrid>
        {team.members.map((member) => {
          const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.id}.png`;
          return (
            <MemberCard key={member.id} onClick={() => onMemberClick(member.id)}>
              <RemoveButton
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveMember(team.id, member.id);
                }}
              >
                <CloseIcon size={12} />
              </RemoveButton>
              <MemberImage src={spriteUrl} alt={member.name} loading="lazy" />
              <PokemonId>#{member.id}</PokemonId>
              <MemberName>{member.name}</MemberName>
            </MemberCard>
          );
        })}
        
        {/* Empty Slots */}
        {Array.from({ length: 6 - team.members.length }).map((_, i) => (
          <EmptySlot key={`empty-${i}`}>Empty</EmptySlot>
        ))}
      </MembersGrid>

      {/* Warning Badge */}
      {hasWarning && (
        <WarningBadge>
          <WarningIcon size={14} />
          Team has less than 6 Pokémon
        </WarningBadge>
      )}

      {/* Action Buttons */}
      <ActionButtons>
        <Button 
          onClick={() => onAddPokemon(team.id)} 
          disabled={isFull} 
          style={{ flex: 1, fontSize: 13 }}
        >
          {isFull ? 'Team Full' : 'Add Pokémon'}
        </Button>
        <Button 
          onClick={() => onDeleteTeam(team.id)} 
          variant="danger" 
          style={{ fontSize: 13 }}
        >
          Delete
        </Button>
      </ActionButtons>
    </StyledTeamCard>
  );
}
