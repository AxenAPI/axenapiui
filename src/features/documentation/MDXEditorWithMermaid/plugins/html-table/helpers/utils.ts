/** Escapes HTML special characters to prevent XSS */
export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Generates unique IDs for table elements.
 * Uses a simple counter that persists across calls.
 * IDs are prefixed to indicate element type for debugging.
 */
let idCounter = 0;

export function generateCellId(): string {
  return `cell-${++idCounter}`;
}

export function generateRowId(): string {
  return `row-${++idCounter}`;
}

export function generateColumnId(): string {
  return `col-${++idCounter}`;
}

/** Escapes special characters in attribute values */
export function escapeAttrValue(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export interface ThrottledFunction<T extends (...args: Parameters<T>) => void> {
  cancel: () => void;

  (...args: Parameters<T>): void;
}

/** Simple throttle function for performance optimization */
export function throttle<T extends (...args: Parameters<T>) => void>(fn: T, delay: number): ThrottledFunction<T> {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const throttled = ((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= delay) {
      lastCall = now;
      fn(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn(...args);
      }, delay - timeSinceLastCall);
    }
  }) as ThrottledFunction<T>;

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return throttled;
}
