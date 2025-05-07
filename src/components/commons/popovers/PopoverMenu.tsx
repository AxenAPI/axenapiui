import {Menu, Popover} from '@axenix/ui-kit';
import {ItemType} from 'antd/lib/menu/interface';
import {useUnit} from 'effector-react';
import {FC, ReactNode} from 'react';

import {$eventGraph} from '@/models/EventGraphModel';

import {$popoverMenu, closePopoverMenu} from '../diagram/model/modals-models/popover/PopoverMenuModel';

interface IPopoverMenuProps {
  items: ItemType[];
  children: ReactNode;
  popoverId: string;
}

export const PopoverMenu: FC<IPopoverMenuProps> = ({children, items, popoverId}) => {
  const eventGraph = useUnit($eventGraph);
  const popoverMenu = useUnit($popoverMenu);

  const {isOpen, itemId} = popoverMenu;

  const nodes = eventGraph?.nodes || [];
  const currentNode = itemId ? nodes?.find(item => item && item.id === itemId) : null;

  const handleClose = () => {
    closePopoverMenu();
  };

  const openPopover = popoverId === currentNode?.id;

  return (
    <Popover
      // TODO: найти способ поменять padding контейнера контента
      maxWidth={168}
      minWidth={168}
      content={<Menu items={items} style={{maxWidth: '160px', borderRight: 'none'}} />}
      onOpenChange={open => {
        if (!open) {
          handleClose();
        }
      }}
      placement="bottomRight"
      trigger="contextMenu"
      isOpen={openPopover && isOpen}
      handleClose={handleClose}
    >
      {children}
    </Popover>
  );
};
