export function shallowClone<T, O extends keyof T | string | number | symbol = keyof T | string | number | symbol>(
  obj: T,
  depth = 1,
  omit: O[] = [],
): T {
  if (!obj || depth <= 0 || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => (omit.includes(item) ? item : shallowClone(item, depth - 1, omit))) as T;
  }

  return Object.keys(obj).reduce<T>((acc, key) => {
    const value = obj[key as keyof T];
    if (!omit.includes(key as O)) {
      acc[key as keyof T] = shallowClone(value, depth - 1, omit);
    } else {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as T);
}

export const isShallowEqual = <T extends Record<string | number | symbol, any>>(a?: T, b?: T, depth = 1): boolean => {
  if (depth <= 0) return true;
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object') return a === b;
  if (a instanceof URL && b instanceof URL) return a.href === b.href;
  if ((a && !b) || (!a && b)) return false;
  const keys = [...Object.keys(a!), ...Object.keys(b!)];
  if (keys.every(key => a![key as keyof typeof a] === b![key as keyof typeof b])) return true;
  return keys.every(key => isShallowEqual(a![key as keyof typeof a], b![key as keyof typeof b], depth - 1));
};
