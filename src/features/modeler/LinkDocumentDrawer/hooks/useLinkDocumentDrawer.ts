import { useUnit } from 'effector-react';
import { useCallback, useMemo } from 'react';

// TODO: убрать зависимость
import { SelectionMode, TreeItemOptions } from '@entities/documentation/DocumentTree/type';

import { linkDocumentDrawerModel } from '../model';

export interface UseLinkDocumentDrawerOptions {
  onViewDocument?: (uuid: string) => void;
}

export const useLinkDocumentDrawer = (options?: UseLinkDocumentDrawerOptions) => {
  const { closeDrawer, hasChanges, isOpen, isSaving, saveLinks, selectedIds, toggleSelection } = useUnit({
    isOpen: linkDocumentDrawerModel.stores.$isOpen,
    isSaving: linkDocumentDrawerModel.stores.$isSaving,
    hasChanges: linkDocumentDrawerModel.stores.$hasChanges,
    selectedIds: linkDocumentDrawerModel.stores.$selectedIds,
    closeDrawer: linkDocumentDrawerModel.events.closeDrawer,
    saveLinks: linkDocumentDrawerModel.events.saveLinks,
    toggleSelection: linkDocumentDrawerModel.events.toggleSelection,
  });

  const handleClose = useCallback(() => {
    closeDrawer();
  }, [closeDrawer]);

  const handleSave = useCallback(() => {
    saveLinks();
  }, [saveLinks]);

  const handleToggle = useCallback(
    (id: string) => {
      toggleSelection(id);
    },
    [toggleSelection]
  );

  // SelectionMode для передачи в IndexDocumentTree
  const selectionMode: SelectionMode = useMemo(
    () => ({
      enabled: true,
      selectedIds,
      onToggle: handleToggle,
    }),
    [selectedIds, handleToggle]
  );

  // TreeItemOptions: скрыть add/delete, показать selection, добавить просмотр по клику
  const treeItemOptions: TreeItemOptions = useMemo(
    () => ({
      actions: {
        add: false,
        delete: false,
      },
      selectionMode,
      onTitleClick: options?.onViewDocument ? pageInfo => options.onViewDocument!(pageInfo.id) : undefined,
    }),
    [selectionMode, options?.onViewDocument]
  );

  return {
    isOpen,
    isSaving,
    hasChanges,
    treeItemOptions,
    handleClose,
    handleSave,
  };
};
