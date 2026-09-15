/**
 * Thin wrapper over `chrome.storage.local`.
 *
 * Exists mainly as the template's example of code that touches an extension
 * API, and of how to test it against the mock in tests/mocks/chrome.ts.
 */

/** Reads a key, falling back to `fallback` when it has never been written. */
export const readSetting = async <T>(key: string, fallback: T): Promise<T> => {
  const stored = await chrome.storage.local.get(key);
  return (stored[key] as T | undefined) ?? fallback;
};

/** Writes a single key. */
export const writeSetting = async <T>(key: string, value: T): Promise<void> => {
  await chrome.storage.local.set({ [key]: value });
};
