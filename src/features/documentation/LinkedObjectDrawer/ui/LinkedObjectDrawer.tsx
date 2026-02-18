import { Accordion, Drawer as UIKitDrawer } from '@axenix/ui-kit';
import { FC } from 'react';

import { useLinkedObjectDrawer } from '../hooks/useLinkedObjectDrawer';

export const LinkedObjectDrawer: FC = () => {
  const { consumingNodesOptions, drawerName, handleClose, isLinkedObjectDrawerOpen, producingNodesOptions } =
    useLinkedObjectDrawer();

  return (
    <UIKitDrawer
      width={500}
      isResizable
      isDestroyOnClose
      isOpen={isLinkedObjectDrawerOpen}
      onClose={handleClose}
      placement="right"
      title={drawerName}
    >
      <div className="h-full bg-gray-50 p-4">
        <h2 className="mb-4">Consuming</h2>
        <Accordion items={consumingNodesOptions} />

        <h2 className="mt-4 mb-4">Producing</h2>
        <Accordion items={producingNodesOptions} />
      </div>
    </UIKitDrawer>
  );
};
