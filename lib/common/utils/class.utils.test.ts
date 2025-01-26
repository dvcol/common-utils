import { describe, it, expect } from 'vitest';

import { toClass, toStyle } from '~/common/utils/class.utils';

describe('class.utils.ts', () => {
  describe('toClass', () => {
    it('should merge strings', () => {
      expect.assertions(1);
      expect(toClass('a ', 'b')).toBe('a b');
    });

    it('should merge arrays', () => {
      expect.assertions(1);
      expect(toClass(['a', 'b '], ['c', 'd'])).toBe('a b c d');
    });

    it('should merge objects', () => {
      expect.assertions(1);
      expect(toClass({ a: true, b: false }, { c: true, d: false })).toBe('a c');
    });

    it('should merge mixed', () => {
      expect.assertions(1);
      expect(toClass('a', ['b ', 'c'], { d: true, e: false }, 'f', ['g'])).toBe('a b c d f g');
    });
  });

  describe('toStyle', () => {
    it('should merge strings', () => {
      expect.assertions(1);
      expect(toStyle('a', 'b ')).toBe('a; b');
    });

    it('should merge arrays', () => {
      expect.assertions(1);
      expect(toStyle(['a', 'b'], ['c ', 'd'])).toBe('a; b; c; d');
    });

    it('should merge objects', () => {
      expect.assertions(1);
      expect(toStyle({ a: true, b: false }, { c: true, d: false })).toBe('a; c');
    });

    it('should merge mixed', () => {
      expect.assertions(1);
      expect(toStyle('a', ['b', 'c'], { d: true, e: false }, 'f;', ['g '])).toBe('a; b; c; d; f; g');
    });

    it('should merge mixed with camel case', () => {
      expect.assertions(1);
      expect(
        toStyle('a', {
          b: true,
          c: false,
          width: '100px',
          minHeight: '50px',
        }),
      ).toBe('a; b; width:100px; min-height:50px');
    });
  });
});
