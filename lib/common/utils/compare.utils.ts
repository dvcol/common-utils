/* eslint-disable no-nested-ternary */

/**
 * Null-safe string local compare.
 * If a is falsy return 1.
 * If b is falsy return -1.
 * Else local compare a to b
 * @param a
 * @param b
 */
export const stringCompare = (a?: string, b?: string): number => (!a ? 1 : !b ? -1 : a.localeCompare(b));

/**
 * Null-safe string number compare.
 * If a is falsy return 1.
 * If b is falsy return -1.
 * Else compare a to b
 * @param a
 * @param b
 */
export const numberCompare = (a?: number, b?: number): number => (!a ? 1 : !b ? -1 : a > b ? 1 : -1);

/* eslint-enable no-nested-ternary */

/**
 * Execute a null/undefined safe compare with the provided compare function.
 * If both inputs are null/undefined return 0.
 * If a is null/undefined but not b, returns 1.
 * If b is null/undefined but not a, returns -1.
 * Else execute compare;
 * @param compareFn
 * @param reverse
 */
export const nullSafeCompare =
  <A, B>(compareFn: (a: A, b: B) => number, reverse = false) =>
  (a: A, b: B) => {
    let result;
    if (a == null && b == null) result = 0;
    else if (a == null) result = 1;
    else if (b == null) result = -1;
    else result = compareFn(a, b);
    return reverse ? -1 * result : result;
  };
