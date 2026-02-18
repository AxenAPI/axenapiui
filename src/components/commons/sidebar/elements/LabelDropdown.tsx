import { Badge, Dropdown } from '@axenix/ui-kit';
import isEmpty from 'lodash/isEmpty';
import { cloneElement, JSX, MouseEvent } from 'react';

import { ExpandIcon } from '@shared/components/ExpandIcon';

import { buildSidebarHeaderContextMenu } from '@/helpers/buildSidebarHeaderContextMenu';
import { MenuItem } from '@/types/common';

import styles from './buildSidebar.module.scss';
import { SortOrderLabel } from './SortOrderLabel';

interface IProps {
  title: string;
  menuItem: MenuItem[];
  hiddenItems: string[];
  isOpen: boolean;
  icon: JSX.Element;
  asc: boolean;
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
  hasMenu?: boolean;
  badge?: JSX.Element;
}

export function LabelDropdown({
  asc,
  badge,
  hasMenu = true,
  hiddenItems,
  icon,
  isOpen,
  menuItem,
  onClick,
  title,
}: IProps) {
  return (
    <Dropdown
      trigger={['contextMenu']}
      menu={hasMenu && !isEmpty(menuItem) ? buildSidebarHeaderContextMenu(menuItem, hiddenItems) : undefined}
    >
      <div className={styles.label}>
        <div className={styles.title}>
          <ExpandIcon isOpen={isOpen} />
          {cloneElement(icon, { width: 17, height: 17 })}
          {title}
          {hasMenu ? <Badge type="default" count={menuItem.length} /> : badge}
        </div>
        <div onClick={onClick} aria-label="Toggle sort order">
          {SortOrderLabel(asc)}
        </div>
      </div>
    </Dropdown>
  );
}
