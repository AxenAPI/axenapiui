import { ReactFlowProvider } from '@xyflow/react';

import { AddFolder } from '@features/documentation/AddFolder';
import { DocumentationMeta } from '@features/documentation/DocumentationMeta';
import { ImportButton } from '@features/documentation/ImportButton';
import { MDXEditorWithMermaid, useSelectedFile } from '@features/documentation/MDXEditorWithMermaid';
import { NewBranchDrawer } from '@features/documentation/NewBranchDrawer';
import { SidebarToggleButton } from '@features/documentation/SidebarToggle';

import { DocumentationHeader } from '@widgets/documentation/Header';
import { DocumentationSidebar } from '@widgets/documentation/Sidebar';

import { useDocumentationPage } from '@pages/documentation/hooks/useDocumentationPage';

import { Breadcrumbs } from '@shared/ui/Breadcrumbs';

export const EditDoc = () => {
  const { contentClassName, hasSelectDocument, isSidebarCollapsed, layoutClassName } = useDocumentationPage();
  const selectedFile = useSelectedFile();

  return (
    <div className="h-full w-full" data-testid="json-editor-page">
      <ReactFlowProvider>
        <div className={layoutClassName}>
          <div className="flex min-h-[40px] items-center justify-end gap-2 border-r border-b border-gray-200 px-6 py-2 text-[14px] text-[#595959]">
            <div className="flex items-center gap-2">
              {!isSidebarCollapsed && (
                <>
                  <AddFolder />
                  <ImportButton />
                </>
              )}
              <SidebarToggleButton />
            </div>
          </div>
          <DocumentationHeader />
          {!isSidebarCollapsed && <DocumentationSidebar />}
          <div className={contentClassName}>
            {hasSelectDocument && (
              <>
                <div className="border-b border-gray-200 px-6 py-2">
                  <Breadcrumbs path={selectedFile?.pagePath ?? ''} />
                </div>
                <div>
                  <DocumentationMeta />
                  <MDXEditorWithMermaid />
                </div>
              </>
            )}
          </div>
        </div>
        <NewBranchDrawer />
      </ReactFlowProvider>
    </div>
  );
};
