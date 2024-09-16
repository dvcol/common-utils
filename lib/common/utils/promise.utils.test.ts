import { describe, expect, it } from 'vitest';

import { raceUntil } from './promise.utils';

const earlyError = new Error('Early reject');
const lateError = new Error('Late reject');
const trueValue = true;
const falseValue = false;
const truthyValue = 'truthy';
const falsyValue = 0;

describe('promise.utils.ts', () => {
  describe('raceUntil', () => {
    const pFalseValue = () =>
      new Promise(resolve => {
        setTimeout(() => resolve(falseValue), 100);
      });
    const pFalsyValue = () =>
      new Promise(resolve => {
        setTimeout(() => resolve(falsyValue), 300);
      });
    const pTrueValue = () =>
      new Promise(resolve => {
        setTimeout(() => resolve(trueValue), 200);
      });
    const pTruthyValue = () =>
      new Promise(resolve => {
        setTimeout(() => resolve(truthyValue), 400);
      });
    const pEarlyReject = () =>
      new Promise((_, reject) => {
        setTimeout(() => reject(earlyError), 100);
      });
    const pLateReject = () =>
      new Promise((_, reject) => {
        setTimeout(() => reject(lateError), 500);
      });
    const pNullValue = () =>
      new Promise(resolve => {
        setTimeout(() => resolve(null), 100);
      });
    const pUndefinedValue = () =>
      new Promise(resolve => {
        setTimeout(() => resolve(undefined), 100);
      });

    it('should race promises until a condition returns a value', async () => {
      expect.assertions(2);
      const { inner, outer } = raceUntil([pFalseValue(), pTrueValue(), pTruthyValue(), pFalsyValue()]);
      await expect(outer).resolves.toBe(falseValue);
      await expect(inner).resolves.toStrictEqual([falseValue, trueValue, truthyValue, falsyValue]);
    });

    it('should race promises until a condition returns null', async () => {
      expect.assertions(2);
      const { inner, outer } = raceUntil([pTrueValue(), pTruthyValue(), pFalsyValue(), pNullValue(), pUndefinedValue()]);
      await expect(outer).resolves.toBeNull();
      await expect(inner).resolves.toStrictEqual([trueValue, truthyValue, falsyValue, null, undefined]);
    });

    it('should race promises until a condition returns a value with a custom condition', async () => {
      expect.assertions(2);
      const { inner, outer } = raceUntil([pFalseValue(), pTrueValue(), pTruthyValue(), pFalsyValue()], r => typeof r === 'string');
      await expect(outer).resolves.toBe(truthyValue);
      await expect(inner).resolves.toStrictEqual([falseValue, trueValue, truthyValue, falsyValue]);
    });

    it('should race promises and resolve with null if no condition returns a value', async () => {
      expect.assertions(2);
      const { inner, outer } = raceUntil([pFalseValue(), pFalsyValue(), pTruthyValue()], r => r === trueValue);
      await expect(outer).resolves.toBeNull();
      await expect(inner).resolves.toStrictEqual([falseValue, falsyValue, truthyValue]);
    });

    it('should reject if any promise rejects', async () => {
      expect.assertions(2);
      const { inner, outer } = raceUntil([pEarlyReject(), pTrueValue(), pTruthyValue(), pLateReject()]);
      expect(outer).rejects.toThrow(earlyError);
      expect(inner).resolves.toBeUndefined();
    });

    it('should return outer value if inner promise resolves before outer rejects', async () => {
      expect.assertions(2);
      const { inner, outer } = raceUntil([pTrueValue(), pLateReject(), pTruthyValue()]);
      expect(outer).resolves.toBe(trueValue);
      expect(inner).resolves.toBeUndefined();
    });
  });
});
