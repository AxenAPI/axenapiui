import {BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps} from '@xyflow/react';
import clsx from 'clsx';
import {useUnit} from 'effector-react';
import React, {type FC, useCallback} from 'react';

import {expandItemByTopicId} from '@/components/commons/diagram/model/ExpandableItemsModel';
import {getArrowAngle} from '@/helpers/diagram-helpers/edge-helpers';
import {useSingleAndDoubleClick} from '@/hooks/useSingleAndDoubleClick';
import {CircleDoubleArrow} from '@/shared/ui/icons';
import type {TExpandableItem} from '@/types/common';

import {$hiddenItems} from '../model/HiddenItemsModel';

export type IExpandableEdgeProps = Partial<EdgeProps & {data: TExpandableItem}>;

export const ExpandableEdge: FC<IExpandableEdgeProps> = ({
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

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const angle = getArrowAngle({targetY, sourceY, targetX, sourceX});

  // TODO не работает
  const hidden = hiddenItems.includes(data.eventId as string);

  const handleEdgeDoubleClick = useCallback(() => {
    expandItemByTopicId(data.topicId);
  }, [data.topicId]);

  const onEdgeClick = useSingleAndDoubleClick(() => {}, handleEdgeDoubleClick);

  return (
    <React.Fragment>
      <g onClick={onEdgeClick} data-testid="expandable-edge">
        <BaseEdge
          id={id}
          path={edgePath}
          className={clsx(hidden ? 'opacity-30' : 'opacity-70', 'stroke-expandable-edge')}
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
            <CircleDoubleArrow className={clsx('text-expandable-edge fill-diagram-bg hover:cursor-pointer')} />
          </div>
        </EdgeLabelRenderer>
      </g>
    </React.Fragment>
  );
};
