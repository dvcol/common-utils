export const getFocusableElement = (
  element?: Element | null,
  targets: string[] = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ],
): HTMLElement | null | undefined => element?.querySelector<HTMLElement>(targets.join(','));
