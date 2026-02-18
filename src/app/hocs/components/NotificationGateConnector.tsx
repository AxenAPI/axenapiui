import { useNotification } from '@axenix/ui-kit';
import { useGate } from 'effector-react';
import { memo, PropsWithChildren } from 'react';

import { notificationModel } from '@shared/notification/notification.model';

/**
 * Подключает gate уведомлений и отображает contextHolder.
 */
export const NotificationGateConnector = memo(({ children }: PropsWithChildren) => {
  const [api, contextHolder] = useNotification();
  useGate(notificationModel.gate, api);

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
});
