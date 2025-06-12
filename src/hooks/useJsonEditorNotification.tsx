import {useNotification} from '@axenix/ui-kit';
import {useCallback, useEffect} from 'react';

import {editEvent} from '@/models/EventGraphModel';

export const JSON_EDITOR_NOTIFICATION_KEY = {
  changeEvent: 'changeEvent',
};

export const useJsonEditorNotification = () => {
  const [api, contextHandler] = useNotification();

  const notifySuccess = useCallback(
    (key: string, message: string) => api.success({key, message, placement: 'bottomRight', duration: 1.5}),
    [api]
  );

  const notifyError = useCallback(
    (key: string, message: string) => api.error({key, message, placement: 'bottomRight', duration: 1.5}),
    [api]
  );

  useEffect(() => {
    const handleChangeEvent = () => {
      notifySuccess(JSON_EDITOR_NOTIFICATION_KEY.changeEvent, 'Changes have been saved');
    };

    const unsubscribeChangeEvent = editEvent.watch(handleChangeEvent);

    return () => {
      unsubscribeChangeEvent();
    };
  }, [api, notifyError, notifySuccess]);

  return {api, contextHandler};
};
