import {BaseEdge, getBezierPath, type EdgeProps} from '@xyflow/react';
import clsx from 'clsx';
import {useUnit} from 'effector-react';
import {type FC, useCallback} from 'react';

import {shrinkItemByTopicId} from '@/components/commons/diagram/model/ExpandableItemsModel';
import {useSingleAndDoubleClick} from '@/hooks/useSingleAndDoubleClick';
import type {TExpandableItem} from '@/types/common';

import {$hiddenItems} from '../model/HiddenItemsModel';

export type IExpandableEdgeProps = Partial<EdgeProps & {data: TExpandableItem}>;

export const SimpleEdge: FC<IExpandableEdgeProps> = ({
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
};
