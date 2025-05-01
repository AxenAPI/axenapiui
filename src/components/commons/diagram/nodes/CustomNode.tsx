import {Input, Tooltip} from '@axenix/ui-kit';
import {Position, Handle, type NodeProps} from '@xyflow/react';
import {useUnit} from 'effector-react';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {
  $infoPanelModal,
  openInfoPanelModal,
} from '@/components/commons/diagram/model/modals-models/info-panel-modal/InfoPanelModalModel';
import {
  $selectedItems,
  addMultipleSelection,
  toggleItemSelection,
} from '@/components/commons/diagram/model/SelectedItemsModel';
import {getCustomNodeClassName, getInputClassName, getNodeIcon} from '@/helpers/node-helpers';
import {useNodePopover} from '@/hooks/useNodePopover';
import {useSingleAndDoubleClick} from '@/hooks/useSingleAndDoubleClick';
import {editNode} from '@/models/EventGraphModel';
import {TCustomNode} from '@/types/common';

import {PopoverMenu} from '../../popovers/PopoverMenu';
import {$hiddenItems} from '../model/HiddenItemsModel';
import {openPopoverMenu} from '../model/modals-models/popover/PopoverMenuModel';

export type ICustomNodeProps = Partial<NodeProps<TCustomNode>>;

export const CustomNode = ({data, id}: ICustomNodeProps) => {
  const isService = data.nodeType === 'SERVICE';

  const hiddenItems = useUnit($hiddenItems);
  const selectedItems = useUnit($selectedItems);
  const infoPanelModal = useUnit($infoPanelModal);
  const {popoverItems} = useNodePopover(id, data);

  const isNodeSelected = infoPanelModal.itemId === id || selectedItems.includes(id);
  const handlePosition = isService ? Position.Right : Position.Left;

  const inputElementRef = useRef(null);

  const customNodeClassName = getCustomNodeClassName(id, data, isNodeSelected, hiddenItems);

  const [isOverflowed, setIsOverflow] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [name, setName] = useState(data.name);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsOverflow(inputElementRef.current?.scrollWidth > inputElementRef.current?.clientWidth);
    });
  }, [data.name, name]);

  useEffect(() => {
    setName(data.name);
  }, [data.name]);

  const handleNameDoubleClick = useCallback(() => {
    setIsReadOnly(false);
  }, []);

  const handleOpenModal = useCallback(() => {
    toggleItemSelection(id);
    openInfoPanelModal(id);
  }, [id]);

  const handleNodeSelect = useCallback(
    (event: React.MouseEvent) => {
      if (event?.ctrlKey || event?.shiftKey) {
        addMultipleSelection(id);
      } else {
        toggleItemSelection(id);
      }
    },
    [id]
  );

  // одиночный клик выбирает объект, shift/ctrl+клик выбирает несколько объектов
  // двойной по названию редактирует название,
  // двойной по любой другой области объекта открывает инфо панель
  const onNodeClick = useSingleAndDoubleClick(handleNodeSelect, handleOpenModal);
  const onNameClick = useSingleAndDoubleClick(handleNodeSelect, handleNameDoubleClick);

  const editNodeName = () => {
    if (name !== data.name) {
      editNode({id, updates: {name}});
    }
  };

  const handleBlur = () => {
    setIsReadOnly(true);
    editNodeName();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setIsReadOnly(true);
      editNodeName();
    }
  };

  const handleContextMenuClick = useCallback(() => {
    setOpenPopoverId(id);
    openPopoverMenu(id);
  }, [id]);

  return (
    <Tooltip title={data.name} isDisabled={!isOverflowed} getPopupContainer={triggerNode => triggerNode}>
      <div
        onContextMenu={e => {
          e.preventDefault();
          handleContextMenuClick();
        }}
      >
        <PopoverMenu items={popoverItems} popoverId={openPopoverId}>
          <div
            data-testid={`${data.nodeType.toLocaleLowerCase()}Node`}
            className={customNodeClassName}
            onClick={onNodeClick}
          >
            {getNodeIcon(data.brokerType || data.nodeType)}
            <Input
              data-testid={`${data.nodeType.toLocaleLowerCase()}NodeName`}
              isReadOnly={isReadOnly}
              ref={inputElementRef}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                onNameClick(e);
              }}
              variant="borderless"
              className={getInputClassName(isReadOnly)}
            />
            <Handle data-testid="nodeSource" type="source" position={handlePosition} />
            <Handle data-testid="nodeTarget" type="target" position={handlePosition} />
          </div>
        </PopoverMenu>
      </div>
    </Tooltip>
  );
};
