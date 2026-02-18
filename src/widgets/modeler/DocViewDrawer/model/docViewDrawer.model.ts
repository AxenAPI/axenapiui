import { createEvent, createStore, sample } from 'effector';

/**
 * Widget: DocViewDrawer
 *
 * Ответственность: только UI-состояние drawer'а (открыт/закрыт).
 * Данные для отображения читаются из Entity (DocumentTree.$selectedFile).
 * Бизнес-логику выбора документа выполняет Feature (SelectDocumentForView).
 */

// Stores
const $isOpen = createStore(false);

// Events
const openDrawer = createEvent();
const closeDrawer = createEvent();

// Logic

sample({
  clock: openDrawer,
  fn: () => true,
  target: $isOpen,
});

sample({
  clock: closeDrawer,
  fn: () => false,
  target: $isOpen,
});

export const docViewDrawerModel = {
  stores: {
    $isOpen,
    // Данные документа читаем из documentTreeModel.stores.$selectedFile
  },
  events: {
    openDrawer,
    closeDrawer,
  },
};
