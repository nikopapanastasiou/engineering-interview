/**
 * Creates a mock user profile object.
 * 
 * @param overrides Partial user data to override defaults
 * @returns A complete user profile object
 */
export function createMockUser(overrides?: Partial<any>): any {
  return {
    id: 'user-1',
    email: 'test@example.com',
    displayName: 'Test User',
    passwordHash: '$2b$10$mock.hash.password123',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

/**
 * Creates a mock authenticated request object.
 * Used in controller tests to simulate authenticated requests.
 * 
 * @param overrides Partial user data to override defaults
 * @returns A mock request object with user property
 */
export function createMockAuthRequest(overrides?: Partial<any>): any {
  return {
    user: {
      userId: 'user-1',
      email: 'test@example.com',
      displayName: 'Test User',
      ...overrides,
    },
  };
}

/**
 * Creates a mock JWT payload.
 * 
 * @param overrides Partial payload data to override defaults
 * @returns A JWT payload object
 */
export function createMockJwtPayload(overrides?: Partial<any>): any {
  return {
    sub: 'user-1',
    email: 'test@example.com',
    displayName: 'Test User',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    ...overrides,
  };
}
