/**
 * Creates a mock Pokemon object with default values.
 * 
 * @param overrides Partial pokemon data to override defaults
 * @returns A complete Pokemon object
 */
export function createMockPokemon(overrides?: Partial<any>): any {
  return {
    id: 1,
    name: 'pikachu',
    types: ['electric'],
    sprites: {
      front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    },
    stats: [
      { base_stat: 35, stat: { name: 'hp' } },
      { base_stat: 55, stat: { name: 'attack' } },
      { base_stat: 40, stat: { name: 'defense' } },
      { base_stat: 50, stat: { name: 'special-attack' } },
      { base_stat: 50, stat: { name: 'special-defense' } },
      { base_stat: 90, stat: { name: 'speed' } },
    ],
    ...overrides,
  };
}

/**
 * Creates an array of mock Pokemon.
 * 
 * @param count Number of Pokemon to create
 * @returns Array of Pokemon objects
 */
export function createMockPokemons(count: number): any[] {
  const names = ['pikachu', 'charizard', 'blastoise', 'venusaur', 'mewtwo', 'dragonite'];
  const types = [['electric'], ['fire', 'flying'], ['water'], ['grass', 'poison'], ['psychic'], ['dragon', 'flying']];
  
  return Array.from({ length: count }, (_, i) =>
    createMockPokemon({
      id: i + 1,
      name: names[i % names.length],
      types: types[i % types.length],
    })
  );
}

/**
 * Creates a mock team-pokemon roster entry.
 */
export function createMockRosterEntry(overrides?: Partial<any>): any {
  return {
    teamId: 'team-1',
    pokemonId: 1,
    pokemon: createMockPokemon(),
    ...overrides,
  };
}
