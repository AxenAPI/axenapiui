import { EventDTO } from '@shared/openapi';

import { GraphNodeEventManager } from '../types/managersTypes';

/** для быстрого доступа к событиям по ID */
export const NewGraphNodeEventManager = (events: EventDTO[]): GraphNodeEventManager => {
  const eventsMap = new Map<string, EventDTO>();
  for (const event of events) {
    eventsMap.set(event.id, event);
  }
  return { getEvent: (id: string) => eventsMap.get(id) };
};
