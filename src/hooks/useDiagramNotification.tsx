import {useNotification} from '@axenix/ui-kit';
import {useUnit} from 'effector-react';
import {useCallback, useEffect} from 'react';

import {
  addEvent,
  addLink,
  addLinks,
  addLinksError,
  addNode,
  clearEventGraph,
  fetchEventGraphDataFx,
  removeNode,
  removeNodes,
  removeNodeWithConnectedLinks,
} from '@/models/EventGraphModel';
import {NodeDTOTypeEnum} from '@/shared/api/event-graph-api';

export const NOTIFICATION_KEY = {
  fetchEventGraphStatus: 'fetchEventGraphStatus',
  addServiceStatus: 'addServiceStatus',
  addTopicStatus: 'addTopicStatus',
  addHttpStatus: 'addHttpStatus',
  deleteAllStatus: 'deleteAllStatus',
  addLinkStatus: 'addLinkStatus',
  addEventStatus: 'addEventStatus',
  deleteItemsStatus: 'deleteItemsStatus',
  addLinkErrorStatus: 'addLinkErrorStatus',
  addLinksStatus: 'addLinksStatus',
};

export const useDiagramNotification = () => {
  const [api, contextHandler] = useNotification();
  const isPending = useUnit(fetchEventGraphDataFx.pending);

  const notifySuccess = useCallback(
    (key: string, message: string) => api.success({key, message, placement: 'bottomRight', duration: 1.5}),
    [api]
  );

  const notifyError = useCallback(
    (key: string, message: string) => api.error({key, message, placement: 'bottomRight', duration: 1.5}),
    [api]
  );

  const notifyLoading = useCallback(
    (key: string, message: string) => api.open({key, message, placement: 'bottomRight', duration: 0}),
    [api]
  );

  useEffect(() => {
    if (isPending) {
      notifyLoading(NOTIFICATION_KEY.fetchEventGraphStatus, 'Import in progress');
    }
  }, [isPending, notifyLoading]);

  useEffect(() => {
    const handleAddNode = (payload: NodeDTOTypeEnum) => {
      switch (payload) {
        case NodeDTOTypeEnum.Service:
          notifySuccess(NOTIFICATION_KEY.addServiceStatus, 'Service has been added');
          break;
        case NodeDTOTypeEnum.Topic:
          notifySuccess(NOTIFICATION_KEY.addTopicStatus, 'Topic has been added');
          break;
        case NodeDTOTypeEnum.Http:
          notifySuccess(NOTIFICATION_KEY.addHttpStatus, 'Http has been added');
          break;
        default:
          break;
      }
    };

    const handleAddEvent = () => {
      notifySuccess(NOTIFICATION_KEY.addEventStatus, 'Event has been added');
    };

    const handleFetchSuccess = () => {
      api.destroy(NOTIFICATION_KEY.fetchEventGraphStatus);
      notifySuccess(NOTIFICATION_KEY.fetchEventGraphStatus, 'Import success');
    };

    const handleFetchFail = () => {
      api.destroy(NOTIFICATION_KEY.fetchEventGraphStatus);
      notifyError(NOTIFICATION_KEY.fetchEventGraphStatus, 'Import failed');
    };

    const handleDeleteAll = () => {
      notifySuccess(NOTIFICATION_KEY.deleteAllStatus, 'Deletion completed');
    };

    const handleDeleteItems = () => {
      notifySuccess(NOTIFICATION_KEY.deleteItemsStatus, 'Deletion completed');
    };

    const handleAddLink = () => {
      notifySuccess(NOTIFICATION_KEY.addLinkStatus, 'Link created');
    };

    const handleAddLinks = () => {
      notifySuccess(NOTIFICATION_KEY.addLinksStatus, 'Link created');
    };

    const handleAddLinksError = () => {
      notifyError(NOTIFICATION_KEY.addLinkErrorStatus, 'All fields must be filled in');
    };

    const unsubscribeAddNode = addNode.watch(handleAddNode);
    const unsubscribeAddEvent = addEvent.watch(handleAddEvent);
    const unsubscribeFetchSuccess = fetchEventGraphDataFx.done.watch(handleFetchSuccess);
    const unsubscribeFetchFail = fetchEventGraphDataFx.fail.watch(handleFetchFail);
    const unsubscribeDeleteAll = clearEventGraph.watch(handleDeleteAll);
    const unsubscribeAddLink = addLink.watch(handleAddLink);
    const unsubscribeAddLinks = addLinks.watch(handleAddLinks);
    const unsubscribeAddLinksError = addLinksError.watch(handleAddLinksError);
    const unsubscribeDeleteNode = removeNode.watch(handleDeleteItems);
    const unsubscribeDeleteNodes = removeNodes.watch(handleDeleteItems);
    const unsubscribeDeleteNodeWithConnectedLinks = removeNodeWithConnectedLinks.watch(handleDeleteItems);

    return () => {
      unsubscribeAddNode();
      unsubscribeFetchSuccess();
      unsubscribeFetchFail();
      unsubscribeDeleteAll();
      unsubscribeAddLink();
      unsubscribeAddEvent();
      unsubscribeDeleteNode();
      unsubscribeDeleteNodes();
      unsubscribeDeleteNodeWithConnectedLinks();
      unsubscribeAddLinksError();
      unsubscribeAddLinks();
    };
  }, [api, notifyError, notifySuccess]);

  return {api, contextHandler};
};
