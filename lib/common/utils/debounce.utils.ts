// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic type
type AnyFunction<Return, Params extends any[] = any[]> = (...args: Params) => Promise<Return> | Return;
type Timeout = ReturnType<typeof setTimeout>;

type Ref<T> = {
  value: T;
};

/**
 * Debounce function that will wait for the delay to pass before executing the function.
 * @param func The function to debounce.
 * @param delay The delay in milliseconds. (default 250 ms)
 * @param timout The timeout reference.
 * @param cancel A function to run (with n-1 arguments) when a debounced call is canceled (i.e. before the delay).
 */
export function debounce<T, C>(
  func: AnyFunction<T>,
  delay = 250,
  timout: Ref<Timeout | undefined> = { value: undefined },
  cancel?: AnyFunction<C>,
): {
  (...args: Parameters<typeof func>): Promise<T>;
  timout?: Timeout;
  cancel: () => Promise<C | undefined>;
  resolve: ((value: T) => void)[];
  reject: ((error: unknown) => void)[];
  previous: Parameters<typeof func>;
} {
  const timeoutId = timout;
  const resolves: ((value: T) => void)[] = [];
  const rejects: ((error: unknown) => void)[] = [];
  const previous: Parameters<typeof func> = [];

  const clear = async () => {
    if (timeoutId.value === undefined) return;
    clearTimeout(timeoutId.value);
    const result = await cancel?.(...previous);
    timeoutId.value = undefined;
    previous.length = 0;
    return result;
  };

  const fn = async (...args: Parameters<typeof func>[]): Promise<T> => {
    await clear();
    const { resolve, reject, promise } = Promise.withResolvers<T>();
    resolves.push(resolve);
    rejects.push(reject);

    previous.push(...args);
    timeoutId.value = setTimeout(async () => {
      try {
        const result = await func(...args);
        resolves.forEach(r => r(result));
        resolves.length = 0;
      } catch (error) {
        rejects.forEach(r => r(error));
        rejects.length = 0;
      } finally {
        timeoutId.value = undefined;
        previous.length = 0;
      }
    }, delay);

    return promise;
  };

  Object.defineProperties(fn, {
    cancel: {
      value: clear,
    },
    timeout: {
      get: () => timeoutId.value,
    },
    resolve: {
      get: () => resolves,
    },
    reject: {
      get: () => rejects,
    },
    previous: {
      get: () => previous,
    },
  });

  return fn as {
    (...args: Parameters<typeof func>): Promise<T>;
    timeout?: Timeout;
    cancel: () => Promise<C | undefined>;
    resolve: ((value: T) => void)[];
    reject: ((error: unknown) => void)[];
    previous: Parameters<typeof func>;
  };
}

export function useDebounce<T>({
  fn,
  cancel,
  delay = 250,
  timeout = { value: undefined },
}: {
  fn: AnyFunction<T>;
  cancel?: AnyFunction<unknown>;
  delay?: number;
  timeout?: Ref<Timeout | undefined>;
}): {
  debounce: (...args: Parameters<typeof fn>) => Promise<T>;
  cancel: () => unknown | Promise<unknown>;
} {
  const debounced = debounce(fn, delay, timeout, cancel);
  return {
    debounce: debounced,
    cancel: debounced.cancel,
  };
}
