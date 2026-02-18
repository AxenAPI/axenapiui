import { Drawer } from '@axenix/ui-kit';

import { Breadcrumbs } from '@shared/ui/Breadcrumbs/ui/Breadcrumbs';

import { useDocViewDrawer } from '../hooks/useDocViewDrawer';

import { DocViewContent } from './DocViewContent';

export const DocViewDrawer = () => {
  const { handleClose, isOpen, selectedFile } = useDocViewDrawer();

  return (
    <Drawer
      width={500}
      isResizable
      isDestroyOnClose
      isOpen={isOpen}
      onClose={handleClose}
      placement="right"
      title={<Breadcrumbs path={selectedFile?.pagePath ?? ''} />}
    >
      <DocViewContent />
    </Drawer>
  );
};
