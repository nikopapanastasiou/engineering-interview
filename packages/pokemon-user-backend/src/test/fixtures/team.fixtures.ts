import { Team, NewTeam } from '../../modules/database/entities/team.entity';

/**
 * Creates a mock team object with default values.
 * All fields can be overridden via the partial parameter.
 * 
 * @param overrides Partial team data to override defaults
 * @returns A complete Team object
 * 
 * @example
 * ```typescript
 * const team = createMockTeam({ name: 'Custom Team' });
 * ```
 */
export function createMockTeam(overrides?: Partial<Team>): Team {
  return {
    id: 'team-1',
    name: 'Test Team',
    userId: 'user-1',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    ...overrides,
  } as Team;
}

/**
 * Creates a mock NewTeam object (for creation operations).
 * 
 * @param overrides Partial team data to override defaults
 * @returns A NewTeam object
 */
export function createMockNewTeam(overrides?: Partial<NewTeam>): NewTeam {
  return {
    name: 'Test Team',
    userId: 'user-1',
    ...overrides,
  };
}

/**
 * Creates an array of mock teams.
 * 
 * @param count Number of teams to create
 * @param baseOverrides Base overrides applied to all teams
 * @returns Array of Team objects
 */
export function createMockTeams(count: number, baseOverrides?: Partial<Team>): Team[] {
  return Array.from({ length: count }, (_, i) =>
    createMockTeam({
      id: `team-${i + 1}`,
      name: `Test Team ${i + 1}`,
      ...baseOverrides,
    })
  );
}
