import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';
import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { AlertCircle } from 'tabler-icons-react';

import type { TEdgeProps } from '@/constants/reactflow';
import { useEdgeSelection } from '@/hooks/useEdgeSelection';

import { $hiddenItems } from '../model/HiddenItemsModel';

export type IDisconnectedEdgeProps = TEdgeProps;

export function DisconnectedEdge({
  data,
  id,
  sourcePosition,
  sourceX,
  sourceY,
  targetPosition,
  targetX,
  targetY,
}: IDisconnectedEdgeProps) {
  const hiddenItems = useUnit($hiddenItems);
  const { isEdgeSelected, onEdgeClick } = useEdgeSelection(id);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const hidden = hiddenItems.includes(data.eventId as string);

  return (
    <>
      <g onClick={onEdgeClick} data-testid="disconnected-edge">
        <BaseEdge
          id={id}
          path={edgePath}
          className={clsx(hidden ? 'opacity-30' : 'opacity-70', 'stroke-color-error')}
          style={{
            strokeDasharray: isEdgeSelected ? '5,5' : 0,
          }}
        />
      </g>

      <g onClick={onEdgeClick}>
        <EdgeLabelRenderer>
          <div
            className={clsx(
              'nodrag nopan pointer-events-auto absolute origin-center',
              '-translate-x-1/2 -translate-y-1/2 transform'
            )}
            style={{
              top: labelY,
              left: labelX,
            }}
          >
            <AlertCircle className={clsx('text-color-error fill-diagram-bg hover:cursor-pointer')} />
          </div>
        </EdgeLabelRenderer>
      </g>
    </>
  );
}
