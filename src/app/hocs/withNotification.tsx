import { GlobalNotificationProvider } from '@axenix/ui-kit';
import { ComponentType, createElement } from 'react';

import { NotificationGateConnector } from './components/NotificationGateConnector';
import { createHoc } from './utilits/createHoc';

/**
 * HOC для подключения тостов и глобальной системы уведомлений.
 */
export const withNotification = createHoc(
  'Notification',
  <P extends object>(WrappedComponent: ComponentType<P>) =>
    (props: P) => (
      <GlobalNotificationProvider>
        <NotificationGateConnector>{createElement(WrappedComponent, props)}</NotificationGateConnector>
      </GlobalNotificationProvider>
    )
);
