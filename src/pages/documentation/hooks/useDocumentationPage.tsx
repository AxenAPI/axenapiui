import clsx from 'clsx';
import { useUnit } from 'effector-react';

import { documentTreeModel } from '@entities/documentation/DocumentTree';

import { sidebarToggleModel } from '@features/documentation/SidebarToggle';

const CONTENT_CONTAINER_CLASS = 'flex w-full flex-col overflow-y-auto';

export const useDocumentationPage = () => {
  const { isSidebarCollapsed, selectedFile } = useUnit({
    isSidebarCollapsed: sidebarToggleModel.stores.$isSidebarCollapsed,
    selectedFile: documentTreeModel.stores.$selectedFile,
  });

  const hasSelectDocument = selectedFile !== null;

  const layoutClassName = clsx(
    'grid h-full w-full grid-rows-[auto_1fr]',
    isSidebarCollapsed ? 'grid-cols-[auto_1fr]' : 'grid-cols-[20rem_1fr]'
  );

  const contentClassName = clsx(
    CONTENT_CONTAINER_CLASS,
    'row-start-2',
    isSidebarCollapsed ? 'col-span-2 col-start-1' : 'col-start-2'
  );

  return {
    layoutClassName,
    contentClassName,
    hasSelectDocument,
    isSidebarCollapsed,
  };
};
