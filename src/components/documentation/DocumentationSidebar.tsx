import {Menu} from '@axenix/ui-kit';
import clsx from 'clsx';
import {useUnit} from 'effector-react';
import {FC, useEffect} from 'react';

import {buildDocumentationSidebar} from '@/components/documentation/helpers/buildDocumentationSidebar';
import {$docNodesTree, $repoPath, cloneDocumentationPostFx, setRepoPath} from '@/models/DocumentationModel';
import {fetchDocFolder} from '@/utils/readRepoTree';

export const DocumentationSidebar: FC = () => {
  const repoPath = useUnit($repoPath);
  const docNodesTree = useUnit($docNodesTree);

  useEffect(() => {
    if (!repoPath)
      cloneDocumentationPostFx()
        .then(result => {
          setRepoPath(result.data);
        })
        .catch(console.error);
  }, [repoPath]);

  useEffect(() => {
    if (repoPath && docNodesTree.length === 0) {
      fetchDocFolder(repoPath);
    }
  }, [repoPath, docNodesTree.length]);

  const menuItems = buildDocumentationSidebar(repoPath, docNodesTree);

  const containerClassName = clsx('h-full w-[20rem] bg-white shrink-0', 'side-bar');

  const scrollAreaClassName = clsx(
    `w-full h-full border-r border-gray-200 overflow-y-auto scroll-auto pt-2 pb-16`,
    'scrollbar'
  );

  return (
    <div className={containerClassName} data-testid="json-editor-sidebar">
      <div className={scrollAreaClassName}>
        <Menu items={menuItems} mode="inline" />
      </div>
    </div>
  );
};
