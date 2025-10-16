import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { DrizzleDatabase } from '../../modules/database/db.tokens';

/**
 * Creates a deep mock of the Drizzle database client.
 * This mock handles the complex chainable query builder pattern.
 * 
 * @returns A fully mocked DrizzleDatabase instance
 * 
 * @example
 * ```typescript
 * const mockDb = createMockDrizzleDb();
 * mockDb.query.teamsTable.findFirst.mockResolvedValue(mockTeam);
 * ```
 */
export function createMockDrizzleDb(): DeepMockProxy<DrizzleDatabase> {
  return mockDeep<DrizzleDatabase>({
    fallbackMockImplementation: () => jest.fn(),
  });
}

/**
 * Creates a mock Drizzle database with common query patterns pre-configured.
 * Useful for reducing boilerplate in tests.
 * 
 * @param config Configuration for common query responses
 * @returns A configured DrizzleDatabase mock
 * 
 * @example
 * ```typescript
 * const mockDb = createConfiguredDrizzleDb({
 *   selectResult: [mockTeam],
 *   insertResult: [mockTeam],
 * });
 * ```
 */
export function createConfiguredDrizzleDb(config?: {
  selectResult?: any[];
  insertResult?: any[];
  updateResult?: any[];
  deleteResult?: any[];
}): DeepMockProxy<DrizzleDatabase> {
  const mockDb = createMockDrizzleDb();

  // Configure select chain
  if (config?.selectResult !== undefined) {
    const selectChain = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue(config.selectResult),
    };
    mockDb.select.mockReturnValue(selectChain as any);
  }

  // Configure insert chain
  if (config?.insertResult !== undefined) {
    const insertChain = {
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue(config.insertResult),
    };
    mockDb.insert.mockReturnValue(insertChain as any);
  }

  // Configure update chain
  if (config?.updateResult !== undefined) {
    const updateChain = {
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue(config.updateResult),
    };
    mockDb.update.mockReturnValue(updateChain as any);
  }

  // Configure delete chain
  if (config?.deleteResult !== undefined) {
    const deleteChain = {
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue(config.deleteResult),
    };
    mockDb.delete.mockReturnValue(deleteChain as any);
  }

  return mockDb;
}
