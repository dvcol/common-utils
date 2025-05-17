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
