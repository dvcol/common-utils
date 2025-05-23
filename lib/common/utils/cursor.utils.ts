type Position = { clientX: number; clientY: number };

// Function to check if cursor is over text node
const checkTextNode = (node: Node, { clientX, clientY }: Position) => {
  if (node.nodeType !== Node.TEXT_NODE) return false;

  // Get the range for this node
  const range = document.createRange();
  range.selectNodeContents(node);
  const rects = range.getClientRects(); // Get bounding rects for the text

  // eslint-disable-next-line no-restricted-syntax
  for (const rect of rects) {
    // Check if cursor is inside the bounding box of the text node
    if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
      return true;
    }
  }

  return false;
};

// Recursively check all child nodes for text content
const checkTextInElement = (elem: Node, position: Position) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const child of elem.childNodes) {
    if (checkTextNode(child, position)) return true;
    if (child.nodeType === Node.ELEMENT_NODE && checkTextInElement(child, position)) return true;
  }
  return false;
};

const isTextInputType = (element: Element) => {
  if (element.tagName === 'INPUT') return true;
  if (element.tagName === 'TEXTAREA') return true;
  return (element as HTMLElement).isContentEditable;
};

const isCursorOverText = ({ clientX, clientY }: Position) => {
  // Get the exact element under the cursor
  const element = document.elementFromPoint(clientX, clientY);
  // No element found for type safety
  if (!element) return false;
  // Check if the element has user-select: none
  const style = getComputedStyle(element);
  // -webkit-user-select is for Safari
  if (style?.userSelect === 'none' || style?.['-webkit-user-select'] === 'none') return false;

  // Check if the element is a text-input or contenteditable (to avoid false positives)
  if (isTextInputType(element)) return true;

  return checkTextInElement(element, { clientX, clientY });
};

const getCursorStyle = (target: HTMLElement, event: PointerEvent) => {
  const style = getComputedStyle(target).cursor;
  if (style === 'auto' && isCursorOverText(event)) return 'text';
  return style;
};

export const getCursorState = (e: PointerEvent) => {
  const { target } = e;
  if (!target || !(target instanceof HTMLElement)) return;
  return getCursorStyle(target, e);
};
