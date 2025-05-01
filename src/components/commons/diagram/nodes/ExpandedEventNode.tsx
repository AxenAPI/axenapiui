import {Position, Handle, type NodeProps} from '@xyflow/react';
import clsx from 'clsx';

import {getNodeIcon} from '@/helpers/node-helpers';
import {TExpandedEventNode} from '@/types/common';

export type IExpandedEventNodeProps = Partial<NodeProps<TExpandedEventNode>>;

export const ExpandedEventNode = ({data}: IExpandedEventNodeProps) => {
  const wrapperClassName = clsx(
    'flex transition-all w-[11.688rem] items-center gap-2 border-2',
    'border-solid px-4 py-3 align-middle',
    'rounded-sm border-colorful-blue-border bg-white'
  );

  return (
    <div data-testid="event-node" className={wrapperClassName}>
      {getNodeIcon(data.brokerType)}
      <div
        data-testid="event-node-text"
        className="w-full max-w-[7.688rem] overflow-hidden text-ellipsis whitespace-nowrap"
      >
        {data.name}
      </div>
      <Handle data-testid="event-node-source" type="source" position={Position.Left} />
      <Handle data-testid="event-node-target" type="target" position={Position.Left} />
    </div>
  );
};
