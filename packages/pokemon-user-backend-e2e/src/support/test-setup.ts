/* eslint-disable */

/**
 * Test setup that runs before each test file
 * 
 * Note: We use NestJS Testing Module with supertest instead of axios,
 * so this file is kept minimal. The actual app setup happens in test-app.ts
 */
module.exports = async function () {
  // Environment setup if needed
  process.env.NODE_ENV = 'test';
};
