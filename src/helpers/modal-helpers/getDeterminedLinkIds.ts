import {v4 as uuidV4} from 'uuid';

import {EConnectionType, EObjectToConnect} from '@/enums/common';
import {LinkDTO} from '@/shared/api/event-graph-api';
import {ILinkForm} from '@/types/common';

/**
 * Правильно определяет from/to ИД в зависимости от типа связи.
 *
 * @param {EConnectionType} type Тип связи.
 * @param {ILinkForm} link Расширенная для rhf модель связи.
 */
export const getDeterminedLinkIds = (type: EConnectionType, link: ILinkForm): LinkDTO => {
  const id = uuidV4();

  switch (true) {
    case link.objectToConnect === EObjectToConnect.HTTP_NODE:
      return {
        id,
        fromId: link.toId, // service
        toId: link.fromId, // http-node
        eventId: link.eventId,
      };

    case type === EConnectionType.CONSUME:
      // toId и fromId меняются местами, т.к. по дефолту в fromId заполняется service
      return {
        id,
        fromId: link.toId,
        toId: link.fromId,
        eventId: link.eventId,
      };

    case type === EConnectionType.PRODUCE:
      return {
        id,
        fromId: link.fromId,
        toId: link.toId,
        eventId: link.eventId,
      };

    default:
      return null;
  }
};
