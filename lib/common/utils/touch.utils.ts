export const SwipeDirection = {
  Up: 'up',
  Down: 'down',
  Left: 'left',
  Right: 'right',
} as const;

export type SwipeDirections = (typeof SwipeDirection)[keyof typeof SwipeDirection];

export type SwipeTolerances = {
  horizontal?: number;
  up?: number;
  down?: number;
  vertical?: number;
  left?: number;
  right?: number;
};

export type Position = { x: number; y: number };
export type ScrollState = {
  /**
   * The start position of the scroll state.
   */
  start?: Position;
  /**
   * The end position of the scroll state.
   */
  end?: Position;
  /**
   * If true, all swipes are ignored in the scroll state changed along the observed axis.
   */
  ignore?: boolean;
};

export type TouchState = {
  start: Touch;
  end: Touch;
};

const ignoreSwipe = ({ start, end, ignore = true }: ScrollState = {}, axis: keyof Position = 'x'): boolean => {
  if (!start || !end || !ignore) return false;
  return start[axis] !== end[axis];
};

const getDiff = (touch: TouchState, scroll: ScrollState = {}): Position => {
  const x = touch.start.clientX - touch.end.clientX;
  const y = touch.start.clientY - touch.end.clientY;
  if (!scroll.start || !scroll.end) return { x, y };
  return {
    x: x + (scroll.start.x - scroll.end.x),
    y: y + (scroll.start.y - scroll.end.y),
  };
};

/**
 * Detects swipe up or down from touch events
 * @param touch - The Touch state positions
 * @param touch.start - The TouchStart event
 * @param touch.end - The TouchEnd event
 * @param tolerance - The vertical tolerance for swipe detection
 * @param tolerance.up - The vertical tolerance for swipe up detection (default: 20, absolute value, sign will be ignored)
 * @param tolerance.down - The vertical tolerance for swipe down detection (default: 20, absolute value, sign will be ignored)
 * @param tolerance.horizontal - The vertical horizontal for swipe detection
 * @param scroll - The state to detect container scroll
 * @param scroll.start - The start position of the scroll state
 * @param scroll.end - The end position of the scroll state
 * @param scroll.ignore - If true, all swipes are ignored in the scroll state changed along the observed axis (default: true)
 */
export const handleSwipeUpDown = (
  { start, end }: Partial<TouchState>,
  { horizontal = 0, up = 20, down = 20 }: Pick<SwipeTolerances, 'horizontal' | 'up' | 'down'> = {},
  scroll: ScrollState = {},
): SwipeDirections | undefined => {
  if (!start || !end || ignoreSwipe(scroll, 'y')) return;
  const { x, y } = getDiff({ start, end }, scroll);
  // If it is a swipe left/right above the tolerance exit
  if (horizontal && Math.abs(x) >= horizontal) return;
  if (y < -Math.abs(down)) return SwipeDirection.Down;
  if (y > Math.abs(up)) return SwipeDirection.Up;
};

/**
 * Detects swipe left or right from touch events
 * @param touch - The Touch state positions
 * @param touch.start - The TouchStart event
 * @param touch.end - The TouchEnd event
 * @param tolerance - The horizontal tolerance for swipe detection
 * @param tolerance.left - The horizontal tolerance for swipe left detection (default: 20, absolute value, sign will be ignored)
 * @param tolerance.right - The horizontal tolerance for swipe right detection (default: 20, absolute value, sign will be ignored)
 * @param tolerance.vertical - The vertical tolerance for swipe detection
 * @param scroll - The state to detect container scroll
 * @param scroll.start - The start position of the scroll state
 * @param scroll.end - The end position of the scroll state
 * @param scroll.ignore - If true, all swipes are ignored in the scroll state changed along the observed axis (default: true)
 */
export const handleSwipeLeftRight = (
  { start, end }: Partial<TouchState>,
  { vertical = 0, left = 50, right = -50 }: Pick<SwipeTolerances, 'vertical' | 'left' | 'right'> = {},
  scroll: ScrollState = {},
): SwipeDirections | undefined => {
  if (!start || !end || ignoreSwipe(scroll, 'x')) return;
  const { x, y } = getDiff({ start, end }, scroll);
  // If it is a tap or swipe up/down above the tolerance exit
  if (vertical && Math.abs(y) >= vertical) return;
  if (x < -Math.abs(right)) return SwipeDirection.Right;
  if (x > Math.abs(left)) return SwipeDirection.Left;
};

/**
 * Detects swipe direction from touch events
 * @param touch - The Touch state positions
 * @param tolerances - The tolerances for swipe detection
 * @param scroll - The state to detect container scroll
 */
export const handleSwipe = (touch: TouchState, tolerances: SwipeTolerances = {}, scroll: ScrollState = {}): SwipeDirections | undefined => {
  return handleSwipeLeftRight(touch, tolerances, scroll) ?? handleSwipeUpDown(touch, tolerances, scroll);
};
