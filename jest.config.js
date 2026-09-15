/**
 * Kept as .js rather than .ts so Jest does not need `ts-node` just to read its
 * own config. The JSDoc type below still gives editor completion.
 *
 * @type {import('jest').Config}
 */
module.exports = {
  // ts-jest type-checks each test file as it runs, so `npm test` catches type
  // errors in tests as well as failures. If the suite grows large enough that
  // this becomes slow, replace the preset with:
  //   transform: {
  //     '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }],
  //   }
  // which transpiles without type-checking (`npm run type-check` still covers it).
  preset: 'ts-jest',

  // Components render into a DOM, so tests need a browser-like environment.
  testEnvironment: 'jsdom',

  // Runs after the environment is ready: registers jest-dom matchers and the
  // global `chrome` mock. See tests/setup.ts.
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

  // Colocated tests: src/App.tsx sits next to src/App.test.tsx.
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.test.tsx'],

  clearMocks: true,
  restoreMocks: true,

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    // Entry point is DOM bootstrapping only; there is nothing meaningful to assert.
    '!src/index.tsx',
  ],
  coverageDirectory: 'coverage',
};
