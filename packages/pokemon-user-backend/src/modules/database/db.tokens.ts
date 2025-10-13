import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from './entities';

export const DATABASE_POOL = Symbol('DATABASE_POOL');
export const DRIZZLE_CLIENT = Symbol('DRIZZLE_CLIENT');

export type DrizzleDatabase = NodePgDatabase<typeof schema>;
