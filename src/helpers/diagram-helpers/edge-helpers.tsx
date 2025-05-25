import type {Node} from '@xyflow/react';

import {EEdgeTypes} from '@/enums/common';
import {EventGraphDTO, LinkDTO} from '@/shared/api/event-graph-api';

/**
 * Проверяет существование узлов с id === fromId и id === toId в наборе узлов графа.
 */
export function isTargetAndSourceNodeExist(link: LinkDTO, rawData: EventGraphDTO): boolean {
  const isTargetNodeExist = rawData.nodes.some(node => node.id === link.toId);
  const isSourceNodeExist = rawData.nodes.some(node => node.id === link.fromId);

  return isTargetNodeExist && isSourceNodeExist;
}

/**
 * Проверяет, является ли ребро расширяемым (множественные или двунаправленные связи)
 */
export function isEdgeExpandable(link: LinkDTO, rawData: EventGraphDTO): boolean {
  // Существует ли несколько связей в одном направлении
  const isMultiple =
    rawData.links.filter(linkEl => linkEl.fromId === link.fromId && linkEl.toId === link.toId).length > 1;

  // Существуют ли двунаправленные связи
  const isBidirectional =
    rawData.links.filter(linkEl => linkEl.fromId === link.toId && linkEl.toId === link.fromId).length >= 1;

  return isMultiple || isBidirectional;
}

/**
 * Возвращает тип связи в зависимости от условий
 */
export function getLinkType(link: LinkDTO, rawData: EventGraphDTO, isExpanded?: boolean): EEdgeTypes {
  if (!isTargetAndSourceNodeExist(link, rawData)) return EEdgeTypes.DISCONNECTED;

  if (isEdgeExpandable(link, rawData) && !isExpanded) return EEdgeTypes.EXPANDABLE;

  return EEdgeTypes.CUSTOM;
}

/**
 * Возвращает id временного узла, связанного с разорванной связью
 */
export function getRelatedGhostNodeId(ghostNodes: Node[], fromId: string, toId: string) {
  return ghostNodes.find(({id}) => id === toId || id === fromId)?.id;
}

/**
 * Создает уникальный идентификатор для составного ребра
 * Пример: 1&2
 */
export function getExpandableLinkId(link: LinkDTO): string {
  return [link.fromId, link.toId].sort().join('&');
}

/**
 * Генерирует строку, представляющую направление связи между двумя узлами графа
 * Пример: 1->2
 */
export function generateDirectionString(fromId: string, toId: string) {
  return `${fromId}->${toId}`;
}

/**
 * Вычисляет угол между начальной и конечной точками. Используется для поворота стрелки в связи.
 */
export function getArrowAngle(params: {targetY: number; sourceY: number; targetX: number; sourceX: number}) {
  const {sourceX, sourceY, targetX, targetY} = params;

  return Math.atan2(targetY - sourceY, targetX - sourceX) * (180 / Math.PI);
}
