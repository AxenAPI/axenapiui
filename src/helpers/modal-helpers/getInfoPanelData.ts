import {EventDTO, LinkDTO, NodeDTO} from '@/shared/api/event-graph-api';
import {InfoPanelData, InfoPanelItem} from '@/types/common';

export const getInfoPanelData = (
  itemId: NodeDTO['id'],
  links: LinkDTO[],
  nodes: NodeDTO[],
  events: EventDTO[]
): InfoPanelData => {
  // Функция для поиска ноды по её ID
  const findNodeById = (id: NodeDTO['id']) => nodes.find(node => node.id === id);

  // Функция для поиска события по его ID
  const findEventById = (id: EventDTO['id']) => events.find(event => event.id === id);

  // Фильтруем связи: входящие в ноду с `itemId` и исходящие из неё
  const toMainNodeLinks = links.filter(link => link.toId === itemId); // Входящие связи
  const fromMainNodeLinks = links.filter(link => link.fromId === itemId); // Исходящие связи

  // Вспомогательная функция для обработки связей и формирования массива данных
  const processLinks = (rawLinks: LinkDTO[], isFrom: boolean): InfoPanelItem[] =>
    rawLinks.reduce((acc: InfoPanelItem[], link) => {
      // Находим связанную ноду (в зависимости от направления связи)
      const relatedNodeId = isFrom ? link.fromId : link.toId;
      const relatedNode = findNodeById(relatedNodeId);

      if (relatedNode) {
        // Проверяем, есть ли уже эта нода в аккумуляторе
        const existingNode = acc.find(node => node.id === relatedNode.id);

        if (existingNode) {
          // Если нода уже есть, добавляем событие в её массив событий
          existingNode.events.push(findEventById(link.eventId));
        } else {
          // Если ноды ещё нет, создаём новую запись с начальным массивом событий
          acc.push({
            ...relatedNode,
            events: [findEventById(link.eventId)],
          });
        }
      }

      return acc;
    }, []);

  const givingEventsNodes = processLinks(toMainNodeLinks, true); // Ноды, из которых идёт событие в ноду с `itemId`
  const gettingEventNodes = processLinks(fromMainNodeLinks, false); // Ноды, в которые идёт события из ноды с `itemId`

  return {
    consumingData: givingEventsNodes,
    producingData: gettingEventNodes,
  };
};
