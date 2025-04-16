// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic type
type AnyFunction<Return, Params extends any[] = any[]> = (...args: Params) => Promise<Return> | Return;
type AnySyncFunction<Return, Params extends any[] = any[]> = (...args: Params) => Return;
type Timeout = ReturnType<typeof setTimeout>;

type Ref<T> = {
  value: T;
};

export type DebouncedFunction<Result, Cancel = void, Fn extends AnyFunction<Result> = AnyFunction<Result>> = {
  (...args: Parameters<Fn>): Promise<Result>;
  /**
   * The timeout currently running if any.
   */
  timout?: Timeout;
  /**
   * Cancel the running timeout, but does not reject/resolve the outsanding promise.
   * To manually reject/resolve the debounce, please use `resolve` or `reject`
   */
  cancel: () => Promise<Cancel | undefined>;
  /**
   * Resolve the current promise early and clear timeout
   * @param value
   */
  resolve: (value: Result) => void;
  /**
   * Reject the current promise early and clear timeout
   * @param error
   */
  reject: (error: unknown) => void;
  /**
   * The arguments passed to the previous call (used for cancel callback)
   */
  previous: Parameters<Fn>;
  /**
   * The current promise (if any)
   */
  promise: Promise<Result> | undefined;
};

/**
 * Debounce function that will wait for the delay to pass before executing the function.
 * @param func The function to debounce.
 * @param delay The delay in milliseconds. (default 250 ms)
 * @param timout The timeout reference.
 * @param cancel A function to run (with n-1 arguments) when a debounced call is canceled (i.e. before the delay).
 */
export function debounce<Result, Cancel>(
  func: AnyFunction<Result>,
  delay = 250,
  timout: Ref<Timeout | undefined> = { value: undefined },
  cancel?: AnySyncFunction<Cancel>,
): DebouncedFunction<Result, Cancel, typeof func> {
  const timeoutId = timout;
  let resolve: (value: Result) => void;
  let reject: (error: unknown) => void;
  let promise: Promise<Result> | undefined;
  const previous: Parameters<typeof func> = [];

  const clear = () => {
    if (timeoutId.value === undefined) return;
    clearTimeout(timeoutId.value);
    const result = cancel?.(...previous);
    timeoutId.value = undefined;
    previous.length = 0;
    return result;
  };

  const finish = () => {
    timeoutId.value = undefined;
    previous.length = 0;
    promise = undefined;
  };

  const fn = async (...args: Parameters<typeof func>[]): Promise<Result> => {
    if (!promise) ({ resolve, reject, promise } = Promise.withResolvers<Result>());

    clear();

    previous.push(...args);
    timeoutId.value = setTimeout(async () => {
      try {
        const result = await func(...args);
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        finish();
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
      value: (value: Result) => {
        resolve(value);
        finish();
      },
    },
    reject: {
      value: (error: unknown) => {
        reject(error);
        finish();
      },
    },
    previous: {
      get: () => previous,
    },
    promise: {
      get: () => promise,
    },
  });

  return fn as DebouncedFunction<Result, Cancel, typeof func>;
}

export function useDebounce<Result>({
  fn,
  cancel,
  delay = 250,
  timeout = { value: undefined },
}: {
  fn: AnyFunction<Result>;
  cancel?: AnyFunction<unknown>;
  delay?: number;
  timeout?: Ref<Timeout | undefined>;
}): {
  debounce: (...args: Parameters<typeof fn>) => Promise<Result>;
  cancel: () => unknown | Promise<unknown>;
} {
  const debounced = debounce(fn, delay, timeout, cancel);
  return {
    debounce: debounced,
    cancel: debounced.cancel,
  };
}
