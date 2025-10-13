import styled from '@emotion/styled';
import { Button } from './ui';
import { Overlay, Modal, CloseButton, Section, SectionTitle, TypeBadge, TYPE_COLORS, COLORS } from './shared';

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


const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
`;

const SpriteImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const PokemonName = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: ${COLORS.textPrimary};
  text-transform: capitalize;
  margin: 0 0 8px 0;
`;

const PokemonId = styled.div`
  font-size: 14px;
  color: ${COLORS.textSecondary};
  margin-bottom: 12px;
`;

const DetailTypeBadge = styled(TypeBadge)`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  margin-right: 6px;
`;


const StatBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const StatName = styled.div`
  min-width: 120px;
  font-size: 14px;
  color: ${COLORS.textSecondary};
  text-transform: capitalize;
`;

const StatValue = styled.div`
  min-width: 40px;
  font-weight: 600;
  color: ${COLORS.textPrimary};
  font-size: 14px;
`;

const StatBarBg = styled.div`
  flex: 1;
  height: 8px;
  background: ${COLORS.gray200};
  border-radius: 4px;
  overflow: hidden;
`;

const StatBarFill = styled.div<{ percent: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${COLORS.secondary}, ${COLORS.primary});
  width: ${({ percent }) => percent}%;
  transition: width 0.3s;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const InfoItem = styled.div`
  font-size: 14px;
  color: ${COLORS.textSecondary};
  span {
    font-weight: 600;
    color: ${COLORS.textPrimary};
  }
`;

const AbilityList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const AbilityBadge = styled.span`
  padding: 6px 12px;
  background: #E3F2FD;
  border: 1px solid ${COLORS.secondary};
  border-radius: 6px;
  font-size: 13px;
  color: ${COLORS.secondary};
  font-weight: 600;
  text-transform: capitalize;
`;

const TeamsList = styled.div`
  display: flex;
  gap: 8px;
`;

const TeamBadge = styled.span`
  padding: 6px 12px;
  background: #E8F5E9;
  border: 1px solid ${COLORS.success};
  border-radius: 6px;
  font-size: 13px;
  color: ${COLORS.success};
  font-weight: 600;
`;

type Props = {
  pokemon: Pokemon;
  teamsContaining?: string[];
  onClose: () => void;
  onAddToTeam?: () => void;
};

export function PokemonDetail({ pokemon, teamsContaining = [], onClose, onAddToTeam }: Props) {
  const spriteUrl =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

  const maxStat = 255;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>

        <Header>
          <SpriteImage src={spriteUrl} alt={pokemon.name} />
          <HeaderInfo>
            <PokemonName>{pokemon.name}</PokemonName>
            <PokemonId>#{pokemon.id.toString().padStart(3, '0')}</PokemonId>
            <div>
              {pokemon.types?.map((t) => (
                <DetailTypeBadge key={t} type={t}>
                  {t}
                </DetailTypeBadge>
              ))}
            </div>
          </HeaderInfo>
        </Header>

        <Section>
          <SectionTitle>Info</SectionTitle>
          <InfoGrid>
            <InfoItem>
              Height: <span>{pokemon.height ? `${(pokemon.height / 10).toFixed(1)} m` : 'N/A'}</span>
            </InfoItem>
            <InfoItem>
              Weight: <span>{pokemon.weight ? `${(pokemon.weight / 10).toFixed(1)} kg` : 'N/A'}</span>
            </InfoItem>
            <InfoItem>
              Base XP: <span>{pokemon.base_experience ?? 'N/A'}</span>
            </InfoItem>
          </InfoGrid>
        </Section>

        {pokemon.abilities && pokemon.abilities.length > 0 && (
          <Section>
            <SectionTitle>Abilities</SectionTitle>
            <AbilityList>
              {pokemon.abilities.map((a) => (
                <AbilityBadge key={a}>{a.replace('-', ' ')}</AbilityBadge>
              ))}
            </AbilityList>
          </Section>
        )}

        {pokemon.stats && Object.keys(pokemon.stats).length > 0 && (
          <Section>
            <SectionTitle>Base Stats</SectionTitle>
            {Object.entries(pokemon.stats).map(([name, value]) => (
              <StatBar key={name}>
                <StatName>{name.replace('-', ' ')}</StatName>
                <StatValue>{value}</StatValue>
                <StatBarBg>
                  <StatBarFill percent={(value / maxStat) * 100} />
                </StatBarBg>
              </StatBar>
            ))}
          </Section>
        )}

        {teamsContaining.length > 0 && (
          <Section>
            <SectionTitle>In Your Teams</SectionTitle>
            <TeamsList>
              {teamsContaining.map((team) => (
                <TeamBadge key={team}>{team}</TeamBadge>
              ))}
            </TeamsList>
          </Section>
        )}

        {onAddToTeam && (
          <Button onClick={onAddToTeam} style={{ width: '100%', marginTop: 8 }}>
            Add to Team
          </Button>
        )}
      </Modal>
    </Overlay>
  );
}
