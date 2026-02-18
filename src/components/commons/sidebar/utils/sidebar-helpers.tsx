import { NodeDTO } from '@shared/openapi';

import { ARROW_LEFT, ARROW_RIGHT, EMPTY_CHAR } from '@/constants/common';
import { EConnectionType } from '@/enums/common';

export const getLinkItemTitle = (
  serviceNode: NodeDTO | undefined,
  topicNode: NodeDTO | undefined,
  httpNode: NodeDTO | undefined,
  connectionType: EConnectionType | undefined
) => {
  const serviceName = serviceNode?.name ?? EMPTY_CHAR;
  const topicName = topicNode?.name ?? EMPTY_CHAR;
  const httpName = httpNode?.name ?? EMPTY_CHAR;

  switch (connectionType) {
    case EConnectionType.PRODUCE:
      return `${serviceName}${ARROW_RIGHT}${topicName || httpName}`;
    case EConnectionType.CONSUME:
      return `${serviceName}${ARROW_LEFT}${topicName || httpName}`;
    default:
      return EMPTY_CHAR;
  }
};
