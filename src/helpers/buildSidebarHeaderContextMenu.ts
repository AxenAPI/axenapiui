import { MenuProps } from 'antd/es/menu';
import { MouseEvent } from 'react';

import { hideNodes, showNodes } from '@/components/commons/diagram/model/HiddenItemsModel';
import { openDeleteSelectedItemsModal } from '@/components/commons/diagram/model/modals-models/delete-selected-items-modal/DeleteSelectedItemsModal';
import { IS_READ_ONLY } from '@/constants/common';
import { removeAllEvents } from '@/models/EventGraphModel';
import { MenuItem } from '@/types/common';

function isAllItemsHidden(items: MenuItem[], hiddenItems: string[]): boolean {
  const allItemsId = items.map(item => item.id).filter(Boolean) as string[];
  return allItemsId.every(id => hiddenItems.includes(id));
}

export const buildSidebarHeaderContextMenu = (items: MenuItem[], hiddenItems: string[], isEvent: boolean = false) =>
  ({
    items: [
      {
        label: 'Delete all',
        key: `delete:all`,
        onClick: (e: { domEvent: MouseEvent }) => {
          e.domEvent.stopPropagation();
          if (IS_READ_ONLY) return;
          const allItemsId = items.map(item => item.id).filter(Boolean) as string[];
          return isEvent ? removeAllEvents(items) : openDeleteSelectedItemsModal(allItemsId);
        },
      },
      {
        label: isAllItemsHidden(items, hiddenItems) ? 'Show all' : 'Hide all',
        key: `hide:all`,
        onClick: (e: { domEvent: MouseEvent }) => {
          e.domEvent.stopPropagation();
          const allItemsId = items.map(item => item.id).filter(Boolean) as string[];
          return isAllItemsHidden(items, hiddenItems) ? showNodes(allItemsId) : hideNodes(allItemsId);
        },
      },
    ],
  }) as MenuProps;
