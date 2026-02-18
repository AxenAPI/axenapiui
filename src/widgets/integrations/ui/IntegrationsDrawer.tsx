import { Button as UIKitButton, Divider, Drawer as UIKitDrawer } from '@axenix/ui-kit';
import { FC } from 'react';

import { GitIntegrationForm } from '@features/repositoryManager/gitIntegration';
import { TrackerIntegrationForm } from '@features/repositoryManager/trackerIntegration';

import { useIntegrationsDrawer } from '../hooks/useIntegrationsDrawer';

export const IntegrationsDrawer: FC = () => {
  const { canSubmit, drawerTitle, handleClose, handleSubmit, isOpen, isSubmitting, submitButtonText } =
    useIntegrationsDrawer();

  return (
    <UIKitDrawer
      width={500}
      isResizable
      isDestroyOnClose
      isOpen={isOpen}
      onClose={handleClose}
      placement="right"
      title={drawerTitle}
      customFooter={
        <div className="flex h-[100%] flex-row gap-2 py-2.5">
          <UIKitButton
            type="primary"
            onClick={handleSubmit}
            style={{ borderRadius: '3px' }}
            isDisabled={!canSubmit}
            isLoading={isSubmitting}
          >
            {submitButtonText}
          </UIKitButton>
          <UIKitButton type="default" onClick={handleClose} style={{ borderRadius: '3px' }} isDisabled={isSubmitting}>
            Cancel
          </UIKitButton>
        </div>
      }
      classNames={{
        // @ts-expect-error 'body' is not in type
        body: 'scrollbar',
      }}
    >
      <div className="flex flex-col gap-6">
        <GitIntegrationForm />

        <Divider />

        <TrackerIntegrationForm />
      </div>
    </UIKitDrawer>
  );
};
