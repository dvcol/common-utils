// es lint-disable-next-line @typescript-eslint/no-explicit-any -- generic type
type AnyFunction<T> = (...args: any[]) => Promise<T> | T;
type Timeout = ReturnType<typeof setTimeout>;

type Ref<T> = {
  value: T;
};

export function debounce<T>(
  func: AnyFunction<T>,
  delay = 250,
  timout: Ref<Timeout | undefined> = { value: undefined },
): (...args: Parameters<typeof func>) => Promise<T> {
  const timeoutId = timout;
  let resolves: ((value: T) => void)[] = [];
  let rejects: ((error: unknown) => void)[] = [];

  return async (...args: Parameters<typeof func>[]): Promise<T> => {
    if (timeoutId.value) clearTimeout(timeoutId.value);
    const { resolve, reject, promise } = Promise.withResolvers<T>();
    resolves.push(resolve);
    rejects.push(reject);

    timeoutId.value = setTimeout(async () => {
      try {
        const result = await func(...args);
        resolves.forEach(r => r(result));
        resolves = [];
      } catch (error) {
        rejects.forEach(r => r(error));
        rejects = [];
      }
    }, delay);

    return promise;
  };
}
