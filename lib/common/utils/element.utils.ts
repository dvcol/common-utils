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

const clickableTags = new Set(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL', 'SUMMARY', 'OPTION', 'DETAILS', 'VIDEO', 'AUDIO']);

export const isClickable = (element: Element) => {
  if (element.hasAttribute('disabled') && ['', 'true', null].includes(element.getAttribute('disabled'))) return false;
  if (element.hasAttribute('readonly') && ['', 'true', null].includes(element.getAttribute('readonly'))) return false;
  if ((element as HTMLElement).tabIndex < 0) return false;
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
