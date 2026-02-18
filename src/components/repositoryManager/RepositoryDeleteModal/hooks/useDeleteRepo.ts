import { useUnit } from 'effector-react';

import {
  $deleteModalData,
  $isDeleteModalOpen,
  closeDeleteModal,
  deleteGitRepositoryEvent,
} from '../model/deleteRepositoryModalModel';

export const useDeleteRepo = () => {
  const isOpen = useUnit($isDeleteModalOpen);
  const repository = useUnit($deleteModalData);

  const handleClose = () => {
    closeDeleteModal();
  };

  const handleDelete = () => {
    if (repository && repository.id) {
      deleteGitRepositoryEvent(repository.id);
    }

    closeDeleteModal();
  };

  return {
    repository,
    isOpen,
    handleDelete,
    handleClose,
  };
};
