import { Button as UIKitButton, Drawer as UIKitDrawer, Input as UIKitInput, Label } from '@axenix/ui-kit';
import { FC } from 'react';

import { useNewBranchDrawer } from '../hooks/useNewBranchDrawer';

export const NewBranchDrawer: FC = () => {
  const { context, handleChange, handleClose, handleSubmit, isNewBranchDrawerOpen, newBranchName } =
    useNewBranchDrawer();

  return (
    <>
      {context}
      <UIKitDrawer
        width={500}
        isResizable
        isDestroyOnClose
        isOpen={isNewBranchDrawerOpen}
        onClose={handleClose}
        placement="right"
        title="New branch"
        customFooter={
          <div className="flex h-[100%] flex-row gap-2 py-2.5">
            <UIKitButton
              type="primary"
              onClick={handleSubmit}
              style={{ borderRadius: '3px' }}
              isDisabled={!newBranchName}
            >
              Create
            </UIKitButton>
            <UIKitButton type="default" onClick={handleClose} style={{ borderRadius: '3px' }}>
              Cancel
            </UIKitButton>
          </div>
        }
        classNames={{
          // @ts-expect-error 'body' is not in type
          body: 'scrollbar',
        }}
      >
        <div>
          <Label>Name</Label>
          <UIKitInput className="mt-[10px]" name="newBranchName" value={newBranchName} onChange={handleChange} />
        </div>
      </UIKitDrawer>
    </>
  );
};
