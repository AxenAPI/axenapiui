import { Modal as UIKitModal } from '@axenix/ui-kit';
import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { X } from 'tabler-icons-react';

import { deleteTreeNodeModalModel } from '../../model/DeleteTreeNodeModal.model';
import { documentTreeModel } from '../../model/documentTree.model';

export const DeleteTreeNodeModal = () => {
  const modal = useUnit(deleteTreeNodeModalModel.stores.$deleteTreeNodeModal);

  const { child, isOpen, parentId } = modal;

  const handleClose = () => {
    deleteTreeNodeModalModel.events.closeDeleteTreeNodeModal();
  };

  const handleOk = () => {
    if (!child) return handleClose();
    documentTreeModel.api.removeNodeFx({ child, parentId });
    handleClose();
  };

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
      onOk={handleOk}
      centered
    >
      Deleting is an irreversible action. All objects and links will be lost.
    </UIKitModal>
  );
};
