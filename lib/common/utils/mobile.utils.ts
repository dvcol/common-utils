export type LockedElement = HTMLElement & {
  dataset: DOMStringMap & { locked?: string; offsetX?: string; offsetY?: string };
};

export type ScrollContainer = {
  scrollTo: (x: number, y: number) => void;
};

export type UseMobileScrollLock = {
  /**
   * Locks the scroll of the target element by setting the scroll position to fixed.
   *
   * @returns True if the scroll was locked, false if the scroll was already locked.
   */
  lock: () => boolean;
  /**
   * Unlocks the scroll of the target element by restoring the scroll position to the original state.
   *
   * @returns True if the scroll was unlocked, false if the scroll was not locked.
   */
  unlock: () => boolean;
  /**
   * The target element to lock the scroll.
   *
   * @default document.body
   */
  target: LockedElement;
  /**
   * The number of locks that are active.
   */
  count: number;
  /**
   * Whether the scroll is locked.
   */
  locked: boolean;
  /**
   * The scroll offset of the target element.
   */
  offset: { x: number; y: number };
};

/**
 * Locks the scroll of the target element by setting the scroll position to fixed.
 *
 * Note: Removing the lock will restore the scroll position to the original state, regardless of the amount of locks.
 * @param target
 * @param container
 */
export const useMobileScrollLock = (target: LockedElement = document.body, container: ScrollContainer = window): UseMobileScrollLock => {
  return {
    lock: () => {
      const locked = Number(target.dataset.locked) || 0;
      target.dataset.locked = (locked + 1).toString();
      if (locked) return false;
      target.dataset.offsetX = window.pageXOffset.toString();
      target.dataset.offsetY = window.pageYOffset.toString();
      target.style.setProperty('--neo-dialog-scroll-offset-x', `-${window.pageXOffset}px`);
      target.style.setProperty('--neo-dialog-scroll-offset-y', `-${window.pageYOffset}px`);
      target.classList.add('neo-scroll-lock');
      return true;
    },
    unlock: () => {
      if (!target.dataset.locked) return false;
      if (Number(target.dataset.locked) > 1) console.warn('NeoDialog: Multiple locks are active, scroll lock may not work as expected');
      target.classList.remove('neo-scroll-lock');
      target.style.removeProperty('--neo-dialog-scroll-offset-x');
      target.style.removeProperty('--neo-dialog-scroll-offset-y');
      const { offsetX, offsetY } = target.dataset;
      container.scrollTo(Number(offsetX), Number(offsetY));
      delete target.dataset.locked;
      delete target.dataset.offsetX;
      delete target.dataset.offsetY;
      return true;
    },
    get target() {
      return target;
    },
    get count() {
      return Number(target.dataset.locked) || 0;
    },
    get locked() {
      return !!Number(target.dataset.locked);
    },
    get offset() {
      return { x: Number(target.dataset.offsetX), y: Number(target.dataset.offsetY) };
    },
  };
};
