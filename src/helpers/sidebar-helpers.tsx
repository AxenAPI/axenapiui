import {ARROW_LEFT, ARROW_RIGHT, EMPTY_CHAR} from '@/constants/common';
import {EConnectionType} from '@/enums/common';
import {NodeDTO} from '@/shared/api/event-graph-api';

export const getLinkItemTitle = (
  serviceNode: NodeDTO,
  topicNode: NodeDTO,
  httpNode: NodeDTO,
  connectionType: EConnectionType
) => {
  const serviceName = serviceNode?.name ?? EMPTY_CHAR;
  const topicName = topicNode?.name ?? EMPTY_CHAR;

  switch (connectionType) {
    case EConnectionType.PRODUCE:
      return `${serviceName}${ARROW_RIGHT}${topicName}`;
    case EConnectionType.CONSUME:
      return `${serviceName}${ARROW_LEFT}${httpNode ? (httpNode?.name ?? EMPTY_CHAR) : topicName}`;
    default:
      return EMPTY_CHAR;
  }
};
