import { Modal as UIKitModal } from '@axenix/ui-kit';
import clsx from 'clsx';
import { X } from 'tabler-icons-react';

import { useDeleteRepo } from '../hooks/useDeleteRepo';

export const DeleteRepositoryModal = () => {
  const { handleClose, handleDelete, isOpen, repository } = useDeleteRepo();
  return (
    <UIKitModal
      className={clsx('w-[520px]')}
      closeIcon={<X size={22} />}
      isOpen={isOpen}
      closable
      title="Delete confirmation"
      cancelText="Cancel"
      okText="Delete"
      onCancel={handleClose}
      onOk={handleDelete}
      centered
    >
      {repository && (
        <div>
          <p>Deleting is an irreversible action. The entry will be lost.</p>
        </div>
      )}
    </UIKitModal>
  );
};
