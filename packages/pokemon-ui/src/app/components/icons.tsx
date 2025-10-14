import styled from '@emotion/styled';
import { COLORS } from './colors';

// Base Icon Component
const IconBase = styled.svg`
  display: inline-block;
  vertical-align: middle;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// Icon Props Interface
interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// Close/X Icon
export const CloseIcon = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <IconBase width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconBase>
);

// Warning Icon
export const WarningIcon = ({ size = 16, color = COLORS.warning, ...props }: IconProps) => (
  <IconBase width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M10.29 3.86L1.82 18A2 2 0 003.54 21h16.92a2 2 0 001.72-3L13.71 3.86a2 2 0 00-3.42 0z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 9v4M12 17h.01"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconBase>
);

// Star Icon (for legendary Pokemon)
export const StarIcon = ({ size = 16, color = '#FFD700', ...props }: IconProps) => (
  <IconBase width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </IconBase>
);

// Diamond Icon (for mythical Pokemon)
export const DiamondIcon = ({ size = 16, color = '#9C27B0', ...props }: IconProps) => (
  <IconBase width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
    <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
  </IconBase>
);

