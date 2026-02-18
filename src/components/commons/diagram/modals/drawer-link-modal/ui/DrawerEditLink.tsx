import { Button, Drawer, Skeleton as UIKitSkeleton, Space } from '@axenix/ui-kit';
import { FC } from 'react';

import { IS_READ_ONLY } from '@/constants/common';

import { useDrawerEditLink } from '../hooks/useDrawerEditLink';

import { DrawerLinkItem } from './DrawerLinkItem';

export const DrawerEditLink: FC = () => {
  const {
    closeHandler,
    editLinkHandler,
    eventsOptions,
    handleRemoveLink,
    httpOptions,
    isOpen,
    linkData,
    methods,
    serviceOptions,
    title,
    topicOptions,
  } = useDrawerEditLink();

  if (!linkData) {
    return (
      <Drawer
        data-testid="drawer-edit-link-loading"
        title="Loading..."
        width={350}
        isOpen={isOpen}
        isDestroyOnClose
        onClose={closeHandler}
      >
        <UIKitSkeleton className="h-[100px] w-full" isActive />
      </Drawer>
    );
  }

  return (
    <Drawer
      data-testid="drawer-edit-link"
      title={title}
      width={350}
      customFooter={
        !IS_READ_ONLY && (
          <Space>
            <Button style={{ borderRadius: '3px' }} type="primary" onClick={methods.handleSubmit(editLinkHandler)}>
              Save
            </Button>

            <Button style={{ borderRadius: '3px' }} onClick={closeHandler}>
              Cancel
            </Button>

            <Button style={{ borderRadius: '3px' }} onClick={handleRemoveLink}>
              Delete
            </Button>
          </Space>
        )
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
