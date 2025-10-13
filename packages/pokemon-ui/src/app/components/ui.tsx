import styled from '@emotion/styled';
import { COLORS } from './colors';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

export const Card = styled.div`
  background: ${COLORS.surface};
  border: 1px solid ${COLORS.gray200};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 14px;

  ${({ variant = 'primary' }) => {
    if (variant === 'primary') {
      return `
        background: ${COLORS.secondary};
        color: white;
        &:hover { background: #2E6AB0; }
        &:disabled { background: ${COLORS.gray300}; cursor: not-allowed; }
      `;
    }
    if (variant === 'danger') {
      return `
        background: ${COLORS.error};
        color: white;
        &:hover { background: #B71C1C; }
        &:disabled { background: ${COLORS.gray300}; cursor: not-allowed; }
      `;
    }
    return `
      background: ${COLORS.gray100};
      color: ${COLORS.gray700};
      &:hover { background: ${COLORS.gray200}; }
      &:disabled { background: ${COLORS.gray50}; cursor: not-allowed; color: ${COLORS.gray400}; }
    `;
  }}
`;

export const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid ${COLORS.gray300};
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: ${COLORS.surface};
  color: ${COLORS.textPrimary};

  &:focus {
    outline: none;
    border-color: ${COLORS.secondary};
    box-shadow: 0 0 0 3px rgba(61, 125, 202, 0.1);
  }

  &::placeholder {
    color: ${COLORS.gray400};
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${COLORS.gray700};
  margin-bottom: 6px;
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;
`;

export const ErrorText = styled.div`
  color: ${COLORS.error};
  font-size: 14px;
  margin-top: 8px;
  padding: 8px 12px;
  background: #FFEBEE;
  border-radius: 4px;
  border-left: 3px solid ${COLORS.error};
`;

export const Grid = styled.div<{ cols?: number; gap?: number }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${({ cols = 200 }) => cols}px, 1fr));
  gap: ${({ gap = 16 }) => gap}px;
`;

export const Heading = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${COLORS.textPrimary};
  margin: 0 0 16px 0;
`;

export const Text = styled.p`
  color: ${COLORS.textSecondary};
  font-size: 14px;
  margin: 0;
`;
