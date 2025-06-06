import {EConnectionType, EObjectToConnect} from '@/enums/common';
import {NodeDTO, NodeDTOTypeEnum} from '@/shared/api/event-graph-api';

export const getLinkFormData = (nodes: NodeDTO[], fromId: string, toId: string) => {
  const serviceNodes = nodes?.filter(({type}) => type === NodeDTOTypeEnum.Service);
  const topicNodes = nodes?.filter(({type}) => type === NodeDTOTypeEnum.Topic);
  const httpNodes = nodes?.filter(({type}) => type === NodeDTOTypeEnum.Http);

  let serviceNode;
  let topicNode;
  let connectionType: EConnectionType;
  let objectToConnect: EObjectToConnect;
  let httpNode;

  const fromServiceNode: NodeDTO = serviceNodes?.find(({id}) => id === fromId);
  const toServiceNode = serviceNodes?.find(({id}) => id === toId);

  if (fromServiceNode) {
    serviceNode = fromServiceNode;
    connectionType = EConnectionType.PRODUCE;
    topicNode = topicNodes?.find(({id}) => id === toId);
    objectToConnect = EObjectToConnect.TOPIC;
  }

  if (toServiceNode) {
    serviceNode = toServiceNode;
    connectionType = EConnectionType.CONSUME;
    const fromTopicNode = topicNodes?.find(({id}) => id === fromId);

    if (fromTopicNode) {
      topicNode = fromTopicNode;
      objectToConnect = EObjectToConnect.TOPIC;
    } else {
      httpNode = httpNodes?.find(({id}) => id === fromId);
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
