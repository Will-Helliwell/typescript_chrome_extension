/**
 * Small pure helpers. Their tests in format.test.ts are the template's example
 * of plain unit testing, with no DOM or React involved.
 */

/**
 * Renders a count with a correctly pluralised noun.
 *
 * @example formatCount(1, 'click') // "1 click"
 * @example formatCount(3, 'click') // "3 clicks"
 */
export const formatCount = (count: number, noun: string): string =>
  `${count} ${noun}${count === 1 ? '' : 's'}`;

/**
 * Shortens text to `maxLength` characters, appending an ellipsis when the text
 * was actually cut. The ellipsis is included in the returned length.
 */
export const truncate = (text: string, maxLength: number): string => {
  if (maxLength <= 0) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1))}…`;
};
