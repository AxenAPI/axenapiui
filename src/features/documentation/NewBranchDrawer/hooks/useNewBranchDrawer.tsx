import { useNotification } from '@axenix/ui-kit';
import { useGate, useUnit } from 'effector-react';
import { ChangeEvent } from 'react';

import { newBranchDrawerModel } from '../model/newBranchDrawer.model';

export const useNewBranchDrawer = () => {
  const [api, context] = useNotification();

  useGate(newBranchDrawerModel.gate, api);

  const { closeNewBranchDrawer, isNewBranchDrawerOpen, newBranchName, setNewBranchName, submitNewBranchName } = useUnit(
    {
      isNewBranchDrawerOpen: newBranchDrawerModel.stores.$isNewBranchDrawerOpen,
      newBranchName: newBranchDrawerModel.stores.$newBranchName,
      submitNewBranchName: newBranchDrawerModel.events.submitNewBranchName,
      closeNewBranchDrawer: newBranchDrawerModel.events.closeNewBranchDrawer,
      setNewBranchName: newBranchDrawerModel.events.setNewBranchName,
    }
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewBranchName(e.target.value.replaceAll(' ', '-'));
  };

  const handleClose = () => {
    closeNewBranchDrawer();
  };

  const handleSubmit = () => {
    submitNewBranchName();
  };

  return { context, isNewBranchDrawerOpen, newBranchName, handleChange, handleClose, handleSubmit };
};
