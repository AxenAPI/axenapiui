import {useUnit} from 'effector-react';
import {useCallback} from 'react';

import {
  $drawerEditLink,
  openDrawerEditLink,
} from '@/components/commons/diagram/model/modals-models/drawer-edit-link/DrawerEditLinkModel';
import {
  $selectedItems,
  addMultipleSelection,
  toggleItemSelection,
} from '@/components/commons/diagram/model/SelectedItemsModel';
import {useSingleAndDoubleClick} from '@/hooks/useSingleAndDoubleClick';
import {LinkDTO} from '@/shared/api/event-graph-api';

/**
 * Хук для обработки взаимодействия с ребром графа.
 * Предоставляет состояние связи (выбрана или не выбрана) и обработчики кликов.
 */
export const useEdgeSelection = (id: LinkDTO['id']) => {
  const selectedItems = useUnit($selectedItems);
  const drawerEditLink = useUnit($drawerEditLink);

  const isEdgeSelected = drawerEditLink.linkId === id || selectedItems.includes(id);

  const handleEdgeDoubleClick = useCallback(() => {
    openDrawerEditLink(id);
  }, [id]);

  const handleEdgeSelect = useCallback(
    (event: React.MouseEvent) => {
      if (event?.ctrlKey || event?.shiftKey) {
        addMultipleSelection(id);
      } else {
        toggleItemSelection(id);
      }
    },
    [id]
  );

  const onEdgeClick = useSingleAndDoubleClick(handleEdgeSelect, handleEdgeDoubleClick);

  return {isEdgeSelected, onEdgeClick};
};
