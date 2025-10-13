import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_POOL, DRIZZLE_CLIENT } from './db.tokens';
import * as schema from './entities';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_POOL,
      useFactory: () =>
        new Pool({
          host: process.env.DB_HOST ?? '127.0.0.1',
          port: Number(process.env.DB_PORT ?? 5432),
          database: process.env.DB_NAME ?? 'pokemon',
          user: process.env.DB_USER ?? 'admin',
          password: process.env.DB_PASSWORD ?? 'admin',
        }),
    },
    {
      provide: DRIZZLE_CLIENT,
      useFactory: (pool: Pool) => drizzle(pool, { schema }),
      inject: [DATABASE_POOL],
    },
  ],
  exports: [DATABASE_POOL, DRIZZLE_CLIENT],
})
export class DbModule {}
