import { useUnit } from 'effector-react';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { NodeDTOTypeEnum } from '@shared/openapi';

import { ARROW_LEFT, ARROW_RIGHT, EMPTY_ARRAY, EMPTY_CHAR } from '@/constants/common';
import { EConnectionType, EObjectToConnect } from '@/enums/common';
import { getRelatedGhostNodeId } from '@/helpers/diagram-helpers/edge-helpers';
import { getDeterminedLinkIds } from '@/helpers/modal-helpers/getDeterminedLinkIds';
import { getLinkFormData } from '@/helpers/modal-helpers/getLinkFormData';
import { $eventGraph, addLinksError, editLink, removeLink } from '@/models/EventGraphModel';
import { ILinkForm } from '@/types/common';

import { $ghostNodes, removeGhostNode } from '../../../model/DiagramModel';
import {
  $drawerEditLink,
  closeDrawerEditLink,
} from '../../../model/modals-models/drawer-edit-link/DrawerEditLinkModel';

export const useDrawerEditLink = () => {
  const { drawerEditLink, eventGraph, ghostNodes } = useUnit({
    drawerEditLink: $drawerEditLink,
    eventGraph: $eventGraph,
    ghostNodes: $ghostNodes,
  });
  const { isOpen, linkId } = drawerEditLink;

  const methods = useForm<ILinkForm>({
    defaultValues: {
      connectionType: undefined,
      objectToConnect: undefined,
      fromId: EMPTY_CHAR,
      toId: EMPTY_CHAR,
      eventId: EMPTY_CHAR,
    },
  });

  const linkData = eventGraph?.links?.find(({ id }) => id === linkId);
  const { fromId, toId } = linkData || {};
  const nodes = eventGraph?.nodes;
  const { connectionType, httpNode, objectToConnect, serviceNode, topicNode } = getLinkFormData(
    nodes ?? [],
    fromId ?? '',
    toId ?? ''
  );

  const closeHandler = useCallback(() => {
    closeDrawerEditLink();
    methods.reset();
  }, [methods]);

  const editLinkHandler = useCallback(
    (data: ILinkForm) => {
      if (!data.fromId || !data.toId || !linkId) return;

      const adjustedData = getDeterminedLinkIds(data.connectionType, data);

      if (!data.eventId || !data.fromId || !data.toId) {
        addLinksError();
        return;
      }

      editLink({ id: linkId, updates: adjustedData });
      closeHandler();

      if (ghostNodes?.length && fromId && toId) {
        const ghostNodeId = getRelatedGhostNodeId(ghostNodes, fromId, toId);
        if (ghostNodeId) {
          removeGhostNode(ghostNodeId);
        }
      }
    },
    [closeHandler, fromId, ghostNodes, linkId, toId]
  );

  useEffect(() => {
    if (!linkData) return;

    const event = eventGraph?.links?.find(({ id }) => id === linkId)?.eventId;

    if (connectionType) {
      methods.setValue('connectionType', connectionType);
    }
    if (objectToConnect) {
      methods.setValue('objectToConnect', objectToConnect);
    }
    methods.setValue('fromId', serviceNode?.id ?? EMPTY_CHAR);
    methods.setValue('toId', topicNode?.id ?? EMPTY_CHAR);
    methods.setValue('eventId', event ?? EMPTY_CHAR);

    if (objectToConnect === EObjectToConnect.HTTP_NODE) {
      methods.setValue('toId', httpNode?.id ?? EMPTY_CHAR);
    }
  }, [connectionType, eventGraph?.links, linkData, linkId, methods, objectToConnect, serviceNode, topicNode, httpNode]);

  const events = eventGraph?.events || EMPTY_ARRAY;
  const serviceNodes = nodes?.filter(({ type }) => type === NodeDTOTypeEnum.Service);
  const topicNodes = nodes?.filter(({ type }) => type === NodeDTOTypeEnum.Topic);
  const httpNodes = nodes?.filter(({ type }) => type === NodeDTOTypeEnum.Http);

  const serviceOptions =
    serviceNodes?.filter(node => node.id).map(({ id, name }) => ({ label: name, value: id })) ?? [];
  const topicOptions = topicNodes?.filter(node => node.id).map(({ id, name }) => ({ label: name, value: id })) ?? [];
  const httpOptions = httpNodes?.filter(node => node.id).map(({ id, name }) => ({ label: name, value: id })) ?? [];
  const eventsOptions = events?.filter(event => event.id).map(({ id, name }) => ({ label: name, value: id })) ?? [];

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

  const handleRemoveLink = () => {
    if (linkId) {
      removeLink(linkId);
    }
    closeDrawerEditLink();
  };

  return {
    isOpen,
    linkData,
    methods,
    serviceOptions,
    topicOptions,
    httpOptions,
    eventsOptions,
    title: getTitle(),
    closeHandler,
    editLinkHandler,
    handleRemoveLink,
  };
};
