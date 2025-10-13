import styled from '@emotion/styled';
import { Card } from './ui';
import { COLORS, TYPE_COLORS } from './colors';

// Re-export colors for convenience
export { COLORS, TYPE_COLORS };

// Modal Components
export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const Modal = styled(Card)`
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: ${COLORS.gray100};
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  &:hover {
    background: ${COLORS.gray200};
  }
`;

// Pokemon Display Components
export const PokemonImage = styled.img`
  width: 96px;
  height: 96px;
  object-fit: contain;
`;

export const PokemonName = styled.div`
  font-weight: 600;
  color: ${COLORS.textPrimary};
  text-transform: capitalize;
`;

export const PokemonId = styled.div`
  font-size: 12px;
  color: ${COLORS.textSecondary};
`;

export const TypeBadge = styled.span<{ type: string }>`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  margin: 0 2px;
  background: ${({ type }) => TYPE_COLORS[type] || '#9ca3af'};
  color: white;
`;

// Remove Button (for cards)
export const RemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
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
  transition: opacity 0.2s;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
`;

// Section Components
export const Section = styled.div`
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${COLORS.gray700};
  margin: 0 0 8px 0;
`;
