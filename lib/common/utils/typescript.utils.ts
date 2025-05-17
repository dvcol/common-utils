/**
 * Returns a class implementing all the properties of the provided type
 */
export const autoImplement = <T>(): new () => T => class {} as any;

/**
 * Decorator to make a class implement an interface with static methods instead of instances
 */
export const staticImplements =
  <T>() =>
  <U extends T>(constructor: U) => {
    // eslint-disable-next-line no-unused-expressions
    constructor;
  };

/* eslint-disable @typescript-eslint/ban-types */

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type DeepPrettify<T> = {
  [K in keyof T]: T[K] extends object ? DeepPrettify<T[K]> : T[K];
} & {};

/* eslint-enable @typescript-eslint/ban-types */
