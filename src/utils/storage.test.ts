import { chromeMock } from '../../tests/setup';
import { readSetting, writeSetting } from './storage';

describe('readSetting', () => {
  it('returns the stored value when the key exists', async () => {
    chromeMock.storage.local.get.mockResolvedValue({ theme: 'dark' });

    await expect(readSetting('theme', 'light')).resolves.toBe('dark');
    expect(chromeMock.storage.local.get).toHaveBeenCalledWith('theme');
  });

  it('returns the fallback when the key has never been written', async () => {
    chromeMock.storage.local.get.mockResolvedValue({});

    await expect(readSetting('theme', 'light')).resolves.toBe('light');
  });

  it('keeps falsy stored values rather than falling back', async () => {
    chromeMock.storage.local.get.mockResolvedValue({ count: 0 });

    await expect(readSetting('count', 10)).resolves.toBe(0);
  });
});

describe('writeSetting', () => {
  it('writes the key and value', async () => {
    await writeSetting('theme', 'dark');

    expect(chromeMock.storage.local.set).toHaveBeenCalledWith({
      theme: 'dark',
    });
  });
});
