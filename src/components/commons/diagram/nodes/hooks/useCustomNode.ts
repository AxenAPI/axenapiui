import { type NodeProps, Position } from '@xyflow/react';
import { useUnit } from 'effector-react';
import { KeyboardEvent, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';

import { $selectedElementId, nodeDetailsModalOpened } from '@pages/modeler-page/model/nodeInfoModal';

import {
  $selectedItems,
  addMultipleSelection,
  toggleItemSelection,
} from '@/components/commons/diagram/model/SelectedItemsModel';
import { getCustomNodeClassName, getInputClassName, getNodeIcon } from '@/helpers/node-helpers';
import { useNodePopover } from '@/hooks/useNodePopover';
import { useSingleAndDoubleClick } from '@/hooks/useSingleAndDoubleClick';
import { editNode } from '@/models/EventGraphModel';
import { TCustomNode } from '@/types/common';

import { $renamingNodeId, setRenamingNodeId } from '../../model/DiagramModel';
import { $hiddenItems } from '../../model/HiddenItemsModel';
import { openPopoverMenu } from '../../model/modals-models/popover/PopoverMenuModel';

export const useCustomNode = ({ data, id }: NodeProps<TCustomNode>) => {
  const { hiddenItems, renamingNodeId, selectedElementId, selectedItems } = useUnit({
    hiddenItems: $hiddenItems,
    renamingNodeId: $renamingNodeId,
    selectedItems: $selectedItems,
    selectedElementId: $selectedElementId,
  });

  const { popoverItems } = useNodePopover(id, data);

  const inputElementRef = useRef<HTMLInputElement>(null);

  const [isOverflowed, setIsOverflow] = useState(false);
  const [name, setName] = useState(data.name);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const isService = data.nodeType === 'SERVICE';
  const isNodeSelected = selectedElementId === id || selectedItems.includes(id);
  const handlePosition = isService ? Position.Right : Position.Left;
  const customNodeClassName = getCustomNodeClassName(id, data, isNodeSelected, hiddenItems);
  const isReadOnly = renamingNodeId !== id;
  const icon = getNodeIcon(data.brokerType || data.nodeType);
  const inputClassName = getInputClassName(isReadOnly);

  useEffect(() => {
    setName(data.name);
  }, [data.name]);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (inputElementRef.current) {
        setIsOverflow(inputElementRef.current.scrollWidth > inputElementRef.current.clientWidth);
      }
    });
  }, [data.name, name]);

  const handleOpenModal = useCallback(() => {
    toggleItemSelection(id);
    if (id) {
      nodeDetailsModalOpened(id);
    }
  }, [id]);

  const handleNodeSelect = useCallback(
    (event?: MouseEvent) => {
      if (event?.ctrlKey || event?.shiftKey) {
        addMultipleSelection(id);
      } else {
        toggleItemSelection(id);
      }
    },
    [id]
  );

  // одиночный клик выбирает объект, shift/ctrl+клик выбирает несколько объектов
  // двойной по любой области объекта открывает инфо панель
  const onNodeClick = useSingleAndDoubleClick(handleNodeSelect, handleOpenModal);

  const editNodeName = () => {
    if (name !== data.name) {
      editNode({ id, updates: { name } });
    }
  };

  const handleBlur = () => {
    setRenamingNodeId(null);
    editNodeName();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      setRenamingNodeId(null);
      editNodeName();
    }
  };

  const handleContextMenuClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      setOpenPopoverId(id);
      openPopoverMenu(id);
    },
    [id]
  );

  return {
    name,
    setName,
    icon,
    popoverItems,
    openPopoverId,
    isOverflowed,
    isReadOnly,
    inputElementRef,
    handlePosition,
    customNodeClassName,
    inputClassName,
    onNodeClick,
    handleBlur,
    handleKeyDown,
    handleContextMenuClick,
  };
};
