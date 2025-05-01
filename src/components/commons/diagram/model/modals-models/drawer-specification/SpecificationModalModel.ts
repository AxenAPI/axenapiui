import {createEffect, createEvent, createStore} from 'effector';

import {apiClient} from '@/shared/api/client';
import {GetServiceSpecificationPostRequest, UpdateServiceSpecificationPostRequest} from '@/shared/api/event-graph-api';

export const openSpecificationModal = createEvent<string>();
export const closeSpecificationModal = createEvent();

// Стор модального окна информационной панели. Содержит два поля:
// - isOpen: boolean - флаг открытия/закрытия модального окна
// - itemId: string - идентификатор элемента, для которого открыто окно
export const $specificationModal = createStore<{isOpen: boolean; nodeId: string}>({
  isOpen: false,
  nodeId: '',
})
  .on(openSpecificationModal, (_, payload) => ({
    isOpen: true,
    nodeId: payload,
  }))
  .reset(closeSpecificationModal);

// Асинхронный эффект для получения спецификаций
export const fetchServiceSpecificationFx = createEffect(
  async (getServiceSpecificationPostRequest: GetServiceSpecificationPostRequest) => {
    try {
      return await apiClient.getServiceSpecificationPost({getServiceSpecificationPostRequest});
    } catch (e) {
      throw new Error(e);
    }
  }
);

/**
 * Update service specification effect.
 */
export const updateServiceSpecification = createEffect(
  async (updateServiceSpecificationPostRequest: UpdateServiceSpecificationPostRequest) => {
    try {
      const response = await apiClient.updateServiceSpecificationPost({updateServiceSpecificationPostRequest});

      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
);
