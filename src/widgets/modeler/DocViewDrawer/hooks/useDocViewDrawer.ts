import { useUnit } from 'effector-react';
import { useCallback } from 'react';

import { documentTreeModel } from '@entities/documentation/DocumentTree';

import { docViewDrawerModel } from '../model/docViewDrawer.model';

export const useDocViewDrawer = () => {
  const { closeDrawer, isOpen, selectedFile } = useUnit({
    isOpen: docViewDrawerModel.stores.$isOpen,
    selectedFile: documentTreeModel.stores.$selectedFile,
    closeDrawer: docViewDrawerModel.events.closeDrawer,
  });

  const handleClose = useCallback(() => {
    closeDrawer();
  }, [closeDrawer]);

  return {
    isOpen,
    selectedFile,
    handleClose,
  };
};
