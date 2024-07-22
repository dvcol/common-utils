/**
 * Returns true if window prefers-color-scheme is dark
 */
export const isDarkTheme = (): boolean => window.matchMedia('(prefers-color-scheme: dark').matches;

/**
 * Returns true if window prefers-color-scheme is light
 */
export const isLightTheme = (): boolean => window.matchMedia('(prefers-color-scheme: light').matches;

/**
 * Watch the theme change and call the callback
 * @param callback callback to call when the theme changes
 * @param watched theme to watch (default: dark)
 */
export const watchTheme = (callback: (theme: 'light' | 'dark', event: MediaQueryListEvent) => void, watched: 'light' | 'dark' = 'dark') => {
  const mql = window.matchMedia(`(prefers-color-scheme: ${watched}`);
  const other = watched === 'dark' ? 'light' : 'dark';

  const listener = (event: MediaQueryListEvent) => {
    if (event.matches) return callback(watched, event);
    return callback(other, event);
  };
  mql.addEventListener('change', listener);
  return () => mql.removeEventListener('change', listener);
};

/**
 * Disposable version of watchTheme (compatible with ts5.x using Symbol.dispose)
 *
 * @param callback callback to call when the theme changes
 * @param watched theme to watch (default: dark)
 *
 * @see watchTheme
 */
export const watchDarkThemeDisposable = (
  callback: (theme: 'light' | 'dark', event: MediaQueryListEvent) => void,
  watched: 'light' | 'dark' = 'dark',
) => ({
  [Symbol.dispose]: watchTheme(callback, watched),
});
