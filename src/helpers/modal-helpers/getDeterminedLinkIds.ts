import { v4 as uuidV4 } from 'uuid';

import { LinkDTO } from '@shared/openapi';

import { EConnectionType } from '@/enums/common';
import { ILinkForm } from '@/types/common';

/**
 * Правильно определяет from/to ИД в зависимости от типа связи.
 *
 * @param {EConnectionType} type Тип связи.
 * @param {ILinkForm} link Расширенная для rhf модель связи.
 */
export const getDeterminedLinkIds = (type: EConnectionType, link: ILinkForm): LinkDTO => {
  const id = uuidV4();

  if (type === EConnectionType.CONSUME) {
    // toId и fromId меняются местами, т.к. по дефолту в fromId заполняется service
    return {
      id,
      fromId: link.toId,
      toId: link.fromId,
      eventId: link.eventId,
    };
  }

  return {
    id,
    fromId: link.fromId,
    toId: link.toId,
    eventId: link.eventId,
  };
};
