import {Button} from '@axenix/ui-kit';

interface IDeleteSelectedItemsModalFooter {
  onClose: () => void;
  onDeleteNode: () => void;
  onDeleteNodeAndLinks: () => void;
  onDeleteLink: () => void;
  selectedItemsType: 'link' | 'node';
}

export const DeleteSelectedItemsModalFooter = ({
  onClose,
  onDeleteLink,
  onDeleteNode,
  onDeleteNodeAndLinks,
  selectedItemsType,
}: IDeleteSelectedItemsModalFooter) => {
  const isDeleteLinks = selectedItemsType === 'link';

  if (isDeleteLinks) {
    return (
      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button type="primary" onClick={onDeleteLink}>
          Delete
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onDeleteNodeAndLinks}>Delete object and relationships</Button>
      <Button type="primary" onClick={onDeleteNode}>
        Delete object
      </Button>
    </div>
  );
};
