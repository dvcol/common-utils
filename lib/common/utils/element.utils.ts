export const focusableElementSelectors = Object.freeze([
  'button:not([disabled])',
  '[href]', // Ensures only real links are focusable
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]', // Includes manually focusable elements
] as const);

export const tabFocusableElementSelectors = Object.freeze([
  'button:not([disabled], [tabindex="-1"])',
  '[href]:not([tabindex="-1"])',
  'input:not([disabled], [tabindex="-1"])',
  'select:not([disabled], [tabindex="-1"])',
  'textarea:not([disabled], [tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
] as const);

export const getFocusableElement = (
  element?: Element | null,
  targets: string[] | readonly string[] = tabFocusableElementSelectors,
): HTMLElement | null | undefined => element?.querySelector<HTMLElement>(targets.join(','));

/**
 * Get all focusable children of an element (excluding non tabbable elements (disabled, readonly, tabIndex=-1))
 * @param element - The element to search within
 * @param targets - Array of selectors to search for focusable elements
 * @returns Array of focusable elements sorted by tabIndex (from lowest to highest)
 */
export const getFocusableElements = (
  element?: Element | null,
  targets: string[] | readonly string[] = tabFocusableElementSelectors,
): HTMLElement[] | undefined => {
  const elements = element?.querySelectorAll<HTMLElement>(targets.join(','));
  if (!elements) return;
  return Array.from(elements).sort((a, b) => (a.tabIndex || 0) - (b.tabIndex || 0));
};

export const getLastFocusableElement = (
  element?: Element | null,
  targets: string[] | readonly string[] = tabFocusableElementSelectors,
): HTMLElement | null | undefined => {
  const elements = getFocusableElements(element, targets);
  if (!elements || !elements.length) return;
  return elements[elements.length - 1];
};

export const clickableTags = new Set(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL', 'SUMMARY', 'OPTION', 'DETAILS', 'VIDEO', 'AUDIO']);

export const isClickable = (element: Element) => {
  if (element.hasAttribute('disabled') && ['', 'true', null].includes(element.getAttribute('disabled'))) return false;
  if (element.hasAttribute('readonly') && ['', 'true', null].includes(element.getAttribute('readonly'))) return false;
  if ((element as HTMLElement).tabIndex < 0) return false;
  if (element.hasAttribute('role') && ['button', 'link'].includes(element.getAttribute('role')?.toLowerCase())) return true;
  return (
    clickableTags.has(element.tagName) ||
    element.hasAttribute('onclick') ||
    element.hasAttribute('onkeydown') ||
    (element as HTMLElement).isContentEditable ||
    (element as HTMLElement).tabIndex >= 0
  );
};

// get first clickable ancestor
export const getClickableAncestor = (
  element: Element,
  boundary?: Element | (() => Element),
  selector: (node: Element) => boolean = isClickable,
): Element | undefined => {
  if (!element) return;
  if (typeof boundary === 'function' && boundary() === element) return;
  if (boundary === element) return;
  if (selector(element)) return element;
  if (!element.parentElement) return;
  return getClickableAncestor(element.parentElement, boundary, selector);
};

export const clickableSelector =
  "a, button, input, textarea, select, details, summary, [role='button'], [role='link'], [onclick], audio, video, [tabindex]:not([tabindex='-1'])";

export const closestClickableElement = (element: Element) => element.closest(clickableSelector);
