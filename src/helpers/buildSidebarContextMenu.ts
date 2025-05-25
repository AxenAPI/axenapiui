import {MenuProps} from 'antd/es/menu';
import React from 'react';

import {hideItem, showItem} from '@/components/commons/diagram/model/HiddenItemsModel';
import {openDeleteSelectedItemsModal} from '@/components/commons/diagram/model/modals-models/delete-selected-items-modal/DeleteSelectedItemsModal';
import {openDrawerCreateEvent} from '@/components/commons/diagram/model/modals-models/drawer-create-event/DrawerCreateEventModel';
import {openDrawerEditTopic} from '@/components/commons/diagram/model/modals-models/drawer-edit-topic/DrawerEditTopicModel';
import {openEditHttpNodeModal} from '@/components/commons/diagram/model/modals-models/edit-http-node-modal/EditHttpNodeModalModel';
import {removeEvent} from '@/models/EventGraphModel';
import {MenuItem} from '@/types/common';

const isDisabledEditButton = (item: MenuItem): boolean => item.type !== 'TOPIC' && item.type !== 'EVENT' && item.type !== 'HTTP';

export const buildSidebarContextMenu = (item: MenuItem, hiddenItems: string[]) =>
  ({
    items: [
      {
        label: 'Delete',
        key: `del:${item.id}`,
        onClick: (e: {domEvent: React.MouseEvent}) => {
          e.domEvent.stopPropagation();
          const isEvent = item.type === 'EVENT';
          return isEvent ? removeEvent(item.id) : openDeleteSelectedItemsModal([item.id]);
        },
      },
      {
        label: hiddenItems.includes(item.id) ? 'Show' : 'Hide',
        key: `hide:${item.id}`,
        onClick: (e: {domEvent: React.MouseEvent}) => {
          e.domEvent.stopPropagation();
          return hiddenItems.includes(item.id) ? showItem(item.id) : hideItem(item.id);
        },
      },
      {
        label: 'Edit',
        key: `edit:${item.id}`,
        disabled: isDisabledEditButton(item),
        onClick: (e: {domEvent: React.MouseEvent}) => {
          e.domEvent.stopPropagation();
          if (item.type === 'EVENT') return openDrawerCreateEvent(item.id);
          if (item.type === 'TOPIC') return openDrawerEditTopic(item.id);
          if (item.type === 'HTTP') return openEditHttpNodeModal(item.id);
        },
      },
    ],
  }) as MenuProps;
