import { Input, Tooltip } from '@axenix/ui-kit';
import { Handle, type NodeProps } from '@xyflow/react';

import { TCustomNode } from '@/types/common';

import { PopoverMenu } from '../../../popovers/PopoverMenu';
import { useCustomNode } from '../hooks/useCustomNode';

export type ICustomNodeProps = NodeProps<TCustomNode>;

export const CustomNode = (props: ICustomNodeProps) => {
  const { data, id } = props;

  const {
    customNodeClassName,
    handleBlur,
    handleContextMenuClick,
    handleKeyDown,
    handlePosition,
    icon,
    inputClassName,
    inputElementRef,
    isOverflowed,
    isReadOnly,
    name,
    onNodeClick,
    openPopoverId,
    popoverItems,
    setName,
  } = useCustomNode(props);

  if (!data || !id) {
    return null;
  }

  return (
    <Tooltip title={data.name} isDisabled={!isOverflowed} getPopupContainer={triggerNode => triggerNode}>
      <div onContextMenu={handleContextMenuClick}>
        <PopoverMenu items={popoverItems} popoverId={openPopoverId || ''}>
          <div
            data-testid={`${data.nodeType.toLocaleLowerCase()}Node`}
            className={customNodeClassName}
            onClick={onNodeClick}
          >
            {icon}
            <Input
              data-testid={`${data.nodeType.toLocaleLowerCase()}NodeName`}
              isReadOnly={isReadOnly}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ref={inputElementRef as any}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              variant={isReadOnly ? 'borderless' : 'filled'}
              className={inputClassName}
              unselectable={isReadOnly ? 'on' : 'off'}
            />
            <Handle data-testid="nodeSource" type="source" position={handlePosition} />
            <Handle data-testid="nodeTarget" type="target" position={handlePosition} />
          </div>
        </PopoverMenu>
      </div>
    </Tooltip>
  );
};
