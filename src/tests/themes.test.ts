// --- src/tests/themes.test.ts ---
import {describe, it, expect} from 'vitest';
import {getTheme} from '../core/themes.js';

describe('themes', () => {
  it('returns theme', () => {
    const t = getTheme('dark-grid');
    expect(t.grid).toBe(true);
  });

  it('throws for invalid theme', () => {
    expect(() => getTheme('x')).toThrow();
  });
});
