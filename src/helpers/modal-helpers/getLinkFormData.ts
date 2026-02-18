import { NodeDTO, NodeDTOTypeEnum } from '@shared/openapi';

import { EConnectionType, EObjectToConnect } from '@/enums/common';

export const getLinkFormData = (nodes: NodeDTO[], fromId: string, toId: string) => {
  const serviceNodes = nodes?.filter(({ type }) => type === NodeDTOTypeEnum.Service);
  const topicNodes = nodes?.filter(({ type }) => type === NodeDTOTypeEnum.Topic);
  const httpNodes = nodes?.filter(({ type }) => type === NodeDTOTypeEnum.Http);

  let serviceNode: NodeDTO | undefined;
  let topicNode: NodeDTO | undefined;
  let connectionType: EConnectionType | undefined;
  let objectToConnect: EObjectToConnect | undefined;
  let httpNode: NodeDTO | undefined;

  const fromServiceNode: NodeDTO | undefined = serviceNodes?.find(({ id }) => id === fromId);
  const toServiceNode: NodeDTO | undefined = serviceNodes?.find(({ id }) => id === toId);

  if (fromServiceNode) {
    serviceNode = fromServiceNode;
    connectionType = EConnectionType.PRODUCE;
    topicNode = topicNodes?.find(({ id }) => id === toId);
    if (topicNode) {
      objectToConnect = EObjectToConnect.TOPIC;
    }
    httpNode = httpNodes?.find(({ id }) => id === toId);
    if (httpNode) {
      objectToConnect = EObjectToConnect.HTTP_NODE;
    }
  }

  if (toServiceNode) {
    serviceNode = toServiceNode;
    connectionType = EConnectionType.CONSUME;
    const fromTopicNode = topicNodes?.find(({ id }) => id === fromId);

    if (fromTopicNode) {
      topicNode = fromTopicNode;
      objectToConnect = EObjectToConnect.TOPIC;
    } else {
      httpNode = httpNodes?.find(({ id }) => id === fromId);
      objectToConnect = EObjectToConnect.HTTP_NODE;
    }
  }

  return {
    serviceNode,
    connectionType,
    topicNode,
    objectToConnect,
    httpNode,
  };
};
