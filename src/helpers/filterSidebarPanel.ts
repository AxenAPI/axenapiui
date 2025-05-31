import {EventGraphDTO} from '@/shared/api/event-graph-api';

import {getLinkFormData} from './modal-helpers/getLinkFormData';

/**
 * Функиця фильтрует sidebar меню.
 *
 * @param {EventGraphDTO} eventGraphData - объект меню
 * @param {string} filterText значение введеное пользователем в строку поиска
 */
export const filterSidebarPanel = (eventGraphData: EventGraphDTO, filterText: string): EventGraphDTO => {
  // фильтрация событий
  const filteredEvents = eventGraphData.events.filter(item =>
    item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  // фильтрация нод
  const filteredNodes = eventGraphData.nodes.filter(item => item.name.toLowerCase().includes(filterText.toLowerCase()));

  // фильтрация тегов
  const filteredTags = eventGraphData.tags.filter(item => item.toLowerCase().includes(filterText.toLowerCase()));

  // фильтрация ссылок
  const filteredLink = eventGraphData?.links?.filter(link => {
    const nodes = eventGraphData?.nodes;
    if (filterText.length === 0) return link;

    const {fromId, toId} = link;

    const {httpNode, topicNode} = getLinkFormData(nodes, fromId, toId);

    return (
      httpNode?.name.toLowerCase().includes(filterText.toLowerCase()) ||
      topicNode?.name.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  return {
    ...eventGraphData,
    nodes: filteredNodes,
    events: filteredEvents,
    tags: filteredTags,
    links: filteredLink,
  };
};
