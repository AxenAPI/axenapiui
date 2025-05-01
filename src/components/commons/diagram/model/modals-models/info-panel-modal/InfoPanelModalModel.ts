import {createEvent, createStore} from 'effector';

export const openInfoPanelModal = createEvent<string>();
export const closeInfoPanelModal = createEvent();

// Стор модального окна информационной панели. Содержит два поля:
// - isOpen: boolean - флаг открытия/закрытия модального окна
// - itemId: string - идентификатор элемента, для которого открыто окно
export const $infoPanelModal = createStore<{isOpen: boolean; itemId: string}>({
  isOpen: false,
  itemId: '',
})
  .on(openInfoPanelModal, (_, payload) => ({
    isOpen: true,
    itemId: payload,
  }))
  .reset(closeInfoPanelModal);
