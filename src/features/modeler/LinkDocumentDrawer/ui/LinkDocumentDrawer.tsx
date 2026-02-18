import { Button, Drawer as UIKitDrawer } from '@axenix/ui-kit';
import { FC } from 'react';

import { IndexDocumentTree } from '@entities/documentation/DocumentTree';

import { useLinkDocumentDrawer } from '../hooks/useLinkDocumentDrawer';

export interface LinkDocumentDrawerProps {
  onViewDocument?: (uuid: string) => void;
}

export const LinkDocumentDrawer: FC<LinkDocumentDrawerProps> = ({ onViewDocument }) => {
  const { handleClose, handleSave, hasChanges, isOpen, isSaving, treeItemOptions } = useLinkDocumentDrawer({
    onViewDocument,
  });

  return (
    <UIKitDrawer
      width={400}
      isResizable
      isDestroyOnClose
      isOpen={isOpen}
      onClose={handleClose}
      placement="right"
      title="Связать с документами"
      customFooter={
        <div className="flex gap-2">
          <Button type="primary" onClick={handleSave} isDisabled={!hasChanges || isSaving} isLoading={isSaving}>
            Сохранить
          </Button>
          <Button onClick={handleClose} isDisabled={isSaving}>
            Отмена
          </Button>
        </div>
      }
    >
      <IndexDocumentTree treeItemOptions={treeItemOptions} />
    </UIKitDrawer>
  );
};
