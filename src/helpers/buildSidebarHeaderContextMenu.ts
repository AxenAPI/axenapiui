import {MenuProps} from 'antd/es/menu';
import React from 'react';

import {hideNodes, showNodes} from '@/components/commons/diagram/model/HiddenItemsModel';
import {openDeleteSelectedItemsModal} from '@/components/commons/diagram/model/modals-models/delete-selected-items-modal/DeleteSelectedItemsModal';
import {removeAllEvents} from '@/models/EventGraphModel';
import {MenuItem} from '@/types/common';

function isAllItemsHidden(items: MenuItem[], hiddenItems: string[]): boolean {
  const allItemsId = items.map(item => item.id);
  return allItemsId.every(id => hiddenItems.includes(id));
}

export const buildSidebarHeaderContextMenu = (items: MenuItem[], hiddenItems: string[], isEvent: boolean = false) =>
  ({
    items: [
      {
        label: 'Delete all',
        key: `delete:all`,
        onClick: (e: {domEvent: React.MouseEvent}) => {
          e.domEvent.stopPropagation();
          const allItemsId = items.map(item => item.id);
          return isEvent ? removeAllEvents(items) : openDeleteSelectedItemsModal(allItemsId);
        },
      },
      {
        label: isAllItemsHidden(items, hiddenItems) ? 'Show all' : 'Hide all',
        key: `hide:all`,
        onClick: (e: {domEvent: React.MouseEvent}) => {
          e.domEvent.stopPropagation();
          const allItemsId = items.map(item => item.id);
          return isAllItemsHidden(items, hiddenItems) ? showNodes(allItemsId) : hideNodes(allItemsId);
        },
      },
    ],
  }) as MenuProps;
