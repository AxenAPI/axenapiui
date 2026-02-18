import { createStore } from 'effector';

// Стор со статусом ноды
export const $status = createStore<string | null>(null, {
  skipVoid: false,
});
