import { useUnit } from 'effector-react';

import { integrationsModel } from '../model/integrationsModel';

export const useIntegrationsDrawer = () => {
  const [isOpen, isEditing, isSubmitting, canSubmit] = useUnit([
    integrationsModel.stores.$isOpen,
    integrationsModel.stores.$isEditing,
    integrationsModel.stores.$isSubmitting,
    integrationsModel.stores.$canSubmit,
  ]);

  const [closeDrawer, submitIntegrations] = useUnit([
    integrationsModel.events.closeDrawer,
    integrationsModel.events.submitIntegrations,
  ]);

  const handleClose = () => {
    closeDrawer();
  };

  const handleSubmit = () => {
    submitIntegrations();
  };

  const drawerTitle = isEditing ? 'Edit Repository' : 'New Repository';
  const submitButtonText = isEditing ? 'Save' : 'Create';

  return {
    isOpen,
    isEditing,
    isSubmitting,
    canSubmit,
    drawerTitle,
    submitButtonText,
    handleClose,
    handleSubmit,
  };
};
