import {Button, Drawer, Space} from '@axenix/ui-kit';
import {useUnit} from 'effector-react';
import {FC, useCallback, useEffect} from 'react';
import {useForm} from 'react-hook-form';

import {ARROW_LEFT, ARROW_RIGHT, EMPTY_ARRAY, EMPTY_CHAR} from '@/constants/common';
import {EConnectionType, EObjectToConnect} from '@/enums/common';
import {getRelatedGhostNodeId} from '@/helpers/diagram-helpers/edge-helpers';
import {getDeterminedLinkIds} from '@/helpers/modal-helpers/getDeterminedLinkIds';
import {getLinkFormData} from '@/helpers/modal-helpers/getLinkFormData';
import {$eventGraph, addLinksError, editLink, removeLink} from '@/models/EventGraphModel';
import {NodeDTOTypeEnum} from '@/shared/api/event-graph-api';
import {ILinkForm} from '@/types/common';

import {$ghostNodes, removeGhostNode} from '../../model/DiagramModel';
import {$drawerEditLink, closeDrawerEditLink} from '../../model/modals-models/drawer-edit-link/DrawerEditLinkModel';

import {DrawerLinkItem} from './DrawerLinkItem';

export const DrawerEditLink: FC = () => {
  const drawerEditLink = useUnit($drawerEditLink);
  const eventGraph = useUnit($eventGraph);
  const ghostNodes = useUnit($ghostNodes);
  const {isOpen, linkId} = drawerEditLink;
  const methods = useForm<ILinkForm>({
    defaultValues: {
      connectionType: null,
      objectToConnect: null,
      fromId: EMPTY_CHAR,
      toId: EMPTY_CHAR,
      eventId: EMPTY_CHAR,
    },
  });

  const {fromId, toId} = eventGraph?.links?.find(({id}) => id === linkId) ?? {};
  const nodes = eventGraph?.nodes;
  const events = eventGraph?.events || EMPTY_ARRAY;
  const serviceNodes = nodes?.filter(({type}) => type === NodeDTOTypeEnum.Service);
  const topicNodes = nodes?.filter(({type}) => type === NodeDTOTypeEnum.Topic);
  const httpNodes = nodes?.filter(({type}) => type === NodeDTOTypeEnum.Http);
  const serviceOptions = serviceNodes?.map(({id, name}) => ({
    label: name,
    value: id,
  }));
  const topicOptions = topicNodes?.map(({id, name}) => ({
    label: name,
    value: id,
  }));
  const httpOptions = httpNodes?.map(({id, name}) => ({
    label: name,
    value: id,
  }));
  const eventsOptions = events?.map(({id, name}) => ({
    label: name,
    value: id,
  }));
  const {connectionType, httpNode, objectToConnect, serviceNode, topicNode} = getLinkFormData(nodes, fromId, toId);

  const getTitle = () => {
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

  const closeHandler = useCallback(() => {
    closeDrawerEditLink();
    methods.reset();
  }, [methods]);

  const editLinkHandler = useCallback(
    (data: ILinkForm) => {
      if (!data.fromId || !data.toId) return;

      const adjustedData = getDeterminedLinkIds(data.connectionType, data);

      // Проверка наличия необходимых идентификаторов
      if (!data.eventId || !data.fromId || !data.toId) {
        return addLinksError();
      }

      editLink({id: linkId, updates: adjustedData});
      closeHandler();

      if (ghostNodes?.length) {
        const ghostNodeId = getRelatedGhostNodeId(ghostNodes, fromId, toId);
        removeGhostNode(ghostNodeId);
      }
    },
    [closeHandler, fromId, ghostNodes, linkId, toId]
  );

  useEffect(() => {
    const event = eventGraph?.links?.find(({id}) => id === linkId)?.eventId;

    methods.setValue('connectionType', connectionType);
    methods.setValue('objectToConnect', objectToConnect);
    methods.setValue('fromId', serviceNode?.id);
    methods.setValue('toId', topicNode?.id);
    methods.setValue('eventId', event);

    if (objectToConnect === EObjectToConnect.HTTP_NODE) methods.setValue('toId', httpNode?.id);
  }, [connectionType, eventGraph?.links, fromId, httpNode, linkId, methods, objectToConnect, serviceNode, topicNode]);

  return (
    <Drawer
      data-testid="drawer-edit-link"
      title={getTitle()}
      size="350px"
      width={350}
      customFooter={
        <Space>
          <Button style={{borderRadius: '3px'}} type="primary" onClick={methods.handleSubmit(editLinkHandler)}>
            Save
          </Button>

          <Button style={{borderRadius: '3px'}} onClick={closeHandler}>
            Cancel
          </Button>

          <Button
            style={{borderRadius: '3px'}}
            onClick={() => {
              removeLink(linkId);
              closeDrawerEditLink();
            }}
          >
            Delete
          </Button>
        </Space>
      }
      isOpen={isOpen}
      isDestroyOnClose
      onClose={closeHandler}
    >
      <DrawerLinkItem
        serviceOptions={serviceOptions}
        topicOptions={topicOptions}
        eventsOptions={eventsOptions}
        httpOptions={httpOptions}
        connectionTypeFieldName="connectionType"
        fromNodeFieldName="fromId"
        objectToConnectFieldName="objectToConnect"
        toNodeFieldName="toId"
        eventFieldName="eventId"
        methods={methods}
      />
    </Drawer>
  );
};
