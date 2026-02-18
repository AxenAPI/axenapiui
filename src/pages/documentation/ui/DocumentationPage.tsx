import { LinkedObjectDrawer } from '@features/documentation/LinkedObjectDrawer';
import { YandexView } from '@features/documentation/YandexView';

import { GlobalBlocker } from '@shared/components/GlobalBlocker';

import { DrawerCreateEvent } from '@/components/commons/diagram/modals/DrawerCreateEvent';

import { useDocumentationPageStart } from '../hooks/useDocumentationPageStart';

import { EditDoc } from './elements/EditDoc';
import { EmptyDoc } from './elements/EmptyDoc';

export function DocumentationPage() {
  const { isEmpty } = useDocumentationPageStart();

  if (isEmpty) {
    return <EmptyDoc />;
  }

  return (
    <>
      <GlobalBlocker />
      <EditDoc />
      <YandexView />
      <LinkedObjectDrawer />
      <DrawerCreateEvent />
    </>
  );
}
