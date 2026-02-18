import { BaseEdge, getBezierPath } from '@xyflow/react';
import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { useCallback } from 'react';

import { shrinkItemByTopicId } from '@/components/commons/diagram/model/ExpandableItemsModel';
import type { TEdgeProps } from '@/constants/reactflow';
import { useSingleAndDoubleClick } from '@/hooks/useSingleAndDoubleClick';

import { $hiddenItems } from '../model/HiddenItemsModel';

export type ISimpleEdgeProps = TEdgeProps;

export function SimpleEdge({
  data,
  id,
  sourcePosition,
  sourceX,
  sourceY,
  targetPosition,
  targetX,
  targetY,
}: ISimpleEdgeProps) {
  const hiddenItems = useUnit($hiddenItems);

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // TODO это не будет работать
  const hidden = hiddenItems.includes(data.eventId as string);

  const handleEdgeDoubleClick = useCallback(() => {
    shrinkItemByTopicId(data.topicId);
  }, [data.topicId]);

  const onEdgeClick = useSingleAndDoubleClick(() => {}, handleEdgeDoubleClick);

  return (
    <g onClick={onEdgeClick} data-testid="simple-edge">
      <BaseEdge
        id={id}
        path={edgePath}
        className={clsx(hidden ? 'opacity-30' : 'opacity-70', 'stroke-expandable-edge')}
      />
    </g>
  );
}
