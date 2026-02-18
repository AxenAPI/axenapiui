import { createEffect, createEvent, createStore } from 'effector';

import { EventGraphService } from '@shared/api/services';
import { GetServiceSpecificationPostRequest, UpdateServiceSpecificationPostRequest } from '@shared/openapi';

export const openSpecificationModal = createEvent<string>();
export const closeSpecificationModal = createEvent();

// Стор модального окна информационной панели. Содержит два поля:
// - isOpen: boolean - флаг открытия/закрытия модального окна
// - itemId: string - идентификатор элемента, для которого открыто окно
export const $specificationModal = createStore<{ isOpen: boolean; nodeId: string }>({
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
      return await EventGraphService.getServiceSpecification(getServiceSpecificationPostRequest);
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : 'Failed to fetch service specification');
    }
  }
);

/**
 * Update service specification effect.
 */
export const updateServiceSpecification = createEffect(
  async (updateServiceSpecificationPostRequest: UpdateServiceSpecificationPostRequest) => {
    try {
      return await EventGraphService.updateServiceSpecification(updateServiceSpecificationPostRequest);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update service specification');
    }
  }
);
