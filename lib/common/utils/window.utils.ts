/**
 * Returns true if window prefers-color-scheme is dark
 */
export const isDarkTheme = (): boolean => window.matchMedia('(prefers-color-scheme: dark').matches;

/**
 * Returns true if window prefers-color-scheme is light
 */
export const isLightTheme = (): boolean => window.matchMedia('(prefers-color-scheme: light').matches;
