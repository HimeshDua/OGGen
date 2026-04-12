// --- src/tests/filename.test.ts ---
import {describe, it, expect} from 'vitest';
import {buildFilename} from '../utils/filename.js';

describe('filename', () => {
  it('generates filename from url', () => {
    expect(buildFilename('https://example.com')).toBe('og-example.com.png');
  });
});
