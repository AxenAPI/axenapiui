import { useUnit } from 'effector-react';
import { MouseEvent, useCallback } from 'react';

import {
  $drawerEditLink,
  openDrawerEditLink,
} from '@/components/commons/diagram/model/modals-models/drawer-edit-link/DrawerEditLinkModel';
import {
  $selectedItems,
  addMultipleSelection,
  toggleItemSelection,
} from '@/components/commons/diagram/model/SelectedItemsModel';
import { useSingleAndDoubleClick } from '@/hooks/useSingleAndDoubleClick';

/**
 * Хук для обработки взаимодействия с ребром графа.
 * Предоставляет состояние связи (выбрана или не выбрана) и обработчики кликов.
 */
export const useEdgeSelection = (id: string) => {
  const selectedItems = useUnit($selectedItems);
  const drawerEditLink = useUnit($drawerEditLink);

  const isEdgeSelected = drawerEditLink.linkId === id || selectedItems.includes(id);

  const handleEdgeDoubleClick = useCallback(() => {
    openDrawerEditLink(id);
  }, [id]);

  const handleEdgeSelect = useCallback(
    (event?: MouseEvent) => {
      if (event?.ctrlKey || event?.shiftKey) {
        addMultipleSelection(id);
      } else {
        toggleItemSelection(id);
      }
    },
    [id]
  );

  const onEdgeClick = useSingleAndDoubleClick(handleEdgeSelect, handleEdgeDoubleClick);

  return { isEdgeSelected, onEdgeClick };
};
