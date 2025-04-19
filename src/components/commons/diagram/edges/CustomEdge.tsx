import {IconCircleArrowRight} from '@tabler/icons-react';
import {BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps} from '@xyflow/react';
import clsx from 'clsx';
import {useUnit} from 'effector-react';
import React, {type FC} from 'react';

import {getArrowAngle} from '@/helpers/diagram-helpers/edge-helpers';
import {useEdgeSelection} from '@/hooks/useEdgeSelection';

import {$hiddenItems} from '../model/HiddenItemsModel';

export type ICustomEdgeProps = Partial<EdgeProps>;

export const CustomEdge: FC<ICustomEdgeProps> = ({
  data,
  id,
  sourcePosition,
  sourceX,
  sourceY,
  targetPosition,
  targetX,
  targetY,
}) => {
  const hiddenItems = useUnit($hiddenItems);
  const {isEdgeSelected, onEdgeClick} = useEdgeSelection(id);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const angle = getArrowAngle({targetY, sourceY, targetX, sourceX});

  const hidden = hiddenItems.includes(data.eventId as string);

  return (
    <React.Fragment>
      <g onClick={onEdgeClick} data-testid="customEdge">
        <BaseEdge
          id={id}
          path={edgePath}
          className={clsx(hidden ? 'opacity-30' : 'opacity-70')}
          style={{
            stroke: `${data.color}`,
            strokeDasharray: isEdgeSelected ? '5,5' : 0,
          }}
        />
      </g>

      <g onClick={onEdgeClick}>
        <EdgeLabelRenderer>
          <div
            className={clsx(
              'nodrag nopan pointer-events-auto absolute origin-center',
              '-translate-x-1/2 -translate-y-1/2 transform',
              hidden && 'opacity-30'
            )}
            style={{
              transform: `rotate(${angle}deg)`,
              top: labelY,
              left: labelX,
            }}
          >
            <IconCircleArrowRight
              className={clsx('fill-diagram-bg hover:cursor-pointer')}
              style={{color: `${data.color}`}}
            />
          </div>
        </EdgeLabelRenderer>
      </g>
    </React.Fragment>
  );
};
