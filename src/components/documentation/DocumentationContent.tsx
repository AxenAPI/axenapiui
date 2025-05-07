import {Button} from '@axenix/ui-kit';
import {useUnit} from 'effector-react';
import {Plus} from 'tabler-icons-react';

import {MDXEditorWithMermaid} from '@/components/commons/editors/MDXEditorWithMermaid';
import {DocumentationHeader} from '@/components/documentation/DocumentationHeader';
import {DocumentationMeta} from '@/components/documentation/DocumentationMeta';
import {DocumentationSidebar} from '@/components/documentation/DocumentationSidebar';
import {$docNodesTree, $documentationBreadcrumbs, $repoPath, closeDocumentation} from '@/models/DocumentationModel';
import {fetchDocFolder} from '@/utils/readRepoTree';

export const DocumentationContent = () => {
  const breadcrumbs = useUnit($documentationBreadcrumbs);
  const repoPath = useUnit($repoPath);
  const docNodes = useUnit($docNodesTree);
  const hasBreadcrumbs = !!breadcrumbs[0]?.title;

  const sidebarContainerClass = 'flex flex-col';
  const projectNameClass =
    'min-h-[40px] border-r border-b border-gray-200 px-7 py-2 text-[14px] text-[#595959] flex justify-between items-center';

  const contentContainerClass = 'flex w-full flex-col overflow-y-auto';

  const handleCreateFile = () =>
    window.electronAPI.createFolder(`${repoPath}/section${docNodes.length + 1}`).then(() => fetchDocFolder(repoPath));

  return (
    <div className="flex w-full">
      <div className={sidebarContainerClass}>
        <p className={projectNameClass}>
          Project name
          <Button className="border-0" onClick={handleCreateFile}>
            <Plus />
          </Button>
        </p>
        <DocumentationSidebar />
      </div>
      <div className={contentContainerClass}>
        <DocumentationHeader onClose={closeDocumentation} />
        {hasBreadcrumbs && (
          <div>
            <DocumentationMeta />
            <MDXEditorWithMermaid />
          </div>
        )}
      </div>
    </div>
  );
};
