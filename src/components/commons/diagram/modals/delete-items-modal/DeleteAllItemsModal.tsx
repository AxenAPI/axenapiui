import {Modal as UIKitModal} from '@axenix/ui-kit';
import clsx from 'clsx';
import {useUnit} from 'effector-react';
import {X} from 'tabler-icons-react';

import {
  $deleteItemsModal,
  closeDeleteItemsModal,
} from '@/components/commons/diagram/model/modals-models/delete-items-modal/DeleteItemsModalModel';
import {clearEventGraph} from '@/models/EventGraphModel';

export const DeleteAllItemsModal = () => {
  const deleteItemsModal = useUnit($deleteItemsModal);

  const {isOpen} = deleteItemsModal;

  const handleClose = () => {
    closeDeleteItemsModal();
  };

  const handleOk = () => {
    closeDeleteItemsModal();
    clearEventGraph();
  };

  return (
    <UIKitModal
      className={clsx('w-[520px]')}
      closeIcon={<X size={22} />}
      isOpen={isOpen}
      closable
      title="Delete confirmation"
      cancelText="Cancel"
      okText="Delete all"
      onCancel={handleClose}
      onOk={handleOk}
      centered
    >
      Deleting is an irreversible action. All objects and relationships will be lost.
    </UIKitModal>
  );
};
