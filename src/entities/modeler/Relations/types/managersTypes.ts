import { EventDTO, NodeDTO } from '@shared/openapi';

/**
 * Менеджер нодов графа
 * Создан для быстрого доступа к нодам по ID
 */
export interface GraphNodeManager {
  getNode: (id: string) => NodeDTO | undefined;
}

/**
 * Менеджер событий
 * Создан для быстрого доступа к событиям по ID
 */
export interface GraphNodeEventManager {
  getEvent: (id: string) => EventDTO | undefined;
}
