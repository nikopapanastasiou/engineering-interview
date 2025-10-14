import styled from '@emotion/styled';
import { Button, Heading, Text } from './ui';
import { Overlay, Modal, TypeBadge, COLORS } from './shared';
import { CloseIcon, StarIcon, DiamondIcon } from './icons';
import { Pokemon } from '../types/pokemon';

// Layout components
const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 24px;
`;

const PokemonImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  flex-shrink: 0;
`;

const HeaderContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const PokemonTitle = styled(Heading)`
  font-size: 24px;
  margin: 0 0 4px 0;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PokemonNumber = styled.span`
  color: ${COLORS.textSecondary};
  font-weight: 400;
`;

const PokemonSubtitle = styled(Text)`
  font-size: 16px;
  color: ${COLORS.textSecondary};
  margin: 0 0 12px 0;
`;

const TypeBadges = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const InfoSection = styled.div`
  margin-bottom: 24px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
`;

const InfoItem = styled(Text)`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid ${COLORS.gray200};
  
  strong {
    color: ${COLORS.textPrimary};
  }
`;

const StatGrid = styled.div`
  display: grid;
  gap: 8px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatName = styled(Text)`
  min-width: 100px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${COLORS.textSecondary};
`;

const StatBar = styled.div<{ value: number }>`
  flex: 1;
  height: 8px;
  background: ${COLORS.gray200};
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${({ value }) => Math.min(value / 255 * 100, 100)}%;
    background: linear-gradient(90deg, 
      ${COLORS.error} 0%, 
      ${COLORS.warning} 50%, 
      ${COLORS.success} 100%
    );
    border-radius: 4px;
  }
`;

const StatValue = styled(Text)`
  min-width: 30px;
  font-weight: 600;
  text-align: right;
  color: ${COLORS.textPrimary};
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

type Props = {
  pokemon: Pokemon;
  teamsContaining?: string[];
  onClose: () => void;
};

export function PokemonDetail({ pokemon, teamsContaining = [], onClose }: Props) {
  const spriteUrl =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <CloseIcon size={18} />
        </CloseButton>

        {/* Header: Image + Name/Info */}
        <Header>
          <PokemonImage src={spriteUrl} alt={pokemon.name} />
          <HeaderContent>
            <PokemonTitle>
              {pokemon.name}
              <PokemonNumber>#{pokemon.id.toString().padStart(3, '0')}</PokemonNumber>
              {pokemon.isLegendary && <StarIcon size={16} />}
              {pokemon.isMythical && <DiamondIcon size={16} />}
            </PokemonTitle>
            
            {/* Genus subtitle */}
            {pokemon.genus && (
              <PokemonSubtitle>{pokemon.genus}</PokemonSubtitle>
            )}
            
            {/* Type badges */}
            <TypeBadges>
              {pokemon.types?.map((type) => (
                <TypeBadge key={type} type={type}>
                  {type}
                </TypeBadge>
              ))}
            </TypeBadges>
          </HeaderContent>
        </Header>

        {/* Description */}
        {pokemon.description && (
          <InfoSection>
            <Text style={{ lineHeight: '1.6', marginBottom: 16 }}>
              {pokemon.description}
            </Text>
          </InfoSection>
        )}

        {/* Basic Info */}
        <InfoSection>
          <InfoGrid>
            <InfoItem>
              Height <strong>{pokemon.height ? `${(pokemon.height / 10).toFixed(1)} m` : 'N/A'}</strong>
            </InfoItem>
            <InfoItem>
              Weight <strong>{pokemon.weight ? `${(pokemon.weight / 10).toFixed(1)} kg` : 'N/A'}</strong>
            </InfoItem>
            <InfoItem>
              Base XP <strong>{pokemon.baseExperience ?? 'N/A'}</strong>
            </InfoItem>
            {pokemon.captureRate && (
              <InfoItem>
                Capture Rate <strong>{pokemon.captureRate}/255</strong>
              </InfoItem>
            )}
            {pokemon.generation && (
              <InfoItem>
                Generation <strong>{pokemon.generation.replace('generation-', 'Gen ')}</strong>
              </InfoItem>
            )}
            {pokemon.habitat && (
              <InfoItem>
                Habitat <strong style={{ textTransform: 'capitalize' }}>{pokemon.habitat}</strong>
              </InfoItem>
            )}
          </InfoGrid>
        </InfoSection>

        {/* Base Stats */}
        {pokemon.stats && (
          <InfoSection>
            <Heading as="h3" style={{ fontSize: 16, marginBottom: 16 }}>Base Stats</Heading>
            <StatGrid>
              {Object.entries(pokemon.stats).map(([key, value]) => (
                <StatItem key={key}>
                  <StatName>{key.replace('-', ' ')}</StatName>
                  <StatBar value={value} />
                  <StatValue>{value}</StatValue>
                </StatItem>
              ))}
            </StatGrid>
          </InfoSection>
        )}

        {/* Abilities */}
        {pokemon.abilities && pokemon.abilities.length > 0 && (
          <InfoSection>
            <Heading as="h3" style={{ fontSize: 16, marginBottom: 12 }}>Abilities</Heading>
            <TypeBadges>
              {pokemon.abilities.map((ability) => (
                <TypeBadge key={ability} type="normal" style={{ background: COLORS.secondary }}>
                  {ability}
                </TypeBadge>
              ))}
            </TypeBadges>
          </InfoSection>
        )}

        {/* Teams */}
        {teamsContaining.length > 0 && (
          <InfoSection>
            <Heading as="h3" style={{ fontSize: 16, marginBottom: 12 }}>On Teams</Heading>
            <TypeBadges>
              {teamsContaining.map((team) => (
                <TypeBadge key={team} type="normal" style={{ background: COLORS.primary }}>
                  {team}
                </TypeBadge>
              ))}
            </TypeBadges>
          </InfoSection>
        )}
      </Modal>
    </Overlay>
  );
}
