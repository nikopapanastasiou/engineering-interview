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

// Plus Icon (for add buttons)
export const PlusIcon = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <IconBase width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M12 5v14M5 12h14"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconBase>
);

// Trash Icon (for delete buttons)
export const TrashIcon = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <IconBase width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 11v6M14 11v6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconBase>
);

// Search Icon
export const SearchIcon = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <IconBase width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <circle
      cx={11}
      cy={11}
      r={8}
      stroke={color}
      strokeWidth={2}
    />
    <path
      d="M21 21l-4.35-4.35"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconBase>
);

// Users Icon (for teams)
export const UsersIcon = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <IconBase width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx={9}
      cy={7}
      r={4}
      stroke={color}
      strokeWidth={2}
    />
    <path
      d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconBase>
);

// Edit Icon
export const EditIcon = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <IconBase width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconBase>
);

// Eye Icon (for view details)
export const EyeIcon = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <IconBase width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx={12}
      cy={12}
      r={3}
      stroke={color}
      strokeWidth={2}
    />
  </IconBase>
);

// Info Icon
export const InfoIcon = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <IconBase width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <circle
      cx={12}
      cy={12}
      r={10}
      stroke={color}
      strokeWidth={2}
    />
    <path
      d="M12 16v-4M12 8h.01"
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

// Loading Spinner Icon
export const LoadingIcon = ({ size = 16, color = 'currentColor', ...props }: IconProps) => (
  <IconBase 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    style={{ animation: 'spin 1s linear infinite' }}
    {...props}
  >
    <path
      d="M21 12a9 9 0 11-6.219-8.56"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconBase>
);
