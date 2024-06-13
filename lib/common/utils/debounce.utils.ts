// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic type
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

  return async (...args: Parameters<typeof func>[]): Promise<T> => {
    return new Promise(resolve => {
      if (timeoutId.value) clearTimeout(timeoutId.value);

      timeoutId.value = setTimeout(async () => {
        const result = await func(...args);
        resolve(result);
      }, delay);
    });
  };
}
