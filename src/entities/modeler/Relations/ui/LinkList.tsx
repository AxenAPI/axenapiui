import { Collapse } from '@axenix/ui-kit';
import { FC } from 'react';

import { LinkGroup } from '../types/types';

import { EventCard } from './EventCard';
import { NodeTitle } from './NodeTitle';

/** Представление списка связей нода */
export const GraphElementRelationsList: FC<{ items: LinkGroup[] }> = ({ items }) => (
  <Collapse
    items={(items ?? []).map(item => ({
      children: item.events.map(e => EventCard(e)),
      key: item.node.id,
      label: <NodeTitle element={item.node} size="small" />,
    }))}
    onChange={() => {}}
    size="small"
  />
);
