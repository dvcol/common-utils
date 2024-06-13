/**
 * Returns true if window prefers-color-scheme is dark
 */
export const isDarkTheme = (): boolean => window.matchMedia('(prefers-color-scheme: dark').matches;
