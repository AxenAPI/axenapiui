import { Icon } from '@axenix/ui-kit';
import { FC } from 'react';

import { IconMap } from '@/helpers/nodes-value-map';

import { EventTitleProps } from '../types/types';

/** Заголовок события с иконкой и именем */
export const EventTitle: FC<EventTitleProps> = ({ element }) => (
  <div className="flex flex-row items-center gap-1">
    <Icon icon={IconMap.EVENTS} size={18} />
    <span className="overflow-hidden text-ellipsis whitespace-nowrap">{element.name}</span>
  </div>
);
