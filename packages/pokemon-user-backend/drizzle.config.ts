import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/modules/database/entities/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'pokemon',
  },
  verbose: true,
  strict: true,
});
