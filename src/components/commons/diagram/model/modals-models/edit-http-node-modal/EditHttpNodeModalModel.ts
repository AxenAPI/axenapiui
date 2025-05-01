import {createEvent, createStore} from 'effector';

export const openEditHttpNodeModal = createEvent<string>();
export const closeEditHttpNodeModal = createEvent();

// Стор модального окна информационной панели. Содержит два поля:
// - isOpen: boolean - флаг открытия/закрытия модального окна
// - itemId: string - идентификатор элемента, для которого открыто окно
export const $editHttpNodeModal = createStore<{isOpen: boolean; nodeId: string}>({
  isOpen: false,
  nodeId: '',
})
  .on(openEditHttpNodeModal, (_, payload) => ({
    isOpen: true,
    nodeId: payload,
  }))
  .reset(closeEditHttpNodeModal);
