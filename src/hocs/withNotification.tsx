import {GlobalNotificationProvider} from '@axenix/ui-kit';
import {FC} from 'react';

/**
 * Хок подключения тостов.
 */
export const withNotification = <P,>(WrappedComponent: FC<P>) => (props: P) => (
  <GlobalNotificationProvider>
    {/** @ts-ignore */}
    <WrappedComponent {...props} />
  </GlobalNotificationProvider>
);
