import { Icon } from '@axenix/ui-kit';
import { FC } from 'react';

import { Modifiers, NodeTitleProps } from '../types/types';

import { NodeIcon } from './NodeIcon';

/** Заголовок нода с иконкой и именем */
export const NodeTitle: FC<NodeTitleProps> = ({ element, size = 'default' }) => (
  <div className={`${Modifiers.Size[size].heading} flex flex-row items-center gap-1`}>
    <Icon icon={NodeIcon(element)} size={Modifiers.Size[size].iconSize} />
    <span className="overflow-hidden text-ellipsis whitespace-nowrap">{element.name}</span>
  </div>
);
