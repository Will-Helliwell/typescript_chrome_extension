/**
 * Global test setup, run once per test file before any test executes.
 *
 * Registered via `setupFilesAfterEnv` in jest.config.ts.
 */

// Adds DOM matchers such as `toBeInTheDocument()` and `toHaveTextContent()`.
import '@testing-library/jest-dom';

import { createChromeMock, asChromeApi, type ChromeMock } from './mocks/chrome';

/**
 * The `chrome` mock for the current test file, typed so its methods are
 * `jest.Mock` and can be configured directly:
 *
 *   import { chromeMock } from '../../tests/setup';
 *   chromeMock.storage.local.get.mockResolvedValue({ count: 3 });
 *
 * Application code reads the same object through the global `chrome`.
 */
export let chromeMock: ChromeMock;

const installChromeMock = (): void => {
  chromeMock = createChromeMock();
  globalThis.chrome = asChromeApi(chromeMock);
};

// Install once up front so module-level code in the file under test can touch
// `chrome` at import time, then rebuild before each test for a clean slate.
installChromeMock();

beforeEach(() => {
  installChromeMock();
});
