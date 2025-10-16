/* eslint-disable */

/**
 * Global setup for E2E tests
 * 
 * This runs once before all test suites.
 * For database setup, we rely on the existing docker-compose database.
 * 
 * Prerequisites:
 * - Database must be running: `pnpm db:up`
 * - Database must be migrated: `pnpm db:migrate`
 * - Database must be seeded: `pnpm db:seed`
 */
module.exports = async function () {
  console.log('\n🚀 Starting E2E test suite...\n');
  console.log('Prerequisites:');
  console.log('  ✓ Database running (pnpm db:up)');
  console.log('  ✓ Migrations applied (pnpm db:migrate)');
  console.log('  ✓ Pokemon data seeded (pnpm db:seed)\n');

  // Store cleanup message for teardown
  globalThis.__TEARDOWN_MESSAGE__ = '\n✅ E2E tests completed\n';
};
