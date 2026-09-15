import { formatCount, truncate } from './format';

describe('formatCount', () => {
  it('uses the singular form for exactly one', () => {
    expect(formatCount(1, 'click')).toBe('1 click');
  });

  it.each([0, 2, 17])('uses the plural form for %i', (count) => {
    expect(formatCount(count, 'click')).toBe(`${count} clicks`);
  });
});

describe('truncate', () => {
  it('leaves text shorter than the limit untouched', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('leaves text exactly at the limit untouched', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('cuts longer text and marks it with an ellipsis', () => {
    expect(truncate('hello world', 8)).toBe('hello w…');
  });

  it('counts the ellipsis towards the limit', () => {
    expect(truncate('hello world', 8)).toHaveLength(8);
  });

  it('returns an empty string for a non-positive limit', () => {
    expect(truncate('hello', 0)).toBe('');
  });
});
