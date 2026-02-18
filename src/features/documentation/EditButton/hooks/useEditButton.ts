import { useUnit } from 'effector-react';

import { editButtonModel } from '../model/editButton.model';

export const useEditButton = () => {
  const { disableEditing, enableEditing, isEditing } = useUnit({
    enableEditing: editButtonModel.events.editModeEnabled,
    disableEditing: editButtonModel.events.editModeDisabled,
    isEditing: editButtonModel.stores.$isEditing,
  });

  const handleToggleEditMode = () => {
    if (isEditing) {
      disableEditing();
    } else {
      enableEditing();
    }
  };

  return { handleToggleEditMode, isEditing };
};
