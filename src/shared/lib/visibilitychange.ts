import { createEvent } from 'effector';

// === Internal Events ===
export const windowFocused = createEvent();

// === Window Focus Listener ===
const setupFocusListener = () => {
  window.addEventListener('focus', () => windowFocused());
};

// Инициализация
if (typeof window !== 'undefined') {
  setupFocusListener();
}
