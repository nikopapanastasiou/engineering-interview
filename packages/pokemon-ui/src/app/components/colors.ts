// Pokémon Design System Colors
export const COLORS = {
  // Primary palette
  primary: '#FFCB05',        // Pikachu Yellow
  secondary: '#3D7DCA',      // Cerulean Blue
  accent: '#E3350D',         // Pokéball Red
  
  // Backgrounds
  background: '#F6F7FB',     // Lavender Gray
  surface: '#FFFFFF',        // White
  
  // Text
  textPrimary: '#1B1B1B',    // Jet Black
  textSecondary: '#5A5A5A',  // Slate Gray
  
  // Feedback
  success: '#4CAF50',        // Viridian Green
  warning: '#FF9800',        // Ember Orange
  error: '#D32F2F',          // Magmar Red
  
  // Neutral grays (for borders, disabled states, etc.)
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
} as const;

// Type colors for Pokemon type badges
export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};
