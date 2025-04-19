import {Modal as UIKitModal} from '@axenix/ui-kit';
import clsx from 'clsx';
import {useUnit} from 'effector-react';
import {X} from 'tabler-icons-react';

import {DeleteSelectedItemsModalFooter} from '@/components/commons/diagram/modals/delete-items-modal/DeleteSelectedItemsFooter';
import {
  $deleteSelectedItemsModal,
  closeDeleteSelectedItemsModal,
} from '@/components/commons/diagram/model/modals-models/delete-selected-items-modal/DeleteSelectedItemsModal';
import {$eventGraph, removeLinks, removeNodes, removeNodeWithConnectedLinks} from '@/models/EventGraphModel';

export const DeleteSelectedItemsModal = () => {
  const eventGraph = useUnit($eventGraph);
  const {isOpen, selectedItemIds} = useUnit($deleteSelectedItemsModal);
  const isOnlyLinksSelected = selectedItemIds?.every(selectedId =>
    eventGraph?.links?.some(link => link.id === selectedId)
  );

  const renderModalContentText = () => {
    if (isOnlyLinksSelected) {
      return 'Deleting is an irreversible action. The link will be lost.';
    }
    return 'Deleting objects is an irreversible action. All relationships with these objects will be lost.';
  };

  const handleClose = () => {
    closeDeleteSelectedItemsModal();
  };

  const handleDeleteNode = () => {
    removeNodes(selectedItemIds);
    closeDeleteSelectedItemsModal();
  };

  const handleDeleteNodeAndLinks = () => {
    selectedItemIds.forEach((itemId: string) => {
      removeNodeWithConnectedLinks(itemId);
    });
    closeDeleteSelectedItemsModal();
  };

  const handleDeleteLink = () => {
    removeLinks(selectedItemIds);
    closeDeleteSelectedItemsModal();
  };

  return (
    <UIKitModal
      className={clsx('w-[520px]')}
      closeIcon={<X size={22} />}
      isOpen={isOpen}
      closable
      title="Delete confirmation"
      centered
      footer={
        <DeleteSelectedItemsModalFooter
          onClose={handleClose}
          onDeleteNode={handleDeleteNode}
          onDeleteNodeAndLinks={handleDeleteNodeAndLinks}
          onDeleteLink={handleDeleteLink}
          selectedItemsType={isOnlyLinksSelected ? 'link' : 'node'}
        />
      }
      onOk={handleClose}
      onCancel={handleClose}
    >
      {renderModalContentText()}
    </UIKitModal>
  );
};
