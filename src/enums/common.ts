export enum EConnectionType {
  CONSUME = 'CONSUME',
  PRODUCE = 'PRODUCE',
}

export enum EObjectToConnect {
  HTTP_NODE = 'HTTP-NODE',
  TOPIC = 'TOPIC',
}

/**
 * custom - обычная связь с иконкой направления связи
 * disconnectedEdge - связь, если удалена нода
 * expandable - связь, которая содержит несколько связей. Можно "развернуть"
 * simple - простая линия
 */
export enum EEdgeTypes {
  CUSTOM = 'custom',
  DISCONNECTED = 'disconnectedEdge',
  EXPANDABLE = 'expandable',
  SIMPLE = 'simple',
}

/**
 * custom - обычный узел
 * ghost - удаленный узел
 * group - узел для создания группы
 * simple - узел для события при раскрытом топике
 */
export enum ENodeTypes {
  CUSTOM = 'custom',
  GHOST = 'ghost',
  GROUP = 'group',
  EXPANDED_EVENT = 'event',
}

/**
 * JSON - экспорт JSON
 * DOC - экспорт DOC
 * PDF - экспорт PDF
 */
export enum EExportTypes {
  JSON = 'JSON',
  DOC = 'DOC',
  PDF = 'PDF',
}
