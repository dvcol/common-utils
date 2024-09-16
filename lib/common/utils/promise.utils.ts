export const wait = (ms?: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

/**
 * Race promises until a one resolves with a value that satisfies a condition or if any promise rejects.
 *
 * @param promises - An array of promises to race
 * @param cb - A callback that receives the resolved value and returns a boolean (default: r => r !== undefined)
 */
export async function raceUntil<T = unknown>(
  promises: Promise<T>[],
  cb = (r: T) => r !== undefined,
): Promise<{
  inner: Promise<void | T[]>;
  outer: Promise<T | null>;
}> {
  const { promise: outer, resolve, reject } = Promise.withResolvers<T>();

  const _promises = promises.map(p =>
    p.then(result => {
      // If an inner promise resolves with a truthy result, resolve the outer promise
      if (cb(result)) resolve(result);
      return result;
    }),
  );
  const inner = Promise.all(_promises)
    .catch(reject)
    .then(result => {
      // If no truthy result is found, resolve with null
      resolve(null);
      return result;
    });
  return { inner, outer };
}
