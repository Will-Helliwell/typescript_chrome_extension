/**
 * A minimal, typed stand-in for the `chrome` extension APIs.
 *
 * jsdom knows nothing about extension APIs, so any code touching `chrome.*`
 * throws in tests unless a stub is installed. `tests/setup.ts` assigns the
 * object built here to `globalThis.chrome` before every test file.
 *
 * Only the handful of APIs this template uses are stubbed. To add another,
 * follow the same shape: `jest.fn()` per method, cast the finished object
 * through `unknown` to the real `typeof chrome` at the bottom.
 */

export interface ChromeMock {
  storage: {
    local: {
      get: jest.Mock;
      set: jest.Mock;
      remove: jest.Mock;
      clear: jest.Mock;
    };
  };
  runtime: {
    sendMessage: jest.Mock;
    onMessage: {
      addListener: jest.Mock;
      removeListener: jest.Mock;
      hasListener: jest.Mock;
    };
    getURL: jest.Mock;
    lastError: chrome.runtime.LastError | undefined;
  };
  tabs: {
    query: jest.Mock;
    sendMessage: jest.Mock;
    create: jest.Mock;
  };
}

/**
 * Builds a fresh mock. Called once per test file by the setup module so that
 * state set in one file can never leak into another.
 *
 * Methods resolve to empty values by default. Override per test with the usual
 * Jest API, e.g. `chrome.storage.local.get.mockResolvedValue({ count: 3 })`.
 */
export const createChromeMock = (): ChromeMock => ({
  storage: {
    local: {
      get: jest.fn().mockResolvedValue({}),
      set: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
      clear: jest.fn().mockResolvedValue(undefined),
    },
  },
  runtime: {
    sendMessage: jest.fn().mockResolvedValue(undefined),
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
      hasListener: jest.fn().mockReturnValue(false),
    },
    getURL: jest.fn((path: string) => `chrome-extension://test-id/${path}`),
    // Chrome sets this to undefined when the last call succeeded. Tests that
    // exercise error paths assign a value here before invoking a callback.
    lastError: undefined,
  },
  tabs: {
    query: jest.fn().mockResolvedValue([]),
    sendMessage: jest.fn().mockResolvedValue(undefined),
    create: jest.fn().mockResolvedValue({ id: 1 }),
  },
});

/**
 * The mock as the application sees it: `typeof chrome`.
 *
 * Tests that need to configure a call should import `chromeMock` from
 * `tests/setup` instead, which is typed as `ChromeMock` and exposes the
 * `jest.Mock` methods directly.
 */
export const asChromeApi = (mock: ChromeMock): typeof chrome =>
  mock as unknown as typeof chrome;
